/**
 * OpenAPI Reusable Component Schemas for Capstonezoomcar-Bknd
 */

const schemas = {
  // --- USER SCHEMAS ---
  User: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '66da8123abc456def7890123' },
      username: { type: 'string', example: 'dinesh' },
      role: { type: 'string', example: 'User', enum: ['User', 'admin'] }
    }
  },
  UserLoginRequest: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string', example: 'dinesh' },
      password: { type: 'string', format: 'password', example: 'password123' }
    }
  },
  UserRegisterRequest: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string', example: 'dinesh' },
      password: { type: 'string', format: 'password', minLength: 6, example: 'password123' }
    }
  },
  AuthResponse: {
    type: 'object',
    properties: {
      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      user: { $ref: '#/components/schemas/User' }
    }
  },
  AdminAuthResponse: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Admin login successful' },
      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      user: { $ref: '#/components/schemas/User' }
    }
  },

  // --- CAR SCHEMAS ---
  Review: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '66da8456abc456def7890456' },
      ratings: { type: 'number', minimum: 1, maximum: 5, example: 5 },
      reviews: { type: 'string', example: 'Great car and smooth ride!' }
    }
  },
  BookedTimeSlot: {
    type: 'object',
    properties: {
      from: { type: 'string', example: '2026-09-10T10:00:00.000Z' },
      to: { type: 'string', example: '2026-09-12T18:00:00.000Z' }
    }
  },
  Car: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '66da8789abc456def7890789' },
      Carname: { type: 'string', example: 'Mahindra Thar' },
      Imageurl: { type: 'string', example: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf' },
      RentPerHour: { type: 'number', example: 500 },
      Capacity: { type: 'number', example: 4 },
      FuelType: { type: 'string', example: 'Diesel' },
      ratings: {
        type: 'array',
        items: { type: 'number' },
        example: [5, 4, 5]
      },
      reviews: {
        type: 'array',
        items: { $ref: '#/components/schemas/Review' }
      },
      bookedTimeSlots: {
        type: 'array',
        items: { $ref: '#/components/schemas/BookedTimeSlot' }
      }
    }
  },
  AddCarRequest: {
    type: 'object',
    required: ['name', 'image', 'rentPerHour', 'capacity', 'fuelType'],
    properties: {
      name: { type: 'string', example: 'Mahindra Thar' },
      image: { type: 'string', example: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf' },
      rentPerHour: { type: 'number', example: 500 },
      capacity: { type: 'number', example: 4 },
      fuelType: { type: 'string', example: 'Diesel' }
    }
  },
  RateCarRequest: {
    type: 'object',
    required: ['ratings', 'reviews'],
    properties: {
      ratings: { type: 'number', minimum: 1, maximum: 5, example: 5 },
      reviews: { type: 'string', example: 'Excellent car condition and smooth driving experience.' }
    }
  },

  // --- BOOKING SCHEMAS ---
  Booking: {
    type: 'object',
    properties: {
      _id: { type: 'string', example: '66da8999abc456def7890999' },
      car: {
        oneOf: [
          { type: 'string', example: '66da8789abc456def7890789' },
          { $ref: '#/components/schemas/Car' }
        ]
      },
      user: {
        oneOf: [
          { type: 'string', example: '66da8123abc456def7890123' },
          { $ref: '#/components/schemas/User' }
        ]
      },
      bookedTimeSlots: { $ref: '#/components/schemas/BookedTimeSlot' },
      totalHours: { type: 'number', example: 12 },
      totalAmount: { type: 'number', example: 6000 },
      transactionId: { type: 'string', example: 'ch_3PfEQKIGMXT0myEMkagrj8DF' },
      driverRequired: { type: 'boolean', example: false },
      createdAt: { type: 'string', format: 'date-time', example: '2026-09-06T12:00:00.000Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2026-09-06T12:00:00.000Z' }
    }
  },
  BookCarRequest: {
    type: 'object',
    required: ['token', 'totalAmount', 'car', 'bookedTimeSlots'],
    properties: {
      token: {
        type: 'object',
        required: ['id', 'email'],
        properties: {
          id: { type: 'string', example: 'tok_1PfEQKIGMXT0myEMkagrj8DF' },
          email: { type: 'string', format: 'email', example: 'dinesh@example.com' }
        }
      },
      totalAmount: { type: 'number', example: 6000 },
      car: { type: 'string', example: '66da8789abc456def7890789', description: 'Car MongoDB ID' },
      user: { type: 'string', example: '66da8123abc456def7890123', description: 'User MongoDB ID' },
      bookedTimeSlots: { $ref: '#/components/schemas/BookedTimeSlot' },
      totalHours: { type: 'number', example: 12 },
      driverRequired: { type: 'boolean', example: false }
    }
  },
  UpdateBookingRequest: {
    type: 'object',
    properties: {
      bookedTimeSlots: { $ref: '#/components/schemas/BookedTimeSlot' },
      totalHours: { type: 'number', example: 15 },
      totalAmount: { type: 'number', example: 7500 },
      driverRequired: { type: 'boolean', example: true }
    }
  },

  // --- PAYMENT SCHEMAS ---
  PaymentSessionResponse: {
    type: 'object',
    properties: {
      url: { type: 'string', example: 'https://checkout.stripe.com/c/pay/cs_test_a1b2c3d4...' }
    }
  },

  // --- COMMON ERROR & RESPONSE SCHEMAS ---
  ErrorResponse: {
    type: 'object',
    properties: {
      error: { type: 'string', example: 'Something went wrong' }
    }
  },
  MessageResponse: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Operation completed successfully' }
    }
  }
};

module.exports = schemas;
