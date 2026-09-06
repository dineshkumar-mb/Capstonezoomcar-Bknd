/**
 * OpenAPI Path Definitions for Booking Endpoints
 */

module.exports = {
  '/api/bookings/bookingcar': {
    post: {
      summary: 'Book a Car & Charge Payment',
      description: 'Create a new car booking and process Stripe credit/debit card payment.',
      tags: ['Bookings'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/BookCarRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Booking completed successfully.',
          content: {
            'text/plain': {
              schema: { type: 'string', example: 'Your booking is successful' }
            }
          }
        },
        400: {
          description: 'Payment processing failed.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: 'Payment failed' }
            }
          }
        },
        404: {
          description: 'Car not found.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: 'Car not found' }
            }
          }
        },
        500: {
          description: 'Internal server error.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/bookings/getallbookings': {
    get: {
      summary: 'Get All Bookings',
      description: 'Retrieve all booking records along with populated car details.',
      tags: ['Bookings'],
      responses: {
        200: {
          description: 'List of all bookings.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Booking' }
              }
            }
          }
        },
        500: {
          description: 'Internal server error.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },
  '/api/bookings/userbookings': {
    get: {
      summary: 'Get User Bookings',
      description: 'Retrieve booking history for a user. User ID is extracted from Authorization Bearer token header or query parameter `userId`.',
      tags: ['Bookings'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'query',
          name: 'userId',
          required: false,
          schema: { type: 'string' },
          description: 'Mongoose ObjectId of the user (optional if Bearer token is passed)',
          example: '66da8123abc456def7890123'
        }
      ],
      responses: {
        200: {
          description: 'User bookings retrieved successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Booking' }
              }
            }
          }
        },
        400: {
          description: 'Missing or invalid userId format.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              examples: {
                missingUserId: {
                  summary: 'Missing userId',
                  value: { error: 'userId is required' }
                },
                invalidFormat: {
                  summary: 'Invalid userId format',
                  value: { error: 'Invalid userId format' }
                }
              }
            }
          }
        },
        500: { description: 'Internal server error.' }
      }
    }
  },
  '/api/bookings/bookings/{id}': {
    put: {
      summary: 'Update Booking',
      description: 'Update an existing booking record by ID.',
      tags: ['Bookings'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' },
          description: 'Mongoose ObjectId of the booking',
          example: '66da8999abc456def7890999'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateBookingRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Booking updated successfully.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Booking' }
            }
          }
        },
        404: {
          description: 'Booking not found.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: 'Booking not found' }
            }
          }
        },
        500: { description: 'Internal server error.' }
      }
    }
  },
  '/api/bookings/delete/{id}': {
    delete: {
      summary: 'Cancel Booking',
      description: 'Cancel a booking and automatically release reserved time slots on the booked car.',
      tags: ['Bookings'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' },
          description: 'Mongoose ObjectId of the booking',
          example: '66da8999abc456def7890999'
        }
      ],
      responses: {
        200: {
          description: 'Booking canceled successfully.',
          content: {
            'text/plain': {
              schema: { type: 'string', example: 'Booking canceled successfully' }
            }
          }
        },
        404: {
          description: 'Booking not found.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: 'Booking not found' }
            }
          }
        },
        500: { description: 'Internal server error.' }
      }
    }
  }
};
