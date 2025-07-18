import * as React from 'react'

import {getStoredUser, setStoredUser, sleep} from '../lib/utils'
import {TUser} from "@/api/User.ts";
import {flushSync} from "react-dom";

export interface AuthContext {
    isAuthenticated: boolean
    login: (user: TUser) => Promise<void>
    logout: () => Promise<void>
    user: TUser | null
}

const AuthContext = React.createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<TUser | null>(getStoredUser())
    const isAuthenticated = !!user

    const logout = React.useCallback(async () => {
        await sleep(250)

        setStoredUser(null)
        flushSync(() => {
            setUser(null)
        });
    }, [])

    const login = React.useCallback(async (user: TUser) => {
        await sleep(500)

        setStoredUser(user)
        setUser(user)
    }, [])

    React.useEffect(() => {
        setUser(getStoredUser())
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
