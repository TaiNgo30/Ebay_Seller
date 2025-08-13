export const openapi = {
    openapi: '3.0.3',
    info: {
        title: 'Seller API (Ebay-like)',
        version: '1.0.0'
    },
    servers: [{ url: 'http://localhost:4000' }],
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
        },
        schemas: {
            LoginRequest: {
                type: 'object',
                properties: { usernameOrEmail: { type: 'string' }, password: { type: 'string' } },
                required: ['usernameOrEmail', 'password']
            },
            RegisterRequest: {
                type: 'object',
                properties: {
                    username: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                    isSeller: { type: 'boolean' }
                },
                required: ['username', 'email', 'password']
            },
            Product: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    title: { type: 'string' },
                    price: { type: 'number' },
                    status: { type: 'string', enum: ['active', 'hidden', 'deleted'] }
                }
            }
        }
    },
    paths: {
        '/health': {
            get: { summary: 'Health check', responses: { '200': { description: 'ok' } } }
        },
        '/api/auth/register': {
            post: {
                summary: 'Register',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } } },
                responses: { '200': { description: 'Token' } }
            }
        },
        '/api/auth/login': {
            post: {
                summary: 'Login',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
                responses: { '200': { description: 'Token' } }
            }
        },
        '/api/seller/me': {
            get: {
                summary: 'Get seller profile & store',
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Seller profile' } }
            }
        },
        '/api/seller/store': {
            put: {
                summary: 'Update store profile',
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { storeName: { type: 'string' }, description: { type: 'string' }, banner: { type: 'string', format: 'binary' } }, required: ['storeName'] } } } },
                responses: { '200': { description: 'Store' } }
            }
        },
        '/api/products': {
            get: {
                summary: 'List my products',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer' } },
                    { name: 'limit', in: 'query', schema: { type: 'integer' } },
                    { name: 'status', in: 'query', schema: { type: 'string' } }
                ],
                responses: { '200': { description: 'Products' } }
            },
            post: {
                summary: 'Create product',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string' },
                                    price: { type: 'number' },
                                    quantity: { type: 'integer' },
                                    attributes: { type: 'string' },
                                    specifics: { type: 'string' },
                                    variants: { type: 'string', description: 'JSON array of variants' },
                                    isDraft: { type: 'boolean' },
                                    scheduledAt: { type: 'string', format: 'date-time' },
                                    images: { type: 'array', items: { type: 'string', format: 'binary' } }
                                },
                                required: ['title', 'price']
                            }
                        }
                    }
                },
                responses: { '201': { description: 'Product created' } }
            }
        },
        '/api/policies': {
            get: { summary: 'List business policies', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Policies' } } },
            post: { summary: 'Create policy', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { type: { type: 'string', enum: ['payment', 'shipping', 'return'] }, name: { type: 'string' }, data: { type: 'object' } }, required: ['type', 'name'] } } } }, responses: { '201': { description: 'Policy' } } }
        },
        '/api/policies/{id}': {
            put: { summary: 'Update policy', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Policy' } } },
            delete: { summary: 'Delete policy', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK' } } }
        },
        '/api/returns': {
            get: { summary: 'List returns for seller', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Returns' } } }
        },
        '/api/returns/{id}': {
            put: { summary: 'Update return status', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['approved', 'rejected', 'received', 'refunded'] }, rmaNumber: { type: 'string' } }, required: ['status'] } } } }, responses: { '200': { description: 'Return' } } }
        },
        '/api/messages': {
            get: { summary: 'List messages in thread', security: [{ bearerAuth: [] }], parameters: [{ name: 'threadId', in: 'query', required: true }], responses: { '200': { description: 'Messages' } } },
            post: { summary: 'Send message', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { threadId: { type: 'string' }, receiverId: { type: 'string' }, content: { type: 'string' }, productId: { type: 'string' }, orderId: { type: 'string' } }, required: ['threadId', 'receiverId', 'content'] } } } }, responses: { '201': { description: 'Message' } } }
        },
        '/api/store-categories': {
            get: { summary: 'List store categories', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Categories' } } },
            post: { summary: 'Create store category', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, parentId: { type: 'string' } }, required: ['name'] } } } }, responses: { '201': { description: 'Category' } } }
        },
        '/api/store-categories/{id}': {
            put: { summary: 'Update store category', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Category' } } },
            delete: { summary: 'Delete store category', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK' } } }
        },
        '/api/products/{id}': {
            put: { summary: 'Update product', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Product' } } },
            delete: { summary: 'Soft delete product', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'OK' } } }
        },
        '/api/products/{id}/hide': {
            put: { summary: 'Hide product', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Product' } } }
        },
        '/api/products/{id}/unhide': {
            put: { summary: 'Unhide product', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Product' } } }
        },
        '/api/inventory/{productId}': {
            get: { summary: 'Get inventory', security: [{ bearerAuth: [] }], parameters: [{ name: 'productId', in: 'path', required: true }], responses: { '200': { description: 'Inventory' } } },
            put: {
                summary: 'Update inventory',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'productId', in: 'path', required: true }],
                requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { quantity: { type: 'integer' } }, required: ['quantity'] } } } },
                responses: { '200': { description: 'Inventory' } }
            }
        },
        '/api/coupons': {
            get: { summary: 'List coupons', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Coupons' } } },
            post: {
                summary: 'Create coupon', security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { code: { type: 'string' }, discountPercent: { type: 'integer' }, startDate: { type: 'string' }, endDate: { type: 'string' }, maxUsage: { type: 'integer' }, productId: { type: 'string' } }, required: ['code', 'discountPercent', 'startDate', 'endDate', 'productId'] } } } },
                responses: { '201': { description: 'Coupon' } }
            }
        },
        '/api/orders': {
            get: { summary: 'List orders', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Orders' } } }
        },
        '/api/orders/{id}/confirm': {
            post: { summary: 'Confirm order', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Order' } } }
        },
        '/api/orders/{id}/shipping-label': {
            get: { summary: 'Generate shipping label', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true }], responses: { '200': { description: 'Label' } } }
        },
        '/api/orders/{id}/status': {
            put: {
                summary: 'Update order status', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true }],
                requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['shipped', 'delivered', 'failed', 'cancelled'] } }, required: ['status'] } } } },
                responses: { '200': { description: 'Order' } }
            }
        },
        '/api/reviews': {
            get: { summary: 'List reviews', security: [{ bearerAuth: [] }], parameters: [{ name: 'productId', in: 'query', schema: { type: 'string' } }], responses: { '200': { description: 'Reviews' } } }
        },
        '/api/feedback': {
            post: { summary: 'Create feedback', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, type: { type: 'string', enum: ['general', 'issue', 'feature'] } }, required: ['message'] } } } }, responses: { '201': { description: 'Feedback' } } }
        },
        '/api/disputes': {
            get: { summary: 'List disputes', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Disputes' } } }
        },
        '/api/disputes/{id}': {
            put: { summary: 'Update dispute', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['in_review', 'resolved', 'rejected'] }, resolution: { type: 'string' } }, required: ['status'] } } } }, responses: { '200': { description: 'Dispute' } } }
        },
        '/api/reports/sales': {
            get: { summary: 'Sales report', security: [{ bearerAuth: [] }], parameters: [{ name: 'range', in: 'query', schema: { type: 'string', enum: ['week', 'month'] } }], responses: { '200': { description: 'Report' } } }
        }
    }
} as const; 