import * as React from 'react'
import {
    createFileRoute,
    redirect,
    useRouter,
    useRouterState,
} from '@tanstack/react-router'
import {z} from 'zod'

import {useAuth} from '../context/auth'
import {sleep} from '../lib/utils'
import {Form, FormControl, FormField, FormItem, FormMessage} from "../components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "../components/ui/input";
import {Button} from "../components/ui/button";
import User from "../api/User";

const fallback = '/' as const

export const Route = createFileRoute('/login')({
    validateSearch: z.object({
        redirect: z.string().optional().catch(''),
    }),
    beforeLoad: ({context, search}) => {
        if (context.auth.isAuthenticated) {
            throw redirect({to: search.redirect || fallback})
        }
    },
    component: Login,
})

const formSchema = z.object({
    username: z.string()
        .min(2, "Длина имени не меньше 2 символов")
        .max(255, "Длина имени не больше 255 символов"),
    password: z.string().min(5, "Длина пароля не меньше 5 символов"),
})

function Login() {
    const authContext = useAuth()
    const router = useRouter()
    const isLoading = useRouterState({select: (s) => s.isLoading})
    const navigate = Route.useNavigate()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const search = Route.useSearch()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true)
        try {
            const user = await User.login(data)
            await authContext.login(user)

            await router.invalidate()

            // This is just a hack being used to wait for the auth state to update
            // in a real app, you'd want to use a more robust solution
            await sleep(1)

            // @ts-ignore
            await navigate({to: search.redirect || fallback})
        } catch (error) {
            console.error('Error logging in: ', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const isLoggingIn = isLoading || isSubmitting

    return (
        <div className="grid min-h-full grid-cols-[minmax(0,320px)] grid-rows-[auto,auto,auto,1fr] grid-areas-[header_content_secondary_footer] content-start justify-center text-center">
            <img src='/logo.svg' alt="logo" className="my-16"/>
            <header className="grid grid-gap-5 gap-5 justify-items-center mb-12">
                <div className="font-medium text-xl">Вход в аккаунт</div>
            </header>
            <main>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <fieldset disabled={isLoggingIn} className="w-full grid gap-2">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input className="h-12 text-base" placeholder="Логин" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input className="h-12 text-base" placeholder="Пароль"
                                                   type="password" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit"
                                    className="h-12 text-base">{isLoggingIn ? 'Loading...' : 'Войти'}</Button>
                        </fieldset>
                    </form>
                </Form>
            </main>
        </div>
    )
}
