import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10 text-center sm:py-16">
      <h1 className="font-display text-3xl text-rice-50">Password reset</h1>
      <p className="mt-3 text-sm text-rice-400">
        This is a UI placeholder. Wire your transactional email provider (SendGrid, Postmark, etc.) and tokenized reset
        flow before production.
      </p>
      <Link href="/account/login" className="mt-8 inline-block">
        <Button variant="outline">Back to login</Button>
      </Link>
    </div>
  );
}
