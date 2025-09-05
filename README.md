# Resep — Aplikasi Resep dengan Expo Router

Aplikasi resep modern, compact, dan responsif (mendukung layar lebar/Z Fold) dibuat dengan Expo + React Native + Expo Router. Fitur utama: pencarian instan, filter kategori, favorit (persisten), detail resep lengkap, related/"resep lainnya", onboarding, splash screen, tema gelap modern, dan grid responsif 2–4 kolom.

## Fitur

- Pencarian + filter kategori (chips)
- Grid responsif 2–4 kolom (otomatis bertambah di layar lebar/Z Fold)
- Detail resep: hero image, info (durasi, level, porsi, kalori), bahan, langkah
- Related (resep lainnya) di halaman detail
- Favorit (AsyncStorage), onboarding multi-step, splash screen
- Gambar mendukung URL dan lokal (require)

---

## Struktur Proyek Ringkas

- `app/_layout.tsx` — Root layout, SafeAreaProvider, FavoritesProvider, splash hide saat font siap
- `app/index.tsx` — Guard onboarding (redirect ke `/onboarding` atau `/(tabs)`)
- `app/(tabs)/_layout.tsx` — Bottom tab (Beranda, Favorit), padding aman untuk Android nav bar
- `app/(tabs)/index.tsx` — Home (pencarian, kategori, grid resep responsif)
- `app/(tabs)/favorites.tsx` — Daftar favorit
- `app/onboarding/` — Onboarding multi-step
- `app/recipe/[id].tsx` — Halaman detail resep + related
- `components/` — UI kecil: `SearchBar`, `CategoryChips`, `RecipeGridCard`, `Screen`, `EmptyState`
- `data/recipes.ts` — Sumber konten resep (30 resep contoh)
- `hooks/useRecipes.ts` — Pencarian/filter dan related
- `context/FavoritesContext.tsx` — Context untuk favorit
- `lib/theme.ts` — Warna tema gelap
- `lib/storage.ts` — AsyncStorage (favorit, onboarding)
- `assets/images/recipes/` — Contoh gambar lokal (5 item pertama)

---

## Menjalankan Secara Lokal

Prasyarat: Node.js LTS, npm, dan Android Studio (untuk emulator Android) bila perlu.

1) Install dependensi

```bash
npm install
```

2) Jalankan pengembangan

```bash
npm run android   # buka di emulator/perangkat Android
npm run ios       # simulator iOS (macOS)
npm run web       # mode web
npm start         # dashboard Expo
```

Jika terlihat error cache/route, coba bersihkan cache:

```bash
npx expo start -c
```

---

## Mengisi & Mengelola Konten

Sumber data: `data/recipes.ts`.

Tipe data (disederhanakan):

```ts
type Recipe = {
  id: string;
  title: string;
  category: "Ayam" | "Daging" | "Sayuran" | "Seafood" | "Sup" | "Mie" | "Nasi" | "Dessert" | "Sarapan" | "Minuman";
  image: string | number; // URL (string) atau lokal require('...')
  duration: number;        // menit
  difficulty: "Mudah" | "Sedang" | "Sulit";
  servings: number;
  calories?: number;
  ingredients: string[];
  steps: string[];
  tags?: string[];
};
```

Opsi gambar:
- URL: `image: "https://..."`
- Lokal: taruh file pada `assets/images/recipes/`, lalu referensikan:

```ts
image: require("../assets/images/recipes/ayam-goreng-kremes.jpg")
```

Menambah resep baru:
1. Tambah objek baru di array `recipes` pada `data/recipes.ts`.
2. Pastikan `id` unik dan `category` salah satu dari kategori yang tersedia.
3. Isi `ingredients` dan `steps` sesuai kebutuhan.
4. Opsional: `author`, `rating`, `calories`, `tags`.

Related/Resep lainnya:
- Ditentukan di `hooks/useRecipes.ts` (`getRelatedRecipes`) dengan skoring kategori + tag.

Grid responsif:
- Di `app/(tabs)/index.tsx`, jumlah kolom ditentukan oleh lebar layar:
  - `< 700px` → 2 kolom
  - `≥ 700px` → 3 kolom (mode terbentang Z Fold, tablet potret)
  - `≥ 1024px` → 4 kolom (layar lebar, lanskap)
- Nilai ambang bisa Anda ubah di file tersebut.

Favorit & Onboarding:
- Disimpan via AsyncStorage (`lib/storage.ts`).
- Kunci: `favorites.v1` dan `onboarding.v1.done`.
- Untuk mengulang onboarding, hapus data app atau ganti kunci.

---

## Build dengan EAS (Expo Application Services)

EAS memungkinkan build cloud untuk Android/iOS.

1) Instal EAS CLI dan login

```bash
npm i -g eas-cli
eas login
```

2) Inisialisasi EAS di proyek

```bash
eas init
```

Perintah ini membuat `eas.json` (jika belum ada). Contoh konfigurasi yang direkomendasikan:

```jsonc
{
  "cli": { "version": ">= 3.16.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "android": { "buildType": "app-bundle" },
      "ios": { "simulator": false }
    }
  },
  "submit": {
    "production": {}
  }
}
```

3) Konfigurasi `app.json`

- Pastikan `expo.slug`, `expo.name`, `expo.scheme` terisi.
- Splash screen sudah diatur via plugin `expo-splash-screen`.
- Router sudah aktif dengan `plugins: ["expo-router"]` dan `experiments.typedRoutes: true`.

4) Build Android

```bash
eas build -p android --profile production
```

Catatan:
- Pertama kali build, EAS akan menawarkan pembuatan keystore otomatis.
- Hasil `.aab` dapat diunduh dari dashboard EAS.

5) Build iOS

```bash
eas build -p ios --profile production
```

Catatan:
- Perlu akun Apple Developer. EAS dapat mengelola kredensial otomatis.
- Hasil `.ipa` tersedia di dashboard EAS.

6) Uji build internal (opsional)

```bash
eas build -p android --profile preview
eas build -p ios --profile preview
```

7) Submit ke Store (opsional)

```bash
eas submit -p android --path <path-ke-aab>
eas submit -p ios --path <path-ke-ipa>
```

Panduan lengkap: https://docs.expo.dev/build/introduction/

---

## Masalah Umum & Solusi Singkat

- "Unmatched route" saat navigasi tab: gunakan path publik (contoh: `/favorites`), bukan menyertakan nama grup route `/(tabs)` di URL.
- Spasi bawah tertutup nav bar Android: tab bar sudah diberi padding aman. Konten layar memakai SafeArea atas saja untuk menghindari celah bawah.
- Cache bundler bermasalah: jalankan `npx expo start -c`.
- Gambar lokal tidak tampil: pastikan `image` memakai `require("../assets/...")` dan path relatif benar.

---

## Lisensi

Proyek ini untuk keperluan pengembangan internal/demonstrasi. Sesuaikan lisensi sesuai kebutuhan Anda.

