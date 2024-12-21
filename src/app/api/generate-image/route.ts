import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

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

    return NextResponse.json({
      success: true,
      message: `Received: ${text}`,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
