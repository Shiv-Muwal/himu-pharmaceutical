export default {
  apps: [
    {
      name: "himu-backend",
      cwd: "/var/www/Himu/himu-pharmaceutical/himu-backend",
      script: "src/server.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 5001,
        AUTO_SEED: "true",
      },
      time: true,
      autorestart: true,
      max_restarts: 20,
      restart_delay: 3000,
    },
  ],
};
