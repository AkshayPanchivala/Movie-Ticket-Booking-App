const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CineHub API Documentation',
      version: '1.0.0',
      description: 'Comprehensive API documentation for the CineHub Cinema Booking System',
      contact: {
        name: 'CineHub Development Team',
        email: 'support@cinehub.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://api.cinehub.com/v1',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Movies',
        description: 'Movie management endpoints'
      },
      {
        name: 'Theaters',
        description: 'Theater management endpoints'
      },
      {
        name: 'Screens',
        description: 'Screen management endpoints'
      },
      {
        name: 'Seats',
        description: 'Seat management endpoints'
      },
      {
        name: 'Shows',
        description: 'Show scheduling and management endpoints'
      },
      {
        name: 'Bookings',
        description: 'Booking management endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints (Admin only)'
      },
      {
        name: 'Analytics',
        description: 'Analytics and reporting endpoints (Admin only)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            full_name: {
              type: 'string',
              example: 'John Doe'
            },
            role: {
              type: 'string',
              enum: ['user', 'theater_admin', 'super_admin'],
              example: 'user'
            },
            theater_id: {
              type: 'string',
              nullable: true,
              example: null
            },
            is_active: {
              type: 'boolean',
              example: true
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-30T10:00:00Z'
            }
          }
        },
        Movie: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            title: {
              type: 'string',
              example: 'The Quantum Paradox'
            },
            description: {
              type: 'string',
              example: 'A mind-bending sci-fi thriller...'
            },
            poster_url: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/poster.jpg'
            },
            trailer_url: {
              type: 'string',
              format: 'uri',
              example: 'https://youtube.com/watch?v=...'
            },
            director: {
              type: 'string',
              example: 'Christopher Nolan'
            },
            genre: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['Sci-Fi', 'Thriller', 'Drama']
            },
            language: {
              type: 'string',
              example: 'English'
            },
            duration: {
              type: 'number',
              example: 142
            },
            movie_cast: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['Actor 1', 'Actor 2']
            },
            rating: {
              type: 'number',
              minimum: 0,
              maximum: 10,
              example: 8.5
            },
            runtime: {
              type: 'number',
              example: 142
            },
            release_date: {
              type: 'string',
              format: 'date',
              example: '2024-06-15'
            },
            is_active: {
              type: 'boolean',
              example: true
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Theater: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              example: 'CineMax Downtown'
            },
            location: {
              type: 'string',
              example: '123 Broadway, New York, NY 10001'
            },
            city: {
              type: 'string',
              example: 'New York'
            },
            total_screens: {
              type: 'number',
              example: 5
            },
            facilities: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['IMAX', 'Dolby Atmos', 'Parking', 'Food Court']
            },
            is_active: {
              type: 'boolean',
              example: true
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Screen: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            theater_id: {
              type: 'string',
              example: '507f1f77bcf86cd799439012'
            },
            name: {
              type: 'string',
              example: 'Screen 1 - IMAX'
            },
            total_seats: {
              type: 'number',
              example: 120
            },
            rows: {
              type: 'number',
              example: 10
            },
            columns: {
              type: 'number',
              example: 12
            },
            is_active: {
              type: 'boolean',
              example: true
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Seat: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            screen_id: {
              type: 'string',
              example: '507f1f77bcf86cd799439012'
            },
            row: {
              type: 'string',
              example: 'A'
            },
            column: {
              type: 'number',
              example: 1
            },
            seat_number: {
              type: 'string',
              example: 'A1'
            },
            seat_type: {
              type: 'string',
              enum: ['regular', 'premium', 'vip'],
              example: 'regular'
            },
            is_active: {
              type: 'boolean',
              example: true
            }
          }
        },
        Show: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            movie_id: {
              type: 'string',
              example: '507f1f77bcf86cd799439012'
            },
            screen_id: {
              type: 'string',
              example: '507f1f77bcf86cd799439013'
            },
            theater_id: {
              type: 'string',
              example: '507f1f77bcf86cd799439014'
            },
            show_date: {
              type: 'string',
              format: 'date',
              example: '2025-10-30'
            },
            show_time: {
              type: 'string',
              pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
              example: '18:00'
            },
            price: {
              type: 'number',
              example: 15.99
            },
            is_active: {
              type: 'boolean',
              example: true
            }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            user_id: {
              type: 'string',
              example: '507f1f77bcf86cd799439012'
            },
            show_id: {
              type: 'string',
              example: '507f1f77bcf86cd799439013'
            },
            booking_date: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-30T10:30:00Z'
            },
            total_amount: {
              type: 'number',
              example: 49.97
            },
            status: {
              type: 'string',
              enum: ['confirmed', 'cancelled', 'completed'],
              example: 'confirmed'
            },
            payment_method: {
              type: 'string',
              enum: ['card', 'upi', 'netbanking', 'wallet'],
              example: 'card'
            },
            payment_details: {
              type: 'object'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
              example: 100
            },
            page: {
              type: 'number',
              example: 1
            },
            limit: {
              type: 'number',
              example: 20
            },
            total_pages: {
              type: 'number',
              example: 5
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR'
                },
                message: {
                  type: 'string',
                  example: 'Invalid request data'
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string'
                      },
                      message: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  code: 'UNAUTHORIZED',
                  message: 'Not authorized to access this route'
                }
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  code: 'FORBIDDEN',
                  message: 'Insufficient permissions'
                }
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  code: 'NOT_FOUND',
                  message: 'Resource not found'
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  code: 'VALIDATION_ERROR',
                  message: 'Invalid request data',
                  details: [
                    {
                      field: 'email',
                      message: 'Invalid email format'
                    }
                  ]
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./config/swaggerDocs.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
