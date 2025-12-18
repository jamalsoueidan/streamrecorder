import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "100px auto",
        padding: 20,
        textAlign: "center",
      }}
    >
      <h1>Stream Recorder</h1>
      <p style={{ margin: "20px 0", color: "#666" }}>
        Record your favorite streamers
      </p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        <Link
          href="/login"
          style={{
            padding: "12px 24px",
            background: "#000",
            color: "#fff",
            borderRadius: 8,
          }}
        >
          Login
        </Link>
        <Link
          href="/register"
          style={{
            padding: "12px 24px",
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        >
          Register
        </Link>
      </div>
    </div>
  );
}
