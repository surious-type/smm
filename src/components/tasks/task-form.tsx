import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PostType, StrategyType } from '@/enums.ts';
import {DPanel, DTask} from '@/types.ts';
import { StepGeneralForm } from '@/components/tasks/step-general-form.tsx';
import { StepStrategyForm } from '@/components/tasks/step-strategy-form.tsx';
import {StepPreviewForm, StepPreviewSchema} from "@/components/tasks/step-preview-form.tsx";
import Task from "@/api/Task.ts";

export default function TaskForm({ panels }: { panels: DPanel[] }) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<Partial<StepPreviewSchema>>({
        links: [],
        post_type: PostType.NEW,
        panel_id: panels.length && panels[0].id,
        strategy_type: StrategyType.SIMPLE,
    })

    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)

    const updateFormData = (data: Partial<StepPreviewSchema>) => {
        setFormData((prev) => ({ ...prev, ...data }))
    }

    const handleSubmit = async () => {
        const formattedData = formatDataForSubmission(formData)
        for (const link of formData?.links) {
            const formData = {channel_link: link, ...formattedData}
            type FormData = typeof formData
            await Task.create<DTask, FormData>(formData)
        }
    }

    const formatDataForSubmission = (data: Partial<StepPreviewSchema>) => {
        const baseData = {
            post_type: data.post_type,
            panel_id: data.panel_id,
            strategy_type: data.strategy_type,
        }

        if (data.post_type === PostType.NEW) {
            Object.assign(baseData, { end_at: data.end_at })
        } else {
            Object.assign(baseData, { count_post: Number(data.count_post) })
        }

        if (data.strategy_type === StrategyType.SIMPLE) {
            return {
                ...baseData,
                strategy: {
                    service_id: data.service_id,
                    quantity: data.quantity,
                },
            }
        } else {
            return {
                ...baseData,
                strategy: {
                    qty_from: data.qty_from,
                    qty_to: data.qty_to,
                    first_hour_pct: data.first_hour_pct,
                    first_hour_service: data.first_hour_service,
                    remainder_hours: data.remainder_hours,
                    remainder_service: data.remainder_service,
                },
            }
        }
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardContent className="pt-6">
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        {[1, 2, 3].map((num) => (
                            <div
                                key={num}
                                className={`flex flex-col items-center ${step === num ? "text-primary" : "text-muted-foreground"}`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2
                    ${step === num ? "bg-primary text-primary-foreground" : step > num ? "bg-primary/20" : "bg-muted"}`}
                                >
                                    {num}
                                </div>
                                <span className="text-sm">
                  {num === 1 ? "Основные данные" : num === 2 ? "Настройки выполнения" : "Подтверждение"}
                </span>
                            </div>
                        ))}
                    </div>
                    <div className="w-full bg-muted h-1 mt-4 rounded-full">
                        <div
                            className="bg-primary h-1 rounded-full transition-all"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {step === 1 && (
                    <StepGeneralForm
                        defaultValues={formData}
                        onSubmit={(data) => {
                            updateFormData(data)
                            nextStep()
                        }}
                    />
                )}

                {step === 2 && (
                    <StepStrategyForm
                        panels={panels}
                        defaultValues={formData}
                        onSubmit={(data) => {
                            updateFormData(data)
                            nextStep()
                        }}
                        onBack={prevStep}
                    />
                )}

                {step === 3 && <StepPreviewForm formData={formData} onSubmit={handleSubmit} onBack={prevStep} />}
            </CardContent>
        </Card>
    )
}
