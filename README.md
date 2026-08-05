# FotoOwl.ai - React Native Mobile Engineer Assignment

![FotoOwl Media Suite](https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80)

> **Submission for React Native Mobile Engineer Intern Role**  
> **Location**: Baner, Pune | Candidate Application  
> **Tech Stack**: React Native, TypeScript, Zustand, React Navigation, AsyncStorage, Expo SDK 52, Jest

---

## 🌟 Executive Summary & Wow Factors

This mobile application is an end-to-end, production-ready React Native solution developed for **FotoOwl.ai**. It demonstrates mobile application architecture, local data persistence, custom hooks, real-time debounced search, compound filtering, favorite image bookmarking, device gallery downloads, avatar customization, dark/light theme engine, security hygiene, and automated unit testing.

### ✨ Highlighted Wow Factors Included:
1. 🌙 **Dynamic Theme System**: Seamless instant toggle between Dark Mode (Cyber Navy) and Light Mode (FotoOwl Violet) persisted in `AsyncStorage`.
2. 🔒 **Advanced Security Layer**: Real-time password strength meter (scoring 0–100% with visual criteria), client-side password hashing, input XSS sanitization, and secure session management.
3. ⚡ **Debounced Real-Time Search Engine**: Throttled search queries via custom `useDebounce` hook, ensuring 60 FPS scrolling performance without main looper lag.
4. 🎛️ **Compound Filter & Sort Engine**: Search, Category filtering (Author A–M, Author N–Z, All), and Sort order (ID Asc/Desc, Author A–Z) seamlessly operate together with infinite scroll pagination.
5. 🖼️ **Full-Screen Zoom & Device Gallery Downloader**: Zoomable image modal viewer with native image saving (`expo-media-library` / `expo-file-system`) and cross-platform web download support.
6. 🎭 **Avatar Customization System**: Interactive Profile avatar picker with predefined photo set + custom image URL support.
7. 🧪 **100% Green Automated Unit Testing**: Jest unit test suite covering validation algorithms, security utilities, and Zustand state transitions.
8. ⚡ **Evaluator Quick-Fill Buttons**: One-tap demo candidate data filler on Registration & Login screens for effortless evaluator testing.

---

## 📱 Application Feature Matrix

| Feature | Status | Description |
| :--- | :---: | :--- |
| **1. Registration Screen** | ✅ Done | Full Name, Email, Gender (Radio buttons), Mobile (10-digits), Address, City (Searchable Dropdown Modal), Password + Confirm Password. |
| **2. Field Validation** | ✅ Done | Strict regex validation for Email, exact 10-digit numeric mobile, matching passwords, and password strength feedback. |
| **3. Login Screen** | ✅ Done | Email & Password authentication against locally stored registered users + evaluator quick fill button. |
| **4. Session Persistence** | ✅ Done | Auto-restores login state on app restart using persistent `AsyncStorage` session token. |
| **5. Image Gallery** | ✅ Done | Fetches Picsum API (`https://picsum.photos/v2/list?page=X&limit=Y`) rendered with 2-column `FlatList`. |
| **6. Real-Time Search** | ✅ Done | Case-insensitive author search with `useDebounce` optimization. |
| **7. Compound Filtering** | ✅ Done | Author A-M, Author N-Z, All Images, and Sorting (ID, Author name). |
| **8. Infinite Scroll Pagination** | ✅ Done | Smooth `onEndReached` fetching with bottom activity indicator. |
| **9. Pull-to-Refresh** | ✅ Done | Non-duplicate pull-to-refresh logic with loading spinner. |
| **10. Favorites System** | ✅ Done | Heart toggle button with immediate `AsyncStorage` sync & persistence. |
| **11. Favorites Screen** | ✅ Done | Dedicated view of saved images with search bar inside favorites & empty state handler. |
| **12. Image Details Screen** | ✅ Done | High-res view, Author info, Asset ID, Dimensions, Share button, and Download button. |
| **13. Full Screen Viewer** | ✅ Done | Fullscreen modal image viewer with single-tap download action. |
| **14. Profile Management** | ✅ Done | View & edit user info (Name, Email, Mobile, Address, City) with immediate app-wide sync. |
| **15. Avatar Picker (Bonus)** | ✅ Done | Selection modal for 8 predefined avatars or custom image link. |
| **16. Dark Mode (Bonus)** | ✅ Done | Dark and Light theme palettes with persistent preference. |
| **17. Unit Tests (Bonus)** | ✅ Done | Jest unit test suite (15/15 tests passing). |

---

## 🛠️ Project Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on v22.19.0)
- **npm** or **yarn**
- **Expo Go App** (for testing on physical iOS/Android phone) or **Web Browser**

### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/<your-username>/fotoowl-gallery-app.git
cd fotoowl-gallery-app
```

2. **Install Dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Run on Web Browser (Instant Interactive Testing)**
```bash
npm run web
```

4. **Run on Mobile Devices (iOS / Android)**
```bash
npx expo start
```
Scan the generated QR code with **Expo Go** on Android or iOS.

5. **Run Unit Tests**
```bash
npm test
```

---

## 📐 Architecture & State Management Design

The application follows a clean **Feature-Driven Architecture** prioritizing modularity, clear separation of concerns, and type safety:

```
src/
├── components/          # Reusable UI Design System
│   ├── common/          # CustomButton, CustomInput, RadioGroup, DropdownPicker, ToastContainer, Header, SkeletonCard, EmptyState
│   ├── gallery/         # ImageCard, FilterBar
│   └── profile/         # AvatarPickerModal, EditProfileModal
├── config/              # Constants, Theme palettes (Dark/Light), Cities, API Endpoints
├── hooks/               # Custom Hooks (useDebounce, useToast, useTheme, etc.)
├── navigation/          # React Navigation (Auth Stack, Main Bottom Tabs, Details Stack)
├── screens/             # App Screens (RegisterScreen, LoginScreen, HomeScreen, FavoritesScreen, ProfileScreen, ImageDetailScreen, FullScreenViewer)
├── services/            # API client (Picsum) & Storage Service wrapper (AsyncStorage)
├── store/               # Zustand Centralized Stores (useAuthStore, useGalleryStore, useThemeStore)
├── types/               # TypeScript Interfaces
└── utils/               # Form validation, Security Sanitizer, Password strength analyzer
```

### Why Zustand for Centralized State Management?
- **Boilerplate-Free**: Atomic state without Redux action creators or reducers.
- **High Performance**: Re-renders only components subscribing to changed slices of state.
- **Easy Persistence**: Directly interfaces with `AsyncStorage` and syncs session state on startup.

---

## 🔒 Security & Data Hygiene

- **Password Encryption**: Input passwords are processed with a client-side hashing algorithm before writing to `AsyncStorage`.
- **Sanitizer Utility**: Inputs are passed through an XSS sanitizer escaping unsafe HTML symbols (`<`, `>`, `&`, `'`, `"`).
- **Session Token Simulation**: Generated cryptographic session token is evaluated on application initialization to maintain user state safely.

---

## ⚡ Assumptions Made During Development

1. **Picsum Public API**: The Picsum API returns a dynamic list of public images. Since page IDs can vary, client-side pagination parameters (`?page=X&limit=20`) are used along with deduplication logic.
2. **Local User Multi-Tenant Storage**: Multiple users can register on the device; credentials are validation-checked against the local user index in `AsyncStorage`.
3. **Platform Media Permissions**: On native mobile devices, requesting media library permissions is mandatory to save photos to the device camera roll. On web, standard file blob downloading is triggered.

---

## 📄 License & Credits

Built with ❤️ for **FotoOwl.ai** React Native Intern Assignment evaluation.
