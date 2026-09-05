# BhashaSetu — Codebase Audit Issues

**Audit Date:** 2026-09-05
**Auditor Role:** Senior Principal Engineer / Security / QA / UI-UX / Performance
**Project:** BhashaSetu — React + Vite frontend, PWA, multi-language learning app

---

## Architecture Overview

- **Framework:** React 18, Vite 5, React Router DOM v6
- **State:** React Context (AppContext, ToastContext)
- **Persistence:** localStorage via storage.js utils
- **Auth:** Frontend-only simulation (no real backend)
- **PWA:** vite-plugin-pwa
- **UI:** Vanilla CSS, neumorphic design
- **No backend, no database, no real API**

---

## CRITICAL BUGS

### LT-001 — user.name.split crashes on undefined/null name
**File:** src/pages/Home.jsx:24, src/layouts/Header.jsx:125
**Severity:** CRITICAL
**Description:** user.name.split(' ')[0] throws a TypeError if user.name is undefined or null. If corrupted localStorage sets name to null, the app crashes on the home page and header.

---

### LT-002 — Toast timer leak: setTimeout never cleared on unmount
**File:** src/context/ToastContext.jsx:12-14
**Severity:** HIGH
**Description:** addToast creates a setTimeout to auto-remove a toast. The timer ID is not stored and cannot be cancelled. Causes stale state updates and potential memory leaks.

---

### LT-003 — Modal: document.body.style.overflow reset to 'unset' instead of empty string
**File:** src/components/Modal.jsx:19
**Severity:** HIGH
**Description:** overflow should be reset to '' (empty string) to restore browser default. 'unset' as a programmatic style assignment doesn't reliably restore scroll on all browsers.

---

### LT-004 — AskAI: Duplicate message IDs possible (race condition)
**File:** src/pages/AskAI.jsx:33,41
**Severity:** HIGH
**Description:** Message IDs use Date.now(). Rapid messages can get the same ID, causing React key conflicts and silent rendering bugs.

---

### LT-005 — No route guard: All sections accessible without login
**File:** src/App.jsx
**Severity:** HIGH (Authorization)
**Description:** All routes including /teacher/dashboard are accessible without authentication. No protected route wrappers exist.

---

### LT-006 — Login/Signup: Admin role selectable by anyone
**File:** src/pages/Login.jsx:58, src/pages/Signup.jsx:71
**Severity:** HIGH (Security)
**Description:** The role selector includes 'Admin' option. Any user can claim admin privileges. No backend validation exists.

---

### LT-007 — CreateLessonModal: Form data never captured
**File:** src/components/teacher/CreateLessonModal.jsx
**Severity:** HIGH (Data integrity)
**Description:** All input/select fields are uncontrolled (no value/onChange). handleSubmit reads no form values — it only transitions to a success screen.

---

### LT-008 — TeacherBottomNav: Links to non-existent routes
**File:** src/layouts/TeacherBottomNav.jsx
**Severity:** HIGH (Broken functionality)
**Description:** Links to /teacher/classes, /teacher/create, /teacher/lessons, /teacher/profile — none defined in App.jsx. Only /teacher/dashboard exists.

---

### LT-009 — QuickActionCards: All paths navigate to non-existent routes
**File:** src/components/teacher/QuickActionCards.jsx
**Severity:** HIGH (Broken functionality)
**Description:** All 5 cards link to undefined routes: /teacher/create, /teacher/translate, /teacher/simplify, /teacher/live, /teacher/analytics.

---

### LT-010 — MyClasses: Navigates to non-existent class detail routes
**File:** src/components/teacher/MyClasses.jsx:38
**Severity:** HIGH (Broken functionality)
**Description:** onClick navigates to /teacher/classes/${idx} which doesn't exist.

---

### LT-011 — RecentLessons "View All": Non-existent route
**File:** src/components/teacher/RecentLessons.jsx:20
**Severity:** MEDIUM (Broken functionality)
**Description:** Navigates to /teacher/lessons which isn't defined.

---

### LT-012 — MyClasses "View All": Non-existent route
**File:** src/components/teacher/MyClasses.jsx:19
**Severity:** MEDIUM (Broken functionality)
**Description:** Navigates to /teacher/classes which isn't defined.

---

### LT-013 — TeacherHeader: Hardcoded teacher name and avatar initial
**File:** src/components/teacher/TeacherHeader.jsx:42-46
**Severity:** MEDIUM (Incorrect behavior)
**Description:** Hardcodes "Priya Ma'am!" and avatar initial "P" instead of reading from user context.

---

### LT-014 — TeacherHero: Hardcoded teacher name
**File:** src/components/teacher/TeacherHero.jsx:35
**Severity:** MEDIUM (Incorrect behavior)
**Description:** Hero section hardcodes "Priya Ma'am!" instead of using user context.

---

### LT-015 — Speak page: Always returns hardcoded mock result
**File:** src/pages/Speak.jsx:19-28
**Severity:** MEDIUM (Missing functionality)
**Description:** No real microphone access or Web Speech API (SpeechRecognition) usage. Always returns a hardcoded success result. No demo indicator for users.

---

### LT-016 — Translate page: Translation always returns mock string
**File:** src/pages/Translate.jsx:25
**Severity:** MEDIUM (Missing functionality)
**Description:** Result is always "[Mock ${targetLang} Translation]: ${sourceText}". No indication to the user.

---

### LT-017 — Translate: navigator.clipboard.writeText — no error handling
**File:** src/pages/Translate.jsx:39
**Severity:** MEDIUM
**Description:** No .catch() on clipboard API call. Clipboard may fail silently in non-secure contexts or when permission is denied, yet toast shows "Copied!".

---

### LT-018 — Translate: Swap doesn't prevent same-language translation
**File:** src/pages/Translate.jsx:30-35
**Severity:** MEDIUM (Logic error)
**Description:** No guard against both languages being the same. Also when swapped, the mock-prefixed translated text becomes the new source.

---

### LT-019 — mockData.js: progress field in lessons is unused dead data
**File:** src/data/mockData.js:9,18,27,36,45
**Severity:** LOW (Maintainability)
**Description:** Each lesson has a progress field that's never read. Progress is tracked via AppContext only. Misleads developers.

---

### LT-020 — Badges: Static unlocked field overrides dynamic context
**File:** src/pages/Badges.jsx:12-15, src/data/mockData.js:49-54
**Severity:** MEDIUM (Logic)
**Description:** Badges with unlocked: true in mockData always appear unlocked regardless of user progress context.

---

### LT-021 — Header: Dropdown not closed on keyboard navigation
**File:** src/components/Header.jsx:135-145
**Severity:** LOW (UI/UX)
**Description:** Profile dropdown doesn't robustly close on all navigation events, particularly keyboard navigation.

---

### LT-022 — Login/Signup: Language selector is non-functional dead UI
**File:** src/pages/Login.jsx:43-46, src/pages/Signup.jsx:56-59
**Severity:** LOW (Dead UI)
**Description:** Language dropdown has no onChange handler, not connected to any state. Purely cosmetic.

---

### LT-023 — BottomNav: Redundant dead condition using window.location.pathname
**File:** src/layouts/BottomNav.jsx:20
**Severity:** LOW (Code quality)
**Description:** window.location.pathname === '' can never be true on any browser. Dead code.

---

### LT-024 — StudentSidebar: Same redundant active check
**File:** src/layouts/StudentSidebar.jsx:41,43
**Severity:** LOW (Code quality)
**Description:** Same redundant window.location.pathname check as LT-023.

---

### LT-025 — useMediaQuery: Flash of mobile layout on desktop
**File:** src/hooks/useMediaQuery.js:4
**Severity:** LOW
**Description:** Initial useState(false) causes components to render mobile layout first, then switch to desktop after effect runs.

---

### LT-026 — TeacherHeader: No click-outside handler for dropdown
**File:** src/components/teacher/TeacherHeader.jsx:51-58
**Severity:** LOW (UI/UX)
**Description:** showDropdown has no click-outside handler. The dropdown stays open when user clicks elsewhere.

---

### LT-027 — TeacherHeader: "Profile" and "Settings" buttons do nothing
**File:** src/components/teacher/TeacherHeader.jsx:53-54
**Severity:** LOW (Dead UI)
**Description:** Both buttons have no onClick handlers.

---

### LT-028 — LiveClass: Join class always resets without actual join
**File:** src/pages/LiveClass.jsx:16-22
**Severity:** LOW (Missing functionality)
**Description:** No actual join logic. Button shows loading briefly then resets. No demo label for users.

---

### LT-029 — CSS: --color-success, --color-success-light, --color-warning, --color-warning-light not defined
**File:** src/index.css + multiple component files
**Severity:** HIGH (Visual bug)
**Description:** These CSS variables are used in Home.jsx, Badges.jsx, Speak.jsx, and Toast.jsx but never defined in index.css. Elements using them render with no color (transparent).

---

### LT-030 — Toast close button: Missing aria-label
**File:** src/components/Toast.jsx:24
**Severity:** LOW (Accessibility)
**Description:** Close button has no aria-label. Screen readers cannot describe it meaningfully.

---

### LT-031 — Profile: Weak email validation
**File:** src/pages/Profile.jsx:32
**Severity:** LOW (Validation)
**Description:** Only checks for '@'. Allows invalid emails like 'a@', '@b', or 'test@' to pass.

---

### LT-032 — AppLayout: isDesktop import used only for BottomNav
**File:** src/layouts/AppLayout.jsx
**Severity:** LOW (Code quality)
**Description:** Minor: sidebar is CSS-hidden, but import of useMediaQuery and isDesktop is only used for BottomNav conditional rendering. Not a bug, worth noting.

---

### LT-033 — index.html: user-scalable=no prevents accessibility zoom
**File:** index.html:6
**Severity:** MEDIUM (Accessibility)
**Description:** maximum-scale=1.0, user-scalable=no prevents users with low vision from zooming. Violates WCAG 2.1 SC 1.4.4.

---

### LT-034 — index.html: Font weight 800 not loaded from Google Fonts
**File:** index.html:13
**Severity:** LOW (Visual quality)
**Description:** Inter fonts only load weights 400-700. h1 uses font-weight: 800 which falls back to 700.

---

### LT-035 — AskAI: Suggestion chips not disabled while AI is typing
**File:** src/pages/AskAI.jsx:120
**Severity:** LOW (UX)
**Description:** Clicking a suggestion while isTyping=true queues a second request. Text input is disabled but chips are not.

---

### LT-036 — Dark theme: No CSS variable overrides defined
**File:** src/index.css, src/context/AppContext.jsx
**Severity:** HIGH (Feature broken)
**Description:** toggleTheme sets data-theme="dark" on document.documentElement, but index.css has no [data-theme="dark"] overrides. Dark mode does nothing visually.

---

### LT-037 — PWA: Referenced icon files may not exist
**File:** vite.config.js:10,20,24,29
**Severity:** MEDIUM (Build/Deploy)
**Description:** PWA manifest references favicon.ico, apple-touch-icon.png, masked-icon.svg, pwa-192x192.png, pwa-512x512.png. If missing from public/, PWA won't install correctly.

---

### LT-038 — storage.js: No type/shape validation on loaded state
**File:** src/utils/storage.js:7
**Severity:** LOW
**Description:** JSON.parse returns whatever is in localStorage. Corrupted state (e.g., string instead of object) causes runtime property access errors.

---

### LT-039 — TeacherLayout: TeacherBottomNav always in DOM
**File:** src/layouts/TeacherLayout.jsx:23
**Severity:** LOW
**Description:** TeacherBottomNav always renders; hidden via inline style tag. Minor cleanliness issue.

---

### LT-040 — Home.jsx: Hero image may not exist — no fallback
**File:** src/pages/Home.jsx:44
**Severity:** MEDIUM
**Description:** src="/hero_boy_globe_1788550838455.jpg" references public directory image. No onerror handler or alt fallback if missing.

---

### LT-041 — TeacherHero: Teacher image import may fail at build time
**File:** src/components/teacher/TeacherHero.jsx:5
**Severity:** MEDIUM
**Description:** import teacherImg from '../../assets/images/teacher_hero.jpg' — if file missing, Vite build fails.

---

### LT-042 — Modal: Focus not trapped inside modal
**File:** src/components/Modal.jsx
**Severity:** MEDIUM (Accessibility)
**Description:** No focus trapping. Keyboard Tab can reach elements behind modal overlay. Violates WCAG 2.1 SC 2.1.2 and modal accessibility best practices.

---

### LT-043 — Learn.jsx: addToast called without type on "Review Lesson"
**File:** src/pages/Learn.jsx:113
**Severity:** LOW
**Description:** addToast('Lesson is already complete!') called with no type. Defaults to 'info' — should be 'success' for semantic correctness.

---

### LT-044 — Button: Missing disabled state styling
**File:** src/components/Button.jsx, src/index.css
**Severity:** LOW (Accessibility/UX)
**Description:** No .btn:disabled CSS styles. Disabled buttons show no visual indicator (no opacity reduction, no cursor change).

---

### LT-045 — No 404 catch-all route
**File:** src/App.jsx
**Severity:** MEDIUM
**Description:** No Route path="*" catch-all. Unknown URLs render a blank page silently.

---

## SUMMARY TABLE

| ID | Severity | Category | Status |
|---|---|---|---|
| LT-001 | CRITICAL | Runtime Error | Open |
| LT-002 | HIGH | Memory Leak | Open |
| LT-003 | HIGH | Bug | Open |
| LT-004 | HIGH | Race Condition | Open |
| LT-005 | HIGH | Authorization | Open |
| LT-006 | HIGH | Security | Open |
| LT-007 | HIGH | Data Integrity | Open |
| LT-008 | HIGH | Broken Route | Open |
| LT-009 | HIGH | Broken Route | Open |
| LT-010 | HIGH | Broken Route | Open |
| LT-011 | MEDIUM | Broken Route | Open |
| LT-012 | MEDIUM | Broken Route | Open |
| LT-013 | MEDIUM | Incorrect Behavior | Open |
| LT-014 | MEDIUM | Incorrect Behavior | Open |
| LT-015 | MEDIUM | Missing Feature | Open |
| LT-016 | MEDIUM | Missing Feature | Open |
| LT-017 | MEDIUM | Error Handling | Open |
| LT-018 | MEDIUM | Logic Error | Open |
| LT-019 | LOW | Dead Code | Open |
| LT-020 | MEDIUM | Logic | Open |
| LT-021 | LOW | UX | Open |
| LT-022 | LOW | Dead UI | Open |
| LT-023 | LOW | Code Quality | Open |
| LT-024 | LOW | Code Quality | Open |
| LT-025 | LOW | Layout Flash | Open |
| LT-026 | LOW | UX | Open |
| LT-027 | LOW | Dead UI | Open |
| LT-028 | LOW | Missing Feature | Open |
| LT-029 | HIGH | Visual Bug (CSS) | Open |
| LT-030 | LOW | Accessibility | Open |
| LT-031 | LOW | Validation | Open |
| LT-032 | LOW | Code Quality | Open |
| LT-033 | MEDIUM | Accessibility | Open |
| LT-034 | LOW | Visual Quality | Open |
| LT-035 | LOW | UX | Open |
| LT-036 | HIGH | Feature Broken | Open |
| LT-037 | MEDIUM | Build/Deploy | Open |
| LT-038 | LOW | Robustness | Open |
| LT-039 | LOW | Code Quality | Open |
| LT-040 | MEDIUM | Visual Bug | Open |
| LT-041 | MEDIUM | Build Error | Open |
| LT-042 | MEDIUM | Accessibility | Open |
| LT-043 | LOW | Minor Bug | Open |
| LT-044 | LOW | Accessibility/UX | Open |
| LT-045 | MEDIUM | Missing Route | Open |
