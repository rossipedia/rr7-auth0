import { redirect } from 'react-router';
import { AUTH0_LOGOUT_URL, authConfig } from '~/auth.server';
import { destroySession, getSession } from '~/session.server';
import { Route } from './+types/logout';

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  const redirectUri = new URL(AUTH0_LOGOUT_URL);
  redirectUri.searchParams.set(
    'returnTo',
    new URL('/', request.url).toString()
  );
  redirectUri.searchParams.set('client_id', authConfig.AUTH0_CLIENT_ID);

  throw redirect(redirectUri.href, {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}
