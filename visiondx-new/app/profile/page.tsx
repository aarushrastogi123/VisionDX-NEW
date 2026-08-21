import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileClient from "../components/ProfileClient";

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("visiondx_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyToken(token);

  if (!payload || !payload.userId) {
    redirect("/login");
  }

  const userId = payload.userId as string;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      age: true,
      gender: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return <ProfileClient user={user} />;
}