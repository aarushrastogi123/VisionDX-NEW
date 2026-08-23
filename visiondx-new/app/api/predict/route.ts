import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // ==========================================
    // 1. CHECK USER LOGIN
    // ==========================================

    const cookieStore = await cookies();

    const token =
      cookieStore.get("visiondx_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to save a prediction",
        },
        { status: 401 }
      );
    }

    // ==========================================
    // 2. VERIFY JWT
    // ==========================================

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

    // ==========================================
    // 3. GET PREDICTION DATA
    // ==========================================

    const body = await request.json();

    const {
      imageUrl,
      disease,
      confidence,
      predictions,
    } = body;

    // ==========================================
    // 4. VALIDATE DATA
    // ==========================================

    if (
      !imageUrl ||
      !disease ||
      confidence === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing prediction data",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // 5. SAVE NEW PREDICTION
    // ==========================================

    const prediction =
      await prisma.prediction.create({
        data: {
          imageUrl,
          disease,
          confidence: Number(confidence),
          predictions: predictions ?? null,
          userId,
        },
      });

    // ==========================================
    // 6. GET ALL USER PREDICTIONS
    // NEWEST FIRST
    // ==========================================

    const userPredictions =
      await prisma.prediction.findMany({
        where: {
          userId,
        },

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
        },
      });

    // ==========================================
    // 7. DELETE EVERYTHING AFTER THE LATEST 5
    // ==========================================

    if (userPredictions.length > 5) {
      const predictionsToDelete =
        userPredictions.slice(5);

      await prisma.prediction.deleteMany({
        where: {
          id: {
            in: predictionsToDelete.map(
              (prediction) => prediction.id
            ),
          },
        },
      });
    }

    // ==========================================
    // 8. RETURN RESULT
    // ==========================================

    return NextResponse.json({
      success: true,
      message: "Prediction saved successfully",
      prediction,
    });

  } catch (error) {
    console.error(
      "Prediction save error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while saving prediction",
      },
      {
        status: 500,
      }
    );
  }
}