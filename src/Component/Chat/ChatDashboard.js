import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../socket/socketContext";
import {
  Paperclip,
  Send,
  Image as ImageIcon,
  X,
  CheckCheck,
  MoreVertical,
  Phone,
  Video,
  ChevronDown,
  Search,
  XCircle,
  Smile,
} from "lucide-react";
import {
  fetchMessages,
  sendMessage,
  fetchConversationMeta,
  fetchUserById,
  deleteChat,
  deleteMessage,
  deleteMessageMe,
} from "../Tanstack/Chatlist";
import bg from "../../utils/background.jpg";
import EditProfileModal from "../EditProfile/editProfile";
import EmojiPicker from "emoji-picker-react";

const ChatDashboard = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const queryClient = useQueryClient();
  const socket = useSocket();
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const onlineArray = useSelector((state) => state.online);
  const online = new Set(onlineArray);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeout = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [messageDropdown, setMessageDropdown] = useState(null);
  const messageDropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const [search, setSearch] = useState("");
  const [displaySearch, setDisplaySearch] = useState(false);
  const [emoji, setEmojis] = useState(false);
  const emojiRef = useRef(null);

  const [deleteModal, setDeleteModal] = useState({
    show: false,
    type: "", // 'conversation', 'message', 'message-for-me'
    id: null,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Close message dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        messageDropdown &&
        messageDropdownRef.current &&
        !messageDropdownRef.current.contains(event.target)
      ) {
        setMessageDropdown(null);
      }
    };

    if (messageDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [messageDropdown]);

  const { data: convo } = useQuery({
    queryKey: ["conversation-meta", conversationId],
    queryFn: () => fetchConversationMeta(conversationId),
    enabled: !!conversationId,
  });
  const showSenderName = convo?.type !== "private";

  const { data: receiver } = useQuery({
    queryKey: ["user", convo?.receiver_id],
    queryFn: () => fetchUserById(convo.receiver_id),
    enabled: convo?.type === "private" && !!convo?.receiver_id,
  });

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("join_conversation", conversationId);

    const handleReceive = () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    };

    const handleTypingEvent = (data) => {
      if (
        data.conversationId === conversationId &&
        data.userId !== currentUser?.auth_id
      ) {
        setIsTyping(true);

        if (typingTimeout.current) {
          clearTimeout(typingTimeout.current);
        }

        typingTimeout.current = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    };

    socket.on("receive_message", handleReceive);
    socket.on("user_typing", handleTypingEvent);
    socket.on("delete_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("user_typing", handleTypingEvent);
    };
  }, [socket, conversationId, currentUser, queryClient]);

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setText("");
      setImages([]);
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = null;
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  // Handle typing indicator
  const handleTyping = () => {
    socket.emit("typing", { conversationId, userId: currentUser?.auth_id });
  };

  // Handle image click - navigate to ImageView
  const handleImageClick = (messageImages) => {
    const urls = messageImages.map((img) => img);
    const query = encodeURIComponent(JSON.stringify(urls));
    navigate(`/image-view?images=${query}`);
  };

  // Handle message actions
  const handleReply = (message) => {
    console.log("Reply to:", message);
    // Implement reply functionality
    setMessageDropdown(null);
  };

  const handleDeleteMessage = (messageId, messageCreatedAt) => {
    // Check if message was created within 10 minutes
    const now = new Date();
    const createdAt = new Date(messageCreatedAt);
    const diffInMinutes = (now - createdAt) / (1000 * 60);

    if (diffInMinutes > 10) {
      // Show error modal or toast
      alert(
        "Messages can only be deleted for everyone within 10 minutes of sending.",
      );
      setMessageDropdown(null);
      return;
    }

    setDeleteModal({
      show: true,
      type: "message",
      id: messageId,
    });
    setMessageDropdown(null);
  };

  const handleDeleteForMe = (messageId) => {
    setDeleteModal({
      show: true,
      type: "message-for-me",
      id: messageId,
    });
    setMessageDropdown(null);
  };

  const handleDeleteConversation = () => {
    setDeleteModal({
      show: true,
      type: "conversation",
      id: conversationId,
    });
    setShowDropdown(false);
  };

  const confirmDelete = () => {
    if (deleteModal.type === "conversation") {
      deleteChat(deleteModal.id);
    } else if (deleteModal.type === "message") {
      deleteMessage(deleteModal.id, conversationId);
    } else if (deleteModal.type === "message-for-me") {
      deleteMessageMe(deleteModal.id, conversationId);
    }
    setDeleteModal({ show: false, type: "", id: null });
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, type: "", id: null });
  };

  const isOnline = convo?.type === "private" && online.has(receiver?.auth_id);

  const toggleMessageDropdown = (msgId, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect.bottom + 200 > viewportHeight) {
      setDropdownPosition("top");
    } else {
      setDropdownPosition("bottom");
    }

    setMessageDropdown(messageDropdown === msgId ? null : msgId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojis(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredMessages = search.trim()
    ? messages.filter((msg) =>
        msg.text?.toLowerCase().includes(search.toLowerCase()),
      )
    : messages;

  if (isLoading) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{ background: "var(--bg-gradient-start)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="typing-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span style={{ color: "var(--text-muted)" }}>Loading chat…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col chat-container">
      {/* ================= ENHANCED HEADER ================= */}
      <div
        className="chat-header px-4 py-3 border-b flex items-center justify-between backdrop-blur-xl relative z-50"
        style={{
          borderColor: "var(--border-main)",
          backgroundColor: "var(--bg-card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-lg shadow-lg transition-transform hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                color: "#020617",
              }}
            >
              {convo?.type === "group" ? (
                convo?.group_image ? (
                  <img
                    src={convo.group_image}
                    alt={convo.group_name || "Group"}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : convo?.group_name?.trim()?.charAt(0)?.toUpperCase() ? (
                  <span>
                    {convo?.group_name?.trim()?.charAt(0)?.toUpperCase()}
                  </span>
                ) : (
                  <span className="font-semibold text-sm text-black">📢</span>
                )
              ) : receiver?.profile_image ? (
                <img
                  src={receiver.profile_image}
                  alt={receiver.name || "User"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : receiver?.user_name?.trim()?.charAt(0)?.toUpperCase() ? (
                <div className="w-full h-full rounded-full flex items-center justify-center font-bold">
                  {receiver?.user_name?.trim()?.charAt(0)?.toUpperCase()}
                </div>
              ) : (
                <span className="font-semibold text-sm text-black">📢</span>
              )}
            </div>

            {/* Online status indicator */}
            {convo?.type === "private" && isOnline && (
              <div
                className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2"
                style={{
                  backgroundColor: "var(--online)",
                  borderColor: "var(--bg-card)",
                  boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
                }}
              />
            )}
          </div>

          <div>
            <h3
              className="font-semibold text-base"
              style={{ color: "var(--text-main)" }}
            >
              {convo?.type === "private"
                ? receiver?.user_name || "Chat"
                : convo?.group_name}
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {convo?.type === "private" &&
                (isTyping ? (
                  <span className="flex items-center gap-1">
                    <span className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                    typing...
                  </span>
                ) : (
                  <span>{isOnline ? "Active" : "Offline"}</span>
                ))}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {displaySearch && (
            <div className="relative">
              <input
                placeholder="Search chat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-5 py-2 pr-11 rounded-xl outline-none transition-all text-[15px]"
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

              {/* Cross icon inside input */}
              <button
                type="button"
                className="absolute right-3 top-1/3 icon-button"
                style={{ color: "var(--text-muted)" }}
                onClick={() => {
                  setSearch("");
                  setDisplaySearch(false);
                }}
              >
                <XCircle size={16} />
              </button>
            </div>
          )}

          {!displaySearch && (
            <button
              className="icon-button p-2 rounded-lg transition-all"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setDisplaySearch(true)}
            >
              <Search size={18} />
            </button>
          )}
          <button
            className="icon-button p-2 rounded-lg transition-all"
            style={{
              color: "var(--text-muted)",
            }}
          >
            <Phone size={18} />
          </button>
          <button
            className="icon-button p-2 rounded-lg transition-all"
            style={{
              color: "var(--text-muted)",
            }}
          >
            <Video size={18} />
          </button>
          <div ref={dropdownRef} className="relative">
            <button
              className="icon-button p-2 rounded-lg transition-all"
              style={{
                color: "var(--text-muted)",
              }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <MoreVertical size={18} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                {/* Backdrop to close dropdown */}
                <div
                  className="fixed inset-0 z-[999]"
                  onClick={() => setShowDropdown(false)}
                ></div>

                <div
                  className="absolute right-0 top-12 w-56 rounded-xl shadow-2xl overflow-hidden z-[1000] border mt-1"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-main)",
                  }}
                >
                  {/* Menu Items */}
                  <div className="py-1">
                    {/* Gallery Button */}
                    <button
                      className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors duration-150"
                      style={{ color: "var(--text-main)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(20, 184, 166, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      onClick={() => {
                        // Navigate to gallery
                        navigate(`/gallery/${conversationId}`);
                        setShowDropdown(false);
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Gallery</span>
                    </button>

                    {convo.type === "group" &&
                      convo.created_by === currentUser.auth_id && (
                        <button
                          className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors duration-150"
                          style={{ color: "var(--text-main)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(20, 184, 166, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                          onClick={() => {
                            setIsEditProfileOpen(true);
                            setShowDropdown(false);
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="text-sm font-medium">
                            Edit group info
                          </span>
                        </button>
                      )}

                    {/* Search Messages Button */}

                    {/* Mute Notifications */}
                    <button
                      className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors duration-150"
                      style={{ color: "var(--text-main)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(20, 184, 166, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      onClick={() => {
                        // Toggle mute
                        setShowDropdown(false);
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        Mute Notifications
                      </span>
                    </button>

                    <div
                      className="my-1 border-t"
                      style={{ borderColor: "var(--border-main)" }}
                    ></div>

                    {/* Delete Conversation Button */}

                    <button
                      className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors duration-150"
                      style={{ color: "var(--text-main)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(20, 184, 166, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      onClick={() => {
                        setShowDropdown(false);
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 3l6 6-4 1-3 6-2-2-6 3 3-6-2-2 6-3 1-4z"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        Pin Conversation
                      </span>
                    </button>
                    <button
                      className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors duration-150"
                      style={{ color: "var(--danger)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(239, 68, 68, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      onClick={() => {
                        // Handle delete
                        handleDeleteConversation();
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        Delete Conversation
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= ENHANCED MESSAGES ================= */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 messages-container"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-60">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                color: "#020617",
                fontSize: "2rem",
              }}
            >
              👋
            </div>
            <p
              className="text-center text-base font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              No messages yet. Say hello!
            </p>
          </div>
        ) : (
          filteredMessages.map((msg, index) => {
            const isMe = msg.sender_id === currentUser?.auth_id;
            const showAvatar =
              !isMe &&
              showSenderName &&
              (index === messages.length - 1 ||
                messages[index + 1]?.sender_id !== msg.sender_id);

            return (
              <div
                key={msg.id}
                className={`message-wrapper flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"} group`}
                style={{
                  animation: "messageSlideIn 0.3s ease-out",
                }}
              >
                {/* Avatar */}
                {showAvatar ? (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 shadow-md"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-primary) 100%)",
                      color: "#020617",
                    }}
                  >
                    {msg.sender?.profile_image ? (
                      <img
                        src={msg.sender.profile_image}
                        alt={msg.sender.user_name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="font-semibold text-sm text-black">
                        {msg.sender?.user_name?.charAt(0).toUpperCase() || "P"}
                      </span>
                    )}
                  </div>
                ) : showSenderName && !isMe ? (
                  <div className="w-8 h-8 flex-shrink-0" />
                ) : null}

                {/* Message Bubble */}
                <div
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}
                >
                  {showSenderName && !isMe && (
                    <span
                      className="text-xs font-medium mb-1 ml-3"
                      style={{ color: "var(--text-label)" }}
                    >
                      {msg.sender?.user_name}
                    </span>
                  )}

                  <div className="flex items-start gap-2 relative">
                    <div
                      className={`message-bubble px-4 py-2.5 rounded-2xl shadow-lg backdrop-blur-sm ${
                        isMe ? "rounded-br-md" : "rounded-bl-md"
                      }`}
                      style={{
                        background: isMe
                          ? "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)"
                          : "var(--bg-message-received)",
                        color: isMe ? "#020617" : "var(--text-main)",
                        border: isMe ? "none" : "1px solid var(--border-main)",
                      }}
                    >
                      {/* Images */}
                      {msg.images?.length > 0 && (
                        <div
                          className="relative cursor-pointer mb-2 group/image"
                          onClick={() => handleImageClick(msg.images)}
                        >
                          <img
                            src={msg.images[0]}
                            alt="sent"
                            className="max-w-64 max-h-64 object-contain rounded-xl transition-transform group-hover/image:scale-[1.02]"
                          />

                          {msg.images.length > 1 && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl">
                              <div className="flex items-center gap-2">
                                <ImageIcon size={24} className="text-white" />
                                <span className="text-white text-2xl font-bold">
                                  +{msg.images.length - 1}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Text */}
                      {msg.text && (
                        <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      )}

                      {/* Timestamp & Status */}
                      <div
                        className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <span
                          className="text-[10px] opacity-70"
                          style={{
                            color: isMe ? "#020617" : "var(--text-muted)",
                          }}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isMe && (
                          <CheckCheck
                            size={14}
                            className="opacity-70"
                            style={{ color: "#020617" }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Message Dropdown Button */}
                    <div
                      className={`opacity-0 group-hover:opacity-100 transition-opacity relative ${
                        isMe ? "order-first" : ""
                      }`}
                      ref={
                        messageDropdown === msg.id ? messageDropdownRef : null
                      }
                    >
                      <button
                        onClick={(e) => toggleMessageDropdown(msg.id, e)}
                        className="p-1 rounded-lg hover:bg-black/20 transition-colors"
                        style={{
                          color: "var(--text-muted)",
                        }}
                      >
                        <ChevronDown size={16} />
                      </button>

                      {/* Message Dropdown Menu */}
                      {messageDropdown === msg.id && (
                        <>
                          {/* Backdrop */}
                          <div
                            className="fixed inset-0 z-[998]"
                            onClick={() => setMessageDropdown(null)}
                          ></div>

                          <div
                            className={`absolute ${
                              dropdownPosition === "top" ? "bottom-8" : "top-8"
                            } ${isMe ? "right-0" : "left-0"}  w-48 rounded-xl shadow-2xl overflow-hidden z-[999] border`}
                            style={{
                              backgroundColor: "var(--bg-card)",
                              borderColor: "var(--border-main)",
                            }}
                          >
                            <div className="py-1">
                              {/* Reply */}
                              <button
                                className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors duration-150"
                                style={{ color: "var(--text-main)" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "rgba(20, 184, 166, 0.1)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "transparent";
                                }}
                                onClick={() => handleReply(msg)}
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
                                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                  />
                                </svg>
                                <span className="text-sm font-medium">
                                  Reply
                                </span>
                              </button>

                              {/* Delete Message (only if user is sender and within 10 minutes) */}
                              {isMe &&
                                (() => {
                                  const now = new Date();
                                  const createdAt = new Date(msg.createdAt);
                                  const diffInMinutes =
                                    (now - createdAt) / (1000 * 60);
                                  const canDeleteForEveryone =
                                    diffInMinutes <= 10;

                                  return (
                                    <button
                                      className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors duration-150"
                                      style={{
                                        color: canDeleteForEveryone
                                          ? "var(--danger)"
                                          : "var(--text-muted)",
                                        opacity: canDeleteForEveryone ? 1 : 0.5,
                                      }}
                                      onMouseEnter={(e) => {
                                        if (canDeleteForEveryone) {
                                          e.currentTarget.style.backgroundColor =
                                            "rgba(239, 68, 68, 0.1)";
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                          "transparent";
                                      }}
                                      onClick={() =>
                                        handleDeleteMessage(
                                          msg.id,
                                          msg.createdAt,
                                        )
                                      }
                                      disabled={!canDeleteForEveryone}
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
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                      <span className="text-sm font-medium">
                                        Delete Message
                                        {!canDeleteForEveryone && " (Expired)"}
                                      </span>
                                    </button>
                                  );
                                })()}

                              {/* Delete For Me */}
                              <button
                                className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors duration-150"
                                style={{ color: "var(--text-main)" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "rgba(20, 184, 166, 0.1)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "transparent";
                                }}
                                onClick={() => handleDeleteForMe(msg.id)}
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
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                  />
                                </svg>
                                <span className="text-sm font-medium">
                                  Delete For Me
                                </span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-end gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-primary) 100%)",
                color: "#020617",
              }}
            >
              ...
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-md shadow-lg backdrop-blur-sm"
              style={{
                background: "var(--bg-message-received)",
                border: "1px solid var(--border-main)",
              }}
            >
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ================= IMAGE PREVIEWS ================= */}
      {previews && previews.length > 0 && (
        <div
          className="px-4 py-3 border-t flex gap-3 flex-wrap backdrop-blur-xl"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-divider)",
          }}
        >
          {previews.map((src, idx) => (
            <div
              key={idx}
              className="relative group image-preview-item"
              style={{
                animation: "fadeIn 0.2s ease-in",
              }}
            >
              <img
                src={src}
                alt="preview"
                className="w-20 h-20 object-cover rounded-xl border-2 shadow-md"
                style={{
                  borderColor: "var(--border-focus)",
                }}
              />

              <button
                type="button"
                onClick={() => {
                  const newImages = images.filter((_, i) => i !== idx);
                  const newPreviews = previews.filter((_, i) => i !== idx);

                  setImages(newImages.length ? newImages : []);
                  setPreviews(newPreviews.length ? newPreviews : []);

                  if (newImages.length === 0 && fileInputRef.current) {
                    fileInputRef.current.value = null;
                  }
                }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  backgroundColor: "var(--danger)",
                  color: "white",
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        mode="group"
        group={convo}
        conversationId={conversationId}
      />

      {/* ================= ENHANCED INPUT ================= */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim() && images.length === 0) return;

          sendMessageMutation.mutate({
            conversationId,
            text,
            images,
          });
        }}
        className="p-4 border-t backdrop-blur-xl"
        style={{
          borderColor: "var(--border-main)",
          backgroundColor: "var(--bg-card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-end gap-3">
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setImages(files);
              setPreviews(files.map((f) => URL.createObjectURL(f)));
            }}
          />

          {/* Input wrapper */}
          <div className="flex-1 relative">
            {/* 📎 Attachment icon (LEFT) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-lg"
              style={{ color: "var(--text-muted)" }}
            >
              <Paperclip size={18} />
            </button>

            {/* Input */}
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              className="w-full pl-11 pr-11 py-3.5 rounded-xl outline-none transition-all text-[15px]"
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

            <div ref={emojiRef}>
              <button
                type="button"
                onClick={() => setEmojis((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg"
                style={{ color: "var(--text-muted)" }}
              >
                <Smile size={18} />
              </button>

              {emoji && (
                <div className="absolute bottom-14 right-0 z-50">
                  <EmojiPicker
                    theme="dark"
                    onEmojiClick={(emojiData) => {
                      setText((prev) => prev + emojiData.emoji);
                      inputRef.current?.focus();
                    }}
                    style={{
                      opacity: 0.8,
                      background: "var(--bg-card)",
                      color: "white",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={
              sendMessageMutation.isLoading ||
              (!text.trim() && images.length === 0)
            }
            className="send-button px-5 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
              color: "#020617",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Send size={18} />
            <span>Send</span>
          </button>
        </div>
      </form>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteModal.show && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center"
            onClick={cancelDelete}
            style={{
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            {/* Modal */}
            <div
              className="rounded-2xl shadow-2xl border max-w-md w-full mx-4"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-main)",
                animation: "scaleIn 0.2s ease-out",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="px-6 py-4 border-b"
                style={{
                  borderColor: "var(--border-main)",
                }}
              >
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-main)" }}
                >
                  {deleteModal.type === "conversation"
                    ? "Delete Conversation?"
                    : deleteModal.type === "message"
                      ? "Delete Message?"
                      : "Delete Message For You?"}
                </h3>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {deleteModal.type === "conversation"
                    ? "This will permanently delete this conversation and all its messages. This action cannot be undone."
                    : deleteModal.type === "message"
                      ? "This message will be deleted for everyone in this chat. This action cannot be undone."
                      : "This message will be deleted for you only. Other participants will still see it."}
                </p>
              </div>

              {/* Footer */}
              <div
                className="px-6 py-4 border-t flex items-center justify-end gap-3"
                style={{
                  borderColor: "var(--border-main)",
                }}
              >
                <button
                  onClick={cancelDelete}
                  className="px-5 py-2.5 rounded-xl font-medium transition-all"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-main)",
                    border: "1px solid var(--border-input)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--bg-input-focus)";
                    e.currentTarget.style.borderColor = "var(--border-focus)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-input)";
                    e.currentTarget.style.borderColor = "var(--border-input)";
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2.5 rounded-xl font-medium transition-all"
                  style={{
                    backgroundColor: "var(--danger)",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(239, 68, 68, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {deleteModal.type === "conversation"
                    ? "Delete Conversation"
                    : deleteModal.type === "message"
                      ? "Delete for Everyone"
                      : "Delete for Me"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            scale: 0.95;
          }
          to {
            opacity: 1;
            scale: 1;
          }
        }

        .icon-button:hover {
          background-color: var(--bg-input);
          color: var(--text-main);
          transform: scale(1.05);
        }

        .attachment-button:hover {
          background-color: var(--bg-input-focus);
          border-color: var(--border-focus);
          color: var(--accent-secondary);
          transform: scale(1.05);
        }

        .send-button:not(:disabled):hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
        }

        .send-button:not(:disabled):active {
          transform: scale(0.98);
        }

        .message-bubble {
          transition: all 0.2s ease;
        }

        .message-bubble:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
        }

        .typing-indicator span {
          width: 6px;
          height: 6px;
          background: var(--accent-secondary);
          border-radius: 50%;
          animation: typingBounce 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typingBounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-8px);
          }
        }

        .typing-dots {
          display: inline-flex;
          gap: 2px;
        }

        .typing-dots span {
          width: 4px;
          height: 4px;
          background: var(--text-muted);
          border-radius: 50%;
          animation: typingBounce 1.4s infinite;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        .typing-loader {
          display: flex;
          gap: 8px;
        }

        .typing-loader span {
          width: 12px;
          height: 12px;
          background: var(--accent-primary);
          border-radius: 50%;
          animation: typingBounce 1.4s infinite;
        }

        .typing-loader span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-loader span:nth-child(3) {
          animation-delay: 0.4s;
        }

        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            var(--accent-primary) 0%,
            var(--accent-secondary) 100%
          );
          border-radius: 10px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: var(--accent-primary);
        }

        /* ================= RESPONSIVE DESIGN ================= */
        
        /* Medium screens - below 1024px */
        @media (max-width: 1024px) {
          .message-bubble img {
            max-width: 12rem !important;
            max-height: 12rem !important;
          }
        }

        /* Small screens - below 768px */
        @media (max-width: 768px) {
          .chat-header {
            padding: 0.5rem 0.75rem !important;
          }

          .message-bubble {
            padding: 0.5rem 0.625rem !important;
          }

          .message-bubble p {
            font-size: 0.8125rem !important;
          }

          .message-bubble img {
            max-width: 10rem !important;
            max-height: 10rem !important;
          }

          .send-button span {
            display: none;
          }

          .messages-container {
            padding: 0.75rem !important;
          }
        }

        /* Mobile - below 480px */
        @media (max-width: 480px) {
          .chat-header h3 {
            font-size: 0.875rem !important;
          }

          .message-bubble {
            padding: 0.4375rem 0.5625rem !important;
          }

          .message-bubble p {
            font-size: 0.75rem !important;
            line-height: 1.25rem !important;
          }

          .message-bubble img {
            max-width: 8rem !important;
            max-height: 8rem !important;
          }

          input {
            padding: 0.5rem 0.75rem !important;
            font-size: 0.8125rem !important;
          }

          .messages-container {
            padding: 0.5rem !important;
          }

          form {
            padding: 0.5rem !important;
          }
        }

        /* Very small screens - below 360px */
        @media (max-width: 360px) {
          .message-bubble img {
            max-width: 6rem !important;
            max-height: 6rem !important;
          }

          .message-bubble p {
            font-size: 0.6875rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatDashboard;
