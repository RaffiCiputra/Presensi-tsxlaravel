import { Check, X, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export type AttendanceStatus = "present" | "absent" | "late" | "unmarked";

export interface Attendee {
  id: string;
  name: string;
  status: AttendanceStatus;
}

interface AttendanceListProps {
  attendees: Attendee[];
  onStatusChange: (id: string, status: AttendanceStatus) => void;
}

export function AttendanceList({ attendees, onStatusChange }: AttendanceListProps) {
  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700 border-green-200";
      case "absent":
        return "bg-red-100 text-red-700 border-red-200";
      case "late":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <Check className="size-4" />;
      case "absent":
        return <X className="size-4" />;
      case "late":
        return <Clock className="size-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {attendees.map((attendee) => (
        <Card key={attendee.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span>{attendee.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="font-medium">{attendee.name}</p>
                <div className="flex items-center gap-1">
                  {getStatusIcon(attendee.status)}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(attendee.status)}`}>
                    {attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={attendee.status === "present" ? "default" : "outline"}
                onClick={() => onStatusChange(attendee.id, "present")}
                className={attendee.status === "present" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <Check className="size-4" />
              </Button>
              <Button
                size="sm"
                variant={attendee.status === "late" ? "default" : "outline"}
                onClick={() => onStatusChange(attendee.id, "late")}
                className={attendee.status === "late" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
              >
                <Clock className="size-4" />
              </Button>
              <Button
                size="sm"
                variant={attendee.status === "absent" ? "default" : "outline"}
                onClick={() => onStatusChange(attendee.id, "absent")}
                className={attendee.status === "absent" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
