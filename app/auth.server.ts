import { Authenticator } from 'remix-auth';
import { OAuth2Strategy } from 'remix-auth-oauth2';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const SESSION_KEY = 'user';

const UserSchema = z.object({
  token: z.string(),
  expires: z.number(), // ms timestamp
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;

export const authenticator = new Authenticator<User>();

const AuthConfig = z.object({
  AUTH0_CLIENT_ID: z.string().min(1, 'AUTH0_CLIENT_ID is required'),
  AUTH0_CLIENT_SECRET: z.string().min(1, 'AUTH0_CLIENT_SECRET is required'),
  AUTH0_ORIGIN: z.string().url('AUTH0_ORIGIN is required'),
  AUTH0_CALLBACK_URL: z.string().url('AUTH0_CALLBACK_URL must be a valid URL'),
});

export const authConfig = AuthConfig.parse(process.env);

export const AUTH0_LOGOUT_URL = `${authConfig.AUTH0_ORIGIN}/v2/logout`;

const Auth0UserInfo = z.object({
  email: z.string().email(),
});

authenticator.use(
  await OAuth2Strategy.discover(
    authConfig.AUTH0_ORIGIN,
    {
      clientId: authConfig.AUTH0_CLIENT_ID,
      clientSecret: authConfig.AUTH0_CLIENT_SECRET,
      redirectURI: authConfig.AUTH0_CALLBACK_URL,
      scopes: ['openid', 'profile', 'email'],
    },
    async ({ tokens }) => {
      const accessToken = tokens.accessToken();
      const expires = tokens.accessTokenExpiresAt().getTime();

      const result = await fetch(`${authConfig.AUTH0_ORIGIN}/userinfo`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((r) => r.json())
        .then(Auth0UserInfo.safeParse);

      if (!result.success) {
        throw fromZodError(result.error);
      }

      return {
        email: result.data.email,
        token: accessToken,
        expires,
      };
    }
  ),
  'auth0'
);
