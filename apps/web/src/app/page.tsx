import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm tracking-wide text-muted-foreground">DramaWay</p>
      <h1 className="text-4xl font-semibold tracking-tight">
        fundacja.dramaway.pl
      </h1>
      <p className="text-lg text-muted-foreground">
        Scaffold: Next.js 15, Tailwind CSS v4, shadcn/ui. Preview reads{" "}
        <code className="text-sm">person</code> and <code className="text-sm">page</code>{" "}
        from Sanity (GROQ).
      </p>
      <div className="flex flex-wrap gap-3">
        <Link className={cn(buttonVariants())} href="/preview">
          Preview Sanity content
        </Link>
        <a
          className={cn(buttonVariants({ variant: "outline" }))}
          href="https://www.fundacja.dramaway.pl/"
          target="_blank"
          rel="noreferrer"
        >
          Live legacy site
        </a>
      </div>
    </main>
  );
}
