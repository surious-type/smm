import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Link2 } from "lucide-react"
import { DTask } from '@/types.ts';

interface TasksTableProps {
  tasks: DTask[]
}

export default function TasksTable({ tasks }: TasksTableProps) {
  // Функция для определения цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Активна":
        return "bg-green-500 hover:bg-green-600"
      case "Завершена":
        return "bg-gray-500 hover:bg-gray-600"
      case "В процессе":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader className="bg-gray-900 text-white">
          <TableRow>
            <TableHead className="w-[50px] text-white">#</TableHead>
            <TableHead className="text-white">Ссылка</TableHead>
            <TableHead className="text-white">Тип постов</TableHead>
            <TableHead className="text-white">Панель</TableHead>
            <TableHead className="text-white">Тип выполнения</TableHead>
            <TableHead className="text-white">Создана</TableHead>
            <TableHead className="text-white">Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="hover:bg-gray-100">
              <TableCell className="font-medium">{task.id}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Link2 className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="truncate max-w-[200px]" title={task.channel_link}>
                    {task.channel_link}
                  </span>
                </div>
              </TableCell>
              <TableCell>{task.post_type}</TableCell>
              <TableCell>id panel {task.panel_id}</TableCell>
              <TableCell>{task.strategy_type}</TableCell>
              <TableCell>{task.created_at}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
