module.exports = {
    apps: [
        {
            name: 'backend-app',
            script: 'npm',
            args: 'start',
            cwd: './Backend',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '3G',
        },
        {
            name: 'frontend-app',
            cwd: './Frontend/dist',
            script: 'serve',
            args: '-s',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                PM2_SERVE_PATH: './',
                PM2_SERVE_PORT: 3000,
            },
        },
    ],
};