import { TUser } from '@/api/User'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getStoredUser() {
    const user = localStorage.getItem(import.meta.env.VITE_ACCESS_USER_KEY)
    if (!user) return null
    return JSON.parse(user) as TUser
}

export function setStoredUser(user: TUser | null) {
    if (user) {
        localStorage.setItem(import.meta.env.VITE_ACCESS_USER_KEY, JSON.stringify(user))
    } else {
        localStorage.removeItem(import.meta.env.VITE_ACCESS_USER_KEY)
    }
}
