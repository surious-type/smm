import axiosClient from "./axios-client";
import Entity from "@/api/Entity.ts";

export type TUser = {
    id: number
    name: string
    username: string
    token: string
    isAdmin: boolean
}

export default class User extends Entity {
    static URL = "/users"

    static async login({username, password}: { username: string, password: string }) {
        const {data} = await axiosClient.post<TUser>('/login', {username, password})
        return data
    }

    static async logout() {
        const {data} = await axiosClient.post<TUser>('/logout')
        return data
    }
}
