/**
 * Audit Service
 * Track all CRUD operations on critical entities
 */

import type { AuditAction, EntityType } from '@/prisma/generated/prisma/enums';
import db from './database';
import { logger } from './logger';

export interface AuditLogData {
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  userId?: string | null;
  metadata?: Record<string, unknown>;
  executionId?: string | null;
  credentialId?: string | null;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        userId: data.userId || undefined,
        metadata: data.metadata as never,
        executionId: data.executionId || undefined,
        credentialId: data.credentialId || undefined,
      },
    });

    logger.info(
      {
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        userId: data.userId,
      },
      'Audit log created'
    );
  } catch (error) {
    logger.error({ error, data }, 'Failed to create audit log');
  }
}

/**
 * Log workflow operations
 */
export async function auditWorkflowCreate(
  workflowId: string,
  userId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    action: 'CREATE',
    entityType: 'WORKFLOW',
    entityId: workflowId,
    userId,
    metadata,
  });
}

export async function auditWorkflowUpdate(
  workflowId: string,
  userId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    action: 'UPDATE',
    entityType: 'WORKFLOW',
    entityId: workflowId,
    userId,
    metadata,
  });
}

export async function auditWorkflowDelete(
  workflowId: string,
  userId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    action: 'DELETE',
    entityType: 'WORKFLOW',
    entityId: workflowId,
    userId,
    metadata,
  });
}

export async function auditWorkflowExecute(
  workflowId: string,
  userId: string,
  executionId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    action: 'EXECUTE',
    entityType: 'WORKFLOW',
    entityId: workflowId,
    userId,
    executionId,
    metadata,
  });
}

/**
 * Log credential operations
 */
export async function auditCredentialCreate(
  credentialId: string,
  userId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    action: 'CREATE',
    entityType: 'CREDENTIAL',
    entityId: credentialId,
    userId,
    credentialId,
    metadata,
  });
}

export async function auditCredentialUpdate(
  credentialId: string,
  userId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    action: 'UPDATE',
    entityType: 'CREDENTIAL',
    entityId: credentialId,
    userId,
    credentialId,
    metadata,
  });
}

export async function auditCredentialDelete(
  credentialId: string,
  userId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    action: 'DELETE',
    entityType: 'CREDENTIAL',
    entityId: credentialId,
    userId,
    credentialId,
    metadata,
  });
}

export async function auditCredentialView(
  credentialId: string,
  userId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    action: 'VIEW',
    entityType: 'CREDENTIAL',
    entityId: credentialId,
    userId,
    credentialId,
    metadata,
  });
}

/**
 * Log execution creation
 */
export async function auditExecutionCreate(
  executionId: string,
  userId: string,
  workflowId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await createAuditLog({
    action: 'CREATE',
    entityType: 'EXECUTION',
    entityId: executionId,
    userId,
    executionId,
    metadata: { ...metadata, workflowId },
  });
}

/**
 * Query audit logs
 */
export async function getAuditLogs(entityType: EntityType, entityId: string, limit = 50) {
  try {
    return await db.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  } catch (error) {
    logger.error({ error, entityType, entityId }, 'Failed to fetch audit logs');
    return [];
  }
}

export async function getUserAuditLogs(userId: string, limit = 50) {
  try {
    return await db.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  } catch (error) {
    logger.error({ error, userId }, 'Failed to fetch user audit logs');
    return [];
  }
}

export async function getRecentAuditActivity(limit = 100) {
  try {
    return await db.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch recent audit activity');
    return [];
  }
}
