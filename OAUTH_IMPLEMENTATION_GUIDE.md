# Google OAuth Integration Guide - Damro Restaurant App

## Overview

This guide explains the secure Google OAuth sign-in implementation for customers only, with automatic user profile creation.

## Architecture Flow

```
User clicks "Continue with Google" on login page
    ↓
Supabase OAuth flow redirects to Google consent
    ↓
Google redirects back to /auth/callback with authorization code
    ↓
Server exchanges code for access_token + refresh_token
    ↓
Redirects to /auth/callback/success with tokens in URL
    ↓
Client stores tokens in localStorage + Supabase session
    ↓
Calls /api/auth/create-profile to create customer profile in app_users
    ↓
AuthContext listens to Supabase auth state changes
    ↓
NavBar displays user info and shows logout button
    ↓
Redirect to home page
```

## Setup Instructions

### 1. Supabase Configuration

**Enable Google OAuth Provider:**

1. Go to Supabase Dashboard → Authentication → Providers
2. Find "Google" and click Enable
3. Add your Google OAuth credentials:
   - Google Client ID (from Google Cloud Console)
   - Google Client Secret (from Google Cloud Console)
4. Set up Redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### 2. Environment Variables

Ensure your `.env.local` contains:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database Table Structure

The `app_users` table should have this schema:

```sql
- id (UUID, primary key)
- full_name (TEXT)
- email (TEXT)
- phone (TEXT, optional)
- address (TEXT, optional)
- user_type (TEXT, default: 'customer')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## File Structure

```
app/
├── auth/
│   ├── callback/
│   │   ├── route.js (OAuth callback handler)
│   │   └── success/
│   │       └── page.js (Success page with token handling)
├── api/
│   └── auth/
│       └── create-profile/
│           └── route.js (Server-side profile creation)
├── context/
│   └── Authcontext.js (Auth state management + Supabase listener)
├── user/
│   └── login/
│       └── page.js (Login page with Google button)
└── Shared/
    └── NavBar/
        └── page.js (Displays user name and logout)
```

## Key Features

### 1. **Automatic Customer Profile Creation**

- When a user signs in with Google for the first time, a customer profile is automatically created in `app_users`
- Profile includes: user ID, email, full name (from Google), and user_type = 'customer'

### 2. **Secure Token Handling**

- Access tokens are stored in localStorage for API calls
- Refresh tokens are stored securely and refreshed automatically by Supabase
- No sensitive data in URL after redirect (tokens only visible briefly during callback)

### 3. **Session Management**

- `AuthContext` listens to Supabase auth state changes
- Automatic sync when user signs in, token refreshes, or signs out
- localStorage is kept in sync with Supabase session

### 4. **User Experience**

- Seamless redirect to home page after successful sign-in
- NavBar shows user's name and logout button
- Loading spinner during OAuth processing
- Automatic redirect to login on error with error message

## Security Considerations

### Current Implementation (Development-Safe)

- Tokens are passed via URL query parameters during redirect
- This is acceptable for development but not production-ideal
- Tokens are immediately stored in localStorage and URL is cleaned

### Production Recommendations

To enhance security for production:

1. **Use HttpOnly Cookies:**

   - Have the server set HttpOnly cookies instead of URL params
   - Update the success page to read cookies via Supabase client
   - Prevents token exposure in browser history/logs

2. **Example Production Flow:**

```
Server /auth/callback route.js:
- Exchange code for session
- Set HttpOnly cookie with session token
- Redirect to /auth/callback/success (no tokens in URL)

Client /auth/callback/success/page.js:
- Supabase automatically reads HttpOnly cookie
- Calls supabase.auth.getSession() to restore session
- No manual token handling needed
```

## Testing the Flow

### 1. **Test Sign-in:**

```
1. Navigate to http://localhost:3000/user/login
2. Click "Continue with Google"
3. Complete Google sign-in
4. Should redirect to home page
5. NavBar should show user name
6. Check localStorage for access_token
```

### 2. **Verify Profile Creation:**

```
1. After sign-in, open Supabase Dashboard
2. Go to app_users table
3. New row should exist with:
   - id: user's UUID
   - full_name: from Google
   - email: user's email
   - user_type: 'customer'
```

### 3. **Test Logout:**

```
1. Click logout button in NavBar
2. Should redirect to /user/login
3. localStorage should be cleared
4. Supabase session should be cleared
```

## API Endpoints

### POST /auth/create-profile

**Purpose:** Create customer profile on first OAuth sign-in

**Request Body:**

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Response:**

```json
{
  "success": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "fullName": "User Name"
}
```

**Error Handling:**

- Returns 400 if no access token
- Returns 401 if token is invalid
- Returns 500 on server errors
- Non-critical: Flow continues even if profile creation fails (user can login with existing session)

## Troubleshooting

### Issue: "No access token received"

**Solution:**

- Check that Google OAuth redirect URL is configured in Supabase
- Verify `redirectTo` in login page matches Supabase configuration

### Issue: User profile not created

**Solution:**

- Check `/api/auth/create-profile` is returning success
- Verify service role key has write permissions on `app_users`
- Check app_users table exists and has correct schema

### Issue: NavBar doesn't show username

**Solution:**

- Check `localStorage.access_token` is present
- Run `await supabase.auth.getSession()` in console
- Check that `userName` is set in AuthContext

### Issue: Logout doesn't work

**Solution:**

- Check `supabase.auth.signOut()` completes without errors
- Verify localStorage is being cleared
- Check Supabase session is cleared

## Advanced Configuration

### Restrict to Customers Only

Currently, Google OAuth creates `user_type: 'customer'` automatically.
Users cannot register restaurants via OAuth (by design).
Restaurant registrations must be done through email/password flow with admin approval.

### Custom User Metadata

To add custom metadata (preferences, language, etc.) on OAuth sign-in:

1. Extend `app_users` table with additional columns
2. Update `/api/auth/create-profile` to include custom fields
3. Example: Add `language` preference from browser settings

### Email Verification

- Supabase auto-verifies emails from Google OAuth
- `email_confirmed_at` is automatically set
- No need for additional verification email

## Monitoring

### Key Metrics to Track

1. OAuth sign-in success rate
2. Profile creation success rate (via `/api/auth/create-profile`)
3. Session refresh frequency
4. User retention after first sign-in

### Logging

- Server logs OAuth errors in `/api/auth/create-profile`
- Client logs auth state changes in AuthContext
- Check browser console for client-side errors

## References

- [Supabase OAuth Docs](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase Auth State Listener](https://supabase.com/docs/reference/javascript/auth-onstatechange)
