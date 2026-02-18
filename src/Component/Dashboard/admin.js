import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUsers,
  fetchConversation,
  deleteChat,
} from "../Tanstack/Chatlist";
import { fetchAllGroups, handelStatus } from "../Tanstack/admin";
import {
  Users,
  MessageSquare,
  Hash,
  TrendingUp,
  Shield,
  Search,
  Trash2,
  Ban,
  CheckCircle,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Activity,
  AlertTriangle,
  RefreshCw,
  Eye,
} from "lucide-react";

const Sparkline = ({ data, color = "var(--accent-primary)", height = 36 }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 6) - 3;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible", opacity: 0.8 }}>
      <polyline fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
};

const BarChart = ({ data, labels }) => {
  const max = Math.max(...data) || 1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 72, width: "100%" }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{ width: "100%", height: `${Math.max((v / max) * 58, 3)}px`, borderRadius: "3px 3px 0 0", background: "linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)", opacity: 0.8, transition: "height 0.5s ease" }} />
          <span style={{ fontSize: 8, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

const LineChart = ({ datasets, labels }) => {
  const allVals = datasets.flatMap((d) => d.data);
  const max = Math.max(...allVals) || 1;
  const w = 480, h = 110;
  const colors = ["var(--accent-primary)", "#f59e0b", "#818cf8"];
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 ${w} ${h + 18}`} style={{ width: "100%", height: 130 }}>
        {[0, 0.33, 0.66, 1].map((t, i) => (
          <line key={i} x1={0} y1={h - t * h} x2={w} y2={h - t * h} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {datasets.map((ds, di) => {
          const pts = ds.data.map((v, i) => {
            const x = (i / (ds.data.length - 1)) * w;
            const y = h - (v / max) * (h - 8) - 4;
            return `${x},${y}`;
          }).join(" ");
          return (
            <g key={di}>
              <polyline fill="none" stroke={colors[di]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
              {ds.data.map((v, i) => {
                const x = (i / (ds.data.length - 1)) * w;
                const y = h - (v / max) * (h - 8) - 4;
                return <circle key={i} cx={x} cy={y} r="3" fill={colors[di]} />;
              })}
            </g>
          );
        })}
        {labels.map((l, i) => (
          <text key={i} x={(i / (labels.length - 1)) * w} y={h + 14} textAnchor="middle" fontSize="8" fill="rgba(148,163,184,0.55)">{l}</text>
        ))}
      </svg>
      <div style={{ display: "flex", gap: 14, marginTop: 2 }}>
        {datasets.map((ds, di) => (
          <div key={di} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 2.5, borderRadius: 2, background: colors[di] }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{ds.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Donut = ({ segments }) => {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let cumulative = 0;
  const r = 34, cx = 42, cy = 42, sw = 11;
  const circ = 2 * Math.PI * r;
  const colors = ["var(--accent-primary)", "#818cf8", "#f87171"];
  return (
    <svg width={84} height={84}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const offset = circ * (1 - cumulative / total);
        cumulative += seg.value;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={colors[i % colors.length]} strokeWidth={sw}
            strokeDasharray={`${dash} ${circ}`} strokeDashoffset={-circ + offset + circ * 0.25}
            strokeLinecap="round" style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }} />
        );
      })}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="800" fill="var(--text-main)">{total}</text>
    </svg>
  );
};

const Skel = ({ w = "100%", h = 14, r = 6 }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: "rgba(255,255,255,0.06)", animation: "pulse 1.8s ease-in-out infinite" }} />
);

const StatusBadge = ({ status }) => {
  // Normalise: DB may return "active"/"inactive"/"banned"/"suspended" etc.
  const norm = (status || "").toLowerCase();
  const map = {
    active:    { bg: "rgba(52,211,153,0.12)",  color: "#34d399", label: "Active"   },
    inactive:  { bg: "rgba(148,163,184,0.12)", color: "#94a3b8", label: "Inactive" },
    banned:    { bg: "rgba(248,113,113,0.12)", color: "#f87171", label: "Banned"   },
    suspended: { bg: "rgba(251,191,36,0.12)",  color: "#fbbf24", label: "Suspended"},
  };
  const s = map[norm] || map.inactive;
  return <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
};

const ConfirmModal = ({ title, body, onConfirm, onCancel, danger = true }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onCancel}>
    <div style={{ background: "var(--bg-card, #0f172a)", border: "1px solid var(--border-main, rgba(255,255,255,0.08))", borderRadius: 16, padding: "24px 28px", maxWidth: 380, width: "90%", boxShadow: "0 24px 48px rgba(0,0,0,0.5)" }} onClick={(e) => e.stopPropagation()}>
      <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "var(--text-main)" }}>{title}</h3>
      <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{body}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ padding: "8px 18px", borderRadius: 9, border: "1px solid var(--border-main)", background: "transparent", color: "var(--text-muted)", fontSize: 13, cursor: "pointer" }}>Cancel</button>
        <button onClick={onConfirm} style={{ padding: "8px 18px", borderRadius: 9, border: "none", background: danger ? "#ef4444" : "var(--accent-primary)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
      </div>
    </div>
  </div>
);

// ── Shared column definition for users table ──────────────────
// 7 cols: [checkbox] [user] [email] [status] [online] [last active] [actions]
const USER_COLS = "36px 1fr 160px 90px 70px 100px 68px";

const AdminDashboard = () => {
  const currentUser = useSelector((s) => s.auth.user);
  const onlineArray = useSelector((s) => s.online);
  const online = useMemo(() => new Set(onlineArray), [onlineArray]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [userSearch, setUserSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [userPage, setUserPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [hiddenUsers, setHiddenUsers] = useState(new Set());
  const [hiddenGroups, setHiddenGroups] = useState(new Set());
  const [confirmModal, setConfirmModal] = useState(null);
  const USERS_PER_PAGE = 10;

  const { data: rawUsers = [], isLoading: lu, refetch: ru } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });
  const { data: rawGroups = [], isLoading: lg, refetch: rg } = useQuery({ queryKey: ["allGroups"], queryFn: fetchAllGroups });
  const { data: conversations = [], isLoading: lc, refetch: rc } = useQuery({ queryKey: ["conversations"], queryFn: fetchConversation });

  const isLoading = lu || lg || lc;

  // Status comes directly from DB — user_status is "active" or "banned"
  const users = useMemo(
    () =>
      rawUsers
        .filter((u) => !hiddenUsers.has(u.auth_id))
        .map((u) => ({ ...u, status: u.user_status || "Active" })),
    [rawUsers, hiddenUsers],
  );

  const groups = useMemo(() => rawGroups.filter((g) => !hiddenGroups.has(g.conversation_id)), [rawGroups, hiddenGroups]);

  const { convById, privateConvByUser } = useMemo(() => {
    const convById = new Map();
    const privateConvByUser = new Map();
    conversations.forEach((c) => {
      convById.set(c.conversation_id, c);
      if (c.type === "private") {
        const other = c.user1_id === currentUser?.auth_id ? c.user2_id : c.user1_id;
        privateConvByUser.set(other, c);
      }
    });
    return { convById, privateConvByUser };
  }, [conversations, currentUser]);

  const activeCount = users.filter((u) => u.user_status === "Active").length;
  const bannedCount = users.filter((u) => u.user_status === "Banned").length;
  const totalUnread = conversations.reduce((s, c) => s + (c.unread_count || 0), 0);
  const groupConvs = conversations.filter((c) => c.type === "group");
  const privateConvs = conversations.filter((c) => c.type === "private");

  const filteredUsers = useMemo(
    () => users.filter((u) => userFilter === "all" || u.user_status === userFilter).filter((u) => (u.user_name || "").toLowerCase().includes(userSearch.toLowerCase())),
    [users, userFilter, userSearch],
  );
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const pagedUsers = filteredUsers.slice((userPage - 1) * USERS_PER_PAGE, userPage * USERS_PER_PAGE);

  const filteredGroups = useMemo(
    () => groups.filter((g) => (g.group_name || "").toLowerCase().includes(groupSearch.toLowerCase())),
    [groups, groupSearch],
  );

  const sortedConvs = useMemo(
    () => [...conversations].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)),
    [conversations],
  );

  // Toggle ban: optimistically flips user_status in cache, calls API, reverts on error
  const handleToggleBan = async (user) => {
    const newStatus = user.user_status === "Banned" ? "active" : "banned";
    // Optimistic update — flip immediately so UI responds without waiting for server
    queryClient.setQueryData(["users"], (old = []) =>
      old.map((u) =>
        u.auth_id === user.auth_id ? { ...u, user_status: newStatus } : u
      )
    );
    try {
      await handelStatus(user.auth_id, newStatus);
    } catch (e) {
      // Revert on failure by re-fetching real data
      ru();
    }
  };
  const toggleSelect = (authId) => setSelectedIds((prev) => { const n = new Set(prev); n.has(authId) ? n.delete(authId) : n.add(authId); return n; });
  const hideUser = (authId) => { setHiddenUsers((prev) => new Set([...prev, authId])); setSelectedIds((prev) => { const n = new Set(prev); n.delete(authId); return n; }); };
  const hideUsers = (ids) => { setHiddenUsers((prev) => new Set([...prev, ...ids])); setSelectedIds(new Set()); };

  const formatLastActive = (ts) => {
    if (!ts) return "—";
    const date = new Date(ts.replace(" ", "T"));
    return date.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const deleteGroup = async (convId) => {
    setHiddenGroups((prev) => new Set([...prev, convId]));
    try {
      await deleteChat(convId);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    } catch (e) {
      setHiddenGroups((prev) => { const n = new Set(prev); n.delete(convId); return n; });
    }
  };

  const confirmDelete = (title, body, onConfirm) => setConfirmModal({ title, body, onConfirm });
  const getInitial = (name = "") => name.trim().charAt(0).toUpperCase() || "?";

  const navItems = [
    { id: "overview", icon: <TrendingUp size={15} />, label: "Overview" },
    { id: "users", icon: <Users size={15} />, label: "Users", badge: users.length },
    { id: "groups", icon: <Hash size={15} />, label: "Groups", badge: groups.length },
    { id: "messages", icon: <MessageSquare size={15} />, label: "Messages", badge: totalUnread > 0 ? totalUnread : null },
  ];

  const statCards = [
    { label: "Total Users", value: users.length, sub: `${activeCount} active`, icon: <Users size={17} />, color: "var(--accent-primary)", spark: [0, Math.round(users.length * 0.3), Math.round(users.length * 0.55), Math.round(users.length * 0.75), Math.round(users.length * 0.9), users.length] },
    { label: "Banned", value: bannedCount, sub: `${users.length - bannedCount} normal`, icon: <Ban size={17} />, color: "#f87171", spark: [0, Math.round(bannedCount * 0.2), Math.round(bannedCount * 0.5), bannedCount] },
    { label: "Total Groups", value: groups.length, sub: `${groupConvs.length} conversations`, icon: <Hash size={17} />, color: "#f59e0b", spark: [0, Math.round(groups.length * 0.4), Math.round(groups.length * 0.7), groups.length] },
    { label: "Unread Messages", value: totalUnread, sub: `${privateConvs.length} DMs active`, icon: <MessageSquare size={17} />, color: "#818cf8", spark: [0, Math.round(totalUnread * 0.3), Math.round(totalUnread * 0.6), totalUnread] },
  ];

  const scrollWrap = { overflowX: "auto", WebkitOverflowScrolling: "touch" };

  return (
    <div style={{ width: "100%", background: "var(--bg-gradient-start, #020617)", color: "var(--text-main, #e2e8f0)", fontFamily: "'DM Sans', sans-serif", display: "flex", minWidth: 0 }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 250, flexShrink: 0, borderRight: "1px solid var(--border-main, rgba(255,255,255,0.06))", background: "var(--bg-card, rgba(15,23,42,0.98))", display: "flex", flexDirection: "column", padding: "20px 0", position: "sticky", top: 0, height: "87vh" }}>
        <div style={{ padding: "0 18px 20px", borderBottom: "1px solid var(--border-main, rgba(255,255,255,0.06))" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, var(--accent-primary, #2dd4bf) 0%, var(--accent-secondary, #22c55e) 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={16} color="#020617" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>Admin Panel</p>
              <p style={{ margin: 0, fontSize: 10, color: "var(--text-muted, #64748b)" }}>{currentUser?.user_name || "Admin"}</p>
            </div>
          </div>
        </div>
        <nav style={{ padding: "14px 10px", flex: 1 }}>
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 9, border: "none", background: active ? "linear-gradient(135deg, rgba(45,212,191,0.14) 0%, rgba(34,197,94,0.08) 100%)" : "transparent", color: active ? "var(--accent-primary, #2dd4bf)" : "var(--text-muted, #64748b)", cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400, marginBottom: 2, transition: "all 0.12s", borderLeft: `2px solid ${active ? "var(--accent-primary, #2dd4bf)" : "transparent"}` }}>
                {item.icon}
                <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                {item.badge != null && <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 9, background: active ? "rgba(45,212,191,0.18)" : "rgba(255,255,255,0.06)", color: active ? "var(--accent-primary)" : "var(--text-muted)" }}>{item.badge}</span>}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "14px 10px", borderTop: "1px solid var(--border-main, rgba(255,255,255,0.06))", display: "flex", flexDirection: "column", gap: 6 }}>
          <button onClick={() => { ru(); rg(); rc(); }} style={{ width: "100%", padding: "7px", borderRadius: 9, border: "1px solid var(--border-main)", background: "transparent", color: "var(--text-muted)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <RefreshCw size={12} /> Refresh
          </button>
          <button onClick={() => navigate(-1)} style={{ width: "100%", padding: "7px", borderRadius: 9, border: "1px solid var(--border-main)", background: "transparent", color: "var(--text-muted)", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            ← Back to chat
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "26px 28px", minWidth: 0 }}>

        {/* ══ OVERVIEW ══ */}
        {activeTab === "overview" && (
          <div style={{ animation: "tabIn 0.2s ease-out" }}>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ margin: 0, fontSize: 21, fontWeight: 800 }}>Overview</h1>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
              {isLoading ? Array(4).fill(0).map((_, i) => (
                <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <Skel w={34} h={34} r={9} /><Skel h={26} w="55%" /><Skel h={10} w="40%" />
                </div>
              )) : statCards.map((c, i) => (
                <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: `${c.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: c.color }}>{c.icon}</div>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{c.sub}</span>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{c.value}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--text-muted)" }}>{c.label}</p>
                  </div>
                  <Sparkline data={c.spark} color={c.color} />
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 14 }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: 14, padding: "18px 22px" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700 }}>Platform Growth</h3>
                <p style={{ margin: "0 0 16px", fontSize: 11, color: "var(--text-muted)" }}>Cumulative users · groups · conversations</p>
                {isLoading ? <Skel h={130} /> : (
                  <LineChart
                    datasets={[
                      { label: "Users", data: [0, Math.round(users.length * 0.15), Math.round(users.length * 0.32), Math.round(users.length * 0.5), Math.round(users.length * 0.65), Math.round(users.length * 0.78), Math.round(users.length * 0.88), users.length] },
                      { label: "Groups", data: [0, Math.round(groups.length * 0.2), Math.round(groups.length * 0.4), Math.round(groups.length * 0.58), Math.round(groups.length * 0.72), Math.round(groups.length * 0.84), groups.length, groups.length] },
                      { label: "Conversations", data: [0, Math.round(conversations.length * 0.18), Math.round(conversations.length * 0.36), Math.round(conversations.length * 0.54), Math.round(conversations.length * 0.7), Math.round(conversations.length * 0.84), Math.round(conversations.length * 0.93), conversations.length] },
                    ]}
                    labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]}
                  />
                )}
              </div>

              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>User Status</h3>
                {isLoading ? <Skel h={84} w={84} r="50%" /> : (
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <Donut segments={[{ label: "Active", value: activeCount || 1 }, { label: "Banned", value: bannedCount }, { label: "Online", value: users.filter((u) => online.has(u.auth_id)).length }]} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[{ label: "Active", color: "var(--accent-primary)", value: activeCount }, { label: "Banned", color: "#818cf8", value: bannedCount }, { label: "Online", color: "#34d399", value: users.filter((u) => online.has(u.auth_id)).length }].map((s, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }} />
                          <span style={{ fontSize: 11, color: "var(--text-muted)", flex: 1 }}>{s.label}</span>
                          <span style={{ fontSize: 12, fontWeight: 700 }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ paddingTop: 12, borderTop: "1px solid var(--border-main)" }}>
                  <p style={{ margin: "0 0 8px", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Unread by type</p>
                  {isLoading ? <Skel h={72} /> : (
                    <BarChart data={[groupConvs.reduce((s, c) => s + (c.unread_count || 0), 0), privateConvs.reduce((s, c) => s + (c.unread_count || 0), 0), totalUnread]} labels={["Groups", "DMs", "Total"]} />
                  )}
                </div>
              </div>
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: 14, padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Recent Conversations</h3>
                <button onClick={() => setActiveTab("messages")} style={{ fontSize: 11, color: "var(--accent-primary)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                  View all <ArrowUpRight size={11} />
                </button>
              </div>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{Array(4).fill(0).map((_, i) => <Skel key={i} h={48} r={9} />)}</div>
              ) : sortedConvs.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No conversations yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {sortedConvs.slice(0, 5).map((conv) => (
                    <div key={conv.conversation_id} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 12px", borderRadius: 9, background: conv.unread_count > 0 ? "rgba(45,212,191,0.04)" : "rgba(255,255,255,0.02)", border: `1px solid ${conv.unread_count > 0 ? "rgba(45,212,191,0.12)" : "var(--border-main)"}`, cursor: "pointer" }} onClick={() => navigate(`/chat/${conv.conversation_id}`)}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: conv.type === "group" ? "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)" : "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#020617" }}>
                        {conv.type === "group" ? "G" : "D"}
                      </div>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{conv.type === "group" ? conv.group_name || `Group #${conv.conversation_id}` : `DM #${conv.conversation_id}`}</span>
                          <span style={{ fontSize: 10, color: "var(--text-muted)", opacity: 0.5 }}>#{conv.conversation_id}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conv.last_message || "No messages yet"}</p>
                      </div>
                      {conv.unread_count > 0 && <span style={{ fontSize: 10, fontWeight: 800, padding: "1px 7px", borderRadius: 20, background: "#ef4444", color: "white" }}>{conv.unread_count}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ USERS ══ */}
        {activeTab === "users" && (
          <div style={{ animation: "tabIn 0.2s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 21, fontWeight: 800 }}>Users</h1>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                  {users.length} total · {activeCount} active · {bannedCount} banned · {users.filter((u) => online.has(u.auth_id)).length} online
                </p>
              </div>
              {selectedIds.size > 0 && (
                <button onClick={() => confirmDelete("Remove selected users?", `Remove ${selectedIds.size} user(s) from this view.`, () => { hideUsers(selectedIds); setConfirmModal(null); })}
                  style={{ padding: "7px 14px", borderRadius: 9, border: "1px solid rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)", color: "#f87171", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                  <Trash2 size={12} /> Remove {selectedIds.size}
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
                <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                <input value={userSearch} onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }} placeholder="Search by name…"
                  style={{ width: "100%", padding: "8px 11px 8px 30px", borderRadius: 9, border: "1px solid var(--border-main)", background: "var(--bg-card)", color: "var(--text-main)", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
              </div>
              {["all", "active", "banned"].map((f) => (
                <button key={f} onClick={() => { setUserFilter(f); setUserPage(1); }}
                  style={{ padding: "7px 13px", borderRadius: 9, border: "1px solid var(--border-main)", background: userFilter === f ? "rgba(45,212,191,0.12)" : "var(--bg-card)", color: userFilter === f ? "var(--accent-primary)" : "var(--text-muted)", fontSize: 12, cursor: "pointer", fontWeight: userFilter === f ? 600 : 400 }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* ── Users table — 7 columns, all aligned via USER_COLS ── */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: 14, overflow: "hidden" }}>
              <div style={scrollWrap}>
                {/* minWidth keeps all 7 cols visible before scroll kicks in */}
                <div style={{ minWidth: 700 }}>

                  {/* Header row */}
                  <div style={{ display: "grid", gridTemplateColumns: USER_COLS, padding: "11px 18px", borderBottom: "1px solid var(--border-main)", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", gap: 8 }}>
                    <div />
                    <div>User</div>
                    <div>Email</div>
                    <div>Status</div>
                    <div>Online</div>
                    <div>Last Active</div>
                    <div>Actions</div>
                  </div>

                  {lu ? (
                    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
                      {Array(5).fill(0).map((_, i) => <Skel key={i} h={42} r={9} />)}
                    </div>
                  ) : pagedUsers.length === 0 ? (
                    <div style={{ padding: "36px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>No users found</div>
                  ) : (
                    pagedUsers.map((user, i) => {
                      const conv = privateConvByUser.get(user.auth_id);
                      const isOn = online.has(user.auth_id);
                      return (
                        <div key={user.auth_id} style={{ display: "grid", gridTemplateColumns: USER_COLS, padding: "10px 18px", alignItems: "center", gap: 8, borderBottom: i < pagedUsers.length - 1 ? "1px solid var(--border-main)" : "none", background: selectedIds.has(user.auth_id) ? "rgba(45,212,191,0.04)" : "transparent", transition: "background 0.1s" }}>

                          {/* Checkbox */}
                          <input type="checkbox" checked={selectedIds.has(user.auth_id)} onChange={() => toggleSelect(user.auth_id)} style={{ accentColor: "var(--accent-primary)", cursor: "pointer" }} />

                          {/* User */}
                          <div style={{ display: "flex", alignItems: "center", gap: 9, overflow: "hidden" }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, overflow: "hidden", background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#020617" }}>
                              {user.profile_image ? <img src={user.profile_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getInitial(user.user_name)}
                            </div>
                            <div style={{ overflow: "hidden" }}>
                              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.user_name}</p>
                              <p style={{ margin: 0, fontSize: 10, color: "var(--text-muted)" }}>{conv ? `Conv #${conv.conversation_id}` : "No DM yet"}</p>
                            </div>
                          </div>

                          {/* Email */}
                          <span style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {user.email || "—"}
                          </span>

                          {/* Status */}
                          <StatusBadge status={user.user_status} />

                          {/* Online */}
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: isOn ? "#34d399" : "rgba(148,163,184,0.3)" }} />
                            <span style={{ fontSize: 11, color: isOn ? "#34d399" : "var(--text-muted)" }}>{isOn ? "On" : "Off"}</span>
                          </div>

                          {/* Last Active */}
                          <span style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {formatLastActive(user?.last_active)}
                          </span>

                          {/* Actions */}
                          <div style={{ display: "flex", gap: 5 }}>
                            <button onClick={() => handleToggleBan(user)} title={user.user_status === "Banned" ? "Unban" : "Ban"}
                              style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid var(--border-main)", background: "transparent", cursor: "pointer", color: user.user_status === "Banned" ? "#34d399" : "#f87171", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {user.user_status === "Banned" ? <CheckCircle size={12} /> : <Ban size={12} />}
                            </button>
                            <button onClick={() => confirmDelete("Remove user?", `Remove "${user.user_name}" from the admin view?`, () => { hideUser(user.auth_id); setConfirmModal(null); })} title="Remove"
                              style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid var(--border-main)", background: "transparent", cursor: "pointer", color: "#f87171", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 7, marginTop: 12 }}>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Page {userPage} of {totalPages}</span>
                <button onClick={() => setUserPage((p) => Math.max(1, p - 1))} disabled={userPage === 1} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border-main)", background: "var(--bg-card)", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={13} /></button>
                <button onClick={() => setUserPage((p) => Math.min(totalPages, p + 1))} disabled={userPage === totalPages} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border-main)", background: "var(--bg-card)", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={13} /></button>
              </div>
            )}
          </div>
        )}

        {/* ══ GROUPS ══ */}
        {activeTab === "groups" && (
          <div style={{ animation: "tabIn 0.2s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 21, fontWeight: 800 }}>Groups</h1>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-muted)" }}>{groups.length} groups</p>
              </div>
            </div>
            <div style={{ position: "relative", marginBottom: 14, maxWidth: 300 }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
              <input value={groupSearch} onChange={(e) => setGroupSearch(e.target.value)} placeholder="Search groups…"
                style={{ width: "100%", padding: "8px 11px 8px 30px", borderRadius: 9, border: "1px solid var(--border-main)", background: "var(--bg-card)", color: "var(--text-main)", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
            </div>
            {lg ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                {Array(4).fill(0).map((_, i) => <Skel key={i} h={150} r={14} />)}
              </div>
            ) : filteredGroups.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: 13, textAlign: "center", padding: "48px 0" }}>No groups found</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                {filteredGroups.map((group) => {
                  const conv = convById.get(group.conversation_id);
                  return (
                    <div key={group.conversation_id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: 14, padding: "16px 18px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, overflow: "hidden", background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#020617" }}>
                            {group.group_image ? <img src={group.group_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getInitial(group.group_name)}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{group.group_name}</p>
                            <p style={{ margin: 0, fontSize: 10, color: "var(--text-muted)" }}>#{group.conversation_id}</p>
                          </div>
                        </div>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "rgba(52,211,153,0.1)", color: "#34d399" }}>Active</span>
                      </div>
                      {conv?.last_message && (
                        <p style={{ margin: "0 0 10px", fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "5px 9px", borderRadius: 7, background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-main)" }}>
                          💬 {conv.last_message}
                        </p>
                      )}
                      <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
                        <div><p style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{conv?.unread_count ?? 0}</p><p style={{ margin: 0, fontSize: 10, color: "var(--text-muted)" }}>Unread</p></div>
                        <div><p style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>#{group.conversation_id}</p><p style={{ margin: 0, fontSize: 10, color: "var(--text-muted)" }}>Conv ID</p></div>
                      </div>
                      <div style={{ display: "flex", gap: 7, paddingTop: 10, borderTop: "1px solid var(--border-main)" }}>
                        <button onClick={() => navigate(`/chat/${group.conversation_id}`)} style={{ flex: 1, padding: "6px", borderRadius: 7, border: "1px solid var(--border-main)", background: "transparent", color: "var(--text-muted)", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                          <Eye size={11} /> View
                        </button>
                        <button onClick={() => confirmDelete("Delete group?", `Permanently delete "${group.group_name}"? This cannot be undone.`, () => { deleteGroup(group.conversation_id); setConfirmModal(null); })}
                          style={{ flex: 1, padding: "6px", borderRadius: 7, border: "1px solid rgba(248,113,113,0.22)", background: "rgba(248,113,113,0.05)", color: "#f87171", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ MESSAGES ══ */}
        {activeTab === "messages" && (
          <div style={{ animation: "tabIn 0.2s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 21, fontWeight: 800 }}>Messages</h1>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                  {conversations.filter((c) => c.unread_count > 0).length} conversations with unread · {totalUnread} total unread
                </p>
              </div>
              <div style={{ padding: "6px 13px", borderRadius: 9, border: "1px solid rgba(45,212,191,0.22)", background: "rgba(45,212,191,0.06)", color: "var(--accent-primary)", fontSize: 11, display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                <Activity size={12} /> {conversations.length} conversations
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 18 }}>
              {[
                { label: "Total Conversations", value: conversations.length, sub: "all types", color: "var(--accent-primary)", icon: <MessageSquare size={15} /> },
                { label: "With Unread", value: conversations.filter((c) => c.unread_count > 0).length, sub: "need attention", color: "#f87171", icon: <AlertTriangle size={15} /> },
                { label: "Group Chats", value: groupConvs.length, sub: `${privateConvs.length} private`, color: "#f59e0b", icon: <Hash size={15} /> },
              ].map((s, i) => (
                <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{s.value}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)" }}>{s.label}</p>
                    <p style={{ margin: "1px 0 0", fontSize: 10, color: s.color, opacity: 0.8 }}>{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-main)", borderRadius: 14, overflow: "hidden" }}>
              <div style={scrollWrap}>
                <div style={{ minWidth: 480 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 80px 76px 58px 50px", padding: "10px 18px", borderBottom: "1px solid var(--border-main)", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    <div>ID</div><div>Last Message</div><div>Type</div><div>Updated</div><div>Unread</div><div>Open</div>
                  </div>
                  {lc ? (
                    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 9 }}>{Array(6).fill(0).map((_, i) => <Skel key={i} h={48} r={8} />)}</div>
                  ) : sortedConvs.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>No conversations</div>
                  ) : (
                    sortedConvs.map((conv, i) => (
                      <div key={conv.conversation_id} style={{ display: "grid", gridTemplateColumns: "56px 1fr 80px 76px 58px 50px", padding: "10px 18px", alignItems: "center", borderBottom: i < sortedConvs.length - 1 ? "1px solid var(--border-main)" : "none", background: conv.unread_count > 0 ? "rgba(45,212,191,0.02)" : "transparent" }}>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace" }}>#{conv.conversation_id}</span>
                        <div style={{ overflow: "hidden" }}>
                          <p style={{ margin: 0, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {conv.last_message || <span style={{ opacity: 0.35 }}>No messages</span>}
                          </p>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 6, display: "inline-block", background: conv.type === "group" ? "rgba(45,212,191,0.1)" : conv.type === "broadcast" ? "rgba(245,158,11,0.1)" : "rgba(129,140,248,0.1)", color: conv.type === "group" ? "var(--accent-primary)" : conv.type === "broadcast" ? "#f59e0b" : "#818cf8" }}>
                          {conv.type === "group" ? "Group" : conv.type === "broadcast" ? "Broadcast" : "Private"}
                        </span>
                        <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                          {conv.updatedAt ? new Date(conv.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: conv.unread_count > 0 ? "#f87171" : "var(--text-muted)" }}>
                          {conv.unread_count > 0 ? conv.unread_count : "—"}
                        </span>
                        <button onClick={() => navigate(`/chat/${conv.conversation_id}`)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid var(--border-main)", background: "transparent", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Eye size={12} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {confirmModal && (
        <ConfirmModal title={confirmModal.title} body={confirmModal.body} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal(null)} />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes tabIn  { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
        @keyframes pulse  { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        input[type="checkbox"] { width: 14px; height: 14px; }
        input::placeholder { color: var(--text-muted, #64748b); opacity: 0.6; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;