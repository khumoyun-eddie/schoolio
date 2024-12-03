"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ClassSchema, ExamSchema, StudentSchema, SubjectSchema, TeacherSchema } from "./formValidationSchemas";
import prisma from "./prisma";

type CurrentState = { success: boolean; error: boolean };

// SUBJECT ACTIONS
export const createSubject = async (currentState: CurrentState, data: SubjectSchema) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });
    // revalidatePath("/list/subjects");`
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};

export const updateSubject = async (currentState: CurrentState, data: SubjectSchema) => {
  try {
    const updateData: any = {
      name: data.name,
    };

    // Only update teachers if provided in the data
    if (data.teachers && data.teachers.length > 0) {
      updateData.teachers = {
        set: data.teachers.map((teacherId) => ({ id: teacherId })),
      };
    }

    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });
    console.log(data);
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};

export const deleteSubject = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });
    // revalidatePath("/list/subjects");`
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};

// CLASS ACTIONS
export const createClass = async (currentState: CurrentState, data: ClassSchema) => {
  try {
    await prisma.class.create({
      data,
    });
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};

export const updateClass = async (currentState: CurrentState, data: ClassSchema) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};

export const deleteClass = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });
    // revalidatePath("/list/subjects");`
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};

// EXAM ACTIONS
export const createExam = async (currentState: CurrentState, data: ExamSchema) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadate as { role?: string })?.role;

  try {
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};

export const updateExam = async (currentState: CurrentState, data: ExamSchema) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadate as { role?: string })?.role;

  try {
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: userId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};

export const deleteExam = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadate as { role?: string })?.role;

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });
    // revalidatePath("/list/subjects");`
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};

// TEACHER ACTIONS
export const createTeacher = async (currentState: CurrentState, data: TeacherSchema) => {
  try {
    const client = await clerkClient();
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};

export const updateTeacher = async (currentState: CurrentState, data: TeacherSchema) => {
  if (!data.id) {
    return { success: false, error: true };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        ...(data.password !== "" && { password: data.password }),
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};

export const deleteTeacher = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);
    await prisma.teacher.delete({
      where: {
        id,
      },
    });
    // revalidatePath("/list/subjects");`
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};

// STUDENT ACTIONS
export const createStudent = async (currentState: CurrentState, data: StudentSchema) => {
  try {
    // check if there a spot in the class
    const classItem = await prisma.class.findUnique({
      where: {
        id: data.classId,
      },
      include: {
        _count: {
          select: { students: true },
        },
      },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }

    const client = await clerkClient();
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};

export const updateStudent = async (currentState: CurrentState, data: StudentSchema) => {
  if (!data.id) {
    return { success: false, error: true };
  }

  try {
    const client = await clerkClient();
    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: { id: data.id },
      data: {
        ...(data.password !== "" && { password: data.password }),
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};

export const deleteStudent = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);
    await prisma.student.delete({
      where: {
        id,
      },
    });
    // revalidatePath("/list/subjects");`
    return { ...currentState, success: true };
  } catch (error) {
    console.log(error);
    return { ...currentState, error: true };
  }
};
