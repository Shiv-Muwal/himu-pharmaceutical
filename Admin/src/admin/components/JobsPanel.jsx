import { useState } from "react";
import { Briefcase, Plus, Trash2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const EMPTY = {
  title: "",
  department: "General",
  location: "Chirawa, Rajasthan",
  type: "Full-time",
  summary: "",
  jd: "",
};

export function JobsPanel({ jobs, onAddJob, onUpdateJob, onRemoveJob }) {
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Vacancy name is required");
      return;
    }
    if (!form.jd.trim()) {
      setError("Job description (JD) is required");
      return;
    }
    if (editingId) {
      onUpdateJob(editingId, form);
    } else {
      onAddJob(form);
    }
    reset();
  };

  const startEdit = (job) => {
    setEditingId(job.id);
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      summary: job.summary,
      jd: job.jd,
    });
    setError("");
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border/20 p-5">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald" />
            <div>
              <h3 className="text-sm font-bold">
                {editingId ? "Edit vacancy" : "Add vacancy"}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Vacancy name + full JD — appears on the Jobs page.
              </p>
            </div>
          </div>
          {editingId ? (
            <button
              type="button"
              onClick={reset}
              className="rounded-xl bg-muted p-2 text-muted-foreground hover:bg-muted/80"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <CardContent className="space-y-4 p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Vacancy name *
                </label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g. Quality Assurance Manager"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Department
                </label>
                <Input
                  value={form.department}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, department: e.target.value }))
                  }
                  placeholder="R&D / Quality / Sales"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Location
                </label>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, location: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, type: e.target.value }))
                  }
                  className="h-11 w-full rounded-xl border border-border bg-background/50 px-3 text-sm"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Short summary
              </label>
              <Input
                value={form.summary}
                onChange={(e) =>
                  setForm((p) => ({ ...p, summary: e.target.value }))
                }
                placeholder="One-line card summary"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                Job description (JD) *
              </label>
              <Textarea
                value={form.jd}
                onChange={(e) => setForm((p) => ({ ...p, jd: e.target.value }))}
                rows={10}
                placeholder="Paste full JD here (responsibilities, requirements, benefits...)"
                className="min-h-[180px]"
              />
            </div>

            {error ? <p className="text-xs text-red-600">{error}</p> : null}

            <Button type="submit" className="gap-2">
              <Plus className="h-4 w-4" />
              {editingId ? "Update vacancy" : "Add vacancy"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm">
        <div className="border-b border-border/20 p-5">
          <h3 className="text-sm font-bold">Open vacancies ({jobs.length})</h3>
        </div>
        <CardContent className="space-y-3 p-5">
          {jobs.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border/50 p-6 text-center text-xs text-muted-foreground">
              No vacancies yet. Add the first one above.
            </p>
          ) : (
            jobs.map((job, i) => (
              <div
                key={job.id}
                className="flex gap-3 rounded-2xl border border-border/40 bg-white/70 p-3"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald/10 font-[family-name:var(--font-heading)] text-xs font-black text-emerald">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground">{job.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {job.department} · {job.location} · {job.type}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                    {job.summary}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(job)}
                    className="rounded-xl bg-emerald/10 p-2 text-emerald hover:bg-emerald/20"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveJob(job.id)}
                    className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
