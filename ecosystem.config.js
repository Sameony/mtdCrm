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
            script: 'serve',
            args: ['-s', '-l', '5173'],  // -s for SPA mode, -l to specify port
            cwd: './Frontend/dist',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
        },
    ],
};