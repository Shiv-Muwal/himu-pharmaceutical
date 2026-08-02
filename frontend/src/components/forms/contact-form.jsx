import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  department: z.string().min(1, "Please select a department"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values) => {
    try {
      await api("/contact", { method: "POST", body: JSON.stringify(values) });
      setSubmitted(true);
    } catch (error) {
      alert(error.message || "Unable to send your message. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-ink-accent mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Message Sent Successfully</h3>
        <p className="text-muted-foreground">
          Thank you for contacting HIMU Pharmacy. We will respond within 24-48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Input placeholder="Full Name *" {...register("name")} />
          {errors.name && <p className="text-ink-accent text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Input type="email" placeholder="Email Address *" {...register("email")} />
          {errors.email && <p className="text-ink-accent text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input placeholder="Phone Number" {...register("phone")} />
        <select
          {...register("department")}
          className="h-11 rounded-xl border border-border bg-background/50 px-4 text-sm"
        >
          <option value="">Select Department *</option>
          <option value="general">General Inquiry</option>
          <option value="sales">Sales &amp; Distribution</option>
          <option value="research">Research &amp; Development</option>
          <option value="quality">Quality Assurance</option>
          <option value="hr">Human Resources</option>
          <option value="regulatory">Regulatory Affairs</option>
        </select>
      </div>
      {errors.department && (
        <p className="text-ink-accent text-xs">{errors.department.message}</p>
      )}
      <div>
        <Input placeholder="Subject *" {...register("subject")} />
        {errors.subject && <p className="text-ink-accent text-xs mt-1">{errors.subject.message}</p>}
      </div>
      <div>
        <Textarea placeholder="Your Message *" rows={5} {...register("message")} />
        {errors.message && <p className="text-ink-accent text-xs mt-1">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

const careerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  position: z.string().min(1),
  experience: z.string().min(1),
  message: z.string().optional(),
});

export function CareerApplicationForm({ positions }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(careerSchema),
  });

  const onSubmit = async (values) => {
    try {
      await api("/careers/apply", { method: "POST", body: JSON.stringify(values) });
      setSubmitted(true);
    } catch (error) {
      alert(error.message || "Unable to submit your application. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-ink-accent mx-auto mb-3" />
        <h3 className="font-bold mb-1">Application Submitted</h3>
        <p className="text-sm text-muted-foreground">
          Our HR team will review your application and contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Input placeholder="Full Name *" {...register("name")} />
          {errors.name && <p className="text-ink-accent text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Input type="email" placeholder="Email *" {...register("email")} />
          {errors.email && <p className="text-ink-accent text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>
      <div>
        <Input placeholder="Phone *" {...register("phone")} />
        {errors.phone && <p className="text-ink-accent text-xs mt-1">{errors.phone.message}</p>}
      </div>
      <select
        {...register("position")}
        className="w-full h-11 rounded-xl border border-border bg-background/50 px-4 text-sm"
      >
        <option value="">Select Position *</option>
        {positions.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <select
        {...register("experience")}
        className="w-full h-11 rounded-xl border border-border bg-background/50 px-4 text-sm"
      >
        <option value="">Years of Experience *</option>
        <option value="0-1">0-1 years</option>
        <option value="1-3">1-3 years</option>
        <option value="3-5">3-5 years</option>
        <option value="5-10">5-10 years</option>
        <option value="10+">10+ years</option>
      </select>
      <Textarea placeholder="Cover Letter (Optional)" {...register("message")} />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
