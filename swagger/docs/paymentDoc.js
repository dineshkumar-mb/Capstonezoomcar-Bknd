/**
 * OpenAPI Path Definitions for Payment Endpoints
 */

module.exports = {
  '/payment': {
    post: {
      summary: 'Create Stripe Checkout Session',
      description: 'Initialize a Stripe Hosted Checkout Session and retrieve the checkout redirect URL.',
      tags: ['Payments'],
      responses: {
        200: {
          description: 'Stripe Checkout Session created successfully. Returns checkout URL.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PaymentSessionResponse' }
            }
          }
        },
        500: {
          description: 'Internal Server Error creating payment session.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Internal Server Error' }
                }
              }
            }
          }
        }
      }
    }
  }
};
