import { db } from './index';
import {
  knowledgeItems,
  conciergeSessions,
  conciergeMessages,
  inquiries,
  conciergeToolAudit
} from './schema';
import { eq, ilike, or, and, desc, sql, ne } from 'drizzle-orm';

export const contentRepository = {
  async getBySlug(slug: string) {
    const results = await db.select()
      .from(knowledgeItems)
      .where(and(
        eq(knowledgeItems.slug, slug),
        eq(knowledgeItems.publicVisibility, true),
        eq(knowledgeItems.isApproved, true),
        ne(knowledgeItems.itemType, 'private_internal_note')
      ))
      .limit(1);
    return results[0] || null;
  },

  async search(queryText: string, limit: number = 5) {
    if (!queryText || queryText.trim() === '') {
      return [];
    }
    const cleanQuery = queryText.trim().replace(/[^a-zA-Z0-9\s]/g, '');
    if (cleanQuery === '') return [];

    try {
      // Try PostgreSQL Full Text Search first for keyword retrieval
      const results = await db.select()
        .from(knowledgeItems)
        .where(and(
          sql`to_tsvector('english', ${knowledgeItems.searchText}) @@ plainto_tsquery('english', ${cleanQuery})`,
          eq(knowledgeItems.publicVisibility, true),
          eq(knowledgeItems.isApproved, true),
          ne(knowledgeItems.itemType, 'private_internal_note')
        ))
        .limit(limit);

      if (results.length > 0) return results;
    } catch (err) {
      console.warn('// Full-text search failed or pgvector-like extensions missing, falling back to ILIKE matching:', err);
    }

    // Fallback to simple ILIKE keyword matching
    const terms = cleanQuery.split(/\s+/).filter(Boolean);
    const conditions = terms.map(term => or(
      ilike(knowledgeItems.title, `%${term}%`),
      ilike(knowledgeItems.body, `%${term}%`),
      ilike(knowledgeItems.searchText, `%${term}%`)
    )).filter(Boolean);

    if (conditions.length === 0) {
      return [];
    }

    return db.select()
      .from(knowledgeItems)
      .where(and(
        or(...conditions),
        eq(knowledgeItems.publicVisibility, true),
        eq(knowledgeItems.isApproved, true),
        ne(knowledgeItems.itemType, 'private_internal_note')
      ))
      .limit(limit);
  },

  async listCategories() {
    const results = await db.selectDistinct({ category: knowledgeItems.category })
      .from(knowledgeItems)
      .where(and(
        eq(knowledgeItems.publicVisibility, true),
        eq(knowledgeItems.isApproved, true),
        ne(knowledgeItems.itemType, 'private_internal_note')
      ));
    return results.map(r => r.category).filter(Boolean);
  }
};

export const productRepository = {
  async search(query: string, limit: number = 5) {
    const results = await db.select()
      .from(knowledgeItems)
      .where(and(
        eq(knowledgeItems.contentType, 'product'),
        eq(knowledgeItems.publicVisibility, true),
        eq(knowledgeItems.isApproved, true),
        ne(knowledgeItems.itemType, 'private_internal_note'),
        or(
          ilike(knowledgeItems.title, `%${query}%`),
          ilike(knowledgeItems.body, `%${query}%`)
        )
      ))
      .limit(limit);
    return results;
  },

  async listAll(limit: number = 10) {
    return db.select()
      .from(knowledgeItems)
      .where(and(
        eq(knowledgeItems.contentType, 'product'),
        eq(knowledgeItems.publicVisibility, true),
        eq(knowledgeItems.isApproved, true),
        ne(knowledgeItems.itemType, 'private_internal_note')
      ))
      .limit(limit);
  },

  async getBySlug(slug: string) {
    const results = await db.select()
      .from(knowledgeItems)
      .where(and(
        eq(knowledgeItems.slug, slug),
        eq(knowledgeItems.contentType, 'product'),
        eq(knowledgeItems.publicVisibility, true),
        eq(knowledgeItems.isApproved, true),
        ne(knowledgeItems.itemType, 'private_internal_note')
      ))
      .limit(1);
    return results[0] || null;
  }
};

export const faqRepository = {
  async listAll(limit: number = 10) {
    return db.select()
      .from(knowledgeItems)
      .where(and(
        eq(knowledgeItems.contentType, 'faq'),
        eq(knowledgeItems.publicVisibility, true)
      ))
      .limit(limit);
  }
};

export const projectRepository = {
  async listAll(limit: number = 10) {
    return db.select()
      .from(knowledgeItems)
      .where(and(
        eq(knowledgeItems.contentType, 'project'),
        eq(knowledgeItems.publicVisibility, true)
      ))
      .limit(limit);
  }
};

export const conciergeRepository = {
  async getOrCreateSession(sessionId: string, anonymousIdentifier?: string) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours expiry
    
    const existing = await db.select()
      .from(conciergeSessions)
      .where(eq(conciergeSessions.sessionId, sessionId))
      .limit(1);

    if (existing.length > 0) {
      await db.update(conciergeSessions)
        .set({ updatedAt: now })
        .where(eq(conciergeSessions.sessionId, sessionId));
      return existing[0];
    }

    const result = await db.insert(conciergeSessions)
      .values({
        sessionId,
        anonymousIdentifier: anonymousIdentifier || 'anonymous',
        expiresAt,
        status: 'active'
      })
      .returning();

    return result[0];
  },

  async addMessage(params: {
    sessionId: string;
    role: string;
    content: string;
    model?: string;
    tokenUsage?: number;
    safetyStatus?: string;
  }) {
    const now = new Date();
    const retainedUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days retention

    return db.insert(conciergeMessages)
      .values({
        sessionId: params.sessionId,
        role: params.role,
        content: params.content,
        model: params.model,
        tokenUsage: params.tokenUsage,
        safetyStatus: params.safetyStatus,
        retainedUntil,
      })
      .returning();
  },

  async getMessages(sessionId: string, limit: number = 30) {
    return db.select()
      .from(conciergeMessages)
      .where(eq(conciergeMessages.sessionId, sessionId))
      .orderBy(desc(conciergeMessages.createdAt))
      .limit(limit);
  },

  async clearSessionMessages(sessionId: string) {
    return db.delete(conciergeMessages)
      .where(eq(conciergeMessages.sessionId, sessionId));
  },

  async auditToolCall(params: {
    sessionId: string;
    toolName: string;
    inputSummary: string;
    executionStatus: string;
    durationMs: number;
  }) {
    return db.insert(conciergeToolAudit)
      .values({
        sessionId: params.sessionId,
        toolName: params.toolName,
        inputSummary: params.inputSummary,
        executionStatus: params.executionStatus,
        durationMs: params.durationMs,
      });
  }
};

export const inquiryRepository = {
  async create(params: {
    name: string;
    email: string;
    organization?: string;
    inquiryType?: string;
    message: string;
    consentVersion?: string;
  }) {
    const results = await db.insert(inquiries)
      .values({
        name: params.name,
        email: params.email,
        organization: params.organization,
        inquiryType: params.inquiryType || 'general',
        message: params.message,
        consentVersion: params.consentVersion || 'v1',
        status: 'pending',
      })
      .returning();
    return results[0];
  }
};
