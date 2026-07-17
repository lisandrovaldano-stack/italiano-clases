export type Role = "teacher" | "student";
export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type SessionStatus = "programado" | "dictado" | "cancelado";

export type Profile = {
  id: string;
  full_name: string;
  role: Role;
  avatar_color: string;
  created_at: string;
};

export type Course = {
  id: string;
  title: string;
  level: Level;
  description: string | null;
  schedule_text: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
};

export type Enrollment = {
  id: string;
  course_id: string;
  student_id: string;
  created_at: string;
};

export type ClassSession = {
  id: string;
  course_id: string;
  numero: number;
  fecha: string;
  temario: string | null;
  material_url: string | null;
  estado: SessionStatus;
  created_at: string;
};

export type Attendance = {
  id: string;
  session_id: string;
  student_id: string;
  presente: boolean;
  nota: string | null;
};

export type Material = {
  id: string;
  session_id: string;
  file_name: string | null;
  url: string;
  created_at: string;
};

export type Task = {
  id: string;
  session_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  file_name: string | null;
  file_url: string | null;
  created_at: string;
};

export type LibraryKind = "youtube" | "image" | "file" | "link";

export type LibraryItem = {
  id: string;
  title: string;
  description: string | null;
  kind: LibraryKind;
  url: string;
  file_name: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      courses: {
        Row: Course;
        Insert: Partial<Course>;
        Update: Partial<Course>;
        Relationships: [];
      };
      enrollments: {
        Row: Enrollment;
        Insert: Partial<Enrollment>;
        Update: Partial<Enrollment>;
        Relationships: [
          {
            foreignKeyName: "enrollments_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollments_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          }
        ];
      };
      class_sessions: {
        Row: ClassSession;
        Insert: Partial<ClassSession>;
        Update: Partial<ClassSession>;
        Relationships: [];
      };
      attendance: {
        Row: Attendance;
        Insert: Partial<Attendance>;
        Update: Partial<Attendance>;
        Relationships: [];
      };
      materials: {
        Row: Material;
        Insert: Partial<Material>;
        Update: Partial<Material>;
        Relationships: [];
      };
      tasks: {
        Row: Task;
        Insert: Partial<Task>;
        Update: Partial<Task>;
        Relationships: [];
      };
      library_items: {
        Row: LibraryItem;
        Insert: Partial<LibraryItem>;
        Update: Partial<LibraryItem>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
  };
};
