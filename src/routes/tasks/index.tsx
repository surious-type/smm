import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button.tsx';
import { PlusCircle } from 'lucide-react';
import TasksTable from '@/components/tasks/tasks-table.tsx';
import Task from '@/api/Task.ts';
import {DTask} from "@/types.ts";

export const Route = createFileRoute('/tasks/')({
    component: RouteComponent,
    loader: () => Task.list<DTask>(),
});


function RouteComponent() {
    const tasks = Route.useLoaderData();
    return (
        <main className="container mx-auto py-6 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Задачи</h1>
                <Link to="/tasks/create">
                    <Button className="bg-blue-500 hover:bg-blue-600">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Добавить
                    </Button>
                </Link>
            </div>

            <TasksTable tasks={tasks} />
        </main>
    );
}
