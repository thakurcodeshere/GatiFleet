module.exports = {
  apps: [{
    name: 'gatifleet-api',
    script: 'index.js',
    instances: '1', // Run 1 instance (or 'max' for cluster mode)
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    // Output logs to our existing Winston logs directory (or let Winston handle app logs)
    error_file: 'logs/pm2-error.log',
    out_file: 'logs/pm2-out.log',
    merge_logs: true,
    time: true
  }]
};
