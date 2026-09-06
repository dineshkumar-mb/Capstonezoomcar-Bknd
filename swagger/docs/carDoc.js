/**
 * OpenAPI Path Definitions for Car Endpoints
 */

module.exports = {
  '/api/cars/getallcars': {
    get: {
      summary: 'Get All Cars',
      description: 'Retrieve all cars available in the fleet.',
      tags: ['Cars'],
      responses: {
        200: {
          description: 'List of cars retrieved successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Car' }
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
  '/api/cars/cars': {
    get: {
      summary: 'Fetch Available Cars by Date Range',
      description: 'Retrieve cars that are booked within the specified date range. Both `from` and `to` parameters are required.',
      tags: ['Cars'],
      parameters: [
        {
          in: 'query',
          name: 'from',
          required: true,
          schema: { type: 'string', format: 'date-time' },
          description: 'Start date-time filter',
          example: '2026-09-10T10:00:00.000Z'
        },
        {
          in: 'query',
          name: 'to',
          required: true,
          schema: { type: 'string', format: 'date-time' },
          description: 'End date-time filter',
          example: '2026-09-12T18:00:00.000Z'
        }
      ],
      responses: {
        200: {
          description: 'Available cars matching date criteria.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Car' }
              }
            }
          }
        },
        400: {
          description: 'Missing from or to query parameters.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: 'Please provide both from and to dates' }
            }
          }
        },
        500: { description: 'Internal server error.' }
      }
    }
  },
  '/api/cars/search': {
    get: {
      summary: 'Search and Filter Cars',
      description: 'Search cars by category and/or hourly rent price range.',
      tags: ['Cars'],
      parameters: [
        {
          in: 'query',
          name: 'category',
          required: false,
          schema: { type: 'string' },
          description: 'Car category filter',
          example: 'SUV'
        },
        {
          in: 'query',
          name: 'minBudget',
          required: false,
          schema: { type: 'number' },
          description: 'Minimum hourly rent',
          example: 100
        },
        {
          in: 'query',
          name: 'maxBudget',
          required: false,
          schema: { type: 'number' },
          description: 'Maximum hourly rent',
          example: 1000
        }
      ],
      responses: {
        200: {
          description: 'Filtered list of cars.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Car' }
              }
            }
          }
        },
        500: { description: 'Internal server error.' }
      }
    }
  },
  '/api/cars/reviews/{carId}': {
    get: {
      summary: 'Get Car Reviews',
      description: 'Retrieve all reviews submitted for a specific car.',
      tags: ['Cars'],
      parameters: [
        {
          in: 'path',
          name: 'carId',
          required: true,
          schema: { type: 'string' },
          description: 'Mongoose ObjectId of the car',
          example: '66da8789abc456def7890789'
        }
      ],
      responses: {
        200: {
          description: 'List of car reviews.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Review' }
              }
            }
          }
        },
        400: {
          description: 'Invalid car ID format.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: 'Invalid car ID format' }
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
        500: { description: 'Internal server error.' }
      }
    }
  },
  '/api/cars/addcar': {
    post: {
      summary: 'Add New Car',
      description: 'Add a new car to the system.',
      tags: ['Cars'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AddCarRequest' }
          }
        }
      },
      responses: {
        201: {
          description: 'Car created successfully.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Car' }
            }
          }
        },
        400: {
          description: 'All fields are required.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { error: 'All fields are required' }
            }
          }
        },
        500: { description: 'Internal server error.' }
      }
    }
  },
  '/api/cars/editcar/{carid}': {
    put: {
      summary: 'Edit Car',
      description: 'Update car properties by car ID.',
      tags: ['Cars'],
      parameters: [
        {
          in: 'path',
          name: 'carid',
          required: true,
          schema: { type: 'string' },
          description: 'Mongoose ObjectId of the car',
          example: '66da8789abc456def7890789'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                Carname: { type: 'string', example: 'Thar 4x4' },
                Imageurl: { type: 'string' },
                RentPerHour: { type: 'number', example: 600 },
                Capacity: { type: 'number' },
                FuelType: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Updated car details.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Car' }
            }
          }
        },
        400: { description: 'Invalid car ID format.' },
        404: { description: 'Car not found.' },
        500: { description: 'Internal server error.' }
      }
    }
  },
  '/api/cars/deletecar/{id}': {
    delete: {
      summary: 'Delete Car',
      description: 'Remove a car record from the database.',
      tags: ['Cars'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string' },
          description: 'Mongoose ObjectId of the car',
          example: '66da8789abc456def7890789'
        }
      ],
      responses: {
        200: {
          description: 'Car deleted successfully.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MessageResponse' },
              example: { message: 'Car deleted successfully' }
            }
          }
        },
        400: { description: 'Invalid car ID format.' },
        404: { description: 'Car not found.' },
        500: { description: 'Internal server error.' }
      }
    }
  },
  '/api/cars/rate/{carId}': {
    post: {
      summary: 'Submit Rating and Review',
      description: 'Submit a new rating (1-5) and review string for a car.',
      tags: ['Cars'],
      parameters: [
        {
          in: 'path',
          name: 'carId',
          required: true,
          schema: { type: 'string' },
          description: 'Mongoose ObjectId of the car',
          example: '66da8789abc456def7890789'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RateCarRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Review submitted successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Review submitted successfully' },
                  car: { $ref: '#/components/schemas/Car' }
                }
              }
            }
          }
        },
        400: {
          description: 'Missing or invalid ratings/reviews fields.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        404: { description: 'Car not found.' },
        500: { description: 'Internal server error.' }
      }
    }
  }
};
