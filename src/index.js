const app = require('./app');
const config = require('./config');

const PORT = config.PORT;

// Simulate heavy startup delay (120 seconds) to test Startup Probe
console.log('Simulating heavy application startup... This may take up to 120 seconds.');
const startTime = Date.now();
while (Date.now() - startTime < 120000) {
  // Busy wait to simulate heavy processing/loading
}
console.log('Startup simulation complete. Starting server...');

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Quiz Application Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.NODE_ENV}`);
  console.log(`🔗 Base URL: http://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/${config.API_VERSION}\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = server;
