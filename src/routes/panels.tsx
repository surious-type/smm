import {createFileRoute, useRouter} from '@tanstack/react-router'
import Panel from "@/api/Panel.ts"
import {DPanel} from "@/types.ts"
import PanelManager from "@/components/panels/panel-manager.tsx"
import {toast} from "sonner";

export const Route = createFileRoute('/panels')({
    loader: () => Panel.list<DPanel>(),
    component: RouteComponent,
})

function RouteComponent() {
    const panels = Route.useLoaderData()
    const router = useRouter()

    const handleCreate = async (newPanel: Omit<DPanel, "id" | "created_at" | "updated_at">) => {
        try {
            console.log(newPanel)
            type formData = typeof newPanel
            await Panel.create<DPanel, formData>(newPanel)
            toast.success(`Панель «${newPanel.name}» успешно добавлена.`)
            await router.invalidate()
        } catch (error) {
            toast.error("Ошибка при создании панели.")
            console.error(error)
        }
    }

    const handleUpdate = async (updatedPanel: DPanel) => {
        try {
            await Panel.update<DPanel, DPanel>(String(updatedPanel.id), updatedPanel)
            toast.success(`Панель «${updatedPanel.name}» успешно обновлена.`)
            await router.invalidate()
        } catch (error) {
            toast.error("Ошибка при обновлении панели.")
            console.error(error)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await Panel.delete<DPanel>(String(id))
            toast.success(`Панель с ID ${id} успешно удалена.`)
            await router.invalidate()
        } catch (error) {
            toast.error("Ошибка при удалении панели.")
            console.error(error)
        }
    }

    return (
        <main className="container mx-auto py-6 px-4">
            <PanelManager
                panels={panels}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />
        </main>
    )
}
