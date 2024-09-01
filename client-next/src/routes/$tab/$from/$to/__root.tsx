import { createFileRoute, createRootRoute, createRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { App } from '../../../../screens/App';

export const Route = createFileRoute('/$tabId/$from/$to')({
  component: App,

  //   () => (
  //     <>
  //       <div className="p-2 flex gap-2">
  //         <Link to="/" className="[&.active]:font-bold">
  //           Home
  //         </Link>{' '}
  //         <Link to="/about" className="[&.active]:font-bold">
  //           About
  //         </Link>
  //       </div>
  //       <hr />
  //       <Outlet />
  //       <TanStackRouterDevtools />
  //     </>
  //   ),
});
