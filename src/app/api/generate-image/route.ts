import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    const apiSecret = request.headers.get("X-API-Secret");

    if (apiSecret !== process.env.API_SECRET) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // TODO: Call your Image Generation API here
    // For now, we'll just echo back the text
    console.log(`Received: ${text}`);

    const url = new URL(
      "https://tushcmd--stable-diffusion-modal-generate.modal.run/"
    );

    url.searchParams.set("prompt", text);

    console.log("Requesting URL:", url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-Key": process.env.API_KEY || "",
        Accept: "image/jpeg",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch image:", errorText);
      throw new Error(`HTTP Error: ${response.status}, message: ${errorText}`);
    }

    const imageBuffer = await response.arrayBuffer();

    const filename = `${crypto.randomUUID()}.jpg`;

    const blob = await put(filename, imageBuffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
    });
    // TODO:Store Prompt in database
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
