/* eslint-disable @typescript-eslint/camelcase */
module.exports = {
  apps: [
    {
      name: "gh-release-stats",
      script: "dist/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
