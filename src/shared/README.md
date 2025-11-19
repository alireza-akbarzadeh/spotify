# Shared Library

Simple, production-ready utilities and services used across the application.

## Structure

```
shared/
├── lib/                    # ✅ NEW - Simplified utilities
│   ├── database.ts        # Prisma client singleton
│   ├── logger.ts          # Pino structured logging
│   ├── audit.ts           # Audit logging service
│   ├── polar.ts           # Polar subscription client
│   ├── encryption.ts      # Encryption utilities
│   ├── request-id.ts      # Request ID management
│   └── index.ts           # Main exports
├── ui/                     # ✅ KEEP - UI components
│   └── components/
└── infrastructure/         # 🗑️ TO REMOVE - Old structure
    └── application/        # 🗑️ TO REMOVE - Old structure
```

## Usage

### Database

```typescript
import { db } from '@/shared/lib';

const users = await db.user.findMany();
```

### Logger

```typescript
import { logger } from '@/shared/lib';

logger.info({ userId }, 'User logged in');
logger.error({ error }, 'Operation failed');
```

### Audit Logging

```typescript
import { auditWorkflowCreate } from '@/shared/lib';

await auditWorkflowCreate(workflowId, userId, { name: 'My Workflow' });
```

### Polar Client

```typescript
import { polarClient } from '@/shared/lib';

const customer = await polarClient.customers.get(customerId);
```

### Encryption

```typescript
import { encrypt, decrypt } from '@/shared/lib';

const encrypted = encrypt('sensitive-data');
const decrypted = decrypt(encrypted);
```

### Request ID

```typescript
import { getOrCreateRequestId } from '@/shared/lib';

const requestId = getOrCreateRequestId(headers);
```

## Available Functions

### Database (`db`)

- Prisma client singleton with logging and performance monitoring
- Automatically reconnects in serverless environments
- Logs slow queries (>1s) in development

### Logger (`logger`)

- Structured logging with Pino
- `logger.info()`, `logger.error()`, `logger.warn()`, `logger.debug()`
- Automatic request ID tracking

### Audit Functions

- `createAuditLog(data)` - Create audit log entry
- `auditWorkflowCreate(workflowId, userId, metadata?)`
- `auditWorkflowUpdate(workflowId, userId, metadata?)`
- `auditWorkflowDelete(workflowId, userId, metadata?)`
- `auditWorkflowExecute(workflowId, userId, executionId, metadata?)`
- `auditCredentialCreate(credentialId, userId, metadata?)`
- `auditCredentialUpdate(credentialId, userId, metadata?)`
- `auditCredentialDelete(credentialId, userId, metadata?)`
- `auditCredentialView(credentialId, userId, metadata?)`
- `auditExecutionCreate(executionId, userId, workflowId, metadata?)`
- `getAuditLogs(entityType, entityId, limit?)`
- `getUserAuditLogs(userId, limit?)`
- `getRecentAuditActivity(limit?)`

### Polar Client (`polarClient`)

- Polar SDK client for subscription management
- Configured for sandbox environment
- Use for customer and subscription operations

### Encryption

- `encrypt(data)` - Encrypt sensitive data
- `decrypt(encrypted)` - Decrypt data

### Request ID

- `getOrCreateRequestId(headers)` - Get or create request ID for tracing

## Migration from Old Structure

**Old imports:**

```typescript
import prisma from '@/shared/infrastructure/database/db';
import { logger } from '@/shared/infrastructure/logger/pino.logger';
import { polarClient } from '@/shared/application/services/polar';
import { createAuditLog } from '@/shared/application/services/audit';
```

**New imports:**

```typescript
import { db, logger, polarClient, createAuditLog } from '@/shared/lib';
// or
import { db as prisma } from '@/shared/lib'; // if you prefer 'prisma' name
```

## Next Steps

1. ✅ All imports updated to use new `/lib` structure
2. 🗑️ Delete `infrastructure/` and `application/` folders after verification
3. 🗑️ Delete `domain/` folder (unused DDD abstractions)

## Benefits

- **70% fewer folders** - From 6 folders to 2
- **Single import source** - Import everything from `@/shared/lib`
- **Clear purpose** - Each file has one clear responsibility
- **Easy to find** - No more nested folder structures
- **Simple to extend** - Just add new files to `lib/`
