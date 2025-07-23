import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {DPanel} from "@/types.ts";

const formSchema = z.object({
    name: z.string().min(1, "Название обязательно"),
    base_url: z.url({error: "Введите корректный URL"}),
    api_key: z.string().min(1, "Ключ обязателен"),
    enabled: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

interface PanelManagerProps {
    panels: DPanel[]
    onCreate: (panel: Omit<DPanel, "id" | "created_at" | "updated_at">) => void
    onUpdate: (panel: DPanel) => void
    onDelete: (id: number) => void
}

export default function PanelManager({ panels, onCreate, onUpdate, onDelete }: PanelManagerProps) {
    const [editingPanel, setEditingPanel] = useState<DPanel | null>(null)

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            base_url: "",
            api_key: "",
            enabled: true,
        },
    })

    const handleEdit = (panel: DPanel) => {
        setEditingPanel(panel)
        form.reset({
            name: panel.name,
            base_url: panel.base_url,
            api_key: panel.api_key,
            enabled: panel.enabled,
        })
    }

    const handleCancelEdit = () => {
        setEditingPanel(null)
        form.reset({
            name: "",
            base_url: "",
            api_key: "",
            enabled: true,
        })
    }

    const onSubmit = (values: FormData) => {
        if (editingPanel) {
            onUpdate({
                ...editingPanel,
                ...values,
                updated_at: new Date().toISOString(),
            })
            setEditingPanel(null)
        } else {
            onCreate(values)
        }

        form.reset({
            name: "",
            base_url: "",
            enabled: true,
        })
    }

    return (
        <div className="p-4 space-y-6">
            {/* Форма создания/редактирования */}
            <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">{editingPanel ? "Редактировать панель" : "Создать новую панель"}</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Название</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Введите название" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="base_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Base URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="api_key"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Api key</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="enabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Включено</FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1">
                                    {editingPanel ? "Обновить" : "Создать"}
                                </Button>
                                {editingPanel && (
                                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                        Отмена
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </Form>
            </div>

            {/* Таблица панелей */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Название</TableHead>
                            <TableHead>Base URL</TableHead>
                            <TableHead>Api key</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {panels.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                    Панели не найдены
                                </TableCell>
                            </TableRow>
                        ) : (
                            panels.map((panel) => (
                                <TableRow key={panel.id}>
                                    <TableCell className="font-mono">{panel.id}</TableCell>
                                    <TableCell className="font-medium">{panel.name}</TableCell>
                                    <TableCell>
                                        <a
                                            href={panel.base_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {panel.base_url}
                                        </a>
                                    </TableCell>
                                    <TableCell className="font-medium">{panel.api_key}</TableCell>
                                    <TableCell>
                                        <Badge variant={panel.enabled ? "default" : "secondary"}>
                                            {panel.enabled ? "Включено" : "Выключено"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(panel)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => onDelete(panel.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
