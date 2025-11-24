# Logout Functionality Test Guide

## Overview
The logout function has been enhanced to properly clear all authentication state, local storage, and redirect to the login page.

## What the Logout Function Does

1. **Signs out from Supabase** — Calls `supabase.auth.signOut()` to revoke the session server-side
2. **Clears localStorage** — Removes `access_token` and `refresh_token`
3. **Clears sessionStorage** — Clears any session-related data
4. **Clears React state** — Sets all auth state to initial values:
   - `isAuthenticated` → `false`
   - `isCustomer` → `false`
   - `userId` → `null`
   - `userName` → `null`
   - `user` → `null`
   - `Isresturant` → `false`
5. **Redirects to login page** — Uses `window.location.href` to navigate to `/user/login`

## How to Test Logout

### Test 1: Basic Logout Flow
1. Open the app and log in with any account (email/password or Google OAuth)
2. Verify you see your username in the NavBar header (e.g., "..مرحبا, Ahmed")
3. Click the red "تسجيل الخروج" (Logout) button in the NavBar
4. **Expected Result:** 
   - You are redirected to `/user/login` page
   - The NavBar now shows "تسجيل/انشاء حساب" (Sign in/Sign up) button instead of username
   - Browser console shows no errors

### Test 2: Verify Tokens Are Cleared
1. Log in to the app
2. Open **Browser DevTools** (F12) → **Application** tab → **Local Storage**
3. Verify `access_token` and `refresh_token` keys exist
4. Click logout button
5. **Expected Result:**
   - Both `access_token` and `refresh_token` keys are removed from localStorage
   - Page redirects to login

### Test 3: Verify Session Persistence Doesn't Occur
1. Log in to the app
2. Click logout and navigate to `/user/login`
3. Try to navigate directly to `/pages/userDashboard` or `/pages/resturantDashboard`
4. **Expected Result:**
   - You are unable to access dashboard pages
   - You remain on login page or are redirected back to home

### Test 4: Logout from Mobile Menu
1. Log in on a mobile device or mobile view (< 1024px width)
2. Open the mobile menu (hamburger icon)
3. Click the "تسجيل الخروج" (Logout) button
4. **Expected Result:**
   - Mobile menu closes
   - You are redirected to login page
   - Tokens are cleared

### Test 5: Logout Works After Google OAuth
1. Log in using Google OAuth
2. Verify username displays in NavBar
3. Click logout button
4. **Expected Result:**
   - Logout succeeds without errors
   - Redirected to `/user/login`
   - Tokens are cleared
   - Next time you try to access protected pages, you must log in again

## Logout Button Location

The logout button appears in:
- **Desktop NavBar** (≥1024px): Top-right corner, red button labeled "تسجيل الخروج"
- **Mobile Menu** (< 1024px): Inside hamburger menu

## Troubleshooting

### Issue: Logout button doesn't appear
- **Cause:** User is not authenticated (`isAuthenticated` is `false`)
- **Fix:** Log in first, then look for the logout button

### Issue: Logout redirects but page remains the same
- **Cause:** Browser cache or slow page load
- **Fix:** 
  - Hard refresh page: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
  - Clear browser cache
  - Check browser console for errors

### Issue: Tokens still exist after logout
- **Cause:** localStorage not being cleared properly
- **Fix:**
  - Open DevTools → Console → Run: `localStorage.clear()`
  - Refresh page
  - Log in and out again

### Issue: User can still access dashboard after logout
- **Cause:** Session token not being validated by auth guard
- **Fix:**
  - Ensure `refreshUser()` is called on page load
  - Check that protected routes check `isAuthenticated` from context
  - Verify `AuthProvider` wraps the entire app in `layout.js`

## Expected Behavior After Logout

| Feature | Before Logout | After Logout |
|---------|--------------|-------------|
| Username in NavBar | Visible | Not visible |
| Logout button | Visible | Hidden |
| Login button | Hidden | Visible |
| localStorage tokens | Present | Cleared |
| Cart visible | Yes (if customer) | No |
| Dashboard access | ✓ Allowed | ✗ Blocked |
| Can create orders | ✓ Yes | ✗ No |

## Code Location

The logout function is defined in: `app/context/Authcontext.js` (lines ~74–103)

Called from:
- `app/Shared/NavBar/page.js` (logout button)
- `app/components/dashboard/resturant/Sidebar.js` (logout in restaurant dashboard)

## Security Notes

- Logout calls `supabase.auth.signOut()` to revoke server-side session
- Tokens are removed from localStorage (not stored in HttpOnly cookies yet)
- Session state is fully cleared from React context
- User cannot access protected pages without re-authenticating
- For production, consider using HttpOnly cookies to prevent XSS token theft

---

**Last Updated:** November 25, 2025
