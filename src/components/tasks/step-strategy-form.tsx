import {useForm} from 'react-hook-form';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {CardTitle, CardDescription} from '@/components/ui/card';
import {z} from 'zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form.tsx';
import {StrategyType} from '@/enums.ts';
import {zodResolver} from '@hookform/resolvers/zod';
import {DPanel} from '@/types.ts';
import {Button} from "@/components/ui/button.tsx";

export const stepStrategySchema = z.object({
    panel_id: z.coerce.number<number>(),
    strategy_type: z.enum(StrategyType),

    // simple
    service_id: z.coerce.number<number>().optional(),
    quantity: z.coerce.number<number>().optional(),

    // smart
    qty_from: z.coerce.number<number>().optional(),
    qty_to: z.coerce.number<number>().optional(),
    first_hour_pct: z.coerce.number<number>().optional(),
    first_hour_service: z.coerce.number<number>().optional(),
    remainder_hours: z.coerce.number<number>().optional(),
    remainder_service: z.coerce.number<number>().optional()
}).check((ctx) => {
    const {
        strategy_type,
        service_id,
        quantity,
    } = ctx.value
    if (strategy_type === StrategyType.SIMPLE) {
        if (!service_id) ctx.issues.push({
            input: ctx.value,
            path: ['service_id'],
            message: 'Обязательное поле',
            code: 'custom'
        });
        if (!quantity) ctx.issues.push({
            input: ctx.value,
            path: ['quantity'],
            message: 'Обязательное поле',
            code: 'custom'
        });
    }
    if (strategy_type === StrategyType.SMART) {
        ['qty_from', 'qty_to', 'first_hour_pct', 'first_hour_service', 'remainder_hours', 'remainder_service'].forEach((key) => {
            if (!ctx.value[key as keyof typeof ctx.value]) {
                ctx.issues.push({
                    input: ctx.value,
                    path: [key],
                    message: 'Обязательное поле',
                    code: 'custom'
                });
            }
        });
    }
});

export type StepStrategySchema = z.infer<typeof stepStrategySchema>;

export function StepStrategyForm({
    panels,
    defaultValues,
    onSubmit,
    onBack
}: {
    panels: DPanel[]
    defaultValues: StepStrategySchema
    onSubmit: (values: StepStrategySchema) => void
    onBack: () => void
}) {
    const form = useForm<StepStrategySchema>({
        resolver: zodResolver(stepStrategySchema),
        defaultValues,
    });

    const strategy_type = form.watch('strategy_type');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-6 animate-in fade-in-50 duration-300">
                    <div className="space-y-2">
                        <CardTitle className="text-lg">Настройки выполнения</CardTitle>
                        <CardDescription>Выберите панель управления и режим выполнения задачи</CardDescription>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <FormField
                                control={form.control}
                                name="panel_id"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Панель управления
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup {...field}
                                                        onValueChange={(value) => field.onChange(Number(value))}
                                                        value={String(field.value)}>
                                                {panels.map((panel) => (
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value={String(panel.id)} id={panel.name}/>
                                                        <Label htmlFor={panel.name}>{panel.name}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-3">
                            <FormField
                                control={form.control}
                                name="strategy_type"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Режим выполнения
                                        </FormLabel>
                                        <FormControl>
                                            <RadioGroup {...field} onValueChange={field.onChange} value={field.value}>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value={StrategyType.SIMPLE}
                                                                    id={StrategyType.SIMPLE}/>
                                                    <Label htmlFor={StrategyType.SIMPLE}>Простое выполнение</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value={StrategyType.SMART} id={StrategyType.SMART}/>
                                                    <Label htmlFor={StrategyType.SMART}>Умное выполнение</Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {strategy_type === StrategyType.SIMPLE && (
                        <div className="space-y-4 border-l-2 border-blue-200 pl-4">
                            <h4 className="font-medium text-blue-700">Настройки простого выполнения</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="service_id"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>
                                                    ID услуги <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="quantity"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Количество действий <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {strategy_type === StrategyType.SMART && (
                        <div className="space-y-4 border-l-2 border-green-200 pl-4">
                            <h4 className="font-medium text-green-700">Настройки умного выполнения</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="qty_from"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Количество действий от <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="qty_to"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Количество действий до <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="first_hour_pct"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Количество в первый час <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="first_hour_service"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>
                                                    ID услуги для первого часа <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="remainder_hours"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>
                                                    ID услуги для первого часа <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select value={String(field.value)}
                                                            onValueChange={(value) => field.onChange(value)}>
                                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="6">6 часов</SelectItem>
                                                            <SelectItem value="12">12 часов</SelectItem>
                                                            <SelectItem value="24">24 часа</SelectItem>
                                                            <SelectItem value="48">48 часов</SelectItem>
                                                            <SelectItem value="72">72 часа</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="remainder_service"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>
                                                    ID услуги для остатка <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="0" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="pt-4 flex justify-between">
                    <Button type="button" variant="outline" onClick={onBack}>
                        Назад
                    </Button>
                    <Button type="submit">Продолжить</Button>
                </div>
            </form>
        </Form>
    );
}
