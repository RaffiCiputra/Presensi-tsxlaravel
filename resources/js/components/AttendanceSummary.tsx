import { Users, UserCheck, UserX, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Attendee } from "./AttendanceList";

interface AttendanceSummaryProps {
  attendees: Attendee[];
}

export function AttendanceSummary({ attendees }: AttendanceSummaryProps) {
  const total = attendees.length;
  const present = attendees.filter((a) => a.status === "present").length;
  const absent = attendees.filter((a) => a.status === "absent").length;
  const late = attendees.filter((a) => a.status === "late").length;
  const unmarked = attendees.filter((a) => a.status === "unmarked").length;

  const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0;

  const stats = [
    {
      label: "Total",
      value: total,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Present",
      value: present,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Late",
      value: late,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Absent",
      value: absent,
      icon: UserX,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={`p-4 ${stat.bg}`}>
              <div className="flex items-center gap-3">
                <div className={`${stat.color}`}>
                  <Icon className="size-6" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {unmarked === 0 && total > 0 && (
<Card className="p-4 bg-linear-to-r from-blue-50 to-purple-50">

          <div className="text-center">
            <p className="text-lg">
              Attendance Rate: <span className="font-semibold">{presentPercentage}%</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {present} out of {total} attendees present
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
