import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

type Task = { id: string; title: string; completed: boolean };

type TaskCardProps = { task: Task; onToggle: (id: string) => void };

export function TaskCard({ task, onToggle }: TaskCardProps) {
  return (
    <Card className="bg-surface">
      <CardContent className="flex items-center gap-2 p-4">
        <Checkbox checked={task.completed} onCheckedChange={() => onToggle(task.id)} />
        <span className={task.completed ? 'line-through text-text-secondary' : 'text-text-primary'}>{task.title}</span>
      </CardContent>
    </Card>
  );
} 