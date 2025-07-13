import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Mock data
function getMockLogs() {
  return {
    '2025-07-13': ['Task 1', 'Task 2'],
  };
}

export default function Log() {
  const logs = getMockLogs();

  return (
    <Card className="bg-surface">
      <CardHeader className="text-text-primary">Historical Log</CardHeader>
      <CardContent>
        {Object.entries(logs).map(([date, tasks]) => (
          <div key={date} className="mb-4">
            <h2 className="font-bold">{date}</h2>
            <ul className="list-disc pl-4">
              {tasks.map((task, idx) => <li key={idx}>{task}</li>)}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 