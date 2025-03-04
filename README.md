# React Router 7 + Auth0

This is a small POC app for integrating [Auth0](https://auth0.com/) with [React Router 7](https://reactrouter.com/).

Additional dependencies:

- [`remix-auth`](https://github.com/sergiodxa/remix-auth)
- [`remix-auth-oauth2`](https://github.com/sergiodxa/remix-auth-oauth2)
- [`zod`](https://zod.dev)
- [`tailwindcss`](https://npm.im/tailwindcss)
- [`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography)
- [`daisyui`](https://daisyui.com/)

Implemented using [Cookie-based sessions](https://reactrouter.com/explanation/sessions-and-cookies#using-sessions).

## Prerequisites:

You'll need to set up an Auth0 account and supply the following environment variables (you can use a `.env` file for local development)

```env
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
AUTH0_CALLBACK_URL=http://localhost:5173/auth/callback
AUTH0_ORIGIN=https://your-auth0-app-domain.us.auth0.com
```

Configure your Auth0 application with the following:

**Application Type**
- `Regular Web Application`

**Allowed Callback URLs**
- `http://localhost:5173/auth/callback`

**Allowed Logout URLs**
- `http://localhost:5173/`

**Advanced Settings -> Grant Types**
- ✅ `Authorization Code`
- ✅ `Refresh Token` (Optional)

**Advanced Settings -> OAuth**
- ✅ `OIDC Conformant`


## Access token

The access token issued by Auth0 will be available on the session user object:

```ts
const session = await getSession(request.headers.get('Cookie'));
const user = session.get(SESSION_KEY);
if (user) {
  // Logged in
  const { token } = user;
  const response = await fetch('https://your-api.domain.test/endpoint', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    // Throw a copy because fetch responses are immutable by default, and we
    // want to make sure if React Router needs to modify the response it can
    throw new Response(response.body, response);
  }

  // Now do what you will with the api response
  const data = await response.json();
}
```

> [!IMPORTANT]
> For the purposes of this POC, the `token` value is completely opaque.  Validating the JWT issued by Auth0 can be considered out of scope (but please remember that you _must_ verify the JWT in your API service!)