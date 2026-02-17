import { useState } from "react";
import {
  Users, MessageSquare, Hash, TrendingUp, Shield,
  Search, Trash2, Ban, CheckCircle,
  ArrowUpRight, ArrowDownRight, Eye,
  ChevronLeft, ChevronRight,
  UserCheck, Activity, Star
} from "lucide-react";

// ── Sparkline mini chart ──────────────────────────────────────
const Sparkline = ({ data, color = "var(--accent-primary)", height = 40 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace(/[^a-z]/gi,"")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
};

// ── Bar chart ─────────────────────────────────────────────────
const BarChart = ({ data, labels }) => {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, width: "100%" }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: "100%",
            height: `${(v / max) * 70}px`,
            borderRadius: "4px 4px 0 0",
            background: `linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)`,
            opacity: 0.85,
            transition: "height 0.4s ease",
            minHeight: 4,
          }} />
          <span style={{ fontSize: 9, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

// ── Activity line chart ───────────────────────────────────────
const LineChart = ({ datasets, labels }) => {
  const allVals = datasets.flatMap(d => d.data);
  const max = Math.max(...allVals);
  const min = 0;
  const range = max - min || 1;
  const w = 500, h = 120;
  const colors = ["var(--accent-primary)", "#f59e0b", "#818cf8"];

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${w} ${h + 20}`} style={{ width: "100%", height: 140 }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line key={i} x1={0} y1={h - t * h} x2={w} y2={h - t * h}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {/* Lines */}
        {datasets.map((ds, di) => {
          const pts = ds.data.map((v, i) => {
            const x = (i / (ds.data.length - 1)) * w;
            const y = h - ((v - min) / range) * (h - 10) - 5;
            return `${x},${y}`;
          }).join(" ");
          return (
            <g key={di}>
              <defs>
                <linearGradient id={`lg${di}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors[di]} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={colors[di]} stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline fill="none" stroke={colors[di]} strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" points={pts} />
              {ds.data.map((v, i) => {
                const x = (i / (ds.data.length - 1)) * w;
                const y = h - ((v - min) / range) * (h - 10) - 5;
                return <circle key={i} cx={x} cy={y} r="3" fill={colors[di]} />;
              })}
            </g>
          );
        })}
        {/* X labels */}
        {labels.map((l, i) => (
          <text key={i} x={(i / (labels.length - 1)) * w} y={h + 16}
            textAnchor="middle" fontSize="9" fill="rgba(148,163,184,0.6)">{l}</text>
        ))}
      </svg>
      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
        {datasets.map((ds, di) => (
          <div key={di} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 3, borderRadius: 2, background: colors[di] }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{ds.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Donut chart ───────────────────────────────────────────────
const Donut = ({ segments }) => {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let cumulative = 0;
  const r = 36, cx = 44, cy = 44, strokeWidth = 12;
  const circumference = 2 * Math.PI * r;
  const colors = ["var(--accent-primary)", "#f59e0b", "#818cf8", "#f87171"];

  return (
    <svg width={88} height={88}>
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dashArray = pct * circumference;
        const offset = circumference * (1 - cumulative / total);
        cumulative += seg.value;
        return (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={colors[i % colors.length]}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashArray} ${circumference}`}
            strokeDashoffset={-circumference + offset + circumference * 0.25}
            strokeLinecap="round"
            style={{ transform: `rotate(-90deg)`, transformOrigin: `${cx}px ${cy}px`, transition: "stroke-dasharray 0.6s ease" }}
          />
        );
      })}
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize="11" fontWeight="700" fill="var(--text-main)">{total}</text>
      <text x={cx} y={cy + 13} textAnchor="middle" dominantBaseline="middle"
        fontSize="7" fill="var(--text-muted)">total</text>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════
const mockUsers = [
  { id: 1, user_name: "Alice Chen", email: "alice@mail.com", status: "active", joined: "2024-11-02", messages: 342, role: "user", profile_image: null },
  { id: 2, user_name: "Bob Martinez", email: "bob@mail.com", status: "active", joined: "2024-12-15", messages: 218, role: "user", profile_image: null },
  { id: 3, user_name: "Clara Singh", email: "clara@mail.com", status: "banned", joined: "2025-01-08", messages: 12, role: "user", profile_image: null },
  { id: 4, user_name: "David Kim", email: "david@mail.com", status: "active", joined: "2025-01-20", messages: 501, role: "admin", profile_image: null },
  { id: 5, user_name: "Eva Johansson", email: "eva@mail.com", status: "inactive", joined: "2025-02-01", messages: 76, role: "user", profile_image: null },
  { id: 6, user_name: "Felix Okafor", email: "felix@mail.com", status: "active", joined: "2025-02-10", messages: 189, role: "user", profile_image: null },
  { id: 7, user_name: "Grace Liu", email: "grace@mail.com", status: "active", joined: "2025-02-14", messages: 403, role: "user", profile_image: null },
  { id: 8, user_name: "Hiro Tanaka", email: "hiro@mail.com", status: "inactive", joined: "2024-10-30", messages: 29, role: "user", profile_image: null },
];

const mockGroups = [
  { id: 1, group_name: "Design Team", members: 12, messages: 1840, created: "2024-10-01", active: true },
  { id: 2, group_name: "Engineering", members: 24, messages: 5320, created: "2024-09-15", active: true },
  { id: 3, group_name: "Marketing Hub", members: 8, messages: 930, created: "2024-11-20", active: true },
  { id: 4, group_name: "Random", members: 31, messages: 7210, created: "2024-09-01", active: true },
  { id: 5, group_name: "Old Project", members: 5, messages: 220, created: "2024-08-10", active: false },
  { id: 6, group_name: "Leadership", members: 4, messages: 410, created: "2024-12-01", active: true },
];

const mockMessages = [
  { id: 1, sender: "Alice Chen", content: "Hey team, status update?", conversation: "Design Team", time: "2m ago", flagged: false },
  { id: 2, sender: "Bob Martinez", content: "Pushing the fix now", conversation: "Engineering", time: "5m ago", flagged: false },
  { id: 3, sender: "Clara Singh", content: "This content was flagged", conversation: "Random", time: "12m ago", flagged: true },
  { id: 4, sender: "David Kim", content: "Meeting at 3pm everyone", conversation: "Leadership", time: "18m ago", flagged: false },
  { id: 5, sender: "Eva Johansson", content: "Check the latest report", conversation: "Marketing Hub", time: "34m ago", flagged: false },
  { id: 6, sender: "Felix Okafor", content: "Another flagged item here", conversation: "Random", time: "1h ago", flagged: true },
];

const growthData = {
  weekly: [12, 19, 8, 24, 31, 18, 27],
  monthly: [45, 62, 38, 71, 58, 83, 91, 76, 102, 88, 115, 134],
};

const activityDatasets = [
  { label: "New Users", data: [12, 19, 15, 24, 31, 22, 28, 35, 29, 42, 38, 51] },
  { label: "Active Users", data: [80, 95, 88, 102, 114, 98, 120, 135, 118, 148, 142, 165] },
  { label: "Messages/day", data: [320, 410, 380, 520, 480, 390, 550, 620, 490, 710, 680, 830] },
];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userSearch, setUserSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [userPage, setUserPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [users, setUsers] = useState(mockUsers);
  const [groups, setGroups] = useState(mockGroups);
  const [chartRange, setChartRange] = useState("monthly");
  const USERS_PER_PAGE = 5;

  const totalMessages = mockMessages.length;
  const flaggedMessages = mockMessages.filter(m => m.flagged).length;

  // Filtered users
  const filteredUsers = users
    .filter(u => userFilter === "all" || u.status === userFilter)
    .filter(u =>
      u.user_name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    );
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const pagedUsers = filteredUsers.slice((userPage - 1) * USERS_PER_PAGE, userPage * USERS_PER_PAGE);

  const filteredGroups = groups.filter(g =>
    g.group_name.toLowerCase().includes(groupSearch.toLowerCase())
  );

  const toggleUserSelect = (id) => {
    setSelectedUsers(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBanUser = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "banned" ? "active" : "banned" } : u));
  };

  const handleDeleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleDeleteGroup = (id) => {
    setGroups(prev => prev.filter(g => g.id !== id));
  };

  const statsCards = [
    {
      label: "Total Users",
      value: users.length,
      delta: "+12%",
      up: true,
      icon: <Users size={18} />,
      spark: [20, 25, 22, 30, 28, 35, users.length],
      color: "var(--accent-primary)",
    },
    {
      label: "Active Users",
      value: users.filter(u => u.status === "active").length,
      delta: "+8%",
      up: true,
      icon: <UserCheck size={18} />,
      spark: [12, 15, 14, 18, 17, 21, users.filter(u => u.status === "active").length],
      color: "#34d399",
    },
    {
      label: "Total Groups",
      value: groups.length,
      delta: "+3%",
      up: true,
      icon: <Hash size={18} />,
      spark: [3, 4, 4, 5, 5, 6, groups.length],
      color: "#f59e0b",
    },
    {
      label: "Flagged Messages",
      value: flaggedMessages,
      delta: "-5%",
      up: false,
      icon: <Activity size={18} />,
      spark: [8, 6, 9, 5, 7, 4, flaggedMessages],
      color: "#f87171",
    },
  ];

  const getInitial = (name) => name?.trim().charAt(0).toUpperCase() || "?";

  const StatusBadge = ({ status }) => {
    const map = {
      active: { bg: "rgba(52,211,153,0.12)", color: "#34d399", label: "Active" },
      inactive: { bg: "rgba(148,163,184,0.12)", color: "#94a3b8", label: "Inactive" },
      banned: { bg: "rgba(248,113,113,0.12)", color: "#f87171", label: "Banned" },
    };
    const s = map[status] || map.inactive;
    return (
      <span style={{
        padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
        background: s.bg, color: s.color, display: "inline-block",
      }}>{s.label}</span>
    );
  };

  const navItems = [
    { id: "overview", icon: <TrendingUp size={16} />, label: "Overview" },
    { id: "users", icon: <Users size={16} />, label: "Users" },
    { id: "groups", icon: <Hash size={16} />, label: "Groups" },
    { id: "messages", icon: <MessageSquare size={16} />, label: "Messages" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-gradient-start, #020617)",
      color: "var(--text-main, #e2e8f0)",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      width:"100%"
    }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        borderRight: "1px solid var(--border-main, rgba(255,255,255,0.06))",
        background: "var(--bg-card, rgba(15,23,42,0.9))",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid var(--border-main, rgba(255,255,255,0.06))" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg, var(--accent-primary, #2dd4bf) 0%, var(--accent-secondary, #22c55e) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Shield size={18} color="#020617" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>Admin Panel</p>
              <p style={{ margin: 0, fontSize: 10, color: "var(--text-muted, #64748b)" }}>Super Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10, border: "none",
                background: activeTab === item.id
                  ? "linear-gradient(135deg, rgba(45,212,191,0.15) 0%, rgba(34,197,94,0.1) 100%)"
                  : "transparent",
                color: activeTab === item.id ? "var(--accent-primary, #2dd4bf)" : "var(--text-muted, #64748b)",
                cursor: "pointer", fontSize: 13, fontWeight: activeTab === item.id ? 600 : 400,
                marginBottom: 2, transition: "all 0.15s",
                borderLeft: activeTab === item.id ? "2px solid var(--accent-primary, #2dd4bf)" : "2px solid transparent",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border-main, rgba(255,255,255,0.06))" }}>
          <p style={{ margin: 0, fontSize: 10, color: "var(--text-muted)", opacity: 0.5 }}>v1.0.0 — Admin Build</p>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>

        {/* ══ OVERVIEW TAB ══════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div style={{ animation: "tabIn 0.2s ease-out" }}>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Dashboard Overview</h1>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
              {statsCards.map((card, i) => (
                <div key={i} style={{
                  background: "var(--bg-card, rgba(15,23,42,0.9))",
                  border: "1px solid var(--border-main, rgba(255,255,255,0.06))",
                  borderRadius: 16, padding: "18px 20px",
                  display: "flex", flexDirection: "column", gap: 12,
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${card.color}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: card.color,
                    }}>
                      {card.icon}
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 2,
                      color: card.up ? "#34d399" : "#f87171",
                    }}>
                      {card.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {card.delta}
                    </span>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{card.value}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-muted)" }}>{card.label}</p>
                  </div>
                  <Sparkline data={card.spark} color={card.color} />
                </div>
              ))}
            </div>

            {/* Growth chart + donut */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 16 }}>
              {/* Line chart */}
              <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border-main)",
                borderRadius: 16, padding: "20px 24px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>User Activity Trends</h3>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>Last 12 months</p>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["weekly", "monthly"].map(r => (
                      <button key={r} onClick={() => setChartRange(r)} style={{
                        padding: "4px 12px", borderRadius: 8, border: "1px solid var(--border-main)",
                        background: chartRange === r ? "rgba(45,212,191,0.15)" : "transparent",
                        color: chartRange === r ? "var(--accent-primary)" : "var(--text-muted)",
                        fontSize: 11, cursor: "pointer", fontWeight: 500,
                      }}>{r.charAt(0).toUpperCase() + r.slice(1)}</button>
                    ))}
                  </div>
                </div>
                <LineChart datasets={activityDatasets} labels={months} />
              </div>

              {/* User distribution donut */}
              <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border-main)",
                borderRadius: 16, padding: "20px 24px",
              }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>User Status</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <Donut segments={[
                    { label: "Active", value: users.filter(u => u.status === "active").length },
                    { label: "Inactive", value: users.filter(u => u.status === "inactive").length },
                    { label: "Banned", value: users.filter(u => u.status === "banned").length },
                  ]} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "Active", color: "var(--accent-primary)", value: users.filter(u => u.status === "active").length },
                      { label: "Inactive", color: "#f59e0b", value: users.filter(u => u.status === "inactive").length },
                      { label: "Banned", color: "#818cf8", value: users.filter(u => u.status === "banned").length },
                    ].map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: "var(--text-muted)", flex: 1 }}>{s.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 20, padding: "14px 0 0", borderTop: "1px solid var(--border-main)" }}>
                  <h4 style={{ margin: "0 0 10px", fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>New signups / week</h4>
                  <BarChart data={growthData.weekly} labels={["M","T","W","T","F","S","S"]} />
                </div>
              </div>
            </div>

            {/* Recent messages quick view */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: 16, padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Recent Messages</h3>
                <button onClick={() => setActiveTab("messages")} style={{
                  fontSize: 12, color: "var(--accent-primary)", background: "none",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                }}>
                  View all <ArrowUpRight size={12} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {mockMessages.slice(0, 4).map(msg => (
                  <div key={msg.id} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                    borderRadius: 10, background: msg.flagged ? "rgba(248,113,113,0.05)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${msg.flagged ? "rgba(248,113,113,0.15)" : "var(--border-main)"}`,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: "#020617",
                    }}>{getInitial(msg.sender)}</div>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{msg.sender}</span>
                        <span style={{ fontSize: 10, color: "var(--text-muted)", opacity: 0.6 }}>in {msg.conversation}</span>
                        {msg.flagged && <span style={{ fontSize: 10, fontWeight: 700, color: "#f87171", background: "rgba(248,113,113,0.1)", padding: "1px 6px", borderRadius: 4 }}>FLAGGED</span>}
                      </div>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.content}</p>
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>{msg.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ USERS TAB ═════════════════════════════════════════ */}
        {activeTab === "users" && (
          <div style={{ animation: "tabIn 0.2s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Users</h1>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>{users.length} total users</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {selectedUsers.size > 0 && (
                  <button style={{
                    padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(248,113,113,0.3)",
                    background: "rgba(248,113,113,0.08)", color: "#f87171", fontSize: 12, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <Trash2 size={13} /> Delete {selectedUsers.size} selected
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                <input
                  value={userSearch} onChange={e => { setUserSearch(e.target.value); setUserPage(1); }}
                  placeholder="Search users..."
                  style={{
                    width: "100%", padding: "9px 11px 9px 32px", borderRadius: 10,
                    border: "1px solid var(--border-main)", background: "var(--bg-card)",
                    color: "var(--text-main)", fontSize: 13, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
              {["all", "active", "inactive", "banned"].map(f => (
                <button key={f} onClick={() => { setUserFilter(f); setUserPage(1); }} style={{
                  padding: "8px 14px", borderRadius: 10, border: "1px solid var(--border-main)",
                  background: userFilter === f ? "rgba(45,212,191,0.12)" : "var(--bg-card)",
                  color: userFilter === f ? "var(--accent-primary)" : "var(--text-muted)",
                  fontSize: 12, cursor: "pointer", fontWeight: userFilter === f ? 600 : 400,
                }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Table */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: 16, overflow: "hidden" }}>
              {/* Header */}
              <div style={{
                display: "grid", gridTemplateColumns: "40px 1fr 160px 100px 80px 100px",
                padding: "12px 20px", borderBottom: "1px solid var(--border-main)",
                fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
                textTransform: "uppercase", letterSpacing: "0.05em",
              }}>
                <div />
                <div>User</div>
                <div>Email</div>
                <div>Status</div>
                <div>Messages</div>
                <div>Actions</div>
              </div>

              {pagedUsers.map((user, i) => (
                <div key={user.id} style={{
                  display: "grid", gridTemplateColumns: "40px 1fr 160px 100px 80px 100px",
                  padding: "12px 20px", alignItems: "center",
                  borderBottom: i < pagedUsers.length - 1 ? "1px solid var(--border-main)" : "none",
                  background: selectedUsers.has(user.id) ? "rgba(45,212,191,0.04)" : "transparent",
                  transition: "background 0.1s",
                }}>
                  <input type="checkbox" checked={selectedUsers.has(user.id)}
                    onChange={() => toggleUserSelect(user.id)}
                    style={{ accentColor: "var(--accent-primary)", cursor: "pointer" }} />

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: "#020617",
                    }}>{getInitial(user.user_name)}</div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{user.user_name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>Joined {user.joined}</p>
                    </div>
                  </div>

                  <span style={{ fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
                  <StatusBadge status={user.status} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{user.messages}</span>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => handleBanUser(user.id)}
                      title={user.status === "banned" ? "Unban" : "Ban"}
                      style={{
                        width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border-main)",
                        background: "transparent", cursor: "pointer",
                        color: user.status === "banned" ? "#34d399" : "#f87171",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                      {user.status === "banned" ? <CheckCircle size={13} /> : <Ban size={13} />}
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)}
                      title="Delete"
                      style={{
                        width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border-main)",
                        background: "transparent", cursor: "pointer", color: "#f87171",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}

              {pagedUsers.length === 0 && (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                  No users found
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginTop: 14 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Page {userPage} of {totalPages}</span>
                <button onClick={() => setUserPage(p => Math.max(1, p - 1))} disabled={userPage === 1}
                  style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border-main)", background: "var(--bg-card)", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronLeft size={14} />
                </button>
                <button onClick={() => setUserPage(p => Math.min(totalPages, p + 1))} disabled={userPage === totalPages}
                  style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid var(--border-main)", background: "var(--bg-card)", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══ GROUPS TAB ════════════════════════════════════════ */}
        {activeTab === "groups" && (
          <div style={{ animation: "tabIn 0.2s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Groups</h1>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>{groups.length} total groups</p>
              </div>
            </div>

            <div style={{ position: "relative", marginBottom: 16, maxWidth: 320 }}>
              <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
              <input value={groupSearch} onChange={e => setGroupSearch(e.target.value)}
                placeholder="Search groups..."
                style={{
                  width: "100%", padding: "9px 11px 9px 32px", borderRadius: 10,
                  border: "1px solid var(--border-main)", background: "var(--bg-card)",
                  color: "var(--text-main)", fontSize: 13, outline: "none", boxSizing: "border-box",
                }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {filteredGroups.map(group => (
                <div key={group.id} style={{
                  background: "var(--bg-card)", border: "1px solid var(--border-main)",
                  borderRadius: 16, padding: "18px 20px",
                  opacity: group.active ? 1 : 0.55,
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, fontWeight: 700, color: "#020617",
                      }}>{getInitial(group.group_name)}</div>
                      <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{group.group_name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>Created {group.created}</p>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                      background: group.active ? "rgba(52,211,153,0.12)" : "rgba(148,163,184,0.12)",
                      color: group.active ? "#34d399" : "#94a3b8",
                    }}>{group.active ? "Active" : "Inactive"}</span>
                  </div>

                  <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{group.members}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>Members</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{group.messages.toLocaleString()}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>Messages</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: "1px solid var(--border-main)" }}>
                    <button style={{
                      flex: 1, padding: "7px", borderRadius: 8, border: "1px solid var(--border-main)",
                      background: "transparent", color: "var(--text-muted)", fontSize: 12,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                    }}>
                      <Eye size={12} /> View
                    </button>
                    <button onClick={() => handleDeleteGroup(group.id)} style={{
                      flex: 1, padding: "7px", borderRadius: 8, border: "1px solid rgba(248,113,113,0.25)",
                      background: "rgba(248,113,113,0.06)", color: "#f87171", fontSize: 12,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                    }}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ MESSAGES TAB ══════════════════════════════════════ */}
        {activeTab === "messages" && (
          <div style={{ animation: "tabIn 0.2s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Messages Overview</h1>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                  {flaggedMessages} flagged · {totalMessages - flaggedMessages} clean
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{
                  padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(248,113,113,0.3)",
                  background: "rgba(248,113,113,0.08)", color: "#f87171", fontSize: 12,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <Activity size={13} /> {flaggedMessages} Flagged
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
              {[
                { label: "Total Messages", value: "14,932", delta: "+18% this week", color: "var(--accent-primary)", icon: <MessageSquare size={16} /> },
                { label: "Flagged Today", value: flaggedMessages, delta: "Needs review", color: "#f87171", icon: <Activity size={16} /> },
                { label: "Avg per User", value: "186", delta: "+4% vs last month", color: "#f59e0b", icon: <Star size={16} /> },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "var(--bg-card)", border: "1px solid var(--border-main)",
                  borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 11, background: `${s.color}18`,
                    display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0,
                  }}>{s.icon}</div>
                  <div>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{s.value}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>{s.label}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 10, color: s.color, opacity: 0.8 }}>{s.delta}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message list */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 140px 100px 80px",
                padding: "12px 20px", borderBottom: "1px solid var(--border-main)",
                fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
                textTransform: "uppercase", letterSpacing: "0.05em",
              }}>
                <div>Message</div>
                <div>Conversation</div>
                <div>Status</div>
                <div>Time</div>
              </div>

              {mockMessages.map((msg, i) => (
                <div key={msg.id} style={{
                  display: "grid", gridTemplateColumns: "1fr 140px 100px 80px",
                  padding: "14px 20px", alignItems: "center",
                  borderBottom: i < mockMessages.length - 1 ? "1px solid var(--border-main)" : "none",
                  background: msg.flagged ? "rgba(248,113,113,0.03)" : "transparent",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: "#020617",
                    }}>{getInitial(msg.sender)}</div>
                    <div style={{ overflow: "hidden" }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{msg.sender}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.content}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{msg.conversation}</span>
                  <span>
                    {msg.flagged
                      ? <span style={{ fontSize: 11, fontWeight: 700, color: "#f87171", background: "rgba(248,113,113,0.1)", padding: "2px 8px", borderRadius: 6 }}>Flagged</span>
                      : <span style={{ fontSize: 11, fontWeight: 600, color: "#34d399", background: "rgba(52,211,153,0.1)", padding: "2px 8px", borderRadius: 6 }}>Clean</span>
                    }
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{msg.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes tabIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input[type="checkbox"] { width: 15px; height: 15px; }
        input::placeholder { color: var(--text-muted, #64748b); opacity: 0.6; }
        button:hover { opacity: 0.85; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;