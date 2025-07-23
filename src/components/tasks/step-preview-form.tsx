import {StepGeneralSchema} from "@/components/tasks/step-general-form.tsx";
import {StepStrategySchema} from "@/components/tasks/step-strategy-form.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CardDescription, CardTitle} from "@/components/ui/card.tsx";
import {PostType, StrategyType} from "@/enums.ts";

export type StepPreviewSchema = StepGeneralSchema & StepStrategySchema;

export function StepPreviewForm({
    formData,
    onSubmit,
    onBack,
}: {
    formData: StepPreviewSchema
    onSubmit: () => void
    onBack: () => void
}) {
    return (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="space-y-2">
                <CardTitle className="text-lg">Подтверждение данных</CardTitle>
                <CardDescription>Проверьте введенные данные перед отправкой</CardDescription>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <h3 className="font-medium text-lg">Основные данные</h3>
                    <div className="bg-muted p-4 rounded-md space-y-3">
                        <div>
                            <span className="font-medium">Ссылки:</span>
                            <ul className="list-disc list-inside mt-1">
                                {formData.links.map((link, index) => (
                                    <li key={index} className="text-sm">
                                        {link}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <span className="font-medium">Тип постов:</span>{" "}
                            {formData.post_type === PostType.NEW ? "Новые посты" : "Существующие посты"}
                        </div>
                        {formData.post_type === PostType.NEW && formData.end_at && (
                            <div>
                                <span className="font-medium">Дата окончания:</span> {formData.end_at}
                            </div>
                        )}
                        {formData.post_type === PostType.EXISTING && formData.count_post && (
                            <div>
                                <span className="font-medium">Количество записей:</span> {formData.count_post}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="font-medium text-lg">Настройки выполнения</h3>
                    <div className="bg-muted p-4 rounded-md space-y-3">
                        <div>
                            <span className="font-medium">Панель управления:</span> {formData.panel_id === 1 ? "smmlite" : "jap"}
                        </div>
                        <div>
                            <span className="font-medium">Режим выполнения:</span>{" "}
                            {formData.strategy_type === StrategyType.SIMPLE ? "Простое выполнение" : "Умное выполнение"}
                        </div>

                        {formData.strategy_type === StrategyType.SIMPLE && (
                            <div className="border-l-2 border-blue-200 pl-4 mt-2 space-y-2">
                                <h4 className="font-medium text-blue-700">Настройки простого выполнения</h4>
                                <div>
                                    <span className="font-medium">ID услуги:</span> {formData.service_id}
                                </div>
                                <div>
                                    <span className="font-medium">Количество действий:</span> {formData.quantity}
                                </div>
                            </div>
                        )}

                        {formData.strategy_type === StrategyType.SMART && (
                            <div className="border-l-2 border-green-200 pl-4 mt-2 space-y-2">
                                <h4 className="font-medium text-green-700">Настройки умного выполнения</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <span className="font-medium">Количество действий от:</span> {formData.qty_from}
                                    </div>
                                    <div>
                                        <span className="font-medium">Количество действий до:</span> {formData.qty_to}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <span className="font-medium">Количество в первый час:</span> {formData.first_hour_pct}%
                                    </div>
                                    <div>
                                        <span className="font-medium">ID услуги для первого часа:</span> {formData.first_hour_service}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div>
                                        <span className="font-medium">Оставшиеся часы:</span> {formData.remainder_hours}
                                    </div>
                                    <div>
                                        <span className="font-medium">ID услуги для остатка:</span> {formData.remainder_service}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" onClick={onBack}>
                    Назад
                </Button>
                <Button onClick={onSubmit}>Отправить</Button>
            </div>
        </div>
    );
}
