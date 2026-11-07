"use client";

import * as React from "react";
import { toast } from "sonner";

export function SocialAuthButtons({ actionText = "register" }: { actionText?: "register" | "sign in" }) {
  const handleSocialClick = (provider: string) => {
    toast.info(`${provider} sign-in will be available in an upcoming update.`);
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Divider */}
      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-3 text-muted-foreground font-medium">
            Or {actionText} with
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => handleSocialClick("Google")}
          className="h-10 rounded-none border border-border bg-background hover:bg-muted/60 active:scale-[0.99] text-foreground text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {/* Authentic Google "G" SVG */}
          <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Google</span>
        </button>

        {/* Apple Button */}
        <button
          type="button"
          onClick={() => handleSocialClick("Apple")}
          className="h-10 rounded-none border border-border bg-background hover:bg-muted/60 active:scale-[0.99] text-foreground text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {/* Authentic Apple SVG */}
          <svg className="size-4 shrink-0 fill-current text-foreground" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.76.99.08 2.05-.51 2.67-1.26z" />
          </svg>
          <span>Apple</span>
        </button>
      </div>
    </div>
  );
}
