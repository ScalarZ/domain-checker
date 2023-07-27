import { Data } from "@/types";
import { CheckCircle2, Heart, XCircle } from "lucide-react";

export default function Domain({
  domain,
  result,
  children,
}: {
  domain: string;
  result: "registered" | "available" | "error" | null;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative px-4 py-2 w-full border shadow-md shadow-slate-200 rounded flex justify-between items-center z-20 dark:text-white dark:shadow-slate-950`}
    >
      <p className="text-lg">{domain}</p>
      <div className="flex items-center gap-x-1">
        <div
          className={`${
            result === "available" ? "text-green-500" : "text-red-600"
          }`}
        >
          {result === "available" ? (
            <CheckCircle2 className="text-green-500" />
          ) : (
            <XCircle className="text-red-500" />
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
