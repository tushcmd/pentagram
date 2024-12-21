// This server action is to protect the generate image API from being called from the client
// The client should call this action instead
"use server";

export async function generateImage(text: string) {
  try {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-SECRET": process.env.API_SECRET || "",
      },
      body: JSON.stringify({ text: text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Server Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate image",
    };
  }
}
