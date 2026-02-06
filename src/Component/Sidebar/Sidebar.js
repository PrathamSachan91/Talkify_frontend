import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  getConversation,
  fetchGroups,
  fetchBroadcast,
  getGroup,
} from "../Tanstack/Chatlist";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSocket } from "../../socket/socketContext";
import CreateGroupModal from "./groupModal";

const SideBar = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const socket = useSocket();
  const queryClient = useQueryClient();

  const [openingUserId, setOpeningUserId] = useState(null);
  const [open, setOpen] = useState(false);

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

  if (isLoading) {
    return (
      <aside className="w-64 h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-400">Loading conversations...</span>
        </div>
      </aside>
    );
  }

  const filteredUsers = users.filter((u) => u.auth_id !== currentUser?.auth_id);

  return (
    <aside
      className="hidden sm:flex sm:w-64 lg:w-72 xl:w-80 h-full flex-col shadow-lg"
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
        <p className="text-xs opacity-60 mt-1" style={{ color: "var(--text-main)" }}>
          {filteredUsers.length + groups.length + (broadcast ? 1 : 0)} total
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
        {groups.length > 0 && (
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
                {groups.length}
              </span>
            </div>

            {groups.map((group) => (
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
                  {group.group_name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium block truncate">
                    {group.group_name}
                  </span>
                  <span className="text-xs opacity-50">Group chat</span>
                </div>
              </div>
            ))}
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
                <span className="text-xs opacity-50">Public channel</span>
              </div>
            </div>
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
              {filteredUsers.length}
            </span>
          </div>

          {filteredUsers.map((user) => (
            <div
              key={`user-${user.auth_id}`}
              className="px-3 py-2.5 mb-1 flex items-center gap-3 cursor-pointer transition-all duration-200 rounded-lg"
              style={{
                color: "var(--text-main)",
                opacity: openingUserId === user.auth_id ? 0.5 : 1,
                pointerEvents: openingUserId === user.auth_id ? "none" : "auto",
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
                  {user.user_name.charAt(0).toUpperCase()}
                </div>
                {/* Online indicator - you can add logic to show/hide this */}
                <div
                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                  style={{
                    backgroundColor: "#10b981",
                    borderColor: "var(--bg-card)",
                  }}
                ></div>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium block truncate">
                  {user.user_name}
                </span>
                <span className="text-xs opacity-50">
                  {openingUserId === user.auth_id ? "Opening..." : "Available"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;