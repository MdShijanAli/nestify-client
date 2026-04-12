"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim() || "demo@nestify.com";
    const name = String(fd.get("name") ?? "").trim() || "Demo User";
    login({ email, name });
    router.push("/");
  };

  return (
    <div className="container mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-16">
      <h1 className="font-heading text-center text-3xl font-bold">Log in</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Use any values — this is a demo sign-in for the UI.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Input name="name" placeholder="Name" autoComplete="name" />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
        />
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link href="/register" className="text-foreground underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
