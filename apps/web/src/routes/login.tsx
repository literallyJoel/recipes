import { createFileRoute } from "@tanstack/react-router";

import GoogleLogo from "@/assets/svg/Google.svg";
import { SplitShell } from "@/components/shared/SplitShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useGuestOnly } from "@/lib/auth-guards";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = authClient;
  const { isPending, redirect } = useGuestOnly("/home");

  if (redirect) {
    return redirect;
  }

  const handleGoogleAuth = async () => {
    await signIn.social({ provider: "google" });
  };

  return (
    <SplitShell
      aside={
        <div className="space-y-3">
          <h1 className="font-display max-w-3xl text-5xl leading-none tracking-display text-balance sm:text-6xl lg:text-7xl">
            Recipes
          </h1>
        </div>
      }
    >
      <Card variant="retro" className="bg-secondary px-5 py-6 sm:px-6 sm:py-7">
        <CardHeader className="space-y-3">
          <p className="text-muted-foreground text-sm font-semibold uppercase tracking-kicker">
            Sign in
          </p>
          <CardTitle className="font-display text-4xl leading-none tracking-display sm:text-5xl">
            Sign In
          </CardTitle>
        </CardHeader>

        <CardContent className="mt-6 space-y-4">
          <Button
            type="button"
            variant="retro"
            size="xl"
            onClick={handleGoogleAuth}
            disabled={isPending}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-foreground bg-white">
                <img src={GoogleLogo} alt="" className="size-5" />
              </span>
              <span>{isPending ? "Working..." : "Continue with Google"}</span>
            </span>
            <span aria-hidden="true" className="font-display text-xl">
              →
            </span>
          </Button>
        </CardContent>
      </Card>
    </SplitShell>
  );
}
