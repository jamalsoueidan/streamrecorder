"use client";

import { register } from "@/app/actions/auth";
import Link from "next/link";
import { useActionState } from "react";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, null);

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 20 }}>
      <h1>Register</h1>

      {state?.error && (
        <p style={{ color: "red", marginBottom: 16 }}>{state.error}</p>
      )}

      <form action={formAction}>
        <div style={{ marginBottom: 16 }}>
          <label>Username</label>
          <br />
          <input
            name="username"
            type="text"
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

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
            minLength={6}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          style={{ width: "100%", padding: 12 }}
        >
          {pending ? "Creating account..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
}
