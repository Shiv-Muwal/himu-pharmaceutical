import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { CheckCircle, Send } from "lucide-react";
import { api } from "@/lib/api";
import { LocationFields } from "@/components/forms/location-fields";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const fieldClass =
  "h-12 rounded-2xl border-[#dce8e0] bg-[#f8fbf8] px-4 text-sm shadow-none focus-visible:ring-emerald/30";

const locationSelectClass =
  "h-12 w-full rounded-2xl border border-[#dce8e0] bg-[#f8fbf8] px-4 text-sm outline-none focus:ring-2 focus:ring-emerald/25";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      inquiryType: "",
      country: "India",
      state: "",
      city: "",
    },
  });

  const country = watch("country");
  const state = watch("state");
  const city = watch("city");

  const onSubmit = async (values) => {
    try {
      await api("/contact", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          department: values.inquiryType,
          address: [values.city, values.state, values.country]
            .filter(Boolean)
            .join(", "),
        }),
      });
      setSubmitted(true);
    } catch (error) {
      alert(error.message || "Unable to send your message. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-[1.5rem] border border-emerald/20 bg-[#eef7f1] px-6 py-14 text-center">
        <CheckCircle className="mx-auto mb-4 h-14 w-14 text-emerald" />
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-foreground">
          Message sent successfully
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Thank you for contacting HIMU Pharmacy. Our team will respond within
          24–48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-emerald/80">
            Full name *
          </label>
          <Input placeholder="Your full name" className={fieldClass} {...register("name")} />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-emerald/80">
            Email *
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            className={fieldClass}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-emerald/80">
            Phone
          </label>
          <Input
            placeholder="+91 XXXXX XXXXX"
            className={fieldClass}
            {...register("phone")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-emerald/80">
            Inquiry type *
          </label>
          <select
            {...register("inquiryType")}
            className={`w-full ${fieldClass} border border-[#dce8e0]`}
          >
            <option value="">Select inquiry type</option>
            <option value="general">General inquiry</option>
            <option value="orders">Orders & delivery</option>
            <option value="products">Product information</option>
            <option value="partnership">Partnership</option>
            <option value="support">Customer support</option>
          </select>
          {errors.inquiryType && (
            <p className="mt-1.5 text-xs text-red-600">{errors.inquiryType.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-emerald/80">
          Location *
        </label>
        <LocationFields
          country={country || ""}
          state={state || ""}
          city={city || ""}
          selectClassName={locationSelectClass}
          errors={{
            country: errors.country?.message,
            state: errors.state?.message,
            city: errors.city?.message,
          }}
          onCountryChange={(value) => {
            setValue("country", value, { shouldValidate: true });
            setValue("state", "", { shouldValidate: true });
            setValue("city", "", { shouldValidate: true });
          }}
          onStateChange={(value) => {
            setValue("state", value, { shouldValidate: true });
            setValue("city", "", { shouldValidate: true });
          }}
          onCityChange={(value) => {
            setValue("city", value, { shouldValidate: true });
          }}
        />
        <input type="hidden" {...register("country")} />
        <input type="hidden" {...register("state")} />
        <input type="hidden" {...register("city")} />
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-emerald/80">
          Subject *
        </label>
        <Input
          placeholder="How can we help?"
          className={fieldClass}
          {...register("subject")}
        />
        {errors.subject && (
          <p className="mt-1.5 text-xs text-red-600">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-emerald/80">
          Message *
        </label>
        <Textarea
          placeholder="Write your message here..."
          rows={6}
          className="min-h-[140px] rounded-2xl border-[#dce8e0] bg-[#f8fbf8] px-4 py-3 text-sm"
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full gap-2 rounded-2xl text-sm font-bold shadow-[0_10px_24px_rgba(20,83,45,0.18)] md:w-auto md:min-w-[200px]"
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? "Sending..." : "Send message"}
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

export function CareerApplicationForm({ positions, defaultPosition = "" }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(careerSchema),
    defaultValues: {
      position: defaultPosition || "",
    },
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
      <div className="py-8 text-center">
        <CheckCircle className="mx-auto mb-3 h-12 w-12 text-emerald" />
        <h3 className="mb-1 font-bold">Application Submitted</h3>
        <p className="text-sm text-muted-foreground">
          Our HR team will review your application and contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Input placeholder="Full Name *" {...register("name")} />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Input type="email" placeholder="Email *" {...register("email")} />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div>
        <Input placeholder="Phone *" {...register("phone")} />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
        )}
      </div>
      <select
        {...register("position")}
        className="h-11 w-full rounded-xl border border-border bg-background/50 px-4 text-sm"
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
        className="h-11 w-full rounded-xl border border-border bg-background/50 px-4 text-sm"
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
