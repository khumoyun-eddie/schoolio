"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormModalProps } from "@/types";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useFormState } from "react-dom";
import { deleteClass, deleteExam, deleteStudent, deleteSubject, deleteTeacher } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
  // TODO: OTHER DELETE ACTIONS
  parent: deleteSubject,
  lesson: deleteSubject,
  assignment: deleteSubject,
  result: deleteSubject,
  attendance: deleteSubject,
  event: deleteSubject,
  announcement: deleteSubject,
};

const TeacherForm = dynamic(() => import("./form/TeacherForm"), {
  loading: () => (
    <div className="flex flex-col items-center justify-center">
      <span className="loader"></span>
      <h1 className="mt-2">Loading...</h1>
    </div>
  ),
});
const StudentForm = dynamic(() => import("./form/StudentForm"), {
  loading: () => (
    <div className="flex flex-col items-center justify-center">
      <span className="loader"></span>
      <h1 className="mt-2">Loading...</h1>
    </div>
  ),
});
const SubjectForm = dynamic(() => import("./form/SubjectForm"), {
  loading: () => (
    <div className="flex flex-col items-center justify-center">
      <span className="loader"></span>
      <h1 className="mt-2">Loading...</h1>
    </div>
  ),
});
const ClassesForm = dynamic(() => import("./form/ClassesForm"), {
  loading: () => (
    <div className="flex flex-col items-center justify-center">
      <span className="loader"></span>
      <h1 className="mt-2">Loading...</h1>
    </div>
  ),
});
const ExamForm = dynamic(() => import("./form/ExamForm"), {
  loading: () => (
    <div className="flex flex-col items-center justify-center">
      <span className="loader"></span>
      <h1 className="mt-2">Loading...</h1>
    </div>
  ),
});

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  class: (setOpen, type, data, relatedData) => (
    <ClassesForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  exam: (setOpen, type, data, relatedData) => (
    <ExamForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  teacher: (setOpen, type, data, relatedData) => (
    <TeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />
  ),
  student: (setOpen, type, data, relatedData) => (
    <StudentForm setOpen={setOpen} type={type} data={data} relatedData={relatedData} />
  ),
};

const FormModal = ({ table, type, data, id, relatedData }: FormModalProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor = type === "create" ? "bg-lamaYellow" : type === "update" ? "bg-lamaSky" : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const DeleteForm = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast.warning(`${table} has been deleted!`);
        setOpen(false);
        router.refresh();
      }
    }, [state, router]);

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text | number" name="id" value={id} hidden />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">Delete</button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} ${bgColor} flex items-center justify-center rounded-full`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="absolute top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-black bg-opacity-60">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <DeleteForm />
            <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
