import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import {
  knowledgeItems,
  knowledgeVersions,
  humanApprovals
} from "@/src/db/schema";
import { eq, desc, and, ne } from "drizzle-orm";
import { seedDatabase } from "@/src/db/seed";

export const dynamic = "force-dynamic";

// Authentication check: Admin can pass authorization token or bypass password in headers/query params
function checkAdminAuth(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const authParam = req.nextUrl.searchParams.get("admin_key");
  const expectedSecret = process.env.ADMIN_SECRET || "SECURE_KINGSHADP_BYPASS";
  
  if (authParam === expectedSecret) return true;
  if (authHeader && authHeader.replace("Bearer ", "") === expectedSecret) return true;
  
  return false;
}

// GET: Retrieve knowledge items, versions, and approvals
export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Sovereign boundary violation: unauthorized credential" }, { status: 401 });
  }

  try {
    const tab = req.nextUrl.searchParams.get("tab") || "items";

    if (tab === "approvals") {
      const allApprovals = await db.select().from(humanApprovals).orderBy(desc(humanApprovals.createdAt));
      return NextResponse.json({ approvals: allApprovals });
    }

    if (tab === "versions") {
      const itemId = req.nextUrl.searchParams.get("item_id");
      if (itemId) {
        const versions = await db.select()
          .from(knowledgeVersions)
          .where(eq(knowledgeVersions.knowledgeItemId, parseInt(itemId)))
          .orderBy(desc(knowledgeVersions.version));
        return NextResponse.json({ versions });
      }
      const allVersions = await db.select().from(knowledgeVersions).orderBy(desc(knowledgeVersions.createdAt));
      return NextResponse.json({ versions: allVersions });
    }

    // Default: Retrieve all knowledge items
    const items = await db.select().from(knowledgeItems).orderBy(desc(knowledgeItems.updatedAt));
    return NextResponse.json({ items });
  } catch (error: any) {
    console.error("// Admin GET handler error:", error);
    return NextResponse.json({ error: error.message || "Failed to retrieve administrative context" }, { status: 500 });
  }
}

// POST: Execute administrative actions (update, approve/reject, revert, seed)
export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Sovereign boundary violation: unauthorized credential" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: "Invalid protocol: missing administrative action" }, { status: 400 });
    }

    switch (action) {
      case "trigger_seed": {
        await seedDatabase();
        return NextResponse.json({ success: true, message: "Sovereign vault knowledge items successfully seeded." });
      }

      case "create_or_update": {
        const { id, slug, title, summary, body: itemBody, contentType, category, tags, publicVisibility, itemType, changelog, bypassApproval } = body;

        if (!slug || !title || !itemBody || !contentType) {
          return NextResponse.json({ error: "Missing required properties" }, { status: 400 });
        }

        const isSensitive = 
          itemType === "governing_rule" || 
          category === "pricing" || 
          contentType === "product" || 
          bypassApproval === false;

        // Check if human approval is required
        if (isSensitive && !bypassApproval) {
          const payload = JSON.stringify({
            id, slug, title, summary, body: itemBody, contentType, category, tags, publicVisibility, itemType, changelog
          });

          const approval = await db.insert(humanApprovals).values({
            actionType: id ? "database_change" : "publish",
            targetId: slug,
            description: `${id ? "Update" : "Publish"} ${itemType} item "${title}" (${slug})`,
            payload,
            status: "pending",
            requestedBy: "admin_console"
          }).returning();

          return NextResponse.json({
            success: true,
            requiresApproval: true,
            message: `Sensitive change to governing rule or product data requires human validation. Approval request #${approval[0].id} logged in the secure queue.`,
            approvalId: approval[0].id
          });
        }

        // Direct updates for standard copy/facts or if authorized bypass
        let updatedItem;
        if (id) {
          // Existing item: Update & track version
          const existing = await db.select().from(knowledgeItems).where(eq(knowledgeItems.id, id)).limit(1);
          if (existing.length === 0) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
          }

          const currentVersion = existing[0].version;
          const nextVersion = currentVersion + 1;

          // Write backup version of current state
          await db.insert(knowledgeVersions).values({
            knowledgeItemId: existing[0].id,
            version: currentVersion,
            title: existing[0].title,
            summary: existing[0].summary,
            body: existing[0].body,
            itemType: existing[0].itemType,
            category: existing[0].category,
            tags: existing[0].tags,
            changelog: existing[0].changelog || "Initial baseline snapshot",
            createdBy: "admin_system"
          });

          // Apply update
          const results = await db.update(knowledgeItems)
            .set({
              slug,
              title,
              summary,
              body: itemBody,
              contentType,
              category,
              tags,
              publicVisibility: publicVisibility !== false,
              itemType: itemType || existing[0].itemType,
              version: nextVersion,
              lastVerifiedAt: new Date(),
              updatedAt: new Date(),
              changelog: changelog || `Updated to version ${nextVersion}`,
            })
            .where(eq(knowledgeItems.id, id))
            .returning();
          updatedItem = results[0];
        } else {
          // New item: Insert & set version to 1
          const results = await db.insert(knowledgeItems)
            .values({
              slug,
              title,
              summary,
              body: itemBody,
              contentType,
              category,
              tags,
              publicVisibility: publicVisibility !== false,
              itemType: itemType || "public_fact",
              version: 1,
              lastVerifiedAt: new Date(),
              isApproved: true,
              changelog: changelog || "Initial publication",
            })
            .returning();
          updatedItem = results[0];
        }

        return NextResponse.json({ success: true, item: updatedItem, message: "Knowledge base item successfully updated." });
      }

      case "approve_reject_action": {
        const { approvalId, status: approvalStatus, decidedBy, rejectionReason } = body;

        if (!approvalId || !["approved", "rejected"].includes(approvalStatus)) {
          return NextResponse.json({ error: "Invalid approval inputs" }, { status: 400 });
        }

        const approval = await db.select().from(humanApprovals).where(eq(humanApprovals.id, approvalId)).limit(1);
        if (approval.length === 0) {
          return NextResponse.json({ error: "Approval request not found" }, { status: 404 });
        }

        if (approval[0].status !== "pending") {
          return NextResponse.json({ error: `Approval request is already in status: ${approval[0].status}` }, { status: 400 });
        }

        if (approvalStatus === "rejected") {
          await db.update(humanApprovals)
            .set({
              status: "rejected",
              decidedBy: decidedBy || "admin_human",
              decidedAt: new Date(),
              rejectionReason: rejectionReason || "Rejected by administration"
            })
            .where(eq(humanApprovals.id, approvalId));
          return NextResponse.json({ success: true, message: "Inquiry change rejected and filed." });
        }

        // Apply approved change
        const payload = JSON.parse(approval[0].payload);
        let updatedItem;

        if (payload.id) {
          // Perform update
          const existing = await db.select().from(knowledgeItems).where(eq(knowledgeItems.id, payload.id)).limit(1);
          if (existing.length > 0) {
            const currentVersion = existing[0].version;
            const nextVersion = currentVersion + 1;

            await db.insert(knowledgeVersions).values({
              knowledgeItemId: existing[0].id,
              version: currentVersion,
              title: existing[0].title,
              summary: existing[0].summary,
              body: existing[0].body,
              itemType: existing[0].itemType,
              category: existing[0].category,
              tags: existing[0].tags,
              changelog: existing[0].changelog || "Baseline snapshots before approved update",
              createdBy: "admin_approval_system"
            });

            const results = await db.update(knowledgeItems)
              .set({
                slug: payload.slug,
                title: payload.title,
                summary: payload.summary,
                body: payload.body,
                contentType: payload.contentType,
                category: payload.category,
                tags: payload.tags,
                publicVisibility: payload.publicVisibility !== false,
                itemType: payload.itemType,
                version: nextVersion,
                lastVerifiedAt: new Date(),
                updatedAt: new Date(),
                changelog: payload.changelog || `Approved update to version ${nextVersion}`,
              })
              .where(eq(knowledgeItems.id, payload.id))
              .returning();
            updatedItem = results[0];
          }
        } else {
          // Perform insert
          const results = await db.insert(knowledgeItems)
            .values({
              slug: payload.slug,
              title: payload.title,
              summary: payload.summary,
              body: payload.body,
              contentType: payload.contentType,
              category: payload.category,
              tags: payload.tags,
              publicVisibility: payload.publicVisibility !== false,
              itemType: payload.itemType || "public_fact",
              version: 1,
              lastVerifiedAt: new Date(),
              isApproved: true,
              changelog: payload.changelog || "Approved initial publication",
            })
            .returning();
          updatedItem = results[0];
        }

        // Finalize approval record
        await db.update(humanApprovals)
          .set({
            status: "approved",
            decidedBy: decidedBy || "admin_human",
            decidedAt: new Date(),
          })
          .where(eq(humanApprovals.id, approvalId));

        return NextResponse.json({ success: true, item: updatedItem, message: "Approval complete. Sovereign state changes applied to database." });
      }

      case "revert_version": {
        const { knowledgeItemId, versionId } = body;

        if (!knowledgeItemId || !versionId) {
          return NextResponse.json({ error: "Missing parameters for reversion" }, { status: 400 });
        }

        const versionRecord = await db.select()
          .from(knowledgeVersions)
          .where(and(eq(knowledgeVersions.knowledgeItemId, knowledgeItemId), eq(knowledgeVersions.id, versionId)))
          .limit(1);

        if (versionRecord.length === 0) {
          return NextResponse.json({ error: "Version history snapshot not found" }, { status: 404 });
        }

        const existingItem = await db.select().from(knowledgeItems).where(eq(knowledgeItems.id, knowledgeItemId)).limit(1);
        if (existingItem.length === 0) {
          return NextResponse.json({ error: "Target item no longer exists in database" }, { status: 404 });
        }

        // Archive current state first as a new version
        const nextVersion = existingItem[0].version + 1;
        await db.insert(knowledgeVersions).values({
          knowledgeItemId: existingItem[0].id,
          version: existingItem[0].version,
          title: existingItem[0].title,
          summary: existingItem[0].summary,
          body: existingItem[0].body,
          itemType: existingItem[0].itemType,
          category: existingItem[0].category,
          tags: existingItem[0].tags,
          changelog: existingItem[0].changelog || "Snapshot before reverting to older state",
          createdBy: "admin_revert"
        });

        // Restore older state
        const results = await db.update(knowledgeItems)
          .set({
            title: versionRecord[0].title,
            summary: versionRecord[0].summary,
            body: versionRecord[0].body,
            itemType: versionRecord[0].itemType,
            category: versionRecord[0].category,
            tags: versionRecord[0].tags,
            version: nextVersion,
            lastVerifiedAt: new Date(),
            updatedAt: new Date(),
            changelog: `Reverted to historical version #${versionRecord[0].version}`,
          })
          .where(eq(knowledgeItems.id, knowledgeItemId))
          .returning();

        return NextResponse.json({ success: true, item: results[0], message: `Successfully reverted item back to version #${versionRecord[0].version}` });
      }

      default:
        return NextResponse.json({ error: "Unknown administrative action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("// Admin POST handler error:", error);
    return NextResponse.json({ error: error.message || "Administrative transaction failed" }, { status: 500 });
  }
}
