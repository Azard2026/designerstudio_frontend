"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KelebekLogo from "../components/KelebekLogo";
import { API_BASE } from "../lib/api";

// --- Types ---
interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role_id: number;
  is_active: boolean;
}

interface DashboardStats {
  total_leads: number;
  new_leads: number;
  conversion_rate: number;
  total_revenue: number;
  active_projects: number;
  leads_by_status: Record<string, number>;
  leads_by_source: Record<string, number>;
  revenue_by_month: Array<{ month: string; revenue: number }>;
  team_performance: Array<{ designer: string; assigned_projects: number; completed_projects: number }>;
}

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  source_id?: number;
  budget: string;
  requirement: string;
  status: string;
  ai_score: number;
  ai_classification: string;
  ai_insights: string;
  created_at?: string;
}

interface FollowupItem {
  id: number;
  lead_id: number;
  lead_name: string;
  lead_email: string;
  lead_phone: string;
  followup_date: string;
  followup_type: string;
  notes: string;
  is_completed: boolean;
}

interface FollowupDashboard {
  todays: FollowupItem[];
  missed: FollowupItem[];
  upcoming: FollowupItem[];
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  budget: number;
  client_id?: number;
  designer_id?: number;
  created_at?: string;
}

interface PortfolioItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  before_image_url?: string;
  after_image_url?: string;
  youtube_url?: string;
  budget_range?: string;
  client_review?: string;
}

interface Blog {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags?: string;
  seo_title?: string;
  seo_description?: string;
  status: string;
  created_at?: string;
}

export default function AdminPage() {
  // Auth state
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loginEmail, setLoginEmail] = useState("admin@kelebekdesigners.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Navigation
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "leads" | "followups" | "projects" | "portfolio" | "blogs" | "settings" | "ai_toolkit"
  >("dashboard");

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("All");
  const [followups, setFollowups] = useState<FollowupDashboard>({ todays: [], missed: [], upcoming: [] });
  const [followupSubTab, setFollowupSubTab] = useState<"todays" | "missed" | "upcoming">("todays");
  const [projects, setProjects] = useState<Project[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Modals & Forms
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", budget: "₹18 Lakhs – ₹35 Lakhs", requirement: "" });
  const [showAddFollowupModal, setShowAddFollowupModal] = useState<Lead | null>(null);
  const [newFollowup, setNewFollowup] = useState({ followup_date: "", followup_type: "Call", notes: "" });
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "", budget: 1500000, status: "Initial Consultation" });
  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", category: "Residential", tags: "Luxury, Interior", summary: "", content: "", status: "Published", run_ai_writer: true });
  const [showAddPortfolioModal, setShowAddPortfolioModal] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({ title: "", category: "Residential", description: "", before_image_url: "", after_image_url: "", budget_range: "₹18 Lakhs – ₹35 Lakhs", client_review: "" });

  // AI Copilot state
  const [aiMessages, setAiMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "Hello Eleanor! How can I help optimize your CRM pipeline or generate marketing content today?" },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [seoTitleInput, setSeoTitleInput] = useState("");
  const [seoContentInput, setSeoContentInput] = useState("");
  const [seoResults, setSeoResults] = useState<any>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Check saved token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("luxe_admin_token");
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    }
  }, []);

  // Fetch current user details
  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        fetchAllData(authToken);
      } else {
        localStorage.removeItem("luxe_admin_token");
        setToken(null);
      }
    } catch {
      localStorage.removeItem("luxe_admin_token");
      setToken(null);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login-json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Authentication failed");
      
      setToken(data.access_token);
      localStorage.setItem("luxe_admin_token", data.access_token);
      fetchCurrentUser(data.access_token);
      showToast("Logged in successfully as Admin");
    } catch (err: any) {
      setAuthError(err.message || "Invalid email or password");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("luxe_admin_token");
    setToken(null);
    setUser(null);
    showToast("Logged out");
  };

  // Data fetching functions
  const fetchAllData = (authToken: string) => {
    fetchStats(authToken);
    fetchLeads(authToken);
    fetchFollowups(authToken);
    fetchProjects(authToken);
    fetchPortfolio();
    fetchBlogs();
    fetchSettings();
  };

  const fetchStats = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/analytics/dashboard-stats`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) setStats(await res.json());
    } catch {}
  };

  const fetchLeads = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) setLeads(await res.json());
    } catch {}
  };

  const fetchFollowups = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/followups/dashboard`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) setFollowups(await res.json());
    } catch {}
  };

  const fetchProjects = async (authToken: string) => {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) setProjects(await res.json());
    } catch {}
  };

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`${API_BASE}/portfolio`);
      if (res.ok) setPortfolio(await res.json());
    } catch {}
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/blogs`);
      if (res.ok) setBlogs(await res.json());
    } catch {}
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) setSiteSettings(await res.json());
    } catch {}
  };

  // Lead status update
  const handleUpdateLeadStatus = async (leadId: number, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Lead #${leadId} status updated to ${newStatus}`);
        fetchLeads(token);
        fetchStats(token);
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId: number) => {
    if (!token || !confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`${API_BASE}/leads/${leadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("Lead deleted successfully");
        fetchLeads(token);
        fetchStats(token);
      }
    } catch {
      showToast("Could not delete lead", "error");
    }
  };

  // Add Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newLead, status: "New" }),
      });
      if (res.ok) {
        showToast("New lead created and scored with AI!");
        setShowAddLeadModal(false);
        setNewLead({ name: "", email: "", phone: "", budget: "$25,000 - $50,000", requirement: "" });
        if (token) { fetchLeads(token); fetchStats(token); }
      }
    } catch {
      showToast("Error creating lead", "error");
    }
  };

  // Complete Followup
  const handleCompleteFollowup = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/followups/${id}/complete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("Followup marked as completed!");
        fetchFollowups(token);
      }
    } catch {
      showToast("Failed to complete followup", "error");
    }
  };

  // Schedule Followup
  const handleCreateFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !showAddFollowupModal) return;
    try {
      const res = await fetch(`${API_BASE}/followups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lead_id: showAddFollowupModal.id,
          followup_date: newFollowup.followup_date || new Date().toISOString(),
          followup_type: newFollowup.followup_type,
          notes: newFollowup.notes,
          is_completed: false,
        }),
      });
      if (res.ok) {
        showToast("Followup scheduled successfully!");
        setShowAddFollowupModal(null);
        setNewFollowup({ followup_date: "", followup_type: "Call", notes: "" });
        fetchFollowups(token);
      }
    } catch {
      showToast("Error scheduling followup", "error");
    }
  };

  // Create Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProject),
      });
      if (res.ok) {
        showToast("Project created successfully!");
        setShowAddProjectModal(false);
        setNewProject({ name: "", description: "", budget: 50000, status: "Initial Consultation" });
        fetchProjects(token);
        fetchStats(token);
      }
    } catch {
      showToast("Error creating project", "error");
    }
  };

  // Create Portfolio Item
  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/portfolio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPortfolio),
      });
      if (res.ok) {
        showToast("Portfolio item created!");
        setShowAddPortfolioModal(false);
        setNewPortfolio({ title: "", category: "Residential", description: "", before_image_url: "", after_image_url: "", budget_range: "$50,000 - $100,000", client_review: "" });
        fetchPortfolio();
      }
    } catch {
      showToast("Error creating portfolio item", "error");
    }
  };

  // Delete Portfolio Item
  const handleDeletePortfolio = async (id: number) => {
    if (!token || !confirm("Delete this portfolio showcase item?")) return;
    try {
      const res = await fetch(`${API_BASE}/portfolio/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("Portfolio item deleted");
        fetchPortfolio();
      }
    } catch {
      showToast("Error deleting item", "error");
    }
  };

  // Create Blog Article
  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const url = `${API_BASE}/blogs?run_ai_writer=${newBlog.run_ai_writer ? "true" : "false"}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newBlog.title,
          category: newBlog.category,
          tags: newBlog.tags,
          summary: newBlog.summary,
          content: newBlog.content,
          status: newBlog.status,
        }),
      });
      if (res.ok) {
        showToast(newBlog.run_ai_writer ? "Blog written & published via AI Auto-Writer!" : "Blog published!");
        setShowAddBlogModal(false);
        setNewBlog({ title: "", category: "Residential", tags: "Luxury, Interior", summary: "", content: "", status: "Published", run_ai_writer: true });
        fetchBlogs();
      }
    } catch {
      showToast("Error publishing blog", "error");
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSettingsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/settings/bulk`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings: siteSettings }),
      });
      if (res.ok) {
        showToast("Site settings updated successfully!");
        fetchSettings();
      }
    } catch {
      showToast("Error saving settings", "error");
    } finally {
      setSettingsSaving(false);
    }
  };

  // Upload setting image
  const handleSettingImageUpload = async (key: string, file: File) => {
    const formData = new FormData();
    formData.append("key", key);
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/settings/upload`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setSiteSettings(p => ({ ...p, [key]: data.value }));
        showToast(`Image uploaded for ${key}`);
      }
    } catch {
      showToast("Image upload failed", "error");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!token) return;
    window.open(`${API_BASE}/analytics/export/leads-csv`, "_blank");
  };

  // AI Chat prompt submit
  const handleSendAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || aiLoading) return;

    const userMsg = { role: "user", content: aiInput };
    const updatedMessages = [...aiMessages, userMsg];
    setAiMessages(updatedMessages);
    setAiInput("");
    setAiLoading(true);

    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      if (res.ok && data.response) {
        setAiMessages(p => [...p, { role: "assistant", content: data.response }]);
      }
    } catch {
      showToast("AI response failed", "error");
    } finally {
      setAiLoading(false);
    }
  };

  // AI SEO Generator
  const handleGenerateSEO = async () => {
    if (!seoTitleInput || !token) return;
    try {
      const res = await fetch(`${API_BASE}/ai/seo-generator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: seoTitleInput, body_content: seoContentInput }),
      });
      if (res.ok) {
        const data = await res.json();
        setSeoResults(data);
        showToast("SEO Metadata & Schema Tags generated!");
      }
    } catch {
      showToast("SEO Generation failed", "error");
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch =
      l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone.includes(leadSearch) ||
      l.requirement.toLowerCase().includes(leadSearch.toLowerCase());
    const matchesStatus = leadStatusFilter === "All" || l.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // -------------------------------------------------------------
  // RENDER: LOGIN FORM (If not authenticated)
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div className="admin-login-screen">
        <div className="admin-login-card">
          <div className="admin-brand" style={{ textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.2rem" }}>
              <KelebekLogo variant="full" height={90} />
            </div>
            <h2>Admin Control Center</h2>
            <p>Access CRM, Lead Pipeline, Projects &amp; Site Engine</p>
          </div>

          {authError && <div className="admin-error-box">{authError}</div>}

          <form onSubmit={handleLogin} className="admin-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="admin@kelebekdesigners.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={authLoading} className="btn-primary login-btn">
              {authLoading ? "Authenticating..." : "Sign In to Control Center →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: MAIN ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="admin-layout">
      {/* Toast popup */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`admin-toast ${toast.type}`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOPBAR */}
      <header className="admin-header">
        <div className="admin-header-left">
          <a href="/" className="admin-logo">
            <span className="gold-text">KELEBEK DESIGNERS</span> CMS &amp; CONTROL ENGINE
          </a>
          <span className="status-indicator">
            <span className="dot online" /> API Online
          </span>
        </div>

        <div className="admin-header-right">
          <div className="user-badge">
            <span className="user-avatar">{user?.full_name?.charAt(0) || "A"}</span>
            <div className="user-info">
              <span className="user-name">{user?.full_name || "Eleanor Vance"}</span>
              <span className="user-role">Platform Admin</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-outline logout-btn">
            Log Out
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="admin-body">
        {/* SIDEBAR NAVIGATION */}
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            {[
              { id: "dashboard", label: "Executive Dashboard", icon: "📊" },
              { id: "leads", label: "CRM Lead Pipeline", icon: "🎯", badge: stats?.new_leads ? `${stats.new_leads} New` : undefined },
              { id: "followups", label: "Follow-ups & Reminders", icon: "📞" },
              { id: "projects", label: "Project Management", icon: "🏗️" },
              { id: "portfolio", label: "Portfolio Showcase CMS", icon: "🖼️" },
              { id: "blogs", label: "Blog Engine & AI Writer", icon: "✍️" },
              { id: "settings", label: "Site Branding & Settings", icon: "⚙️" },
              { id: "ai_toolkit", label: "AI Copilot & SEO", icon: "🤖" },
            ].map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id as any)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* CONTENT AREA */}
        <main className="admin-content">
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h2>Executive Overview</h2>
                  <p>Real-time analytics, CRM metrics, and financial performance</p>
                </div>
                <div className="pane-actions">
                  <button onClick={handleExportCSV} className="btn-outline">
                    📥 Export Leads CSV
                  </button>
                  <button onClick={() => setShowAddLeadModal(true)} className="btn-primary">
                    + Add New Lead
                  </button>
                </div>
              </div>

              {/* KPI WIDGETS */}
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-label">Total Leads Received</span>
                  <span className="stat-value">{stats?.total_leads ?? 0}</span>
                  <span className="stat-sub">{stats?.new_leads ?? 0} pending action</span>
                </div>
                <div className="stat-card gold">
                  <span className="stat-label">Lead Conversion Rate</span>
                  <span className="stat-value">{stats?.conversion_rate ?? 0}%</span>
                  <span className="stat-sub">High converting sales pipeline</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Total Completed Revenue</span>
                  <span className="stat-value">${stats?.total_revenue?.toLocaleString() ?? "0"}</span>
                  <span className="stat-sub">Verified invoice payments</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Active Interior Projects</span>
                  <span className="stat-value">{stats?.active_projects ?? 0}</span>
                  <span className="stat-sub">In design & execution</span>
                </div>
              </div>

              {/* ANALYTICS CHARTS AND PIPELINE */}
              <div className="dashboard-charts-grid">
                {/* Revenue Trend Visualizer */}
                <div className="chart-card">
                  <h3>Monthly Revenue Trend</h3>
                  <div className="bar-chart">
                    {stats?.revenue_by_month?.map((m, idx) => (
                      <div key={idx} className="bar-column">
                        <div
                          className="bar-fill"
                          style={{ height: `${Math.min(100, (m.revenue / 60000) * 100)}%` }}
                        />
                        <span className="bar-label">{m.month}</span>
                        <span className="bar-val">${(m.revenue / 1000).toFixed(0)}k</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lead Status Breakdown */}
                <div className="chart-card">
                  <h3>Lead Status Distribution</h3>
                  <div className="status-progress-list">
                    {Object.entries(stats?.leads_by_status || { New: 2, "Meeting Scheduled": 1, Won: 1 }).map(([st, cnt]) => (
                      <div key={st} className="status-progress-item">
                        <div className="status-info">
                          <span>{st}</span>
                          <strong>{cnt} leads</strong>
                        </div>
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${((cnt / (stats?.total_leads || 1)) * 100).toFixed(0)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CRM LEADS PIPELINE */}
          {activeTab === "leads" && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h2>CRM Lead Pipeline</h2>
                  <p>AI-Scored client inquiries, budget qualifications & direct follow-ups</p>
                </div>
                <div className="pane-actions">
                  <button onClick={() => setShowAddLeadModal(true)} className="btn-primary">
                    + Add New Lead
                  </button>
                </div>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="table-filter-bar">
                <input
                  type="text"
                  placeholder="Search leads by name, email, or requirements..."
                  value={leadSearch}
                  onChange={e => setLeadSearch(e.target.value)}
                  className="search-input"
                />
                <select
                  value={leadStatusFilter}
                  onChange={e => setLeadStatusFilter(e.target.value)}
                  className="status-select"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Meeting Scheduled">Meeting Scheduled</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              {/* LEADS TABLE */}
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Lead Info</th>
                      <th>Budget & Requirement</th>
                      <th>AI Rating</th>
                      <th>Pipeline Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map(lead => (
                      <tr key={lead.id}>
                        <td>
                          <div className="cell-user">
                            <strong>{lead.name}</strong>
                            <span>{lead.email}</span>
                            <span className="phone-sub">{lead.phone}</span>
                          </div>
                        </td>
                        <td>
                          <div className="cell-req">
                            <span className="budget-tag">{lead.budget}</span>
                            <p>{lead.requirement}</p>
                          </div>
                        </td>
                        <td>
                          <div className="cell-ai">
                            <span className={`ai-badge ${lead.ai_classification?.toLowerCase()}`}>
                              {lead.ai_classification} ({lead.ai_score}/100)
                            </span>
                            <small title={lead.ai_insights}>{lead.ai_insights}</small>
                          </div>
                        </td>
                        <td>
                          <select
                            value={lead.status}
                            onChange={e => handleUpdateLeadStatus(lead.id, e.target.value)}
                            className={`status-dropdown status-${lead.status?.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Meeting Scheduled">Meeting Scheduled</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Won">Won</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => setShowAddFollowupModal(lead)}
                              className="btn-sm"
                              title="Schedule Follow-up"
                            >
                              📞 Remind
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="btn-sm danger"
                              title="Delete Lead"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={5} className="empty-td">
                          No matching leads found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: FOLLOWUPS & REMINDERS */}
          {activeTab === "followups" && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h2>Follow-ups & Reminders</h2>
                  <p>Never miss a prospective client touchpoint or project call</p>
                </div>
              </div>

              {/* SUB TABS */}
              <div className="sub-tabs">
                <button
                  className={followupSubTab === "todays" ? "active" : ""}
                  onClick={() => setFollowupSubTab("todays")}
                >
                  Due Today ({followups.todays.length})
                </button>
                <button
                  className={followupSubTab === "missed" ? "active" : ""}
                  onClick={() => setFollowupSubTab("missed")}
                >
                  Missed / Overdue ({followups.missed.length})
                </button>
                <button
                  className={followupSubTab === "upcoming" ? "active" : ""}
                  onClick={() => setFollowupSubTab("upcoming")}
                >
                  Upcoming ({followups.upcoming.length})
                </button>
              </div>

              <div className="followups-list">
                {followups[followupSubTab].map(item => (
                  <div key={item.id} className="followup-card">
                    <div className="followup-main">
                      <span className="type-badge">{item.followup_type}</span>
                      <h4>{item.lead_name}</h4>
                      <p>{item.notes}</p>
                      <small>📅 {new Date(item.followup_date).toLocaleString()}</small>
                    </div>
                    <div className="followup-action">
                      <button
                        onClick={() => handleCompleteFollowup(item.id)}
                        className="btn-gold-outline"
                      >
                        ✓ Mark Completed
                      </button>
                    </div>
                  </div>
                ))}
                {followups[followupSubTab].length === 0 && (
                  <div className="empty-box">No follow-ups listed in this category.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PROJECT MANAGEMENT */}
          {activeTab === "projects" && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h2>Active Projects</h2>
                  <p>Client projects, milestones, design stages & budgets</p>
                </div>
                <div className="pane-actions">
                  <button onClick={() => setShowAddProjectModal(true)} className="btn-primary">
                    + Create Project
                  </button>
                </div>
              </div>

              <div className="projects-grid">
                {projects.map(proj => (
                  <div key={proj.id} className="project-card">
                    <div className="proj-header">
                      <span className="proj-status">{proj.status}</span>
                      <h3>{proj.name}</h3>
                    </div>
                    <p>{proj.description}</p>
                    <div className="proj-footer">
                      <span>Budget: ${proj.budget?.toLocaleString()}</span>
                      <button className="btn-sm">View Milestones →</button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="empty-box">No active projects currently created.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PORTFOLIO CMS */}
          {activeTab === "portfolio" && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h2>Portfolio Showcase CMS</h2>
                  <p>Manage your luxury project gallery, before/after photos & reviews</p>
                </div>
                <div className="pane-actions">
                  <button onClick={() => setShowAddPortfolioModal(true)} className="btn-primary">
                    + Add Portfolio Item
                  </button>
                </div>
              </div>

              <div className="portfolio-grid">
                {portfolio.map(item => (
                  <div key={item.id} className="portfolio-admin-card">
                    <div className="portfolio-img-box">
                      <img src={item.after_image_url || "/images/hero_interior_1784468037551.png"} alt={item.title} />
                      <span className="cat-badge">{item.category}</span>
                    </div>
                    <div className="portfolio-body">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <div className="portfolio-meta">
                        <span>💰 {item.budget_range}</span>
                      </div>
                      {item.client_review && <blockquote className="review">"{item.client_review}"</blockquote>}
                    </div>
                    <div className="portfolio-actions">
                      <button onClick={() => handleDeletePortfolio(item.id)} className="btn-sm danger">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: BLOG CMS & AI WRITER */}
          {activeTab === "blogs" && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h2>Blog Engine & AI Writer</h2>
                  <p>Publish architecture & interior design articles with 1-click AI generation</p>
                </div>
                <div className="pane-actions">
                  <button onClick={() => setShowAddBlogModal(true)} className="btn-primary">
                    ✍️ Create Article (AI Writer)
                  </button>
                </div>
              </div>

              <div className="blogs-list">
                {blogs.map(blog => (
                  <div key={blog.id} className="blog-admin-card">
                    <div className="blog-header-row">
                      <span className="blog-status-badge">{blog.status}</span>
                      <span className="blog-cat">{blog.category}</span>
                    </div>
                    <h3>{blog.title}</h3>
                    <p>{blog.summary}</p>
                    <div className="blog-seo">
                      <small>SEO Title: {blog.seo_title || blog.title}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SITE BRANDING & SETTINGS */}
          {activeTab === "settings" && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h2>Site Branding & Settings</h2>
                  <p>Dynamic controls for website copy, hero banner images and studio details</p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="settings-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Studio / Brand Name</label>
                    <input
                      type="text"
                      value={siteSettings.site_name || "Luxe Design & Architecture"}
                      onChange={e => setSiteSettings(p => ({ ...p, site_name: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      value={siteSettings.contact_email || "contact@luxedesign.com"}
                      onChange={e => setSiteSettings(p => ({ ...p, contact_email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Hero Headline Banner Image</label>
                  <div className="image-upload-preview">
                    {siteSettings.hero_img && <img src={siteSettings.hero_img} alt="Hero" className="thumb" />}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => e.target.files?.[0] && handleSettingImageUpload("hero_img", e.target.files[0])}
                    />
                  </div>
                </div>

                <button type="submit" disabled={settingsSaving} className="btn-primary">
                  {settingsSaving ? "Saving Settings..." : "Save All Site Settings"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 8: AI TOOLKIT */}
          {activeTab === "ai_toolkit" && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h2>AI Copilot & SEO Suite</h2>
                  <p>Interactive interior design copilot, SEO meta tag generator & FAQ wizard</p>
                </div>
              </div>

              <div className="ai-toolkit-grid">
                {/* Copilot Chat */}
                <div className="ai-chat-card">
                  <h3>🤖 Luxe AI Staff Assistant</h3>
                  <div className="chat-box">
                    {aiMessages.map((msg, i) => (
                      <div key={i} className={`chat-bubble ${msg.role}`}>
                        <strong>{msg.role === "user" ? "You" : "AI Copilot"}</strong>
                        <p>{msg.content}</p>
                      </div>
                    ))}
                    {aiLoading && <div className="chat-bubble assistant loading">Thinking...</div>}
                  </div>
                  <form onSubmit={handleSendAiChat} className="chat-input-form">
                    <input
                      type="text"
                      placeholder="Ask copilot about leads, styling trends, or email templates..."
                      value={aiInput}
                      onChange={e => setAiInput(e.target.value)}
                    />
                    <button type="submit" disabled={aiLoading} className="btn-primary">
                      Send
                    </button>
                  </form>
                </div>

                {/* SEO Generator Tool */}
                <div className="seo-tool-card">
                  <h3>⚡ AI Meta Tag & Schema Generator</h3>
                  <div className="form-group">
                    <label>Page / Article Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Modern Villa Interior Design Trends 2026"
                      value={seoTitleInput}
                      onChange={e => setSeoTitleInput(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Article Summary / Keywords</label>
                    <textarea
                      rows={3}
                      placeholder="Enter main topic details..."
                      value={seoContentInput}
                      onChange={e => setSeoContentInput(e.target.value)}
                    />
                  </div>
                  <button onClick={handleGenerateSEO} className="btn-gold-outline">
                    Generate Optimized SEO Meta & Schema
                  </button>

                  {seoResults && (
                    <div className="seo-output">
                      <h4>Generated Metadata</h4>
                      <p><strong>Meta Title:</strong> {seoResults.title}</p>
                      <p><strong>Meta Description:</strong> {seoResults.description}</p>
                      <p><strong>Keywords:</strong> {seoResults.keywords}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ------------------- MODALS ------------------- */}
      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Add New Lead</h3>
            <form onSubmit={handleCreateLead}>
              <div className="form-group">
                <label>Client Full Name</label>
                <input required type="text" value={newLead.name} onChange={e => setNewLead(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input required type="email" value={newLead.email} onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input required type="text" value={newLead.phone} onChange={e => setNewLead(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Estimated Budget (INR ₹)</label>
                <input
                  type="text"
                  placeholder="e.g. ₹15 Lakhs or 15L"
                  value={newLead.budget}
                  onChange={e => setNewLead(p => ({ ...p, budget: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Project Requirements</label>
                <textarea required rows={3} value={newLead.requirement} onChange={e => setNewLead(p => ({ ...p, requirement: e.target.value }))} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddLeadModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary">Create Lead →</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Followup Modal */}
      {showAddFollowupModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Schedule Follow-up for {showAddFollowupModal.name}</h3>
            <form onSubmit={handleCreateFollowup}>
              <div className="form-group">
                <label>Date & Time</label>
                <input required type="datetime-local" value={newFollowup.followup_date} onChange={e => setNewFollowup(p => ({ ...p, followup_date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Follow-up Type</label>
                <select value={newFollowup.followup_type} onChange={e => setNewFollowup(p => ({ ...p, followup_type: e.target.value }))}>
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">In-Person Meeting</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes / Agenda</label>
                <textarea required rows={3} value={newFollowup.notes} onChange={e => setNewFollowup(p => ({ ...p, notes: e.target.value }))} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddFollowupModal(null)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary">Schedule Reminder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Title</label>
                <input required type="text" value={newProject.name} onChange={e => setNewProject(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea required rows={3} value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Approved Budget (INR ₹)</label>
                <input required type="number" value={newProject.budget} onChange={e => setNewProject(p => ({ ...p, budget: Number(e.target.value) }))} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddProjectModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Portfolio Modal */}
      {showAddPortfolioModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Add Portfolio Showcase Item</h3>
            <form onSubmit={handleCreatePortfolio}>
              <div className="form-group">
                <label>Title</label>
                <input required type="text" value={newPortfolio.title} onChange={e => setNewPortfolio(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={newPortfolio.category} onChange={e => setNewPortfolio(p => ({ ...p, category: e.target.value }))}>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Modular Kitchen">Modular Kitchen</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL (After Photo)</label>
                <input type="text" placeholder="/images/hero_interior_1784468037551.png" value={newPortfolio.after_image_url} onChange={e => setNewPortfolio(p => ({ ...p, after_image_url: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea required rows={2} value={newPortfolio.description} onChange={e => setNewPortfolio(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddPortfolioModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Blog Modal */}
      {showAddBlogModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Write Blog Article</h3>
            <form onSubmit={handleCreateBlog}>
              <div className="form-group">
                <label>Article Topic / Title</label>
                <input required type="text" placeholder="e.g. 5 Trends in Modular Kitchen Design" value={newBlog.title} onChange={e => setNewBlog(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={newBlog.run_ai_writer} onChange={e => setNewBlog(p => ({ ...p, run_ai_writer: e.target.checked }))} />
                  <span>✨ Use AI Writer to automatically generate full article body & SEO tags</span>
                </label>
              </div>
              {!newBlog.run_ai_writer && (
                <div className="form-group">
                  <label>Content</label>
                  <textarea rows={4} value={newBlog.content} onChange={e => setNewBlog(p => ({ ...p, content: e.target.value }))} />
                </div>
              )}
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddBlogModal(false)} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary">Publish Article →</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
