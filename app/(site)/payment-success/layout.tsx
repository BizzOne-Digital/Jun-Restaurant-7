import { Suspense } from "react";

export default function PaymentSuccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="py-24 text-center text-rice-400">Loading confirmation…</div>}>
      {children}
    </Suspense>
  );
}
