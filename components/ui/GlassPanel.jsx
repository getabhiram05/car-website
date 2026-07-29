export default function GlassPanel({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        rounded-[30px]
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        shadow-[0_20px_60px_rgba(0,0,0,.4)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}