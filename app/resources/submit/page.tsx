"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  Heading,
  Text,
  Label,
  Input,
  Textarea,
  Button,
  Card,
  Container,
} from "../../components/ui";

interface SubmitFormData {
  title: string;
  link: string;
  description: string;
}

interface SubmitFormErrors {
  title?: string;
  link?: string;
  description?: string;
}

const initialFormData: SubmitFormData = { title: "", link: "", description: "" };

export default function SubmitResourcePage() {
  const [formData, setFormData] = useState<SubmitFormData>(initialFormData);
  const [errors, setErrors] = useState<SubmitFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const validate = () => {
    const newErrors: SubmitFormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.link.trim()) {
      newErrors.link = "Link is required";
    } else {
      try {
        new URL(formData.link.trim());
      } catch {
        newErrors.link = "Enter a valid URL";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof SubmitFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/resources/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          link: formData.link.trim(),
          description: formData.description.trim(),
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData(initialFormData);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Resource submission failed", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] relative overflow-x-hidden">
      <Header />
      <main className="py-12 sm:py-16">
        <Container size="md" animate>
          <div className="mb-10 text-center space-y-4">
            <Heading level="h1" animate={false}>
              Submit a Resource
            </Heading>
            <Text size="lg" variant="secondary">
              Know a great tool, guide, or link for ASU students? Share it with the community.
            </Text>
          </div>

          {submitStatus === "success" && (
            <Card gradient className="mb-8 text-center">
              <Heading level="h3" animate={false} className="mb-2">
                Submitted for review
              </Heading>
              <Text variant="secondary" className="mb-4">
                Thanks! Your resource will appear once a maintainer merges it.
              </Text>
              <Link href="/resources">
                <Button type="button" variant="secondary">
                  Back to Resources
                </Button>
              </Link>
            </Card>
          )}

          {submitStatus === "error" && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Something went wrong. Please check your connection and try again.
            </div>
          )}

          <Card animated={false} gradient>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" required>
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Product name or resource title"
                  error={errors.title}
                  fullWidth
                />
              </div>

              <div>
                <Label htmlFor="link" required>
                  Link
                </Label>
                <Input
                  id="link"
                  name="link"
                  type="url"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="https://..."
                  error={errors.link}
                  fullWidth
                />
              </div>

              <div>
                <Label htmlFor="description" required>
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Briefly describe what this resource covers."
                  error={errors.description}
                  fullWidth
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Resource"}
                </Button>
              </div>
            </form>
          </Card>
        </Container>
        <div className="mt-16">
          <Footer />
        </div>
      </main>
    </div>
  );
}
