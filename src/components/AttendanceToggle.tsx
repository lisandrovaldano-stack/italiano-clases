"use client";

import { useTransition } from "react";
import { setAttendance } from "@/app/admin/curso/[id]/actions";

export function AttendanceToggle({
  sessionId,
  studentId,
  courseId,
  presente,
}: {
  sessionId: string;
  studentId: string;
  courseId: string;
  presente: boolean | undefined;
}) {
  const [isPending, startTransition] = useTransition();

  function mark(value: boolean) {
    const formData = new FormData();
    formData.set("session_id", sessionId);
    formData.set("student_id", studentId);
    formData.set("course_id", courseId);
    formData.set("presente", String(value));
    startTransition(() => {
      setAttendance(formData);
    });
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
      <button
        type="button"
        disabled={isPending}
        onClick={() => mark(true)}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition disabled:opacity-50 ${
          presente === true
            ? "bg-primary text-white"
            : "text-foreground/60 hover:bg-cream-dark"
        }`}
      >
        Presente
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => mark(false)}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition disabled:opacity-50 ${
          presente === false
            ? "bg-accent text-white"
            : "text-foreground/60 hover:bg-cream-dark"
        }`}
      >
        Ausente
      </button>
    </div>
  );
}
