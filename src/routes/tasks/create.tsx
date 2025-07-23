import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button.tsx';
import { ArrowLeft } from 'lucide-react';
import TaskForm from '@/components/tasks/task-form.tsx';
import Panel from '@/api/Panel.ts';
import { DPanel } from '@/types.ts';

export const Route = createFileRoute('/tasks/create')({
    loader: () => Panel.list<DPanel>(),
    component: RouteComponent
});

function RouteComponent() {
    const panels = Route.useLoaderData()

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="mb-6">
                <Link to="/tasks">
                    <Button variant="outline" className="mb-4 bg-transparent">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад к списку задач
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Создание новой задачи</h1>
            </div>

            <TaskForm panels={panels}/>
        </div>
    );
}
