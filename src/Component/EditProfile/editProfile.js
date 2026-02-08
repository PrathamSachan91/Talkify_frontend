import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "../Tanstack/editProfile";
import { setUser } from "../redux/AuthSlice";
import { Camera, User, X, Check } from "lucide-react";
import { editGroup } from "../Tanstack/Chatlist";
import { useQueryClient } from "@tanstack/react-query";


const EditProfileModal = ({ isOpen, onClose, mode, group, conversationId }) => {
  const user = useSelector((state) => state.auth);
  const initialName = mode === "group" ? group?.group_name : user.user_name;

  const initialImage =
    mode === "group" ? group?.group_image : user.profile_image;

  const [name, setName] = useState(initialName || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(initialImage || null);
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  const [alert, setAlert] = useState(null);
  const queryClient = useQueryClient();

  const userMutation = useMutation({
    mutationFn: editProfile,
    onSuccess: (data) => {
      dispatch(setUser(data));
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    },
    onError: (error) => {
      setAlert(error.message || "Failed to update profile");
    },
  });

  const groupMutation = useMutation({
    mutationFn: editGroup,
    onSuccess: () => {
      setShowSuccess(true);
      queryClient.invalidateQueries({
      queryKey: ["conversation-meta", conversationId],
    });

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    },
  });

  const mutation = mode === "group" ? groupMutation : userMutation;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlert("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setAlert("Please select a valid image file");
        return;
      }

      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setAlert(
        mode === "group" ? "Please enter group name" : "Please enter your name",
      );
      return;
    }

    mutation.mutate(
      mode === "group"
        ? {
            group_id: group.id,
            group_name: name.trim(),
            group_image: image,
            conversation_id: conversationId,
          }
        : {
            user_name: name.trim(),
            profile_image: image,
          },
    );
  };

  const handleClose = () => {
    if (name !== user.user_name || image) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close?",
        )
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      setAlert(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [alert]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className="w-full max-w-lg rounded-2xl border p-6 relative"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-main)",
            boxShadow: "var(--shadow-elevated)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success Toast */}
          {alert && (
            <div
              className="w-[60%] mx-auto flex items-center mb-4 px-4 py-3 rounded-lg text-sm"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                color: "var(--danger)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              {alert}
            </div>
          )}
          {showSuccess && (
            <div
              className="absolute top-4 right-4 px-4 py-2 rounded-lg flex items-center gap-2 animate-slide-in shadow-lg z-10"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                color: "#020617",
              }}
            >
              <Check size={16} />
              <span className="text-sm font-semibold">{mode === "group" ? "Group updated!" : "Profile updated!"}</span>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
              }}
            >
              <User size={24} style={{ color: "#020617" }} />
            </div>

            <div className="flex-1">
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--text-main)" }}
              >
                {mode === "group" ? "Edit Group" : "Edit Profile"}
              </h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {mode === "group"
                  ? "Update group information"
                  : "Update your profile information"}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-lg transition-all"
              style={{
                color: "var(--text-muted)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--bg-input)";
                e.currentTarget.style.color = "var(--text-main)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative group">
                <div
                  className="w-28 h-28 rounded-full overflow-hidden border-4 transition-all"
                  style={{
                    borderColor: "var(--accent-secondary)",
                    boxShadow: "var(--shadow-glow)",
                  }}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                      }}
                    >
                      <User size={40} style={{ color: "#020617" }} />
                    </div>
                  )}
                </div>

                {/* Camera Overlay */}
                <label
                  htmlFor="profile-image-modal"
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera size={28} className="text-white" />
                </label>

                <input
                  id="profile-image-modal"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="text-center">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Click to upload • Max 5MB
                </p>
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <label
                htmlFor="name-modal"
                className="block text-sm font-medium"
                style={{ color: "var(--text-label)" }}
              >
                {mode === "group" ? "Group Name" : "Display Name"}
              </label>
              <div className="relative">
                <input
                  id="name-modal"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-main)",
                    border: "1px solid var(--border-input)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--border-focus)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(45, 212, 191, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-input)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {name.length}/50
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl font-semibold transition-all"
                style={{
                  backgroundColor: "var(--bg-input)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-input)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--bg-input-focus)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-input)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={mutation.isPending || !name.trim()}
                className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                  color: "#020617",
                  boxShadow: "var(--shadow-glow)",
                }}
                onMouseEnter={(e) => {
                  if (!mutation.isPending && name.trim()) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(34, 197, 94, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-glow)";
                }}
              >
                {mutation.isPending ? (
                  <>
                    <div className="typing-loader-small">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .typing-loader-small {
          display: flex;
          gap: 4px;
        }

        .typing-loader-small span {
          width: 6px;
          height: 6px;
          background: #020617;
          border-radius: 50%;
          animation: typingBounce 1.4s infinite;
        }

        .typing-loader-small span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-loader-small span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typingBounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </>
  );
};

export default EditProfileModal;
