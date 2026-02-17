import { useState, useEffect, useRef } from "react";
import { X, Search, Send, Check } from "lucide-react";

const ForwardMessageModal = ({
  isOpen,
  onClose,
  message,
  groups = [],
  users = [],
  conversations = [],
  currentUser,
  onForward,
}) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelected(new Set());
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen || !message) return null;

  const privateConvByUser = new Map();
  conversations.forEach((conv) => {
    if (conv.type === "private") {
      const otherId =
        conv.user1_id === currentUser?.auth_id
          ? conv.user2_id
          : conv.user1_id;
      privateConvByUser.set(otherId, conv);
    }
  });

  const q = search.toLowerCase().trim();

  const groupList = groups
    .filter((g) => (g.group_name || "").toLowerCase().includes(q))
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

  const dmList = users
    .filter((u) => u.auth_id !== currentUser?.auth_id)
    .filter((u) => (u.user_name || "").toLowerCase().includes(q))
    .sort((a, b) => {
      const ca = privateConvByUser.get(a.auth_id);
      const cb = privateConvByUser.get(b.auth_id);
      return new Date(cb?.updatedAt || 0) - new Date(ca?.updatedAt || 0);
    });

  const hasResults = groupList.length > 0 || dmList.length > 0;

  const toggle = (key) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleForward = async () => {
    if (!selected.size || sending) return;
    setSending(true);

    const conversationIds = [...selected]
      .map((key) => {
        // Group key → conversation_id directly
        const groupMatch = groupList.find(
          (g) => String(g.conversation_id) === key
        );
        if (groupMatch) return groupMatch.conversation_id;

        const dmConv = privateConvByUser.get(key);
        return dmConv?.conversation_id ?? null;
      })
      .filter(Boolean);

    try {
      await onForward(conversationIds, message);
    } finally {
      setSending(false);
      onClose();
    }
  };

  const getInitial = (name = "") => name.trim().charAt(0).toUpperCase() || "?";

  const Row = ({ id, name, image, isGroup }) => {
    const isSel = selected.has(id);
    return (
      <button
        type="button"
        onClick={() => toggle(id)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "100%",
          padding: "9px 16px",
          background: isSel ? "rgba(45,212,191,0.09)" : "transparent",
          border: "none",
          cursor: "pointer",
          transition: "background 0.13s",
          textAlign: "left",
        }}
        onMouseEnter={(e) => {
          if (!isSel) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isSel ? "rgba(45,212,191,0.09)" : "transparent";
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: isGroup
              ? "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)"
              : "linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-primary) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
            fontWeight: 700,
            fontSize: 16,
            color: "#020617",
          }}
        >
          {image ? (
            <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span>{getInitial(name)}</span>
          )}
        </div>

        <div style={{ flex: 1, overflow: "hidden" }}>
          <p style={{
            margin: 0, fontSize: 14, fontWeight: 500,
            color: "var(--text-main)", whiteSpace: "nowrap",
            overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {name}
          </p>
        </div>

        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          border: isSel ? "2px solid var(--accent-primary)" : "2px solid var(--border-input)",
          background: isSel
            ? "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)"
            : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.13s",
        }}>
          {isSel && <Check size={12} color="#020617" strokeWidth={3} />}
        </div>
      </button>
    );
  };

  const SectionLabel = ({ icon, label, topBorder }) => (
    <div style={{
      padding: topBorder ? "10px 16px 4px" : "8px 16px 4px",
      display: "flex", alignItems: "center", gap: 6,
      borderTop: topBorder ? "1px solid var(--border-main)" : "none",
      marginTop: topBorder ? 4 : 0,
    }}>
      {icon}
      <span style={{
        fontSize: 10, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.07em", color: "var(--text-muted)",
      }}>
        {label}
      </span>
    </div>
  );

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(5px)", zIndex: 10000,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fwdBgIn 0.18s ease-out",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%", maxWidth: 420, margin: "0 16px",
            borderRadius: 18, overflow: "hidden",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-main)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(45,212,191,0.07)",
            animation: "fwdModalIn 0.2s cubic-bezier(0.34,1.56,0.64,1)",
            display: "flex", flexDirection: "column", maxHeight: "78vh",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "16px 18px 12px",
            borderBottom: "1px solid var(--border-main)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--text-main)" }}>
                Forward Message
              </h2>
              {selected.size > 0 && (
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--accent-primary)" }}>
                  {selected.size} recipient{selected.size > 1 ? "s" : ""} selected
                </p>
              )}
            </div>
            <button
              type="button" onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: "50%",
                border: "1px solid var(--border-input)", background: "var(--bg-input)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--text-muted)", transition: "all 0.13s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-input-focus)"; e.currentTarget.style.borderColor = "var(--border-focus)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-input)"; e.currentTarget.style.borderColor = "var(--border-input)"; }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Message preview */}
          {(message.text || message.images?.length > 0) && (
            <div style={{
              margin: "10px 14px 2px", padding: "8px 12px", borderRadius: 10,
              background: "rgba(45,212,191,0.06)", border: "1px solid rgba(45,212,191,0.14)",
              flexShrink: 0,
            }}>
              <p style={{ margin: "0 0 5px", fontSize: 10, fontWeight: 700, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Forwarding
              </p>
              {message.images?.length > 0 && (
                <div style={{ display: "flex", gap: 5, marginBottom: message.text ? 6 : 0 }}>
                  {message.images.slice(0, 4).map((img, i) => (
                    <img key={i} src={img} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6 }} />
                  ))}
                  {message.images.length > 4 && (
                    <div style={{ width: 36, height: 36, borderRadius: 6, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--text-muted)" }}>
                      +{message.images.length - 4}
                    </div>
                  )}
                </div>
              )}
              {message.text && (
                <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {message.text}
                </p>
              )}
            </div>
          )}

          {/* Search */}
          <div style={{ padding: "10px 14px 6px", flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search groups or people…"
                style={{
                  width: "100%", padding: "8px 11px 8px 32px", borderRadius: 9,
                  border: "1px solid var(--border-input)", background: "var(--bg-input)",
                  color: "var(--text-main)", fontSize: 13, outline: "none",
                  boxSizing: "border-box", transition: "border-color 0.13s, box-shadow 0.13s",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--border-focus)"; e.target.style.boxShadow = "0 0 0 3px rgba(45,212,191,0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border-input)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "var(--accent-primary) transparent" }}>
            {!hasResults ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", color: "var(--text-muted)", gap: 8 }}>
                <Search size={28} opacity={0.2} />
                <p style={{ margin: 0, fontSize: 13 }}>
                  {search ? `No results for "${search}"` : "No chats found"}
                </p>
              </div>
            ) : (
              <>
                {groupList.length > 0 && (
                  <>
                    <SectionLabel
                      topBorder={false}
                      label={`Groups (${groupList.length})`}
                      icon={<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.5, color: "var(--text-main)" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    />
                    {groupList.map((group) => (
                      <Row
                        key={`group-${group.conversation_id}`}
                        id={String(group.conversation_id)}
                        name={group.group_name || "Group"}
                        image={group.group_image || null}
                        isGroup
                      />
                    ))}
                  </>
                )}

                {dmList.length > 0 && (
                  <>
                    <SectionLabel
                      topBorder={groupList.length > 0}
                      label={`Direct Messages (${dmList.length})`}
                      icon={<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.5, color: "var(--text-main)" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
                    />
                    {dmList.map((user) => (
                      <Row
                        key={`dm-${user.auth_id}`}
                        id={user.auth_id}
                        name={user.user_name || "User"}
                        image={user.profile_image || null}
                        isGroup={false}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: "12px 16px", borderTop: "1px solid var(--border-main)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0, gap: 12,
          }}>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", flex: 1 }}>
              {selected.size === 0 ? "Select who to forward to" : `Forwarding to ${selected.size} chat${selected.size > 1 ? "s" : ""}`}
            </p>
            <button
              type="button" onClick={handleForward}
              disabled={!selected.size || sending}
              style={{
                padding: "8px 18px", borderRadius: 9, border: "none",
                background: selected.size && !sending
                  ? "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)"
                  : "var(--bg-input)",
                color: selected.size && !sending ? "#020617" : "var(--text-muted)",
                fontSize: 13, fontWeight: 700,
                cursor: selected.size && !sending ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", gap: 6, transition: "all 0.13s",
                boxShadow: selected.size && !sending ? "var(--shadow-glow)" : "none",
              }}
              onMouseEnter={(e) => { if (selected.size && !sending) e.currentTarget.style.transform = "scale(1.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {sending ? (
                <>
                  <div style={{ width: 13, height: 13, borderRadius: "50%", border: "2px solid rgba(2,6,23,0.25)", borderTop: "2px solid #020617", animation: "fwdSpin 0.65s linear infinite" }} />
                  Sending…
                </>
              ) : (
                <><Send size={14} />Forward</>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fwdBgIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fwdModalIn { from { opacity: 0; transform: scale(0.93) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fwdSpin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default ForwardMessageModal;