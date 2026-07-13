"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, LayoutDashboard, Database, RefreshCw, Plus, Edit3, CheckCircle2, 
  XCircle, ArrowLeft, History, Cpu, FileText, Send, HelpCircle, Eye, EyeOff 
} from "lucide-react";

type KnowledgeItem = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  body: string;
  contentType: string;
  category: string;
  tags: string[];
  publicVisibility: boolean;
  itemType: string;
  version: number;
  changelog?: string;
  updatedAt: string;
};

type ApprovalRequest = {
  id: number;
  actionType: string;
  targetId: string;
  description: string;
  payload: string;
  status: "pending" | "approved" | "rejected";
  requestedBy: string;
  createdAt: string;
};

type VersionSnapshot = {
  id: number;
  knowledgeItemId: number;
  version: number;
  title: string;
  summary: string;
  body: string;
  changelog: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loginError, setLoginError] = useState("");

  // DB Data States
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<VersionSnapshot[]>([]);
  const [activeItemVersionsId, setActiveItemVersionsId] = useState<number | null>(null);
  
  // Tab Navigation
  const [activeTab, setActiveTab] = useState<"items" | "approvals" | "inquiries">("items");
  
  // Editor States
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<KnowledgeItem>>({
    slug: "",
    title: "",
    summary: "",
    body: "",
    contentType: "fact",
    category: "general",
    tags: [],
    publicVisibility: true,
    itemType: "public_fact",
    changelog: ""
  });
  const [tagInput, setTagInput] = useState("");

  // Inquiries State
  const [inquiries, setInquiries] = useState<any[]>([]);

  // Status & Log States
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "ADMINCORE DEPLOYED // READY",
    "AWAITING SECURITY CLEARENCE..."
  ]);

  useEffect(() => {
    // Check local storage for pre-existing key
    const savedKey = localStorage.getItem("kingshadp_admin_token");
    if (savedKey) {
      setAdminKey(savedKey);
      testAuthentication(savedKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setSystemLogs(prev => [...prev.slice(-8), `[${time}] ${message}`]);
  };

  const testAuthentication = async (keyToTest: string) => {
    addLog(`INITIALISING ACCESS SECURE handshake...`);
    try {
      const res = await fetch(`/api/admin?admin_key=${encodeURIComponent(keyToTest)}`);
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("kingshadp_admin_token", keyToTest);
        addLog("ACCESS GRANTED: Sovereign terminal unlocked.");
        fetchData(keyToTest);
      } else {
        const errData = await res.json();
        setLoginError(errData.error || "Handshake rejected.");
        setIsAuthenticated(false);
        addLog("HANDSHAKE REJECTED: Security block logged.");
      }
    } catch (err) {
      setLoginError("Could not reach secure administration server node.");
      setIsAuthenticated(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!adminKey) {
      setLoginError("Enter administrator token.");
      return;
    }
    testAuthentication(adminKey);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("kingshadp_admin_token");
    setItems([]);
    setApprovals([]);
    setInquiries([]);
    addLog("OPERATOR SIGN-OUT: Terminal locked successfully.");
  };

  const fetchData = async (key = adminKey) => {
    if (!key) return;
    try {
      addLog("POLLING SECURE DIRECTORY REPOS...");
      // Fetch knowledge items
      const itemsRes = await fetch(`/api/admin?tab=items&admin_key=${encodeURIComponent(key)}`);
      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setItems(itemsData.items || []);
      }

      // Fetch approvals
      const approvalsRes = await fetch(`/api/admin?tab=approvals&admin_key=${encodeURIComponent(key)}`);
      if (approvalsRes.ok) {
        const approvalsData = await approvalsRes.json();
        setApprovals(approvalsData.approvals || []);
      }

      // Fetch inquiries directly from API contact route or fallback to local log tracker
      try {
        const mockLogs = localStorage.getItem("kingshadp_vault_logs");
        if (mockLogs) {
          setInquiries(JSON.parse(mockLogs));
        }
      } catch (err) {
        console.error("Local inquiries read error", err);
      }

      addLog("DIRECTORY SYNCHRONISED: State is nominal.");
    } catch (err: any) {
      addLog(`SYNC RETREAT: ${err.message}`);
    }
  };

  const handleTriggerSeed = async () => {
    if (!confirm("Are you sure you want to seed/reset the database? This loads default approved brand knowledge items.")) return;
    addLog("COMMIT TRIGGER: Initiating global DB seeding protocol...");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "trigger_seed", admin_key: adminKey })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg("Database seeded successfully.");
        setStatusType("success");
        addLog("SYSTEM SEED COMMIT: Complete.");
        fetchData();
      } else {
        setStatusMsg(data.error || "Seeding failed.");
        setStatusType("error");
        addLog("SYSTEM SEED ERROR: Transaction aborted.");
      }
    } catch (err: any) {
      setStatusMsg("Seeding failed: Connection aborted.");
      setStatusType("error");
    }
  };

  const handleSaveItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addLog(`INITIATING CHANGE COMMIT: "${editingItem.title}"`);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_or_update",
          admin_key: adminKey,
          ...editingItem,
          bypassApproval: editingItem.itemType === "public_fact" // true bypass for minor text copy
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg(data.message || "Content updated successfully.");
        setStatusType("success");
        addLog(`CHANGE COMPLETE: ${data.requiresApproval ? "Approval ticket queued." : "State updated directly."}`);
        setIsEditing(false);
        fetchData();
      } else {
        setStatusMsg(data.error || "Save rejected.");
        setStatusType("error");
        addLog("COMMIT ABORTED: Transaction rejected.");
      }
    } catch (err: any) {
      setStatusMsg("Save failed: Node disconnect.");
      setStatusType("error");
    }
  };

  const handleApproveAction = async (id: number, status: "approved" | "rejected") => {
    const reason = status === "rejected" ? prompt("Please enter the reason for rejection:") || "Rejected by administration" : "";
    addLog(`RESOLVING APPROVAL REQUEST #${id} AS ${status.toUpperCase()}...`);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve_reject_action",
          admin_key: adminKey,
          approvalId: id,
          status,
          decidedBy: "owner_console",
          rejectionReason: reason
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        addLog(`APPROVAL COMPLETE: Changes applied successfully.`);
        fetchData();
      } else {
        addLog(`APPROVAL FAILURE: ${data.error || "Unknown response"}`);
      }
    } catch (err) {
      addLog("APPROVAL CONNECTION ERROR: Server unreachable.");
    }
  };

  const viewVersions = async (itemId: number) => {
    addLog(`RETRIEVING VERSIONS for Item ID #${itemId}...`);
    try {
      const res = await fetch(`/api/admin?tab=versions&item_id=${itemId}&admin_key=${encodeURIComponent(adminKey)}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedVersions(data.versions || []);
        setActiveItemVersionsId(itemId);
        addLog(`VERSIONS SYNCHED: Found ${data.versions?.length || 0} snapshots.`);
      }
    } catch (err) {
      addLog("VERSION RETRIEVAL FAILED.");
    }
  };

  const handleRevertVersion = async (itemId: number, versionId: number, verNumber: number) => {
    if (!confirm(`Are you sure you want to revert item to historical version #${verNumber}?`)) return;
    addLog(`REVERTING ITEM ID #${itemId} to snapshot version #${verNumber}...`);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "revert_version",
          admin_key: adminKey,
          knowledgeItemId: itemId,
          versionId
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        addLog(`REVERSION SUCCESSFUL: State restored.`);
        setActiveItemVersionsId(null);
        setSelectedVersions([]);
        fetchData();
      } else {
        addLog(`REVERSION FAILURE: ${data.error}`);
      }
    } catch (err) {
      addLog("REVERSION CONNECTION TERMINATED.");
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      const currentTags = editingItem.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        setEditingItem({ ...editingItem, tags: [...currentTags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditingItem({
      ...editingItem,
      tags: (editingItem.tags || []).filter(t => t !== tagToRemove)
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090908] flex items-center justify-center p-6 text-[#f4ecd8] font-sans selection:bg-[#93000a]">
        <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-10 pointer-events-none" />
        <div className="w-full max-w-md bg-[#0c0a09]/80 border border-[#dcc57b]/20 p-8 rounded-2xl shadow-[0_15px_50px_rgba(147,0,10,0.15)] backdrop-blur-md relative overflow-hidden flex flex-col gap-6 text-left">
          
          <div className="flex flex-col items-center gap-3 border-b border-[#dcc57b]/25 pb-6">
            <Lock className="w-12 h-12 text-[#93000a] drop-shadow-[0_0_10px_rgba(147,0,10,0.5)] animate-pulse" />
            <span className="font-mono text-[8px] text-[#93000a] tracking-[0.4em] uppercase font-bold">{"// SYSTEM SECURE PERIPHERY"}</span>
            <h1 className="font-serif text-3xl font-light italic mt-1 text-white">Sovereign Portal Access</h1>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            {loginError && (
              <div className="bg-red-950/25 border border-red-900/45 text-red-500 font-mono text-[10px] p-3.5 rounded-lg uppercase tracking-wider">
                COGNITIVE LOCK: {loginError}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Administrator Key Token:</label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="ENTER ACCESS CRACK CODE"
                  className="w-full bg-black/70 border border-[#dcc57b]/20 px-4 py-3.5 rounded-lg font-mono text-xs uppercase tracking-widest text-white outline-none focus:border-[#dcc57b] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-3.5 text-white/40 hover:text-white"
                  aria-label={showKey ? "Hide credentials" : "Show credentials"}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 bg-[#dcc57b] hover:bg-[#ebd58b] text-[#090908] font-mono text-[10px] tracking-widest uppercase py-3.5 rounded-lg font-bold transition-all hover:scale-[1.02]"
            >
              Request Handshake Token
            </button>
          </form>

          <div className="border-t border-white/5 pt-4 mt-2 font-mono text-[8px] text-white/30 flex flex-col gap-1">
            <span>&gt; AUTH ENFORCEMENT: CRYPTO SHARES ENCRYPTED</span>
            <span>&gt; BYPASS DEFAULTS: SECURE_KINGSHADP_BYPASS</span>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090908] text-[#f4ecd8] font-sans p-6 md:p-12 selection:bg-[#93000a]">
      <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10 text-left">
        
        {/* Header */}
        <div className="border-b border-[#dcc57b]/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-3">
            <div className="font-mono text-[10px] text-[#93000a] uppercase tracking-widest flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>KINGSHADP ADMINISTRATIVE CORE CMS</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-light">
              Admin Control Room.
            </h1>
            <p className="font-sans text-xs text-white/60 font-light mt-1">
              Authorized operators can update website content, review secure ledger files, approve rules revisions, or roll back snapshots.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleTriggerSeed}
              className="bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-[9px] uppercase tracking-widest px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#dcc57b]" /> Seed DB Nodes
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#93000a]/10 hover:bg-[#93000a]/25 border border-[#93000a]/40 font-mono text-[9px] uppercase tracking-widest text-[#ef4444] px-4 py-2.5 rounded-lg transition-colors"
            >
              Lock Terminal
            </button>
          </div>
        </div>

        {/* Global Alert Notification */}
        {statusMsg && (
          <div className={`p-4 rounded-xl border flex justify-between items-center ${
            statusType === "success" 
              ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-400" 
              : "bg-red-950/20 border-red-900/40 text-red-400"
          }`}>
            <span className="font-mono text-[10px] uppercase tracking-wider">{statusMsg}</span>
            <button onClick={() => setStatusMsg("")} className="font-mono text-[9px] font-bold hover:text-white uppercase">[ DISMISS ]</button>
          </div>
        )}

        {/* Workspace Panels */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Dashboard Panel */}
          <div className="flex-1 flex flex-col gap-8">
            
            {/* Tabs Selector */}
            <div className="flex gap-2 border-b border-[#dcc57b]/10 pb-1">
              {[
                { id: "items", label: "Knowledge Directory", count: items.length },
                { id: "approvals", label: "Pending Approvals", count: approvals.filter(a => a.status === "pending").length },
                { id: "inquiries", label: "Inquiries Logs", count: inquiries.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsEditing(false);
                    setActiveItemVersionsId(null);
                  }}
                  className={`font-mono text-[10px] uppercase tracking-widest px-5 py-3 border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-[#dcc57b] text-[#dcc57b] font-bold"
                      : "border-transparent text-white/50 hover:text-white"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* TAB CONTENT: ITEMS DIRECTORY */}
            {activeTab === "items" && !isEditing && (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-2xl text-white font-light italic">CMS Repositories</h3>
                  <button
                    onClick={() => {
                      setEditingItem({
                        slug: "",
                        title: "",
                        summary: "",
                        body: "",
                        contentType: "fact",
                        category: "general",
                        tags: [],
                        publicVisibility: true,
                        itemType: "public_fact",
                        changelog: "Created via administration console"
                      });
                      setIsEditing(true);
                      setActiveItemVersionsId(null);
                    }}
                    className="bg-[#dcc57b] hover:bg-[#ebd58b] text-[#090908] font-mono text-[9px] uppercase tracking-widest px-4 py-2.5 rounded-lg font-bold flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Publish New Item
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-[#0c0a09]/50 border border-white/10 hover:border-[#dcc57b]/30 p-6 rounded-xl flex flex-col gap-4 text-left transition-colors relative"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[8px] text-[#93000a] bg-[#93000a]/10 border border-[#93000a]/20 px-2 py-0.5 rounded uppercase font-bold">
                          {item.itemType}
                        </span>
                        <span className="font-mono text-[8px] text-[#dcc57b] uppercase">v{item.version}</span>
                      </div>

                      <div className="flex flex-col">
                        <h4 className="font-serif text-xl text-white font-normal truncate">{item.title}</h4>
                        <span className="font-mono text-[9px] text-[#dcc57b] mt-0.5 font-semibold">SLUG: /{item.slug}</span>
                      </div>

                      <p className="font-sans text-xs text-white/55 font-light leading-relaxed min-h-[40px] line-clamp-2">
                        {item.summary || "No summary provided."}
                      </p>

                      <div className="bg-black/20 p-3 rounded font-mono text-[9.5px] text-white/40 max-h-24 overflow-y-auto leading-normal">
                        {item.body}
                      </div>

                      <div className="flex gap-2 mt-2 border-t border-white/5 pt-4">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsEditing(true);
                            setActiveItemVersionsId(null);
                          }}
                          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-[9px] uppercase tracking-widest py-2 rounded transition-colors flex items-center justify-center gap-1 text-white"
                        >
                          <Edit3 className="w-3 h-3 text-[#dcc57b]" /> Edit
                        </button>
                        <button
                          onClick={() => viewVersions(item.id)}
                          className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-[9px] uppercase tracking-widest py-2 rounded transition-colors flex items-center justify-center gap-1 text-white"
                        >
                          <History className="w-3 h-3 text-[#dcc57b]" /> Snapshots
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: EDIT/CREATE FORM */}
            {activeTab === "items" && isEditing && (
              <form onSubmit={handleSaveItemSubmit} className="bg-[#0c0a09]/50 border border-[#dcc57b]/20 p-6 md:p-8 rounded-xl flex flex-col gap-5 text-left animate-fade-in">
                <div className="flex justify-between items-center border-b border-[#dcc57b]/10 pb-4 mb-2">
                  <h3 className="font-serif text-2xl text-white italic font-light">
                    {editingItem.id ? "Edit System Item" : "Publish System Item"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-white/40 hover:text-white font-mono text-[9px] uppercase tracking-widest flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Entry Identifier (Slug):</label>
                    <input
                      type="text"
                      required
                      value={editingItem.slug || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                      className="bg-black/80 border border-white/15 px-3.5 py-3 rounded-lg font-mono text-xs text-white outline-none focus:border-[#dcc57b] uppercase"
                      placeholder="e.g. CORE_IDENTITY"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Entry Title (Display):</label>
                    <input
                      type="text"
                      required
                      value={editingItem.title || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="bg-black/80 border border-white/15 px-3.5 py-3 rounded-lg font-sans text-xs text-white outline-none focus:border-[#dcc57b]"
                      placeholder="e.g. Master Studio Identity"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Summary / Preview (One Sentence):</label>
                  <input
                    type="text"
                    required
                    value={editingItem.summary || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, summary: e.target.value })}
                    className="bg-black/80 border border-white/15 px-3.5 py-3 rounded-lg font-sans text-xs text-white outline-none focus:border-[#dcc57b]"
                    placeholder="Slight summary overview describing the content state"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Content Body (Aesthetic/Factual Text):</label>
                  <textarea
                    required
                    rows={8}
                    value={editingItem.body || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, body: e.target.value })}
                    className="bg-black/80 border border-white/15 px-3.5 py-3 rounded-lg font-sans text-xs text-white leading-relaxed font-light outline-none focus:border-[#dcc57b]"
                    placeholder="Provide full copy factual ground definitions..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">System classification:</label>
                    <select
                      value={editingItem.itemType || "public_fact"}
                      onChange={(e) => setEditingItem({ ...editingItem, itemType: e.target.value })}
                      className="bg-black/80 border border-white/15 px-3.5 py-3 rounded-lg font-mono text-xs text-white cursor-pointer"
                    >
                      <option value="public_fact">PUBLIC FACT (Instant Update)</option>
                      <option value="governing_rule">GOVERNING BRAND RULE (Requires Approval Ticket)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Content category:</label>
                    <select
                      value={editingItem.category || "general"}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="bg-black/80 border border-white/15 px-3.5 py-3 rounded-lg font-mono text-xs text-white cursor-pointer"
                    >
                      <option value="general">GENERAL BRAND INFORMATION</option>
                      <option value="products">PRODUCT SPECS & MATTE TEXTILES</option>
                      <option value="rules">IDENTITY AND TONE INSTRUCTIONS</option>
                      <option value="pricing">PRICING STRUCTURE</option>
                      <option value="music">MUSIC ARCHIVE TRACKS</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Tags Directory:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      className="flex-1 bg-black/80 border border-white/15 px-3.5 py-3 rounded-lg font-mono text-xs text-white outline-none focus:border-[#dcc57b] uppercase"
                      placeholder="e.g. MIAMI, SLATE, PORTUGUESE"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-[#dcc57b] hover:bg-[#ebd58b] text-[#090908] font-mono text-[10px] tracking-widest uppercase px-5 rounded-lg font-bold"
                    >
                      Add Tag
                    </button>
                  </div>
                  {editingItem.tags && editingItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editingItem.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="bg-white/5 border border-white/10 px-3 py-1 rounded-full font-mono text-[9px] text-white uppercase flex items-center gap-1.5"
                        >
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="text-[#ef4444] hover:text-white font-bold text-[10px]">&times;</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Commit Changelog Message:</label>
                  <input
                    type="text"
                    required
                    value={editingItem.changelog || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, changelog: e.target.value })}
                    className="bg-black/80 border border-[#93000a]/30 px-3.5 py-3 rounded-lg font-mono text-xs text-white outline-none focus:border-[#93000a]"
                    placeholder="e.g. Sizing adjustments, tone corrections..."
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 bg-[#dcc57b] hover:bg-[#ebd58b] text-[#090908] font-mono text-[10px] tracking-widest uppercase py-4 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  Transmit Change Request <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* TAB CONTENT: PENDING APPROVALS QUEUE */}
            {activeTab === "approvals" && (
              <div className="flex flex-col gap-6 text-left animate-fade-in">
                <h3 className="font-serif text-2xl text-white font-light italic">Pending Human Verification Ticket System</h3>
                
                {approvals.length === 0 ? (
                  <div className="bg-[#0c0a09]/50 border border-white/5 py-12 rounded-xl text-center flex flex-col items-center gap-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">All State changes approved. Security nominal.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {approvals.map((req) => {
                      const payload = JSON.parse(req.payload);
                      return (
                        <div 
                          key={req.id}
                          className="bg-[#0c0a09]/50 border border-[#93000a]/20 p-6 rounded-xl flex flex-col gap-4"
                        >
                          <div className="flex justify-between items-start border-b border-white/5 pb-3">
                            <div className="flex flex-col">
                              <span className="font-mono text-[8px] text-[#93000a] uppercase font-bold tracking-wider">TICKET ID #{req.id}</span>
                              <h4 className="font-serif text-xl text-white mt-1 italic font-light">{req.description}</h4>
                            </div>
                            <span className={`font-mono text-[8.5px] uppercase px-3 py-1 border rounded-sm font-semibold ${
                              req.status === "pending" 
                                ? "border-amber-500/30 bg-amber-500/5 text-amber-500 animate-pulse" 
                                : req.status === "approved"
                                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-500"
                                : "border-[#93000a]/30 bg-[#93000a]/5 text-[#ef4444]"
                            }`}>
                              {req.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                            <div className="flex flex-col gap-1 bg-black/30 p-4 rounded border border-white/5">
                              <span className="font-mono text-[8.5px] text-white/40 uppercase">PROPOSED CHANGES BODY:</span>
                              <p className="text-white mt-2 leading-relaxed font-light">{payload.body}</p>
                            </div>
                            <div className="flex flex-col gap-3 justify-between">
                              <div className="flex flex-col gap-1">
                                <span className="font-mono text-[8.5px] text-white/40 uppercase">COMMIT INFORMATION:</span>
                                <span className="text-white font-medium mt-1">SLUG: /{payload.slug}</span>
                                <span className="text-white/60">CATEGORY: {payload.category}</span>
                                <span className="text-white/60">CHANGELOG: {payload.changelog || "none"}</span>
                              </div>
                              
                              {req.status === "pending" && (
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => handleApproveAction(req.id, "approved")}
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-mono text-[10px] uppercase py-2.5 rounded font-bold transition-all flex items-center justify-center gap-1"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                  </button>
                                  <button
                                    onClick={() => handleApproveAction(req.id, "rejected")}
                                    className="flex-1 bg-[#93000a] hover:bg-[#b0000a] text-white font-mono text-[10px] uppercase py-2.5 rounded font-bold transition-all flex items-center justify-center gap-1"
                                  >
                                    <XCircle className="w-3.5 h-3.5" /> Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: INQUIRIES LOGS FEED */}
            {activeTab === "inquiries" && (
              <div className="flex flex-col gap-6 text-left animate-fade-in">
                <h3 className="font-serif text-2xl text-white font-light italic">Unified Client Inquiry Ledger Files</h3>

                {inquiries.length === 0 ? (
                  <div className="bg-[#0c0a09]/50 border border-white/5 py-12 rounded-xl text-center flex flex-col items-center gap-3">
                    <CheckCircle2 className="w-10 h-10 text-[#dcc57b]" />
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">No transaction inquiries registered. Standby...</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {inquiries.map((inq, index) => (
                      <div 
                        key={inq.id || index}
                        className="bg-[#0c0a09]/50 border border-white/10 hover:border-[#dcc57b]/30 p-6 rounded-xl flex flex-col gap-3 transition-colors text-left"
                      >
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="font-mono text-[8.5px] text-[#93000a] uppercase font-bold tracking-wider">{inq.sector || "GENERAL INQUIRY"}</span>
                          <span className="font-mono text-[8.5px] text-white/35">{inq.timestamp}</span>
                        </div>
                        
                        <div className="flex flex-col">
                          <h4 className="font-serif text-xl text-white font-normal">{inq.title || "Inquiry Submission"}</h4>
                          <span className="font-mono text-[9px] text-[#dcc57b] mt-0.5">CHECKSUM: {inq.checksum || "UNIFIED"}</span>
                        </div>

                        <div className="bg-black/30 p-4 rounded font-sans text-xs text-white/80 leading-relaxed font-light border border-white/5">
                          {inq.details || inq.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Sidebar System Telemetry Logs Panel */}
          <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 text-left">
            
            {/* Version Snaps Drawer */}
            {activeItemVersionsId !== null && (
              <div className="bg-[#0c0a09]/60 backdrop-blur-md border border-[#dcc57b]/30 p-5 rounded-xl flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="font-mono text-[9px] text-[#dcc57b] font-bold uppercase tracking-wider">VERSION SNAPSHOTS</span>
                  <button 
                    onClick={() => {
                      setActiveItemVersionsId(null);
                      setSelectedVersions([]);
                    }}
                    className="font-mono text-[10px] text-white/40 hover:text-white"
                  >
                    &times; CLOSE
                  </button>
                </div>
                {selectedVersions.length === 0 ? (
                  <span className="font-mono text-[9px] text-white/35 uppercase">No past revisions registered.</span>
                ) : (
                  <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
                    {selectedVersions.map((ver) => (
                      <div 
                        key={ver.id}
                        className="bg-black/40 border border-white/5 p-3 rounded flex flex-col gap-2 hover:border-[#dcc57b]/40 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[9px] text-[#dcc57b] font-semibold">VERSION #{ver.version}</span>
                          <button
                            onClick={() => handleRevertVersion(ver.knowledgeItemId, ver.id, ver.version)}
                            className="font-mono text-[8px] bg-[#93000a]/20 border border-[#93000a]/40 text-[#ef4444] px-2 py-0.5 rounded uppercase font-bold hover:bg-[#93000a]/50 transition-colors"
                          >
                            Rollback
                          </button>
                        </div>
                        <span className="font-serif text-sm text-white italic">{ver.title}</span>
                        <p className="font-sans text-[11px] text-white/50 leading-normal font-light line-clamp-2 bg-black/10 p-2 rounded">{ver.body}</p>
                        <span className="font-mono text-[7px] text-white/35 uppercase">{ver.changelog || "No message logged"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Static Telemetry Feed */}
            <div className="bg-[#0c0a09]/60 backdrop-blur-md border border-[#dcc57b]/20 p-5 rounded-xl flex flex-col gap-4">
              <span className="font-mono text-[9px] text-[#93000a] font-bold uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> Core Terminal Logs
              </span>
              <div className="flex flex-col gap-2 font-mono text-[9px] text-white/60 select-none leading-relaxed">
                {systemLogs.map((log, idx) => (
                  <div key={idx} className="truncate">
                    <span className="text-[#93000a] mr-1.5">&gt;</span> {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Sovereign Rule Info */}
            <div className="bg-gradient-to-br from-[#140608]/40 to-black/80 border border-[#93000a]/20 p-5 rounded-xl flex flex-col gap-3">
              <span className="font-mono text-[8px] text-[#93000a] uppercase font-bold tracking-[0.2em]">{"// SECURE POLICY GUARD"}</span>
              <h4 className="font-serif text-lg text-white font-light italic">Sovereign Rules Policy</h4>
              <p className="font-sans text-xs text-white/60 leading-relaxed font-light">
                Updates regarding master policies, pricing structure boundaries, and security rules cannot bypass approval steps. Changes queue up for explicit human operator verification before altering system behavior.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
