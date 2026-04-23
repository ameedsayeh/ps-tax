export function AmbientBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Primary blob — top center */}
      <div
        className="absolute left-1/2 top-[-20%] h-[1400px] w-[900px] -translate-x-1/2 rounded-full animate-float-slow"
        style={{
          background:
            "radial-gradient(closest-side, rgba(94,106,210,0.28), rgba(94,106,210,0) 70%)",
          filter: "blur(150px)",
        }}
      />
      {/* Secondary blob — left */}
      <div
        className="absolute left-[-10%] top-[30%] h-[800px] w-[600px] rounded-full animate-float-slower"
        style={{
          background:
            "radial-gradient(closest-side, rgba(167,139,250,0.18), rgba(167,139,250,0) 70%)",
          filter: "blur(120px)",
        }}
      />
      {/* Tertiary blob — right */}
      <div
        className="absolute right-[-5%] top-[50%] h-[700px] w-[500px] rounded-full animate-float-slow"
        style={{
          background:
            "radial-gradient(closest-side, rgba(59,130,246,0.14), rgba(59,130,246,0) 70%)",
          filter: "blur(100px)",
        }}
      />
      {/* Bottom accent — pulsing */}
      <div
        className="absolute bottom-[-10%] left-1/2 h-[700px] w-[1100px] -translate-x-1/2 rounded-full animate-float-pulse"
        style={{
          background:
            "radial-gradient(closest-side, rgba(94,106,210,0.14), rgba(94,106,210,0) 70%)",
          filter: "blur(130px)",
        }}
      />
    </div>
  );
}
