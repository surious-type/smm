import { Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Header'
import { AuthContext } from '@/context/auth';

interface MyRouterContext {
    auth: AuthContext
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    beforeLoad: ({context, location}) => {
        if (!context.auth.user && location.pathname !== "/login") {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            })
        }
    },
    component: () => (
        <>
            <Header />

            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
})
