"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError(true);
      return;
    }
    router.push(`/admin?key=${encodeURIComponent(password.trim())}`);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-2xl font-bold text-center">Admin Access</h1>
      <p className="mt-2 text-sm text-muted-foreground text-center">
        Enter the admin password to view the dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
        {error && (
          <p className="text-sm text-red-500">Please enter a password.</p>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Access Dashboard
        </button>
      </form>
    </div>
  );
}
