
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, CalendarClock } from "lucide-react";

interface TaskProps {
  title: string;
  subject: string;
  dueDate: string;
}

interface UpcomingCardProps {
  tasks: TaskProps[];
}

export function UpcomingCard({ tasks }: UpcomingCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            Upcoming Tasks
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No upcoming tasks. Add some in your study planner!
            </p>
          ) : (
            tasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium leading-none mb-1">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.subject}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{task.dueDate}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
