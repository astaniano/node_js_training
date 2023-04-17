const transportEnum = {
    HTTP: 'http',
    WEBSOCKET: 'ws',
}

const frameworkEnum = {
    NATIVE: 'native',
    FASTIFY: 'fastify',
}

module.exports = {
    serverPort: 8001,
    staticServerPort: 8000,
    db: {
        host: '127.0.0.1',
        port: 5432,
        database: 'example',
        user: 'marcus',
        password: 'marcus',
    },
    transport: transportEnum.WEBSOCKET,
    framework: frameworkEnum.NATIVE
}
