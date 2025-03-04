import { isRouteErrorResponse, Outlet } from 'react-router';
import { Route } from './+types/_';
import { z } from 'zod';

export default function Layout() {
  return (
    <div className="container mx-auto my-8 max-w-sm prose">
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div>
        <h1>404</h1>
        <p>Page not found.</p>
      </div>
    );
  }

  const parsed = z.object({ message: z.string() }).safeParse(error);
  const msg = parsed.success ? parsed.data.message : 'An error occurred.';

  return (
    <div>
      <h1>Something went wrong.</h1>
      <p>{msg}</p>
    </div>
  );
}
