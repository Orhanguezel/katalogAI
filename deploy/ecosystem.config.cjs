// KatalogAI — PM2 Ecosystem Config
// Kullanim: pm2 start deploy/ecosystem.config.cjs
// pm2 save && pm2 startup

module.exports = {
  apps: [
    {
      name: 'katalogai-backend',
      cwd: './backend',
      script: 'node_modules/.bin/bun',
      args: 'run start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 8078,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      merge_logs: true,
      time: true,
    },
    {
      name: 'katalogai-admin',
      cwd: './admin_panel',
      script: 'node_modules/.bin/next',
      args: 'start -p 3030',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3030,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: './logs/admin-error.log',
      out_file: './logs/admin-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
