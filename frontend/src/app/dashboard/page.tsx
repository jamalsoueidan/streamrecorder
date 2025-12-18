import { logout } from "@/app/actions/auth";
import { getToken } from "@/lib/token";
import { redirect } from "next/navigation";
import api from "../api";
import AddFollowerForm from "./add-follower-form";
import UnfollowButton from "./unfollow-button";

export default async function DashboardPage() {
  const token = await getToken();

  if (!token) {
    redirect("/login");
  }

  const user =
    await api.usersPermissionsUsersRoles.getUsersPermissionsUsersRoles();
  const followers = await api.follower.forUserList();
  const recordings = await api.recording.forUserList();

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <h1>Dashboard</h1>
        <div>
          <span style={{ marginRight: 16 }}>Hi, {user?.data?.username}</span>
          <form action={logout} style={{ display: "inline" }}>
            <button type="submit">Logout</button>
          </form>
        </div>
      </div>

      <AddFollowerForm />

      {/* Followers */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ marginBottom: 16 }}>
          Following ({followers.data?.data?.length || 0})
        </h2>
        {followers.data?.data?.length === 0 ? (
          <p>Youre not following anyone yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {followers.data?.data?.map((f) => (
              <li
                key={f.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 16,
                  border: "1px solid #eee",
                  marginBottom: 8,
                  borderRadius: 8,
                }}
              >
                <div>
                  <strong>{f.username}</strong>{" "}
                  <span style={{ color: "#666" }}>@{f.slug}</span>
                  <br />
                  <small>{f.totalRecordings} recordings</small>
                </div>
                <UnfollowButton id={f.id!} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recordings */}
      <div>
        <h2 style={{ marginBottom: 16 }}>
          Recent Recordings ({recordings.data?.data?.length || 0})
        </h2>
        {recordings.data?.data?.length === 0 ? (
          <p>No recordings yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recordings.data?.data?.map((r) => (
              <li
                key={r.id}
                style={{
                  padding: 16,
                  border: "1px solid #eee",
                  marginBottom: 8,
                  borderRadius: 8,
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <strong>{r.follower?.username}</strong>{" "}
                  <span style={{ color: "#666" }}>@{r.follower?.slug}</span>
                </div>
                <div style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleString()
                    : "Unknown date"}
                </div>

                {/* Sources */}
                {r.sources && r.sources.length > 0 && (
                  <div>
                    <small style={{ color: "#666" }}>
                      {r.sources.length} source(s)
                    </small>
                    <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
                      {r.sources.map((s) => (
                        <li key={s.id} style={{ fontSize: 14 }}>
                          <a
                            href={s.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#0066cc" }}
                          >
                            {s.path}
                          </a>
                          {s.duration && (
                            <span style={{ color: "#999", marginLeft: 8 }}>
                              ({Math.floor(s.duration / 60)}m {s.duration % 60}
                              s)
                            </span>
                          )}
                          {s.size && (
                            <span style={{ color: "#999", marginLeft: 8 }}>
                              {s.size}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
