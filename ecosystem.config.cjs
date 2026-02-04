module.exports = {
  apps: [
    {
      name: "spa-backend",
      cwd: "./backEnd",
      script: "npm",
      args: "run start:prod",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "spa-frontend",
      cwd: "./frontEnd",
      script: "npm",
      args: "run preview",
      env: {
        NODE_ENV: "production",
        PORT: 5173,
      },
    },
  ],
};
