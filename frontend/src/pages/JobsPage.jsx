import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  X,
  ArrowRight,
  Building2,
} from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { FadeIn } from "@/components/animations/motion-components";
import { Button } from "@/components/ui/button";
import { CareerApplicationForm } from "@/components/forms/contact-form";
import { getJobs } from "@/lib/jobs";
import { generateJobPostingSchemas } from "@/lib/seo";
import { SeoJsonLd } from "@/components/seo/seo-json-ld";

function formatJd(jd = "") {
  return String(jd)
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line, i, arr) => line || (arr[i - 1] && arr[i - 1].trim()));
}

export default function JobsPage() {
  const [jobs, setJobs] = useState(() => getJobs());
  const [selected, setSelected] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const refresh = () => setJobs(getJobs());
    window.addEventListener("storage", refresh);
    window.addEventListener("himu-jobs-updated", refresh);
    refresh();
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("himu-jobs-updated", refresh);
    };
  }, []);

  useEffect(() => {
    if (!selected) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selected]);

  const openJob = (job, apply = false) => {
    setSelected(job);
    setShowApply(apply);
  };

  const closeJob = () => {
    setSelected(null);
    setShowApply(false);
  };

  return (
    <>
      <SeoJsonLd id="jobs" data={generateJobPostingSchemas(jobs)} />
      <PageHero
        title="Jobs at HIMU"
        description="Build trusted care with a team rooted in Chirawa — open roles, clear JDs, direct apply."
        image="/jobs/jobs-hero.png"
        badge="Jobs"
      />

      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Atmospheric field — not a flat wash */}
        <div className="pointer-events-none absolute inset-0 bg-[#f4f8f4]" />
        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#cfe8d6]/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-[#efe3b8]/40 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(20,83,45,0.12) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="container-custom relative">
          <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-end">
            <FadeIn>
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#3d7a5a]">
                Open vacancies
              </p>
              <h2 className="max-w-md font-[family-name:var(--font-heading)] text-4xl font-black leading-[1.05] text-[#14532D] md:text-5xl">
                Roles worth
                <span className="mt-1 block text-[#6fa987]">showing up for.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="flex flex-col gap-4 border-l-2 border-[#6fa987]/40 pl-5 sm:flex-row sm:items-center sm:justify-between lg:pl-8">
                <p className="max-w-sm text-sm leading-relaxed text-[#5f7468]">
                  Tap any role for the full JD. Prefer speed? Hit Apply now and
                  send your profile in one step.
                </p>
                <div className="inline-flex shrink-0 items-center gap-3 rounded-2xl bg-[#14532D] px-4 py-3 text-white shadow-[0_12px_30px_rgba(20,83,45,0.25)]">
                  <Briefcase className="h-4 w-4 text-[#BBF7D0]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#BBF7D0]/90">
                      Live openings
                    </p>
                    <p className="font-[family-name:var(--font-heading)] text-xl font-black leading-none">
                      {jobs.length}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {jobs.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#b9d4c4] bg-white/60 px-6 py-20 text-center">
              <Briefcase className="mx-auto mb-3 h-10 w-10 text-[#8aa394]" />
              <p className="font-bold text-[#1f3b2c]">No open vacancies right now</p>
              <p className="mt-1 text-sm text-muted-foreground">
                New roles land here first — check back soon.
              </p>
            </div>
          ) : (
            <div className="relative mx-auto max-w-3xl">
              {/* Spine */}
              <div className="absolute bottom-6 left-[1.65rem] top-6 hidden w-px bg-gradient-to-b from-[#6fa987] via-[#cfe0d6] to-transparent sm:block" />

              <ol className="space-y-5">
                {jobs.map((job, i) => {
                  const active = hoveredId === job.id || selected?.id === job.id;
                  return (
                    <FadeIn key={job.id} delay={i * 0.05}>
                      <li>
                        <motion.article
                          role="button"
                          tabIndex={0}
                          onMouseEnter={() => setHoveredId(job.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onClick={() => openJob(job, false)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openJob(job, false);
                            }
                          }}
                          whileHover={{ x: 4 }}
                          transition={{ type: "spring", stiffness: 380, damping: 28 }}
                          className={`group relative cursor-pointer overflow-hidden rounded-[1.5rem] border bg-white/80 backdrop-blur-sm transition ${
                            active
                              ? "border-[#6fa987] shadow-[0_20px_50px_rgba(61,122,90,0.14)]"
                              : "border-[#d8e6dd] shadow-[0_8px_28px_rgba(26,46,31,0.05)]"
                          }`}
                        >
                          <div
                            className={`absolute inset-y-0 left-0 w-1.5 transition ${
                              active ? "bg-[#14532D]" : "bg-[#cfe8d6]"
                            }`}
                          />

                          <div className="flex gap-4 p-5 pl-5 sm:gap-6 sm:p-6 sm:pl-6">
                            <div className="relative z-10 hidden shrink-0 sm:block">
                              <motion.div
                                animate={{
                                  scale: active ? 1.06 : 1,
                                  backgroundColor: active ? "#14532D" : "#eef7f1",
                                  color: active ? "#f8fbf8" : "#14532D",
                                }}
                                className="flex h-12 w-12 items-center justify-center rounded-2xl font-[family-name:var(--font-heading)] text-sm font-black shadow-sm"
                              >
                                {String(i + 1).padStart(2, "0")}
                              </motion.div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="sm:hidden rounded-lg bg-[#eef7f1] px-2 py-0.5 text-[10px] font-black text-[#14532D]">
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#3d7a5a]">
                                  <Building2 className="h-3 w-3" />
                                  {job.department}
                                </span>
                                <span className="text-[#c5d5cb]">·</span>
                                <span className="text-[10px] font-bold uppercase tracking-wide text-[#8a6a20]">
                                  {job.type}
                                </span>
                              </div>

                              <h3 className="font-[family-name:var(--font-heading)] text-xl font-black tracking-tight text-[#143528] transition group-hover:text-[#14532D] md:text-2xl">
                                {job.title}
                              </h3>

                              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#61756a]">
                                {job.summary}
                              </p>

                              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#e8f0eb] pt-4">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#7a9586]">
                                  <MapPin className="h-3.5 w-3.5 text-[#6fa987]" />
                                  {job.location}
                                </span>

                                <div className="flex items-center gap-2">
                                  <span className="hidden text-[11px] font-medium text-[#8aa394] sm:inline">
                                    View JD
                                  </span>
                                  <Button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openJob(job, true);
                                    }}
                                    className="h-10 rounded-xl bg-[#14532D] px-4 text-xs font-bold text-white hover:bg-[#0f3f22]"
                                  >
                                    Apply now
                                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      </li>
                    </FadeIn>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selected ? (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
            <motion.button
              type="button"
              aria-label="Close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0f2418]/50 backdrop-blur-[7px]"
              onClick={closeJob}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 28 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.75rem] border border-[#dce8e0] bg-[#f8fbf8] shadow-[0_30px_80px_rgba(15,36,24,0.28)] sm:rounded-[1.75rem]"
            >
              <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#14532D] via-[#166534] to-[#1a5c38] px-5 pb-6 pt-5 sm:px-7 sm:pt-6">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#BBF7D0]/15 blur-2xl" />
                <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-48 rounded-full bg-[#d6b04d]/15 blur-2xl" />

                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#BBF7D0]">
                      {selected.department} · {selected.type}
                    </p>
                    <h2 className="max-w-lg font-[family-name:var(--font-heading)] text-2xl font-black leading-tight text-white sm:text-3xl">
                      {selected.title}
                    </h2>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-white/75">
                      <MapPin className="h-3.5 w-3.5" />
                      {selected.location}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeJob}
                    className="rounded-xl bg-white/15 p-2 text-white backdrop-blur-sm transition hover:bg-white/25"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
                {!showApply ? (
                  <>
                    <div className="space-y-3">
                      {formatJd(selected.jd).map((line, idx) => {
                        if (!line.trim()) return <div key={idx} className="h-2" />;
                        const isHeading =
                          !line.startsWith("•") &&
                          !line.startsWith("-") &&
                          line.length < 48 &&
                          !line.endsWith(".");
                        if (isHeading) {
                          return (
                            <h3
                              key={idx}
                              className="pt-2 font-[family-name:var(--font-heading)] text-xs font-black uppercase tracking-[0.14em] text-[#14532D]"
                            >
                              {line}
                            </h3>
                          );
                        }
                        return (
                          <p
                            key={idx}
                            className="text-sm leading-relaxed text-[#4d6658]"
                          >
                            {line}
                          </p>
                        );
                      })}
                    </div>
                    <Button
                      type="button"
                      onClick={() => setShowApply(true)}
                      className="h-11 w-full rounded-2xl bg-[#14532D] text-sm font-bold text-white hover:bg-[#0f3f22] sm:w-auto sm:min-w-[200px]"
                    >
                      Apply now
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowApply(false)}
                      className="mb-4 text-xs font-bold text-[#3d7a5a] hover:underline"
                    >
                      ← Back to job description
                    </button>
                    <h3 className="mb-4 font-[family-name:var(--font-heading)] text-lg font-black text-[#1f3b2c]">
                      Apply for {selected.title}
                    </h3>
                    <CareerApplicationForm
                      positions={[selected.title]}
                      defaultPosition={selected.title}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
