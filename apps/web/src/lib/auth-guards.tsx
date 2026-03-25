import type { ReactElement } from "react";
import { Navigate } from "@tanstack/react-router";

import { authClient } from "./auth-client";

type RedirectState = {
  isPending: boolean;
  redirect: ReactElement | null;
  session: ReturnType<typeof authClient.useSession>["data"];
};

export const useGuestOnly = (redirectTo: "/home" | "/login" = "/home"): RedirectState => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return {
      isPending,
      redirect: null,
      session
    };
  }

  return {
    isPending,
    redirect: session ? <Navigate to={redirectTo} replace /> : null,
    session
  };
};

export const useRequireAuth = (
  redirectTo: "/login" | "/home" = "/login"
): RedirectState => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return {
      isPending,
      redirect: null,
      session
    };
  }

  return {
    isPending,
    redirect: session ? null : <Navigate to={redirectTo} replace />,
    session
  };
};
