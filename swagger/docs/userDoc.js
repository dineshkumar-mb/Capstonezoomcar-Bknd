/**
 * OpenAPI Path Definitions for User & Admin Endpoints
 */

module.exports = {
  '/api/users/login': {
    post: {
      summary: 'User Login',
      description: 'Authenticate user credentials and receive a JWT token.',
      tags: ['Authentication & Users'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserLoginRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Login successful. Returns JWT token and user profile.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse'
              }
            }
          }
        },
        400: {
          description: 'Missing username/password or invalid credentials.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              examples: {
                missingFields: {
                  summary: 'Missing credentials',
                  value: { error: 'Please provide both username and password' }
                },
                invalidCreds: {
                  summary: 'Invalid credentials',
                  value: { error: 'Invalid credentials' }
                }
              }
            }
          }
        },
        500: {
          description: 'Internal server error.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    }
  },
  '/api/users/register': {
    post: {
      summary: 'User Registration',
      description: "Register a new user account with role 'User'. Password must be at least 6 characters.",
      tags: ['Authentication & Users'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserRegisterRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'User registered successfully.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MessageResponse'
              },
              example: { message: 'User registered successfully' }
            }
          }
        },
        400: {
          description: 'Validation error or username already exists.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              examples: {
                missingFields: {
                  summary: 'Missing fields',
                  value: { error: 'Please provide both username and password' }
                },
                shortPassword: {
                  summary: 'Password too short',
                  value: { error: 'Password must be at least 6 characters long' }
                },
                duplicateUser: {
                  summary: 'User exists',
                  value: { error: 'Username already exists' }
                }
              }
            }
          }
        },
        500: {
          description: 'Internal server error.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    }
  },
  '/api/users/admin/login': {
    post: {
      summary: 'Admin Login',
      description: 'Authenticate admin credentials and receive an admin JWT token.',
      tags: ['Authentication & Users'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserLoginRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Admin login successful.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AdminAuthResponse'
              }
            }
          }
        },
        400: {
          description: 'Invalid credentials or missing fields.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        403: {
          description: 'Access denied for non-admin users.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: { error: 'Access denied. Admins only.' }
            }
          }
        },
        500: {
          description: 'Internal server error.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    }
  },
  '/api/users/admin/addcar': {
    post: {
      summary: 'Admin Add Car',
      description: 'Admin endpoint to add a new car to the fleet. Requires admin JWT token in Authorization header.',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AddCarRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Car added successfully.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MessageResponse'
              },
              example: { message: 'Car added successfully' }
            }
          }
        },
        400: {
          description: 'Invalid input or missing fields.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        403: {
          description: 'Access denied - Missing token or non-admin role.'
        },
        500: {
          description: 'Internal server error.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    }
  },
  '/api/users/admin/editcar/{id}': {
    put: {
      summary: 'Admin Edit Car',
      description: 'Admin endpoint to update car details by car ID. Requires admin JWT token.',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
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
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AddCarRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Car updated successfully.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Car updated successfully' },
                  car: { $ref: '#/components/schemas/Car' }
                }
              }
            }
          }
        },
        400: { description: 'Missing fields or invalid request.' },
        403: { description: 'Access denied.' },
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
  '/api/users/admin/deletecar/{id}': {
    delete: {
      summary: 'Admin Delete Car',
      description: 'Admin endpoint to remove a car from the database by ID. Requires admin JWT token.',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
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
        403: { description: 'Access denied.' },
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
  }
};
