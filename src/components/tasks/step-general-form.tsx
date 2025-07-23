import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {CardTitle, CardDescription} from '@/components/ui/card';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form.tsx';
import {PostType} from '@/enums.ts';

export const stepGeneralSchema = z.object({
    links: z.coerce.string<string[]>()
        .min(1, "Укажите хотя бы одну ссылку")
        .transform((str) =>
            str
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean)
        )
        .refine((links: string[]) => links.length > 0, {
            message: "Укажите хотя бы одну корректную ссылку",
        })
        .refine(
            (links: string[]) =>
                links.every((link) => /^https:\/\/t\.me\/.+/.test(link)),
            {
                message: "Все ссылки должны начинаться с https://t.me/",
            }
        ),
    post_type: z.enum(PostType),
    end_at: z.string().optional(),
    count_post: z.coerce.number<number>().optional()
}).check((ctx) => {
    console.log(ctx)
    if (ctx.value.post_type === PostType.NEW && !ctx.value.end_at) {
        ctx.issues.push({
            input: ctx.value,
            message: 'Дата обязательна для новых постов',
            code: 'custom',
            path: ['end_at'],
        })
    }
    if (ctx.value.post_type === PostType.EXISTING && !ctx.value.count_post) {
        ctx.issues.push({
            input: ctx.value,
            message: 'Количество записей обязательно для существующих постов',
            code: 'custom',
            path: ['count_post'],
        })
    }
});

export type StepGeneralSchema = z.infer<typeof stepGeneralSchema>;

export function StepGeneralForm({
    defaultValues,
    onSubmit
}: {
    defaultValues: StepGeneralSchema
    onSubmit: (values: StepGeneralSchema) => void
}) {
    const form = useForm<StepGeneralSchema>({
        resolver: zodResolver(stepGeneralSchema),
        defaultValues,
    });

    const post_type = form.watch('post_type');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-6 animate-in fade-in-50 duration-300">
                    <div className="space-y-2">
                        <CardTitle className="text-lg">Основные данные</CardTitle>
                        <CardDescription>
                            Укажите ссылки и выберите к каким постам применить обработку
                        </CardDescription>
                    </div>

                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="links"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Ссылки для обработки <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Введите ссылки, каждую с новой строки"
                                            {...field}
                                            className="min-h-[100px]"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-3">
                        <FormField
                            control={form.control}
                            name="post_type"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        К каким постам применить <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup {...field} onValueChange={field.onChange} value={field.value}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value={PostType.NEW} id="new-posts"/>
                                                <Label htmlFor="new-posts">Новые посты</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value={PostType.EXISTING} id="existing-posts"/>
                                                <Label htmlFor="existing-posts">Существующие посты</Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    {post_type === PostType.NEW && (
                        <div className="space-y-2 animate-in fade-in-50 duration-300 border-l-2 border-blue-200 pl-4">
                            <FormField
                                control={form.control}
                                name="end_at"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Дата окончания <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input id="end-date" type="date" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    {post_type === PostType.EXISTING && (
                        <div className="space-y-2 animate-in fade-in-50 duration-300 border-l-2 border-green-200 pl-4">
                            <FormField
                                control={form.control}
                                name="count_post"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Количество записей <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input id="record-count" type="number" min="0" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}
                </div>
                <button type="submit">Продолжить</button>
            </form>
        </Form>
    );
}
