import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Check if the user is logged in
    const cookieStore = await cookies();
    const token = cookieStore.get("visiondx_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to make a prediction",
        },
        { status: 401 }
      );
    }

    // 2. Verify the JWT
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

    // 3. Get the uploaded data
    const body = await request.json();

    const { imageUrl, disease, confidence } = body;

    // 4. Validate the data
    if (!imageUrl || !disease || confidence === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing prediction data",
        },
        { status: 400 }
      );
    }

    // 5. Save prediction in PostgreSQL
    const prediction = await prisma.prediction.create({
      data: {
        imageUrl,
        disease,
        confidence: Number(confidence),
        userId,
      },
    });

    // 6. Return the saved prediction
    return NextResponse.json({
      success: true,
      message: "Prediction saved successfully",
      prediction,
    });
  } catch (error) {
    console.error("Prediction error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while saving prediction",
      },
      { status: 500 }
    );
  }
}