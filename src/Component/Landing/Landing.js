import { MessageCircle, Users, Zap, Shield, ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div
      className="pt-[120px] flex-1 h-full p-6 flex flex-col justify-center items-center text-center relative overflow-auto"
      style={{
        background: "linear-gradient(to bottom, var(--bg-gradient-mid), var(--bg-gradient-end))",
        color: "var(--text-main)",
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{
            backgroundColor: "var(--accent-primary)",
            top: "10%",
            right: "10%",
            animationDuration: "5s",
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{
            backgroundColor: "var(--accent-secondary)",
            bottom: "10%",
            left: "10%",
            animationDuration: "7s",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="pt-[120px] relative z-10 max-w-2xl animate-fadeInUp">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl animate-float"
            style={{
              backgroundColor: "var(--accent-primary)",
            }}
          >
            <MessageCircle className="w-12 h-12 text-black" strokeWidth={2.5} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
          Welcome to Talkify 🌿
        </h2>

        {/* Subtitle */}
        <p className="text-lg max-w-md mx-auto mb-8 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Select a user from the sidebar to start a real-time conversation.
          Messages are secure, fast, and seamless.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Feature 1 */}
          <div
            className="p-5 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-main)",
            }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
              style={{
                backgroundColor: "rgba(20, 184, 166, 0.2)",
              }}
            >
              <Zap className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
            </div>
            <h3 className="font-semibold mb-1" style={{ color: "var(--text-main)" }}>
              Real-time
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Instant message delivery
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className="p-5 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-main)",
            }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
              style={{
                backgroundColor: "rgba(139, 92, 246, 0.2)",
              }}
            >
              <Shield className="w-6 h-6" style={{ color: "var(--accent-secondary)" }} />
            </div>
            <h3 className="font-semibold mb-1" style={{ color: "var(--text-main)" }}>
              Secure
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              End-to-end encryption
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className="p-5 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-main)",
            }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
              style={{
                backgroundColor: "rgba(20, 184, 166, 0.2)",
              }}
            >
              <Users className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
            </div>
            <h3 className="font-semibold mb-1" style={{ color: "var(--text-main)" }}>
              Group Chat
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Connect with multiple users
            </p>
          </div>
        </div>

        {/* CTA Card */}
        <div
          className="mt-8 px-8 py-6 rounded-2xl border shadow-xl animate-pulse-subtle"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-main)",
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <MessageCircle className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
            <span className="text-lg font-semibold" style={{ color: "var(--accent-primary)" }}>
              Get Started
            </span>
          </div>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Your chats will appear here
          </p>
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
            <span>Select a conversation</span>
            <ArrowRight className="w-4 h-4 animate-bounce-horizontal" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "var(--accent-primary)" }}>
              ⚡
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Instant Sync
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "var(--accent-secondary)" }}>
              🔒
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Private & Safe
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: "var(--accent-primary)" }}>
              🌐
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Always Online
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes bounceHorizontal {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(5px);
          }
        }
        @keyframes pulseSubtle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.02);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-bounce-horizontal {
          animation: bounceHorizontal 1.5s ease-in-out infinite;
        }
        .animate-pulse-subtle {
          animation: pulseSubtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;