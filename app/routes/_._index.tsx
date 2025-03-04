import { SESSION_KEY } from '~/auth.server';
import { Route } from './+types/_._index';
import { getSession } from '~/session.server';
import { Form, href, Link } from 'react-router';

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const user = session.get(SESSION_KEY);
  return { user };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  return (
    <div>
      <h1>Welcome</h1>
      {!user && (
        <Link to={href('/login')} className="btn btn-primary text-white">
          Log in
        </Link>
      )}
      {user && (
        <>
          <p>
            Logged in as: <code>{user.email}</code>
          </p>
          <Form method="post" action={href('/logout')} className="contents">
            <button className="btn btn-error">Log out</button>
          </Form>
        </>
      )}
    </div>
  );
}
