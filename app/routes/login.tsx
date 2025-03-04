import { Route } from './+types/login';
import { authenticator } from '~/auth.server';

export async function loader({ request }: Route.LoaderArgs) {
  await authenticator.authenticate('auth0', request);
}
