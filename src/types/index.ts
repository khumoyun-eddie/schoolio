import { Dispatch, SetStateAction } from "react";

//* ============ Teacher
export type Teacher = {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  subjects: string[];
  classes: string[];
  address: string;
};

//* ============ Student
export type Student = {
  id: number;
  studentId: string;
  name: string;
  email?: string;
  photo: string;
  phone?: string;
  grade: number;
  class: string;
  address: string;
};

//* ============ Parent
export type Parent = {
  id: number;
  name: string;
  email?: string;
  students: string[];
  phone: string;
  address: string;
};

//* ============ Subject
export type Subject = {
  id: number;
  name: string;
  teachers: string[];
};

//* ============ Classes
export type Classes = {
  id: number;
  name: string;
  capacity: number;
  grade: number;
  supervisor: string;
};

//* ============ Lesson
export type Lesson = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
};

//* ============ Exams
export type Exam = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  date: string;
};

//* ============ Assignments
export type Assignment = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
};

//* ============ Results
export type Result = {
  id: number;
  subject: string;
  type: "exam" | "assignment";
  teacher: string;
  date: string;
  student: string;
  score: number;
  class: string;
};

//* ============ Events
export type Event = {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  class: string;
};

//* ============ Announcement
export type Announcement = {
  id: number;
  title: string;
  date: string;
  class: string;
};

//* ============ EventCalendar
export type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];

//* ============ Form Modal Types
interface TableEntity {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
}

interface FormAction {
  type: "create" | "update" | "delete";
}

export interface FormModalProps extends TableEntity, FormAction {
  data?: any;
  id?: string | number;
}
