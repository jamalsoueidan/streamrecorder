export default ({ env }) => {
  // GitHub Actions (Linux) - use SQLite
  if (process.env.CI) {
    return {
      connection: {
        client: "sqlite",
        connection: {
          filename: ".tmp/test.db",
        },
        useNullAsDefault: true,
      },
    };
  }

  // Local Windows - use PostgreSQL
  return {
    connection: {
      client: "postgres",
      connection: {
        host: env("DATABASE_HOST", "localhost"),
        port: env.int("DATABASE_PORT", 5432),
        database: "streamrecorder_test",
        user: env("DATABASE_USERNAME", "postgres"),
        password: env("DATABASE_PASSWORD", "postgres"),
        schema: "public",
      },
    },
  };
};
