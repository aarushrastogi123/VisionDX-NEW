import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("visiondx_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const userId = payload.userId as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        age: true,
        gender: true,
        predictions: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            imageUrl: true,
            disease: true,
            confidence: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Profile fetch error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong while fetching profile" },
      { status: 500 }
    );
  }
}


export async function PUT(request: Request) {
  try {
    // Get JWT from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("visiondx_token")?.value;

    // Check if user is logged in
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Verify JWT
    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session",
        },
        { status: 401 }
      );
    }

    const userId = payload.userId as string;

    // Get updated data
    const { name, age, gender } = await request.json();

    // Basic validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required",
        },
        { status: 400 }
      );
    }

    // Update the logged-in user
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name.trim(),
        age: age ? Number(age) : null,
        gender: gender || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gender: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while updating profile",
      },
      { status: 500 }
    );
  }
}