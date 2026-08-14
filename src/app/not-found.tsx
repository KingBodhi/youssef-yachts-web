import Link from "next/link";
import { Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 pt-24">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-border bg-surface">
          <Anchor className="h-9 w-9 text-primary" />
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary-light sm:text-sm">
          Off the chart
        </p>
        <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mt-4 text-muted">
          This page has drifted. The fleet, however, is exactly where you left
          it.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/fleet">Browse the Fleet</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">Back Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
