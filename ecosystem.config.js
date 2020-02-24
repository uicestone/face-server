module.exports = {
  apps: {
    name: "project-face",
    // script: "./node_modules/.bin/ts-node",
    // args: "src/server.ts",
    script: "./dist/server",
    log_date_format: "YYYY-MM-DD HH:mm:ss.SSS (ZZ)",
    log: true,
    env: {
      TZ: "Asia/Shanghai"
    }
  },
  deploy: {
    production: {
      user: "www-data",
      host: ["stirad.com"],
      ref: "origin/master",
      repo: "git@github.com:uu-z/project-face-server.git",
      path: "/var/www/face-server",
      "post-deploy": "yarn && pm2 startOrRestart ecosystem.config.js"
    }
  }
}
