import { useEffect, useRef, useState } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Switch, Route, useLocation, Router as WouterRouter, Redirect, Link } from 'wouter';
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import { Toaster } from "@/components/ui/toaster";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(280, 100%, 60%)",
    colorForeground: "hsl(280, 50%, 10%)",
    colorMutedForeground: "hsl(280, 20%, 40%)",
    colorDanger: "hsl(0, 100%, 60%)",
    colorBackground: "hsl(0, 0%, 100%)",
    colorInput: "hsl(300, 20%, 98%)",
    colorInputForeground: "hsl(280, 50%, 10%)",
    colorNeutral: "hsl(280, 50%, 10%)",
    fontFamily: "'Space Mono', monospace",
    borderRadius: "0rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-none border-4 border-foreground w-[440px] max-w-full overflow-hidden shadow-[8px_8px_0px_0px_hsl(var(--foreground))]",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-2xl font-bold uppercase tracking-tighter text-foreground",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButtonText: "font-bold uppercase",
    formFieldLabel: "uppercase font-bold text-sm tracking-tight",
    footerActionLink: "text-primary font-bold hover:underline",
    footerActionText: "text-muted-foreground",
    dividerText: "uppercase font-bold text-xs",
    identityPreviewEditButton: "text-primary hover:underline",
    formFieldSuccessText: "text-secondary font-bold",
    alertText: "text-destructive font-bold",
    logoBox: "mb-6 flex justify-center",
    logoImage: "h-16 object-contain",
    socialButtonsBlockButton: "border-2 border-foreground hover:bg-muted font-bold rounded-none",
    formButtonPrimary: "bg-primary text-white border-2 border-foreground hover:bg-primary/90 font-bold uppercase rounded-none transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))]",
    formFieldInput: "border-2 border-foreground rounded-none focus:ring-0 focus:border-primary font-mono",
    footerAction: "pt-4",
    dividerLine: "bg-border",
    alert: "border-2 border-destructive bg-destructive/10 rounded-none",
    otpCodeFieldInput: "border-2 border-foreground rounded-none",
    formFieldRow: "mb-4",
    main: "p-6",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClientLocal = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClientLocal.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClientLocal]);

  return null;
}

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/dashboard" />
      </Show>
      <Show when="signed-out">
        <Home />
      </Show>
    </>
  );
}

function UserPortal() {
  return (
    <>
      <Show when="signed-in">
        <Dashboard />
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Join the patch",
            subtitle: "Sign in to access your Berries",
          },
        },
        signUp: {
          start: {
            title: "Get Berries",
            subtitle: "Create your wallet profile",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/dashboard" component={UserPortal} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route path="*">
            <div className="flex min-h-screen items-center justify-center flex-col gap-6 bg-background">
              <h1 className="text-6xl font-bold uppercase tracking-tighter">Not Found</h1>
              <Link href="/" className="px-8 py-4 bg-primary text-white font-bold uppercase border-4 border-foreground shadow-[6px_6px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all">Go Home</Link>
            </div>
          </Route>
        </Switch>
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;