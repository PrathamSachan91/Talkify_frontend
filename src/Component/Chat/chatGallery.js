import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Image as ImageIcon,
  Search,
  Grid3x3,
  Grid2x2,
  Menu,
} from "lucide-react";

import { fetchConversationImages } from "../Tanstack/Chatlist";

const ChatGallery = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [gridSize, setGridSize] = useState(3); // 2 or 3 columns
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch images
  const { data: images = [], isLoading } = useQuery({
    queryKey: ["conversation-images", conversationId],
    queryFn: () => fetchConversationImages(conversationId),
    enabled: !!conversationId,
  });

  // Filter images based on search
  const filteredImages = images.filter((img) => {
    if (!searchQuery) return true;
    const date = new Date(img.createdAt).toLocaleDateString();
    const sender = img.sender?.user_name || "";
    return (
      date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sender.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Navigate to previous image
  const previousImage = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : filteredImages.length - 1;
      setSelectedImage(filteredImages[newIndex]);
      return newIndex;
    });
  }, [filteredImages]);

  // Navigate to next image
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev < filteredImages.length - 1 ? prev + 1 : 0;
      setSelectedImage(filteredImages[newIndex]);
      return newIndex;
    });
  }, [filteredImages]);

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Open lightbox
  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  // Download image
  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `talkify-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") previousImage();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedImage, nextImage, previousImage, closeLightbox]);

  if (isLoading) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid) 50%, var(--bg-gradient-end) 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="typing-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span style={{ color: "var(--text-muted)" }}>Loading gallery...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid) 50%, var(--bg-gradient-end) 100%)",
      }}
    >
      {/* Responsive Header */}
      <div
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-main)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Main Header Row */}
        <div className="px-4 md:px-6 py-3 md:py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Left Section - Back Button & Title */}
            <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-shrink">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg transition-all hover:scale-105 flex-shrink-0"
                style={{
                  backgroundColor: "var(--bg-input)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border-input)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-input-focus)";
                  e.currentTarget.style.borderColor = "var(--border-focus)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-input)";
                  e.currentTarget.style.borderColor = "var(--border-input)";
                }}
              >
                <ArrowLeft size={20} />
              </button>

              <div className="min-w-0 flex-shrink">
                <h1
                  className="text-lg md:text-2xl font-bold flex items-center gap-2"
                  style={{ color: "var(--text-main)" }}
                >
                  <ImageIcon size={20} className="md:hidden flex-shrink-0" />
                  <ImageIcon size={24} className="hidden md:block flex-shrink-0" />
                  <span className="truncate">Gallery</span>
                </h1>
                <p className="text-xs md:text-sm truncate" style={{ color: "var(--text-muted)" }}>
                  {filteredImages.length}{" "}
                  {filteredImages.length === 1 ? "image" : "images"}
                </p>
              </div>
            </div>

            {/* Right Section - Desktop Controls */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  size={16}
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  placeholder="Search by date or sender..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg text-sm outline-none transition-all w-64"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-main)",
                    border: "1px solid var(--border-input)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--border-focus)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(45, 212, 191, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-input)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Grid Size Toggle */}
              <div
                className="flex items-center gap-1 p-1 rounded-lg"
                style={{
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-input)",
                }}
              >
                <button
                  onClick={() => setGridSize(2)}
                  className="p-2 rounded transition-all"
                  style={{
                    backgroundColor: gridSize === 2 ? "var(--accent-primary)" : "transparent",
                    color: gridSize === 2 ? "#020617" : "var(--text-muted)",
                  }}
                  title="2 columns"
                >
                  <Grid2x2 size={16} />
                </button>
                <button
                  onClick={() => setGridSize(3)}
                  className="p-2 rounded transition-all"
                  style={{
                    backgroundColor: gridSize === 3 ? "var(--accent-primary)" : "transparent",
                    color: gridSize === 3 ? "#020617" : "var(--text-muted)",
                  }}
                  title="3 columns"
                >
                  <Grid3x3 size={16} />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden p-2 rounded-lg transition-all flex-shrink-0"
              style={{
                backgroundColor: "var(--bg-input)",
                color: "var(--text-main)",
                border: "1px solid var(--border-input)",
              }}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Filters - Collapsible */}
        {showMobileFilters && (
          <div
            className="lg:hidden px-4 pb-3 border-t animate-slideDown"
            style={{
              borderColor: "var(--border-main)",
            }}
          >
            <div className="max-w-7xl mx-auto space-y-3 pt-3">
              {/* Mobile Search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  size={16}
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  placeholder="Search by date or sender..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-main)",
                    border: "1px solid var(--border-input)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--border-focus)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(45, 212, 191, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-input)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Mobile Grid Size Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: "var(--text-label)" }}>
                  Grid:
                </span>
                <div
                  className="flex items-center gap-1 p-1 rounded-lg flex-1"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    border: "1px solid var(--border-input)",
                  }}
                >
                  <button
                    onClick={() => setGridSize(2)}
                    className="flex-1 py-2 rounded transition-all flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: gridSize === 2 ? "var(--accent-primary)" : "transparent",
                      color: gridSize === 2 ? "#020617" : "var(--text-muted)",
                    }}
                  >
                    <Grid2x2 size={16} />
                    <span className="text-sm font-medium">2 Columns</span>
                  </button>
                  <button
                    onClick={() => setGridSize(3)}
                    className="flex-1 py-2 rounded transition-all flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: gridSize === 3 ? "var(--accent-primary)" : "transparent",
                      color: gridSize === 3 ? "#020617" : "var(--text-muted)",
                    }}
                  >
                    <Grid3x3 size={16} />
                    <span className="text-sm font-medium">3 Columns</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(20, 184, 166, 0.1)",
                }}
              >
                <ImageIcon size={36} className="md:hidden" style={{ color: "var(--accent-primary)" }} />
                <ImageIcon size={40} className="hidden md:block" style={{ color: "var(--accent-primary)" }} />
              </div>
              <h3
                className="text-lg md:text-xl font-semibold text-center px-4"
                style={{ color: "var(--text-main)" }}
              >
                {searchQuery ? "No images found" : "No images yet"}
              </h3>
              <p className="text-sm md:text-base text-center px-4" style={{ color: "var(--text-muted)" }}>
                {searchQuery
                  ? "Try adjusting your search"
                  : "Images shared in this conversation will appear here"}
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-3 md:gap-4 ${
                gridSize === 2
                  ? "grid-cols-2"
                  : "grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative aspect-square rounded-lg md:rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-main)",
                    boxShadow: "var(--shadow-card)",
                  }}
                  onClick={() => openLightbox(image, index)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-elevated)";
                    e.currentTarget.style.borderColor = "var(--border-focus)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-card)";
                    e.currentTarget.style.borderColor = "var(--border-main)";
                  }}
                >
                  {/* Image */}
                  <img
                    src={image.url}
                    alt={`Shared by ${image.sender?.user_name || "Unknown"}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{
                            backgroundColor: "var(--accent-secondary)",
                            color: "#020617",
                          }}
                        >
                          {image.sender?.user_name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <span className="text-xs md:text-sm font-medium truncate">
                          {image.sender?.user_name || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs opacity-80">
                        <Calendar size={10} className="md:hidden flex-shrink-0" />
                        <Calendar size={12} className="hidden md:block flex-shrink-0" />
                        <span className="truncate">
                          {new Date(image.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(image.url);
                      }}
                      className="absolute top-2 right-2 md:top-4 md:right-4 p-1.5 md:p-2 rounded-lg backdrop-blur-md transition-all hover:scale-110"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                      }}
                      title="Download image"
                    >
                      <Download size={14} className="md:hidden" />
                      <Download size={16} className="hidden md:block" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox - Same as before */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 rounded-full transition-all hover:scale-110 hover:rotate-90 z-10"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
            }}
            title="Close (ESC)"
          >
            <X size={24} />
          </button>

          {/* Download Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadImage(selectedImage.url);
            }}
            className="absolute top-4 right-20 p-3 rounded-full transition-all hover:scale-110 z-10"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
            }}
            title="Download"
          >
            <Download size={24} />
          </button>

          {/* Previous Button */}
          {filteredImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                previousImage();
              }}
              className="absolute left-4 p-3 rounded-full transition-all hover:scale-110"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              }}
              title="Previous (←)"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Next Button */}
          {filteredImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 p-3 rounded-full transition-all hover:scale-110"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              }}
              title="Next (→)"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-6xl max-h-[90vh] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt="Full size"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Image Info */}
            <div
              className="mt-4 p-4 rounded-lg backdrop-blur-xl"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                    style={{
                      backgroundColor: "var(--accent-secondary)",
                      color: "#020617",
                    }}
                  >
                    {selectedImage.sender?.user_name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {selectedImage.sender?.user_name || "Unknown"}
                    </p>
                    <p className="text-sm opacity-70">
                      {new Date(selectedImage.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-sm opacity-70">
                  {currentIndex + 1} / {filteredImages.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
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
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
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
      `}</style>
    </div>
  );
};

export default ChatGallery;