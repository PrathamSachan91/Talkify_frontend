import { useState } from "react";
import { Users, X, Check, Search } from "lucide-react";

const CreateGroupModal = ({ open, onClose, users, onCreate }) => {
  const [groupName, setGroupName] = useState("");
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  if (!open) return null;

  const toggleUser = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selected.length === 0) {
      alert("Enter group name and select members");
      return;
    }

    setIsCreating(true);
    try {
      await onCreate({
        group_name: groupName,
        members: selected,
      });

      setGroupName("");
      setSelected([]);
      setSearchQuery("");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setGroupName("");
      setSelected([]);
      setSearchQuery("");
      onClose();
    }
  };

  const filteredUsers = users.filter((u) =>
    u.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl border animate-scaleIn"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-main)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "var(--accent-primary)" }}
              >
                <Users className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: "var(--text-main)" }}
                >
                  Create Group
                </h2>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Add members to your new group
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isCreating}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:rotate-90 disabled:opacity-50"
              style={{
                color: "var(--text-muted)",
              }}
              onMouseEnter={(e) => {
                if (!isCreating) {
                  e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                  e.currentTarget.style.color = "var(--danger)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Group Name Input */}
          <div className="mb-5">
            <label
              className="text-sm font-medium mb-2 block"
              style={{ color: "var(--text-label)" }}
            >
              Group Name
            </label>
            <input
              type="text"
              placeholder="Enter group name..."
              className="w-full px-4 py-3 rounded-lg outline-none transition-all duration-200"
              style={{
                backgroundColor: "var(--bg-input)",
                color: "var(--text-main)",
                border: "2px solid var(--border-input)",
              }}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-primary)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border-input)";
              }}
              disabled={isCreating}
            />
          </div>

          {/* Members Section */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label
                className="text-sm font-medium"
                style={{ color: "var(--text-label)" }}
              >
                Add Members
              </label>
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: "rgba(20, 184, 166, 0.2)",
                  color: "var(--accent-primary)",
                }}
              >
                {selected.length} selected
              </span>
            </div>

            {/* Search Input */}
            {users.length > 5 && (
              <div className="relative mb-3">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  placeholder="Search members..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-main)",
                    border: "1px solid var(--border-input)",
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent-primary)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-input)";
                  }}
                  disabled={isCreating}
                />
              </div>
            )}

            {/* Members List */}
            <div
              className="max-h-64 overflow-y-auto rounded-lg border"
              style={{
                backgroundColor: "var(--bg-input)",
                borderColor: "var(--border-main)",
              }}
            >
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const isSelected = selected.includes(u.auth_id);
                  return (
                    <label
                      key={u.auth_id}
                      className="flex items-center gap-3 px-3 py-3 cursor-pointer transition-all duration-200 border-b last:border-b-0"
                      style={{
                        borderColor: "var(--border-main)",
                        opacity: isCreating ? 0.5 : 1,
                        pointerEvents: isCreating ? "none" : "auto",
                      }}
                      onMouseEnter={(e) => {
                        if (!isCreating) {
                          e.currentTarget.style.backgroundColor = "rgba(20, 184, 166, 0.08)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {/* Custom Checkbox */}
                      <div className="relative flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleUser(u.auth_id)}
                          className="sr-only"
                          disabled={isCreating}
                        />
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center transition-all duration-200"
                          style={{
                            backgroundColor: isSelected
                              ? "var(--accent-primary)"
                              : "transparent",
                            border: `2px solid ${
                              isSelected ? "var(--accent-primary)" : "var(--border-input)"
                            }`,
                          }}
                        >
                          {isSelected && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                        </div>
                      </div>

                      {/* User Avatar */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{
                          backgroundColor: "var(--accent-secondary)",
                          color: "#020617",
                        }}
                      >
                        {u.user_name.charAt(0).toUpperCase()}
                      </div>

                      {/* User Name */}
                      <span
                        className="text-sm font-medium flex-1"
                        style={{ color: "var(--text-main)" }}
                      >
                        {u.user_name}
                      </span>
                    </label>
                  );
                })
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    No members found
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isCreating}
              className="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: "1px solid var(--border-main)",
                color: "var(--text-main)",
              }}
              onMouseEnter={(e) => {
                if (!isCreating) {
                  e.currentTarget.style.backgroundColor = "rgba(100, 116, 139, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleCreate}
              disabled={isCreating || !groupName.trim() || selected.length === 0}
              className="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--accent-primary)",
                color: "#020617",
              }}
              onMouseEnter={(e) => {
                if (!isCreating && groupName.trim() && selected.length > 0) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {isCreating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </>
  );
};

export default CreateGroupModal;