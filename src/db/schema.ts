import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const entries = pgTable('entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  content: text('content').notNull(),
  date: text('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  entries: many(entries),
}));

export const entriesRelations = relations(entries, ({ one }) => ({
  author: one(users, {
    fields: [entries.userId],
    references: [users.id],
  }),
}));

// AI Concierge tables
export const conciergeSessions = pgTable('concierge_sessions', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull().unique(),
  anonymousIdentifier: text('anonymous_identifier'),
  authenticatedUserId: text('authenticated_user_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  status: text('status').default('active'),
  consentVersion: text('consent_version'),
});

export const conciergeMessages = pgTable('concierge_messages', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').references(() => conciergeSessions.sessionId).notNull(),
  role: text('role').notNull(), // 'user' | 'model'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  model: text('model'),
  tokenUsage: integer('token_usage'),
  safetyStatus: text('safety_status'),
  retainedUntil: timestamp('retained_until'),
});

export const knowledgeItems = pgTable('knowledge_items', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  summary: text('summary'),
  body: text('body').notNull(),
  contentType: text('content_type').notNull(), // 'page' | 'product' | 'service' | 'faq' | 'project'
  category: text('category'),
  tags: text('tags'), // comma separated
  publicVisibility: boolean('public_visibility').default(true).notNull(),
  sourceUrl: text('source_url'),
  updatedAt: timestamp('updated_at').defaultNow(),
  searchText: text('search_text'),
  // Expanded fields for Brand Intelligence governance
  itemType: text('item_type').default('public_fact').notNull(), // 'governing_rule' | 'public_fact' | 'editable_copy' | 'product_data' | 'archive_data' | 'private_internal_note'
  lastVerifiedAt: timestamp('last_verified_at').defaultNow(),
  version: integer('version').default(1).notNull(),
  isApproved: boolean('is_approved').default(true).notNull(),
  changelog: text('changelog'),
});

export const knowledgeVersions = pgTable('knowledge_versions', {
  id: serial('id').primaryKey(),
  knowledgeItemId: integer('knowledge_item_id').references(() => knowledgeItems.id, { onDelete: 'cascade' }).notNull(),
  version: integer('version').notNull(),
  title: text('title').notNull(),
  summary: text('summary'),
  body: text('body').notNull(),
  itemType: text('item_type').notNull(),
  category: text('category'),
  tags: text('tags'),
  changelog: text('changelog'),
  createdAt: timestamp('created_at').defaultNow(),
  createdBy: text('created_by'),
});

export const humanApprovals = pgTable('human_approvals', {
  id: serial('id').primaryKey(),
  actionType: text('action_type').notNull(), // 'publish' | 'delete' | 'update_price' | 'outbound_comm' | 'billing_change' | 'database_change'
  targetId: text('target_id'), // references slug or item ID
  description: text('description').notNull(),
  payload: text('payload').notNull(), // JSON string representing the exact change payload
  status: text('status').default('pending').notNull(), // 'pending' | 'approved' | 'rejected'
  requestedBy: text('requested_by').default('system').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  decidedBy: text('decided_by'),
  decidedAt: timestamp('decided_at'),
  rejectionReason: text('rejection_reason'),
});

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  organization: text('organization'),
  inquiryType: text('inquiry_type'),
  message: text('message').notNull(),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  consentVersion: text('consent_version'),
});

export const conciergeToolAudit = pgTable('concierge_tool_audit', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').references(() => conciergeSessions.sessionId),
  toolName: text('tool_name').notNull(),
  inputSummary: text('input_summary'),
  executionStatus: text('execution_status').notNull(), // 'success' | 'failed'
  durationMs: integer('duration_ms'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const conciergeSessionsRelations = relations(conciergeSessions, ({ many }) => ({
  messages: many(conciergeMessages),
  toolAudits: many(conciergeToolAudit),
}));

export const conciergeMessagesRelations = relations(conciergeMessages, ({ one }) => ({
  session: one(conciergeSessions, {
    fields: [conciergeMessages.sessionId],
    references: [conciergeSessions.sessionId],
  }),
}));

export const conciergeToolAuditRelations = relations(conciergeToolAudit, ({ one }) => ({
  session: one(conciergeSessions, {
    fields: [conciergeToolAudit.sessionId],
    references: [conciergeSessions.sessionId],
  }),
}));
