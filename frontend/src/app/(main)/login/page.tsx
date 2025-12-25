"use client";

import { login } from "@/app/actions/auth";
import Link from "next/link";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 20 }}>
      <h1>Login</h1>

      {state?.error && (
        <p style={{ color: "red", marginBottom: 16 }}>{state.error}</p>
      )}

      <form action={formAction}>
        <div style={{ marginBottom: 16 }}>
          <label>Email</label>
          <br />
          <input
            name="email"
            type="email"
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Password</label>
          <br />
          <input
            name="password"
            type="password"
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          style={{ width: "100%", padding: 12 }}
        >
          {pending ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        Dont have an account? <Link href="/register">Register</Link>
      </p>
    </div>
  );
}
