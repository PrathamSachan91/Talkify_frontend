import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  getConversation,
  fetchGroups,
  fetchBroadcast,
  getGroup,
  fetchConversation,
} from "../Tanstack/Chatlist";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useSocket } from "../../socket/socketContext";
import CreateGroupModal from "./groupModal";
import { CheckCheck } from "lucide-react";

const SideBar = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const onlineArray = useSelector((state) => state.online);
  const online = new Set(onlineArray);
  const [openingUserId, setOpeningUserId] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  /* ---------------- FETCH USERS ---------------- */
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  /* ---------------- FETCH GROUPS ---------------- */
  const { data: groups = [] } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  const { data: broadcast } = useQuery({
    queryKey: ["broadcast"],
    queryFn: fetchBroadcast,
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversation,
  });

  /* ---------------- OPEN PRIVATE CHAT ---------------- */
  const openChatMutation = useMutation({
    mutationFn: getConversation,
    onSuccess: (conver) => {
      navigate(`/chat/${conver.conversation_id}`);
      setOpeningUserId(null);
    },
    onError: () => {
      setOpeningUserId(null);
      alert("Failed to open chat");
    },
  });

  const openChat = (userId) => {
    if (openingUserId) return;
    setOpeningUserId(userId);
    openChatMutation.mutate(userId);
  };

  /* ---------------- CREATE GROUP ---------------- */
  const createGroupMutation = useMutation({
    mutationFn: getGroup,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setOpen(false);
      navigate(`/chat/${data.conversation_id}`);
    },
    onError: () => {
      alert("Failed to create group");
    },
  });

  /* ---------------- SOCKET: USER CREATED ---------------- */
  useEffect(() => {
    if (!socket) return;

    const handleUserCreated = (user) => {
      queryClient.setQueryData(["users"], (old = []) => {
        if (old.some((u) => u.auth_id === user.auth_id)) return old;
        return [...old, user];
      });
    };

    socket.on("user_created", handleUserCreated);

    return () => {
      socket.off("user_created", handleUserCreated);
    };
  }, [socket, queryClient]);

  useEffect(() => {
    if (!socket) return;

    const handleLastMessage = (data) => {
      queryClient.setQueryData(["conversations"], (old = []) => {
        if (!old || old.length === 0) return old;
        const targetId = Number(data.conversationId);
        const updated = old.map((conv) =>
          conv.conversation_id === targetId
            ? {
                ...conv,
                last_message: data.text,
                updatedAt: data.updatedAt,
              }
            : conv,
        );

        return updated.sort(
          (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0),
        );
      });
    };

    socket.on("last_message", handleLastMessage);

    return () => socket.off("last_message", handleLastMessage);
  }, [socket, queryClient]);

  // Memoize filtered users
  const filteredUsers = useMemo(
    () =>
      users
        .filter((u) => u.auth_id !== currentUser?.auth_id)
        .filter((u) =>
          u.user_name.toLowerCase().includes(search.toLowerCase()),
        ),
    [users, currentUser, search],
  );

  // Memoize filtered groups
  const filteredGroups = useMemo(
    () =>
      groups.filter((g) =>
        g.group_name.toLowerCase().includes(search.toLowerCase()),
      ),
    [groups, search],
  );

  const {
    conversationById,
    privateConversationByUser,
    orderedUsers,
    orderedGroups,
  } = useMemo(() => {
    const sortedConversations = [...conversations].sort(
      (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0),
    );

    const convById = new Map();
    const privateByUser = new Map();

    sortedConversations.forEach((conv) => {
      convById.set(conv.conversation_id, conv);

      if (conv.type === "private") {
        const otherUser =
          conv.user1_id === currentUser?.auth_id
            ? conv.user2_id
            : conv.user1_id;

        privateByUser.set(otherUser, conv);
      }
    });

    const orderedUsers = [...filteredUsers].sort((a, b) => {
      const convA = privateByUser.get(a.auth_id);
      const convB = privateByUser.get(b.auth_id);
      return new Date(convB?.updatedAt || 0) - new Date(convA?.updatedAt || 0);
    });

    const orderedGroups = [...filteredGroups].sort((a, b) => {
      const convA = convById.get(a.conversation_id);
      const convB = convById.get(b.conversation_id);
      return new Date(convB?.updatedAt || 0) - new Date(convA?.updatedAt || 0);
    });

    return {
      conversationById: convById,
      privateConversationByUser: privateByUser,
      orderedUsers,
      orderedGroups,
    };
  }, [conversations, filteredUsers, filteredGroups, currentUser]);

  if (!isLoggedIn) return null;

  if (isLoading) {
    return (
      <aside className="w-64 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-400">
            Loading conversations...
          </span>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="sm:flex sm:w-64 lg:w-72 xl:w-80 h-full flex-col shadow-lg"
      style={{
        backgroundColor: "var(--bg-card)",
        borderRight: "1px solid var(--border-main)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-[10px] border-b"
        style={{
          borderColor: "var(--border-main)",
        }}
      >
        <h2
          className="text-lg font-bold tracking-tight"
          style={{
            color: "var(--text-label)",
          }}
        >
          Conversations
        </h2>
        <p
          className="text-xs opacity-60 mt-1"
          style={{ color: "var(--text-main)" }}
        >
          {filteredUsers.length + filteredGroups.length + (broadcast ? 1 : 0)}{" "}
          total
        </p>
      </div>

      {/* New Group Button */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => setOpen(true)}
          className="w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "#020617",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create New Group
        </button>
      </div>

      <input
        placeholder="Search chat..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex align-center px-5 py-2 m-2 rounded-xl outline-none transition-all text-[15px]"
        style={{
          backgroundColor: "var(--bg-input)",
          color: "var(--text-main)",
          border: "1px solid var(--border-input)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--border-focus)";
          e.target.style.boxShadow =
            "0 0 0 3px rgba(45, 212, 191, 0.1), var(--shadow-glow)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--border-input)";
          e.target.style.boxShadow = "none";
        }}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        open={open}
        onClose={() => setOpen(false)}
        users={filteredUsers}
        onCreate={(data) => createGroupMutation.mutate(data)}
      />

      {/* List */}
      <div className="overflow-y-auto flex-1 px-2 pb-2">
        {/* GROUPS */}
        {orderedGroups.length > 0 && (
          <div className="mb-3">
            <div className="px-3 py-2 flex items-center gap-2">
              <svg
                className="w-4 h-4 opacity-60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span
                className="text-xs font-semibold uppercase tracking-wider opacity-60"
                style={{ color: "var(--text-main)" }}
              >
                Groups
              </span>
              <span
                className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "rgba(20, 184, 166, 0.2)",
                  color: "var(--accent-primary)",
                }}
              >
                {orderedGroups.length}
              </span>
            </div>

            {orderedGroups.map((group) => {
              const conv = conversationById.get(group.conversation_id);

              return (
                <div
                  key={`group-${group.conversation_id}`}
                  className="px-3 py-2.5 mb-1 flex items-center gap-3 cursor-pointer transition-all duration-200 rounded-lg"
                  style={{ color: "var(--text-main)" }}
                  onClick={() => navigate(`/chat/${group.conversation_id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(20, 184, 166, 0.12)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-sm"
                    style={{
                      backgroundColor: "var(--accent-primary)",
                      color: "#020617",
                    }}
                  >
                    {group.group_image ? (
                      <img
                        src={group.group_image}
                        alt={group.group_name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span>{group.group_name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium block truncate">
                      {group.group_name}
                    </span>
                    <span className="text-xs opacity-50 truncate block">
                      {conv?.last_message || "No messages yet"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BROADCAST */}
        {broadcast && (
          <div className="mb-3">
            <div className="px-3 py-2 flex items-center gap-2">
              <svg
                className="w-4 h-4 opacity-60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
              <span
                className="text-xs font-semibold uppercase tracking-wider opacity-60"
                style={{ color: "var(--text-main)" }}
              >
                Broadcast
              </span>
            </div>

            {(() => {
              const conv = conversationById.get(broadcast.conversation_id);

              return (
                <div
                  key={`broadcast-${broadcast.conversation_id}`}
                  className="px-3 py-2.5 mb-1 flex items-center gap-3 cursor-pointer transition-all duration-200 rounded-lg"
                  style={{ color: "var(--text-main)" }}
                  onClick={() => navigate(`/chat/${broadcast.conversation_id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(20, 184, 166, 0.12)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm"
                    style={{
                      backgroundColor: "var(--accent-primary)",
                      color: "#020617",
                    }}
                  >
                    📢
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium block truncate">
                      {broadcast.group_name}
                    </span>
                    <span className="text-xs opacity-50 truncate block">
                      {conv?.last_message || "No messages yet"}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* DIRECT MESSAGES */}
        <div>
          <div className="px-3 py-2 flex items-center gap-2">
            <svg
              className="w-4 h-4 opacity-60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span
              className="text-xs font-semibold uppercase tracking-wider opacity-60"
              style={{ color: "var(--text-main)" }}
            >
              Direct Messages
            </span>
            <span
              className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgba(139, 92, 246, 0.2)",
                color: "var(--accent-secondary)",
              }}
            >
              {orderedUsers.length}
            </span>
          </div>

          {orderedUsers.map((user) => {
            const isOnline = online.has(user?.auth_id);
            const conv = privateConversationByUser.get(user.auth_id);

            return (
              <div
                key={`user-${user.auth_id}`}
                className="px-3 py-2.5 mb-1 flex items-center gap-3 cursor-pointer transition-all duration-200 rounded-lg"
                style={{
                  color: "var(--text-main)",
                  opacity: openingUserId === user.auth_id ? 0.5 : 1,
                  pointerEvents:
                    openingUserId === user.auth_id ? "none" : "auto",
                }}
                onClick={() => openChat(user.auth_id)}
                onMouseEnter={(e) => {
                  if (openingUserId !== user.auth_id) {
                    e.currentTarget.style.backgroundColor =
                      "rgba(139, 92, 246, 0.12)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-sm"
                    style={{
                      backgroundColor: "var(--accent-secondary)",
                      color: "#020617",
                    }}
                  >
                    {user?.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={user.user_name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="font-semibold text-sm text-black">
                        {user?.user_name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* ✅ Online indicator */}
                  {isOnline && (
                    <div
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                      style={{
                        backgroundColor: "#10b981",
                        borderColor: "var(--bg-card)",
                      }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium block truncate">
                    {user.user_name}
                  </span>

                  <div className="flex items-center gap-1">
                    {conv?.last_sender === currentUser?.auth_id && (
                      <CheckCheck
                        size={14}
                        className="opacity-70 flex-shrink-0"
                        style={{ color: "var(--text-muted)" }}
                      />
                    )}
                    <span className="text-xs opacity-50 truncate">
                      {conv?.last_message || "No messages yet"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
