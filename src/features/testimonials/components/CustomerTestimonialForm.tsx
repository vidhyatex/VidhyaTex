"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  LoadingButtonLabel,
} from "@/components/admin/AdminLoadingState";
import { fetchWithTimeout } from "@/lib/network/fetchWithTimeout";

type Kind = "text" | "video";

export function CustomerTestimonialForm() {
  const { toast } = useToast();
  const [kind, setKind] = useState<Kind>("text");
  const [customerName, setCustomerName] = useState("");
  const [location, setLocation] = useState("");
  const [quote, setQuote] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [rating, setRating] = useState(5);
  const [company, setCompany] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const saveDisabled = useMemo(
    () => isSaving || !customerName.trim(),
    [isSaving, customerName],
  );

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetchWithTimeout("/api/storefront/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          customerName: customerName.trim(),
          location: location.trim() || null,
          quote: quote.trim() || null,
          videoUrl: videoUrl.trim() || null,
          rating,
          company,
        }),
      });

      const body = (await res.json().catch(() => null)) as {
        message?: string;
        ok?: boolean;
      } | null;

      if (!res.ok) {
        throw new Error(body?.message || "Could not submit your review.");
      }

      setSubmitted(true);
      setCustomerName("");
      setLocation("");
      setQuote("");
      setVideoUrl("");
      setRating(5);
      setKind("text");
      toast({
        title: "Review submitted",
        description:
          body?.message ||
          "Thanks! It will appear on the site after we approve it.",
      });
    } catch (error) {
      toast({
        title: "Submit failed",
        description: error instanceof Error ? error.message : "Please retry",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand-gold/30 bg-card/80 p-6 text-sm leading-relaxed text-muted-foreground">
        <p className="font-semibold text-foreground">Thank you</p>
        <p className="mt-2">
          Your testimonial was received. Our team will review it before it
          appears on the testimonials page and homepage.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => setSubmitted(false)}
        >
          Share another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={kind === "text" ? "default" : "outline"}
          onClick={() => setKind("text")}
        >
          Written review
        </Button>
        <Button
          type="button"
          size="sm"
          variant={kind === "video" ? "default" : "outline"}
          onClick={() => setKind("video")}
        >
          Video review
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="testimonial-name">Your name</Label>
          <Input
            id="testimonial-name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Meenakshi"
            required
            maxLength={120}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="testimonial-location">City (optional)</Label>
          <Input
            id="testimonial-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Salem"
            maxLength={120}
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="testimonial-rating">Rating</Label>
        <select
          id="testimonial-rating"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} star{value === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </div>

      {kind === "text" ? (
        <div className="grid gap-1.5">
          <Label htmlFor="testimonial-quote">Your review</Label>
          <Textarea
            id="testimonial-quote"
            rows={4}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Tell others about your saree experience…"
            required
            maxLength={2000}
          />
        </div>
      ) : (
        <>
          <div className="grid gap-1.5">
            <Label htmlFor="testimonial-video">Video URL</Label>
            <Input
              id="testimonial-video"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/shorts/…"
              required
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              YouTube, Vimeo, or a direct MP4/WebM link.
            </p>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="testimonial-quote-video">
              Short note (optional)
            </Label>
            <Textarea
              id="testimonial-quote-video"
              rows={3}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="A line about your saree…"
              maxLength={2000}
            />
          </div>
        </>
      )}

      <div className="hidden" aria-hidden>
        <Label htmlFor="testimonial-company">Company</Label>
        <Input
          id="testimonial-company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={saveDisabled}>
        <LoadingButtonLabel
          isLoading={isSaving}
          loadingText="Submitting…"
          idleText="Submit for review"
        />
      </Button>
    </form>
  );
}
