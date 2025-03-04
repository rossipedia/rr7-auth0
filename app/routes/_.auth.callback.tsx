import { redirect } from 'react-router';
import { authenticator, SESSION_KEY } from '~/auth.server';
import { commitSession, getSession } from '~/session.server';
import type { Route } from './+types/_.auth.callback';

export async function loader({ request }: Route.LoaderArgs) {
  const user = await authenticator.authenticate('auth0', request);
  const session = await getSession(request.headers.get('Cookie'));
  session.set(SESSION_KEY, user);
  throw redirect('/', {
    headers: { 'Set-Cookie': await commitSession(session) },
  });
}

// Need to export something or React Router will think this is a Resource route
// which doesn't participate in the UI. Without this, any thrown auth error
// won't trigger the layout's ErrorBoundary.
export default () => null;
