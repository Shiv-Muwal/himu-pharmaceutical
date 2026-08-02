import { motion } from "framer-motion";

/** Pure CSS/Framer 3D scene — no heavy WebGL dependency. */
export function LoginScene3D() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      style={{ perspective: "1200px" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(16,185,129,0.22),transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(214, 176, 77,0.18),transparent_45%),linear-gradient(160deg,#1e2422_0%,#0b6a46_45%,#062418_100%)]" />

      {/* Floating grid floor */}
      <div
        className="absolute bottom-[-10%] left-1/2 h-[55%] w-[140%] -translate-x-1/2 opacity-40"
        style={{
          transform: "rotateX(68deg) translateZ(-80px)",
          backgroundImage:
            "linear-gradient(rgba(214, 176, 77,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(214, 176, 77,0.18) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to top, black, transparent)",
        }}
      />

      {/* Orbit ring */}
      <motion.div
        className="absolute left-1/2 top-[42%] h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/25 sm:h-[420px] sm:w-[420px]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_24px_rgba(214, 176, 77,0.8)]" />
        <span className="absolute -right-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.7)]" />
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-[42%] h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/20 sm:h-[280px] sm:w-[280px]"
        animate={{ rotateZ: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* Central glowing orb */}
      <motion.div
        className="absolute left-1/2 top-[40%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 sm:h-36 sm:w-36"
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          rotateY: [0, 360],
          y: [0, -12, 0],
        }}
        transition={{
          rotateY: { duration: 12, repeat: Infinity, ease: "linear" },
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300/70 via-[#0b6a46] to-[#1e2422] shadow-[0_0_80px_rgba(16,185,129,0.45)]" />
        <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-gold/40 via-transparent to-white/10" />
        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/80 blur-[1px] shadow-[0_0_30px_rgba(214, 176, 77,0.9)]" />
      </motion.div>

      {/* Floating capsules */}
      {[
        { x: "12%", y: "22%", delay: 0, rot: 35, color: "from-emerald-400 to-teal-700" },
        { x: "78%", y: "18%", delay: 0.4, rot: -25, color: "from-gold to-amber-700" },
        { x: "18%", y: "68%", delay: 0.8, rot: 15, color: "from-teal-300 to-emerald-800" },
        { x: "82%", y: "62%", delay: 1.1, rot: -40, color: "from-[#d6b04d] to-emerald-700" },
        { x: "8%", y: "45%", delay: 0.2, rot: 55, color: "from-white/80 to-emerald-500" },
        { x: "88%", y: "40%", delay: 0.6, rot: -10, color: "from-emerald-200 to-[#0b6a46]" },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: item.x, top: item.y, transformStyle: "preserve-3d" }}
          animate={{
            y: [0, -18, 0],
            rotateZ: [item.rot, item.rot + 12, item.rot],
            rotateY: [0, 180, 360],
          }}
          transition={{
            duration: 5 + i * 0.35,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className={`h-14 w-5 rounded-full bg-gradient-to-b ${item.color} shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:h-16 sm:w-6`}
            style={{ transform: "rotateX(18deg)" }}
          >
            <div className="h-1/2 rounded-t-full bg-white/25" />
          </div>
        </motion.div>
      ))}

      {/* Soft particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={`p-${i}`}
          className="absolute h-1 w-1 rounded-full bg-gold/70"
          style={{
            left: `${8 + ((i * 17) % 84)}%`,
            top: `${12 + ((i * 23) % 70)}%`,
          }}
          animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.8, 1.4, 0.8] }}
          transition={{
            duration: 3 + (i % 5),
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#1e2422]/70" />
    </div>
  );
}
