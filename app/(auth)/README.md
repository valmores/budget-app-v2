# (auth) — Authentication Screens

This route group contains all unauthenticated screens. Using a route group keeps these screens grouped logically without adding a segment to the URL path.

| File | Route | Description |
|---|---|---|
| `index.tsx` | `/` | Login screen (email + password sign-in) |
| `register.tsx` | `/register` | Registration screen (name, email, password) |
| `_layout.tsx` | — | Stack navigator for auth screens with slide animations |

---

## Firebase Auth Integration (Planned)

> See the full implementation plan for details.

### What needs to be wired up

- `handleLogin` → `signIn(email, password)` via `AuthContext`
- `handleRegister` → `signUp(name, email, password)` via `AuthContext`
- Inline error banners using `mapFirebaseError(code)` from `lib/authErrors.ts`
- Loading state on submit buttons (`ActivityIndicator`)

### Auth guard

The root `app/_layout.tsx` will handle redirects:
- **Unauthenticated** → stays in `/(auth)`
- **Authenticated** → redirected to `/(app)`

Screens in this group should **not** manually call `router.replace('/dashboard/dashboard')` — the guard handles that automatically once Firebase confirms a valid session.

---

## Notes

- Haptics are guarded by `Platform.OS !== 'web'` to safely run on all targets.
- `(auth)` is a route group — it does **not** appear in the URL path.
- The `slide_from_left` / `slide_from_right` animations on index/register give a natural back/forward feel.
