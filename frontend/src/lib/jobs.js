const JOBS_KEY = "himu-jobs";

export const JOB_IMAGE_PRESETS = [
  { id: "research", label: "Research", src: "/jobs/jobs-card-research.png" },
  { id: "quality", label: "Quality", src: "/jobs/jobs-card-quality.png" },
  { id: "manufacturing", label: "Manufacturing", src: "/jobs/jobs-card-manufacturing.png" },
  { id: "sales", label: "Sales", src: "/jobs/jobs-card-sales.png" },
];

export const DEFAULT_JOBS = [
  {
    id: "job-01",
    title: "Senior Research Scientist",
    department: "R&D",
    location: "Chirawa, Rajasthan",
    type: "Full-time",
    image: "/jobs/jobs-card-research.png",
    summary:
      "Lead formulation development for novel dermatology and wellness products.",
    jd: `Role Overview
Lead formulation development projects for novel drug delivery systems in dermatology and wellness at HIMU Pharmaceutical.

Key Responsibilities
• Design and optimize topical and skincare formulations
• Plan lab trials, stability studies, and scale-up support
• Collaborate with Quality, Manufacturing, and Regulatory teams
• Document protocols, batch records, and technical reports
• Mentor junior scientists and interns

Requirements
• M.Pharm / M.Sc Chemistry or related field
• 4+ years in formulation R&D (dermatology preferred)
• Strong documentation and cross-functional communication skills

What We Offer
Competitive pay, learning support, and a collaborative science-first culture.`,
    createdAt: "2026-01-10T10:00:00.000Z",
  },
  {
    id: "job-02",
    title: "Quality Assurance Manager",
    department: "Quality",
    location: "Chirawa, Rajasthan",
    type: "Full-time",
    image: "/jobs/jobs-card-quality.png",
    summary:
      "Own GMP compliance, batch release readiness, and audit preparedness.",
    jd: `Role Overview
Oversee quality systems across HIMU Pharmaceutical operations with a focus on patient safety and regulatory excellence.

Key Responsibilities
• Maintain GMP / quality management systems
• Review batch documentation and release readiness
• Lead internal audits and external inspection readiness
• Investigate deviations, CAPA, and change controls
• Train teams on quality culture and SOPs

Requirements
• B.Pharm / M.Pharm with 5+ years QA experience
• Hands-on experience with audits and documentation control
• Strong attention to detail and leadership skills

What We Offer
Clear ownership, growth path, and a quality-first workplace.`,
    createdAt: "2026-01-12T10:00:00.000Z",
  },
  {
    id: "job-03",
    title: "Production Supervisor",
    department: "Manufacturing",
    location: "Chirawa, Rajasthan",
    type: "Full-time",
    image: "/jobs/jobs-card-manufacturing.png",
    summary:
      "Supervise production lines for efficiency, safety, and consistent quality.",
    jd: `Role Overview
Manage day-to-day manufacturing operations and keep output aligned with quality and safety standards.

Key Responsibilities
• Supervise production schedules and line performance
• Ensure SOP adherence and workplace safety
• Coordinate with QA, warehouse, and planning teams
• Track yield, downtime, and continuous improvement
• Coach operators and maintain shift discipline

Requirements
• Diploma / B.Pharm / B.Tech with 3+ years production experience
• Experience in pharma or personal-care manufacturing preferred
• Strong people management and problem-solving skills

What We Offer
Hands-on leadership role with visible impact on product delivery.`,
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "job-04",
    title: "Medical Representative",
    department: "Sales",
    location: "Multiple Locations",
    type: "Full-time",
    image: "/jobs/jobs-card-sales.png",
    summary:
      "Build relationships with healthcare professionals and grow HIMU’s portfolio.",
    jd: `Role Overview
Promote HIMU Pharmaceutical products to doctors, clinics, and pharmacies in your territory.

Key Responsibilities
• Plan daily doctor / retailer coverage
• Present product benefits with scientific clarity
• Achieve monthly sales and coverage targets
• Gather market feedback and competitor insights
• Maintain CRM updates and call reports

Requirements
• Graduate (B.Sc / B.Pharm preferred)
• 1+ year MR experience preferred (freshers with strong communication welcome)
• Willingness to travel within assigned territory

What We Offer
Attractive incentives, field support, and career growth into area management.`,
    createdAt: "2026-01-18T10:00:00.000Z",
  },
];

function normalizeJob(job) {
  if (!job || typeof job !== "object") return null;
  const title = String(job.title || "").trim();
  const jd = String(job.jd || job.description || "").trim();
  if (!title || !jd) return null;
  return {
    id: String(job.id || `job_${Date.now()}`),
    title,
    department: String(job.department || "General").trim() || "General",
    location: String(job.location || "Chirawa, Rajasthan").trim(),
    type: String(job.type || "Full-time").trim() || "Full-time",
    image:
      String(job.image || "").trim() ||
      JOB_IMAGE_PRESETS[0].src,
    summary:
      String(job.summary || "").trim() ||
      jd.split("\n").find((l) => l.trim())?.slice(0, 140) ||
      title,
    jd,
    createdAt: job.createdAt || new Date().toISOString(),
  };
}

export function getJobs() {
  if (typeof window === "undefined") return [...DEFAULT_JOBS];
  try {
    const raw = localStorage.getItem(JOBS_KEY);
    if (!raw) {
      localStorage.setItem(JOBS_KEY, JSON.stringify(DEFAULT_JOBS));
      return [...DEFAULT_JOBS];
    }
    const list = JSON.parse(raw);
    if (!Array.isArray(list) || !list.length) {
      localStorage.setItem(JOBS_KEY, JSON.stringify(DEFAULT_JOBS));
      return [...DEFAULT_JOBS];
    }
    return list.map(normalizeJob).filter(Boolean);
  } catch {
    return [...DEFAULT_JOBS];
  }
}

export function saveJobs(list) {
  const cleaned = (list || []).map(normalizeJob).filter(Boolean);
  localStorage.setItem(JOBS_KEY, JSON.stringify(cleaned));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("himu-jobs-updated"));
  }
  return cleaned;
}

export function addJob(payload) {
  const next = normalizeJob({
    ...payload,
    id: `job_${Date.now()}`,
    createdAt: new Date().toISOString(),
  });
  if (!next) return getJobs();
  return saveJobs([next, ...getJobs()]);
}

export function updateJob(id, payload) {
  const current = getJobs();
  const next = current.map((job) =>
    job.id === id
      ? normalizeJob({ ...job, ...payload, id: job.id, createdAt: job.createdAt })
      : job,
  );
  return saveJobs(next);
}

export function removeJob(id) {
  return saveJobs(getJobs().filter((job) => job.id !== id));
}
