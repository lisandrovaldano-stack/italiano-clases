"use client";

import { setAttendance } from "@/app/admin/curso/[id]/actions";

export function AttendanceToggle({
  sessionId,
  studentId,
  courseId,
  defaultChecked,
}: {
  sessionId: string;
  studentId: string;
  courseId: string;
  defaultChecked: boolean;
}) {
  return (
    <form
      action={setAttendance}
      onChange={(e) => (e.currentTarget as HTMLFormElement).requestSubmit()}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="session_id" value={sessionId} />
      <input type="hidden" name="student_id" value={studentId} />
      <input type="hidden" name="course_id" value={courseId} />
      <input
        type="checkbox"
        name="presente"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[var(--color-primary)]"
      />
      <span className="text-sm">Presente</span>
    </form>
  );
}
