export function ItalyBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
      style={{
        backgroundImage: "url(/background-pattern.png)",
        backgroundRepeat: "repeat",
        backgroundSize: "768px 512px",
        opacity: 0.5,
      }}
    />
  );
}
