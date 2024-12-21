import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    const apiKey = request.headers.get("X-API-Key");

    if (apiKey !== process.env.API_KEY) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const apiEndpoint =
      process.env.STABLE_DIFFUSION_API_URL ||
      "https://tushcmd--stable-diffusion-modal-generate.modal.run";

    const apiResponse = await fetch(
      `${apiEndpoint}?prompt=${encodeURIComponent(text)}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": process.env.API_KEY || "",
          Accept: "image/jpeg",
        },
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Failed to fetch image:", errorText);
      throw new Error(
        `HTTP Error: ${apiResponse.status}, message: ${errorText}`
      );
    }

    const imageBuffer = await apiResponse.arrayBuffer();

    const filename = `${crypto.randomUUID()}.jpg`;
    const blob = await put(filename, imageBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
    });
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to process request",
      },
      { status: 500 }
    );
  }
}
