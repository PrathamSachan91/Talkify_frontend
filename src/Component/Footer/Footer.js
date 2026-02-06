const FooterMinimal = () => {
  return (
    <footer
      className="px-6 py-2 border-t backdrop-blur-xl flex items-center justify-center text-sm"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-divider)",
        color: "var(--text-muted)",
      }}
    >
      © {new Date().getFullYear()} Talkify. All rights reserved.
    </footer>
  );
};

export default FooterMinimal;
