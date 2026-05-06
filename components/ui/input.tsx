import { cn } from "@/lib/cn";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-rice-50 outline-none ring-ocean-400/40 placeholder:text-rice-200/50 focus:ring-2",
        className
      )}
      {...props}
    />
  );
}
