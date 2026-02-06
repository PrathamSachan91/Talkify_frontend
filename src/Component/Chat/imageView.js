import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ZoomIn, 
  ZoomOut,
  RotateCw,
  Share2,
  ArrowLeft
} from 'lucide-react';

const ImageView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const resetTransforms = useCallback(() => {
    setZoom(1);
    setRotation(0);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetTransforms();
  }, [images.length, resetTransforms]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetTransforms();
  }, [images.length, resetTransforms]);

  useEffect(() => {
    try {
      const imagesParam = searchParams.get('images');
      if (!imagesParam) {
        throw new Error('No images');
      }

      const parsedImages = JSON.parse(decodeURIComponent(imagesParam));
      if (!Array.isArray(parsedImages) || parsedImages.length === 0) {
        throw new Error('Invalid images data');
      }

      setImages(parsedImages);
    } catch (error) {
      console.error('Error loading images:', error);
      setImages([]);
    }
  }, [searchParams]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate(-1);
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, navigate]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex];
    link.download = `talkify-image-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Talkify Image',
          text: 'Check out this image from Talkify',
          url: images[currentIndex],
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(images[currentIndex]);
      alert('Image URL copied to clipboard!');
    }
  };

  if (images.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid) 50%, var(--bg-gradient-end) 100%)',
        }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🖼️</div>
          <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-main)' }}>
            No Images Found
          </h2>
          <p className="text-base mb-6" style={{ color: 'var(--text-muted)' }}>
            There are no images to display.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl font-medium transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
              color: '#020617',
              boxShadow: 'var(--shadow-glow)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'var(--shadow-glow)';
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid) 50%, var(--bg-gradient-end) 100%)',
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-50 px-4 py-3 backdrop-blur-xl border-b flex items-center justify-between"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-main)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-input)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-input-focus)';
              e.currentTarget.style.borderColor = 'var(--border-focus)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-input)';
              e.currentTarget.style.borderColor = 'var(--border-input)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shadow-md"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                color: '#020617',
              }}
            >
              T
            </div>
            <div>
              <h1 className="font-semibold text-base" style={{ color: 'var(--text-main)' }}>
                Image Gallery
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {currentIndex + 1} of {images.length}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="control-btn p-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-input)',
            }}
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>

          <span className="text-sm px-3" style={{ color: 'var(--text-muted)' }}>
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            className="control-btn p-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-input)',
            }}
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>

          <div
            className="w-px h-6 mx-2"
            style={{ backgroundColor: 'var(--border-main)' }}
          />

          <button
            onClick={handleRotate}
            className="control-btn p-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-input)',
            }}
            title="Rotate"
          >
            <RotateCw size={18} />
          </button>

          <button
            onClick={handleShare}
            className="control-btn p-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-input)',
            }}
            title="Share"
          >
            <Share2 size={18} />
          </button>

          <button
            onClick={handleDownload}
            className="control-btn p-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-input)',
            }}
            title="Download"
          >
            <Download size={18} />
          </button>

          <div
            className="w-px h-6 mx-2"
            style={{ backgroundColor: 'var(--border-main)' }}
          />

          <button
            onClick={() => navigate(-1)}
            className="control-btn p-2 rounded-lg transition-all"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Image Viewer */}
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="nav-btn absolute left-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-main)',
                color: 'var(--text-main)',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)';
                e.currentTarget.style.color = '#020617';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleNext}
              className="nav-btn absolute right-4 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-main)',
                color: 'var(--text-main)',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)';
                e.currentTarget.style.color = '#020617';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image Container */}
        <div className="max-w-full max-h-full flex items-center justify-center">
          <img
            src={images[currentIndex]}
            alt={`${currentIndex + 1}`}
            className="max-w-full max-h-[calc(100vh-200px)] object-contain rounded-xl shadow-2xl transition-all duration-300"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
            }}
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="%23ddd" width="400" height="400"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="24">Image not found</text></svg>';
            }}
          />
        </div>
      </div>

      {/* Mobile Bottom Controls */}
      <div
        className="md:hidden sticky bottom-0 p-4 backdrop-blur-xl border-t"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-main)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="flex items-center justify-around gap-2">
          <button
            onClick={handleZoomOut}
            className="mobile-control-btn p-3 rounded-xl flex-1"
            style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-input)',
            }}
          >
            <ZoomOut size={20} className="mx-auto" />
          </button>

          <button
            onClick={handleRotate}
            className="mobile-control-btn p-3 rounded-xl flex-1"
            style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-input)',
            }}
          >
            <RotateCw size={20} className="mx-auto" />
          </button>

          <button
            onClick={handleZoomIn}
            className="mobile-control-btn p-3 rounded-xl flex-1"
            style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-input)',
            }}
          >
            <ZoomIn size={20} className="mx-auto" />
          </button>

          <button
            onClick={handleDownload}
            className="mobile-control-btn p-3 rounded-xl flex-1"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
              color: '#020617',
            }}
          >
            <Download size={20} className="mx-auto" />
          </button>
        </div>
      </div>

      {/* Thumbnail Strip (Desktop) */}
      {images.length > 1 && (
        <div
          className="hidden md:block sticky bottom-0 p-4 backdrop-blur-xl border-t overflow-x-auto"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-main)',
          }}
        >
          <div className="flex gap-3 justify-center">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  resetTransforms();
                }}
                className="thumbnail flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all"
                style={{
                  border: index === currentIndex 
                    ? '2px solid var(--accent-secondary)' 
                    : '2px solid var(--border-main)',
                  opacity: index === currentIndex ? 1 : 0.6,
                  boxShadow: index === currentIndex ? 'var(--shadow-glow)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  if (index !== currentIndex) {
                    e.currentTarget.style.opacity = '0.6';
                  }
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .control-btn:hover,
        .mobile-control-btn:hover {
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%) !important;
          color: #020617 !important;
          transform: scale(1.05);
          border-color: transparent !important;
        }

        .control-btn:active,
        .mobile-control-btn:active {
          transform: scale(0.95);
        }

        .thumbnail {
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .nav-btn {
            width: 40px !important;
            height: 40px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageView;