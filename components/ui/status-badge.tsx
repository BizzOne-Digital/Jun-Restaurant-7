import { cn } from "@/lib/cn";

const map: Record<string, string> = {
  pending: "bg-mango-500/20 text-mango-300",
  paid: "bg-ocean-400/20 text-ocean-100",
  preparing: "bg-coral-500/20 text-coral-300",
  ready: "bg-avocado-500/20 text-avocado-400",
  completed: "bg-white/10 text-rice-100",
  cancelled: "bg-red-500/15 text-red-300",
  refunded: "bg-white/5 text-rice-300",
  unpaid: "bg-mango-500/20 text-mango-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
        map[status] ?? "bg-white/10 text-rice-100"
      )}
    >
      {status.replace(/-/g, " ")}
    </span>
  );
}
