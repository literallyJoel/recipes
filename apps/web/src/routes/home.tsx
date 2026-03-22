import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireAuth } from "@/lib/auth-guards";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

function HomePage() {
  const { redirect } = useRequireAuth("/login");

  if (redirect) {
    return redirect;
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-5 pt-24 pb-8 sm:px-8 lg:px-10">
        <Card variant="frame" className="w-full p-8 sm:p-10 lg:p-14">
          <CardHeader className="space-y-3">
            <p className="text-muted-foreground text-sm font-semibold uppercase tracking-[0.28em]">
              Home
            </p>
            <CardTitle className="font-display text-5xl leading-none tracking-[-0.04em] sm:text-6xl">
              Home
            </CardTitle>
          </CardHeader>

          <CardContent className="mt-8">
            <Button variant="retro" asChild>
              <Link to="/login">Back to login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
