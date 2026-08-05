# 📱 FotoOwl Pins — Scalable React Native Media Stream Application



Built for the **FotoOwl.ai React Native Mobile Engineer Intern Assignment**.  
`FotoOwl Pins` is a production-grade React Native mobile application built with TypeScript, Zustand state management, React Navigation 7, AsyncStorage local persistence, Jest automated testing, and a signature **Pinterest-Inspired Staggered Masonry UI/UX**.

---

## 🚀 Key Features

- 🔐 **Registration & Auth Flow**: 8 required fields with real-time validation (valid email regex, 10-digit numeric mobile, password strength meter, password matching confirmation). Includes a **⚡ Quick-Fill Candidate Demo Data** button for instant 1-click evaluator testing.
- 💾 **Session Persistence**: Maintains local user session tokens in `AsyncStorage` with cold-start auto login.
- 📌 **Pinterest Staggered Masonry Stream**: Staggered dual-column layout with dynamic pin heights, aspect-ratio scaling, rounded pin corners (`borderRadius: 16`), and signature **Pinterest Red (`#E60023`) Save Overlay Buttons**.
- 🔍 **Compound Search, Filter & Sort**: Real-time debounced search by Author/Event Tag (`useDebounce.ts`), interest category chips (*All Pins*, *Collective Stream*, *Author A-M*, *Author N-Z*, *Favorites Only*), and numeric-safe ID & Author alphabetical sorting.
- ❤️ **Favorites Engine**: Instant 0ms optimistic UI favorite toggling with background `AsyncStorage` persistence, plus a dedicated **Favorites Screen** with internal search.
- 🔍 **High-Res Viewer & Device Download**: View pin asset metadata, share links (`expo-sharing`), and download high-resolution photos directly to the user's device photo gallery (`expo-media-library` / `expo-file-system`).
- ☁️ **Collective Server Photo Upload**: `UploadPhotoModal.tsx` supporting device gallery photo selection (`expo-image-picker`), custom image links, event tagging, and a simulated **FotoOwl AI Face Indexing** processing pipeline.
- 👤 **Profile & Avatar Picker Engine**: Edit profile details inline and select custom avatars from a predefined set or photo URL.
- 🌙 **Dark & Light Mode**: Cyber Dark & FotoOwl Light theme engine (`useThemeStore.ts`).
- 🧪 **Automated Unit Testing**: **15 / 15 Jest Unit Tests Passing** (`npm test`).

---

## 🛠️ Project Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm or yarn
- **Expo CLI / EAS CLI**: Installed via npm
- **Mobile Device or Emulator**: Expo Go App (iOS / Android) or Web Browser

### Step-by-Step Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/aastha70203/FotoOwl-Assignment.git
   cd FotoOwl-Assignment
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Web Preview (Local Web Application)**:
   ```bash
   npm run web
   ```
   Open `http://localhost:8081` in your browser.

4. **Run Mobile App (Expo Go / Emulator)**:
   ```bash
   npm start
   ```
   Scan the generated QR code using the **Expo Go** app on Android/iOS.

5. **Run Automated Unit Tests**:
   ```bash
   npm test
   ```
   Executes 15 Jest unit test assertions for form validation, password strength scoring, XSS sanitization, and Zustand store actions.

6. **Generate Standalone APK**:
   ```bash
   npx eas-cli build --platform android --profile preview
   ```

---

## 💡 Assumptions Made During Development

1. **Offline & Network Resilience**:
   - The app fetches data from the Picsum API (`https://picsum.photos/v2/list`). If network requests fail or hit browser CORS policies, the application automatically falls back to an offline curated dataset of 50 high-res event photos without crashing.

2. **Compound Filtering Coexistence**:
   - Search by Author/Event Tag, Category Filters (*All Pins*, *Collective Stream*, *Author A-M*, *Author N-Z*, *Favorites Only*), and Sorting (*ID Asc/Desc*, *Author A-Z/Z-A*) evaluate together dynamically in `getFilteredImages()`.

3. **Optimistic UI Updates**:
   - Favorite toggles and profile updates mutate Zustand store state synchronously in 0ms for instant user feedback, while persisting to `AsyncStorage` asynchronously in the background.

4. **Cross-Platform Media Downloads**:
   - On mobile devices, photo downloading uses `expo-file-system` and `expo-media-library` to save photos directly to the user's photo gallery.
   - On Web browsers, downloading converts image URLs to DOM Blobs and triggers browser file downloads automatically.

5. **Community Event Photo Uploads**:
   - Simulated AI face indexing & color balance processing pipeline mimics FotoOwl's core event media technology.

---

## 📚 Libraries Used & Rationale

| Library | Version | Purpose & Rationale |
| :--- | :--- | :--- |
| **`react-native`** | `0.86.2` | Core cross-platform mobile framework. |
| **`expo`** | `~57.0.9` | Development runtime environment & cross-platform SDK. |
| **`zustand`** | `^5.0.14` | Centralized state management. Chosen for light footprint, zero boilerplate, and zero prop drilling. |
| **`@react-navigation/native`** | `^7.3.14` | Native Stack & Bottom Tabs navigation. |
| **`@react-native-async-storage/async-storage`** | `^3.1.1` | Local persistence for user credentials, sessions, favorites, community uploads, and theme preferences. |
| **`expo-image`** | `~57.0.1` | High-performance image component with memory caching and smooth transition effects. |
| **`expo-image-picker`** | `^57.0.7` | Media picker for community photo uploads. |
| **`expo-media-library` & `expo-file-system`** | `^57.0.3` | Native file system downloads and saving to device camera roll. |
| **`expo-sharing`** | `^57.0.8` | Device native share dialog. |
| **`lucide-react-native`** | `^1.28.0` | Modern SVG iconography. |
| **`jest` & `ts-jest`** | `^30.4.2` | Automated unit testing framework. |

---

## 📂 Folder Structure Explanation

```text
fotoowl-gallery-app/
├── __mocks__/                # Jest mock definitions (AsyncStorage)
├── __tests__/                # Automated Jest test suites (validation & store)
│   ├── store.test.ts
│   └── validation.test.ts
├── assets/                   # App icons, splash screens, and images
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/           # Generic buttons, inputs, headers, skeletons, toasts
│   │   │   ├── CustomButton.tsx
│   │   │   ├── CustomInput.tsx
│   │   │   ├── DropdownPicker.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── PasswordStrengthMeter.tsx
│   │   │   ├── RadioGroup.tsx
│   │   │   ├── SkeletonCard.tsx
│   │   │   └── ToastContainer.tsx
│   │   ├── gallery/          # Gallery & feed specific components
│   │   │   ├── FilterBar.tsx
│   │   │   ├── ImageCard.tsx
│   │   │   ├── ImageDetailModal.tsx
│   │   │   └── UploadPhotoModal.tsx
│   │   └── profile/          # Profile editing & avatar selector modals
│   │       ├── AvatarPickerModal.tsx
│   │       └── EditProfileModal.tsx
│   ├── config/               # App constants, API URLs, and Pinterest theme tokens
│   │   └── constants.ts
│   ├── hooks/                # Reusable custom hooks
│   │   ├── useDebounce.ts    # Search input debouncing
│   │   └── useToast.ts       # Global toast notification hook
│   ├── navigation/           # React Navigation Stack & Bottom Tab Navigators
│   │   └── AppNavigator.tsx
│   ├── screens/              # Primary application screens
│   │   ├── auth/             # Authentication screens
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   └── main/             # Main dashboard screens
│   │       ├── FavoritesScreen.tsx
│   │       ├── FullScreenViewer.tsx
│   │       ├── HomeScreen.tsx
│   │       ├── ImageDetailScreen.tsx
│   │       └── ProfileScreen.tsx
│   ├── services/             # API client & AsyncStorage wrappers
│   │   ├── apiService.ts
│   │   └── storageService.ts
│   ├── store/                # Centralized Zustand stores
│   │   ├── useAuthStore.ts   # Authentication & session store
│   │   ├── useGalleryStore.ts# Gallery, search, filter & favorites store
│   │   └── useThemeStore.ts  # Dark/Light theme mode store
│   ├── types/                # TypeScript interfaces & types
│   │   └── index.ts
│   └── utils/                # Validation regex, password scorer & XSS sanitizers
│       └── validation.ts
├── App.tsx                   # App root entry point with SafeAreaProvider & ToastContainer
├── app.json                  # Expo & Android native configuration
├── eas.json                  # EAS Cloud APK build configuration
├── index.js                  # Native entry point
├── package.json              # App manifest & dependencies
└── tsconfig.json             # TypeScript compiler settings
```


