import axiosClient from "@/api/axios-client.ts";

export default class Entity {
    static URL: string

    static async list<T>(owner?: number) {
        const {data} = await axiosClient.get<T[]>(this.routeToUrl(this.URL, owner))
        return data
    }

    static async item<T>(id: string, owner?: number) {
        const {data} = await axiosClient.get<T>(`${this.routeToUrl(this.URL, owner)}/${id}`)
        return data
    }

    static async create<T, TData>(formData: TData, owner?: number) {
        const {data} = await axiosClient.postForm<T>(this.routeToUrl(this.URL, owner), formData)
        return data
    }

    static async update<T, TData>(id: string, formData: TData, owner?: number) {
        const {data} = await axiosClient.put<T>(`${this.routeToUrl(this.URL, owner)}/${id}`, formData)
        return data
    }

    static async delete<T>(id: string, owner?: number) {
        const {data} = await axiosClient.delete<T>(`${this.routeToUrl(this.URL, owner)}/${id}`)
        return data
    }

    static routeToUrl(route: string, owner?: number): string {
        if (!owner) return route
        return route.replace('.', `/${owner}/`);
    }
}
