how about the img issue
Edit
I notice you're using the Image preloading pattern in your code, but there's a simpler and more reliable way to handle image loading in Next.js components. Let me modify the ImageGenerator component to handle images better:

```py
"use client";

import { useState } from "react";
import Image from "next/image";
import { generateImage } from "@/actions/generateImage";

export default function ImageGenerator() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateImage(inputText);

      if (!result.success) {
        throw new Error(result.error || "Failed to generate image");
      }

      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
      }

      setInputText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <main className="flex-1 flex flex-col items-center gap-8">
        {error && (
          <div className="w-full max-w-2xl mx-auto p-4 bg-red-50 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        {imageUrl && (
          <div className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg relative aspect-square">
            <Image
              src={imageUrl}
              alt="Generated Image"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        )}
      </main>

      <footer className="w-full max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-black/[.05] dark:bg-white/[.06] border border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              placeholder="Describe the image you want to generate..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-3 rounded-lg bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
}
```

Key changes I made:

Removed the manual image preloading logic with new Image()
Added Next.js Image component with proper configuration:

Used fill property with aspect-square container for consistent sizing
Added sizes prop for responsive images
Added priority since this is the main content
Used object-contain to maintain aspect ratio

Simplified the state management by directly setting the image URL

However, if your images are coming from an external domain, you'll need to configure Next.js to allow that domain. Add this to your next.config.js:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-image-domain.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
```

Replace 'your-image-domain.com' with the actual domain where your images are hosted. If you're getting images from multiple domains, you can add multiple patterns to the remotePatterns array.
