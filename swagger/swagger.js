const schemas = require('./schemas');
const config = require('../utils/config');
const userPaths = require('./docs/userDoc');
const carPaths = require('./docs/carDoc');
const bookingPaths = require('./docs/bookingDoc');
const paymentPaths = require('./docs/paymentDoc');

const serverUrl = config.SWAGGER_SERVER_URL || `http://localhost:${config.PORT || 3001}`;

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'ZoomCar Clone API Documentation',
    version: '1.0.0',
    description: 'Production-ready OpenAPI 3.0 API documentation and interactive Swagger UI for ZoomCar Backend Services.'
  },
  servers: [
    {
      url: serverUrl,
      description: 'Active Server'
    }
  ],
  tags: [
    { name: 'Authentication & Users', description: 'User registration, authentication & admin login' },
    { name: 'Cars', description: 'Car fleet management, search, filtering & reviews' },
    { name: 'Bookings', description: 'Car bookings, slot reservation & cancellation' },
    { name: 'Payments', description: 'Stripe payment integration' },
    { name: 'Admin', description: 'Administrative operations' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token (obtained via /api/users/login or /api/users/admin/login) to authorize requests'
      }
    },
    schemas: schemas
  },
  paths: {
    ...userPaths,
    ...carPaths,
    ...bookingPaths,
    ...paymentPaths
  }
};

module.exports = swaggerSpec;
