const app = require('./app');
require('dotenv').config();

// Set port
const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, () => {
  console.log(`🔐 Auth service running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`🔹 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔹 API endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
}); 