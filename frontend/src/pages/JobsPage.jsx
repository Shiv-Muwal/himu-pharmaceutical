import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Clock,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import {
  FadeIn,
  SectionHeading,
} from "@/components/animations/motion-components";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { CareerApplicationForm } from "@/components/forms/contact-form";
import { getJobs } from "@/lib/jobs";

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
      <PageHero
        title="Jobs at HIMU"
        description="Grow with a team building trusted skincare and pharmaceutical care from Chirawa, Rajasthan."
        image="/jobs/jobs-hero.png"
        badge="Jobs"
      />

      <section className="relative overflow-hidden section-padding">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#eef7f1_0%,_transparent_55%),linear-gradient(180deg,#fbf9f3_0%,#f3f7f2_100%)]" />
        <div className="container-custom relative">
          <SectionHeading
            badge="Open roles"
            title="Current vacancies"
            description="Browse openings in serial — tap a card for the full JD, or Apply now."
          />

          <div className="mx-auto max-w-3xl space-y-4">
            {jobs.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-[#cfe0d6] bg-white/70 px-6 py-16 text-center">
                <Briefcase className="mx-auto mb-3 h-10 w-10 text-[#8aa394]" />
                <p className="font-bold text-[#1f3b2c]">No open vacancies right now</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Check back soon — new roles are posted regularly.
                </p>
              </div>
            ) : (
              jobs.map((job, i) => (
                <FadeIn key={job.id} delay={i * 0.06}>
                  <article
                    role="button"
                    tabIndex={0}
                    onClick={() => openJob(job, false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openJob(job, false);
                      }
                    }}
                    className="group grid cursor-pointer overflow-hidden rounded-[1.75rem] border border-[#dce8e0] bg-white/90 shadow-[0_12px_40px_rgba(26,46,31,0.06)] transition hover:-translate-y-0.5 hover:border-[#6fa987]/50 hover:shadow-[0_18px_50px_rgba(61,122,90,0.12)] sm:grid-cols-[140px_1fr]"
                  >
                    <div className="relative min-h-[140px] overflow-hidden sm:min-h-full">
                      <Image
                        src={job.image}
                        alt=""
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#14532D]/45 to-transparent sm:bg-gradient-to-r" />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black text-[#14532D]">
                        #{String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex flex-col justify-between gap-4 p-5 sm:p-6">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#e7f3ec] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#3d7a5a]">
                            {job.department}
                          </span>
                          <span className="rounded-full bg-[#f8f3e6] px-2.5 py-1 text-[10px] font-bold text-[#8a6a20]">
                            {job.type}
                          </span>
                        </div>
                        <h3 className="font-[family-name:var(--font-heading)] text-xl font-black text-[#1f3b2c] transition group-hover:text-[#14532D]">
                          {job.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#6f8679]">
                          {job.summary}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-semibold text-[#7a9586]">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            View full JD
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openJob(job, true);
                          }}
                          className="h-10 rounded-2xl px-5 text-xs font-bold"
                        >
                          Apply now
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                        <span className="text-[11px] font-medium text-[#8aa394]">
                          or tap card for details
                        </span>
                      </div>
                    </div>
                  </article>
                </FadeIn>
              ))
            )}
          </div>
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
              className="absolute inset-0 bg-[#1a2e1f]/45 backdrop-blur-[6px]"
              onClick={closeJob}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.75rem] border border-[#dce8e0] bg-gradient-to-br from-[#f8fbf8] via-white to-[#fbf9f3] shadow-[0_30px_80px_rgba(26,46,31,0.22)] sm:rounded-[1.75rem]"
            >
              <div className="relative h-40 shrink-0 sm:h-48">
                <Image
                  src={selected.image}
                  alt=""
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14532D] via-[#14532D]/55 to-transparent" />
                <button
                  type="button"
                  onClick={closeJob}
                  className="absolute right-3 top-3 rounded-xl bg-white/90 p-2 text-[#1f3b2c] shadow-sm"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-4 left-5 right-5">
                  <p className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#BBF7D0]">
                    <Sparkles className="h-3.5 w-3.5" />
                    {selected.department} · {selected.type}
                  </p>
                  <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-white sm:text-3xl">
                    {selected.title}
                  </h2>
                  <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
                    <MapPin className="h-3.5 w-3.5" />
                    {selected.location}
                  </p>
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
                              className="pt-2 font-[family-name:var(--font-heading)] text-sm font-black uppercase tracking-wide text-[#14532D]"
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
                      className="h-11 w-full rounded-2xl text-sm font-bold sm:w-auto sm:min-w-[200px]"
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
