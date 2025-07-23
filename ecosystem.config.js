// PM2 Configuration for Intranet Litio Service
// Ubuntu Server 24.04 Production Setup

module.exports = {
  apps: [
    {
      name: "intranet-litio-service",
      script: "npm",
      args: "start",
      cwd: "/var/www/litio-erp",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Logging
      log_file: "/var/log/litio-erp/combined.log",
      out_file: "/var/log/litio-erp/out.log",
      error_file: "/var/log/litio-erp/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // Restart configuration
      watch: false,
      ignore_watch: ["node_modules", "logs", ".git"],
      max_restarts: 10,
      min_uptime: "10s",
      max_memory_restart: "1G",

      // Advanced configuration
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,

      // Auto restart on file changes (disable in production)
      autorestart: true,

      // Cron restart (restart every day at 2 AM)
      cron_restart: "0 2 * * *",

      // Merge logs
      merge_logs: true,

      // Time zone
      time: true,
    },
  ],

  deploy: {
    production: {
      user: "ubuntu",
      host: "your-server-ip",
      ref: "origin/main",
      repo: "https://github.com/litio-service/intranet.git",
      path: "/var/www/litio-erp",
      "pre-deploy-local": "",
      "post-deploy": "npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
}
