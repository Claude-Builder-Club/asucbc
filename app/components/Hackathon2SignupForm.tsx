"use client";

import { useState } from "react";
import { Heading, Text, Label, Input, Button, ButtonGroup, Toggle } from "./ui";
import HackathonCongratulations from "./HackathonCongratulations";
import Link from "next/link";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  year: string;
  lookingForTeam: boolean;
  major: string;
  github: string;
  linkedin: string;
  registrationType: "hackathon" | "caseCompetition";
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  year?: string;
  major?: string;
  github?: string;
  linkedin?: string;
}

export default function Hackathon2SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    year: '',
    lookingForTeam: false,
    major: '',
    github: '',
    linkedin: '',
    registrationType: "hackathon",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [successType, setSuccessType] = useState<"hackathon" | "caseCompetition">("hackathon");

  // Function to reset form and go back to registration
  const handleReset = () => {
    setSubmitStatus("idle");
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      year: '',
      lookingForTeam: false,
      major: '',
      github: '',
      linkedin: '',
      registrationType: "hackathon",
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.year) {
      newErrors.year = "Year is required";
    }

    if (!formData.major.trim()) {
      newErrors.major = "Major is required";
    }

    if (formData.registrationType === "hackathon" && !formData.github.trim()) {
      newErrors.github = "GitHub username is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('lookingForTeam', String(formData.lookingForTeam));
      formDataToSend.append('major', formData.major);
      formDataToSend.append('github', formData.github);
      formDataToSend.append('linkedin', formData.linkedin);
      formDataToSend.append('registrationType', formData.registrationType);
      formDataToSend.append('hackathonId', 'hackathon2');

      const response = await fetch('/api/hackathon2', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSuccessType(formData.registrationType);
        setSubmitStatus("success");
        // Track successful submission
        if (typeof window !== 'undefined' && (window as any).umami) {
          (window as any).umami.track('Hackathon2 Form Submitted', {
            year: formData.year,
            lookingForTeam: formData.lookingForTeam,
            registrationType: formData.registrationType,
          });
        }
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          year: '',
          lookingForTeam: false,
          major: '',
          github: '',
          linkedin: '',
          registrationType: "hackathon",
        });
      } else {
        setSubmitStatus("error");
        // Track submission error
        if (typeof window !== 'undefined' && (window as any).umami) {
          (window as any).umami.track('Hackathon2 Form Error', { status: response.status });
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show congratulations screen on success
  if (submitStatus === "success") {
    return <HackathonCongratulations onReset={handleReset} hackathonName={successType === "caseCompetition" ? "Claude Builder Club Case Competition 2026" : "Claude Builder Club Hackathon 2026"} eventDates="March 20-22, 2026" />;
  }

  return (
    <div className="max-w-2xl mx-auto pt-8 sm:pt-12 md:pt-16">
      <div className="mb-8">
        <Heading level="h2" animate={false} className="mb-4">
          {formData.registrationType === "caseCompetition"
            ? "Case Competition Registration Form"
            : "Hackathon Registration Form"}
        </Heading>
        <Text size="sm" variant="secondary">
          All fields marked with * are required.
        </Text>

        {/* SDC Registration Disclaimer */}
        <div className="mt-4 p-4 bg-[var(--theme-text-accent)]/10 rounded-lg border-l-4 border-[var(--theme-text-accent)]">
          <Text
            size="sm"
            className="font-semibold text-[var(--theme-text-primary)]"
          >
            <span className="text-[var(--theme-text-accent)]">
              ⚠️ Important:
            </span>{" "}
            If you're registered on SDC (Sun Devil Connect), you must also
            register here to confirm your attendance. Non-ASU and graduated
            students are welcome to participate in the hackathon, but they are
            not eligible to receive prizes.
          </Text>
        </div>

        {/* Registration Type Toggle */}
        <div
          className="mt-4 flex items-center gap-3 cursor-pointer"
          onClick={() => {
            const next =
              formData.registrationType === "caseCompetition"
                ? "hackathon"
                : "caseCompetition";
            setFormData((prev) => ({ ...prev, registrationType: next }));
            setErrors((prev) => ({
              ...prev,
              github: undefined,
              linkedin: undefined,
            }));
          }}
        >
          <Toggle
            checked={formData.registrationType === "caseCompetition"}
            onChange={() => {}}
          />
          <Text size="sm" variant="secondary" className="flex-1">
            <span className="font-bold text-[var(--theme-text-primary)]">
              Switch to Case Competition Registration
            </span>{" "}
            <span className="text-[var(--theme-text-accent)]">
              (winner may be interviewed by sponsor)
            </span>
          </Text>
        </div>
      </div>

      {submitStatus === "error" && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-medium">
            There was an error submitting your hackathon registration.
          </p>
          <p className="text-sm mt-1">
            Please try again or contact us directly.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name */}
        <div>
          <Label htmlFor="firstName" required>
            First Name
          </Label>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
            placeholder="Enter your first name"
            fullWidth
          />
        </div>

        {/* Last Name */}
        <div>
          <Label htmlFor="lastName" required>
            Last Name
          </Label>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
            placeholder="Enter your last name"
            fullWidth
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="your.email@asu.edu"
            fullWidth
          />
        </div>

        {/* Year */}
        <div>
          <Label htmlFor="year" required>
            What year are you?
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { value: "freshman", label: "Freshman" },
              { value: "sophomore", label: "Sophomore" },
              { value: "junior", label: "Junior" },
              { value: "senior", label: "Senior" },
              { value: "masters", label: "Masters" },
              { value: "other", label: "Other" },
            ].map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={
                  formData.year === option.value ? "secondary" : "outline"
                }
                size="md"
                onClick={() => {
                  setFormData((p) => ({ ...p, year: option.value }));
                  if (errors.year) {
                    setErrors((prev) => ({ ...prev, year: undefined }));
                  }
                  // Track year selection
                  if (typeof window !== "undefined" && (window as any).umami) {
                    (window as any).umami.track("Hackathon2 Year Selected", {
                      year: option.value,
                    });
                  }
                }}
                className="w-full"
              >
                {option.label}
              </Button>
            ))}
          </div>
          {errors.year && (
            <p className="mt-1 text-sm text-red-600">{errors.year}</p>
          )}
        </div>

        {/* Looking for Team Member */}
        <div>
          <Label required>Are you looking for team members?</Label>
          <ButtonGroup
            options={[
              {
                value: true,
                label: "Yes",
                description: "I need teammates",
              },
              {
                value: false,
                label: "No",
                description: "I have a team or going solo",
              },
            ]}
            value={formData.lookingForTeam}
            onChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                lookingForTeam: value,
              }));
              if (typeof window !== "undefined" && (window as any).umami) {
                (window as any).umami.track("Hackathon2 Team Search", {
                  lookingForTeam: value,
                });
              }
            }}
            columns={2}
          />
        </div>

        {/* Major */}
        <div>
          <Label htmlFor="major" required>
            What is your major?
          </Label>
          <Input
            type="text"
            id="major"
            name="major"
            value={formData.major}
            onChange={handleInputChange}
            error={errors.major}
            placeholder="e.g., Computer Science, Software Engineering"
            fullWidth
          />
        </div>

        {/* GitHub (hackathon) or LinkedIn (case competition) */}
        {formData.registrationType === "hackathon" ? (
          <div>
            <Label htmlFor="github" required>
              GitHub Username
            </Label>
            <Input
              type="text"
              id="github"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              error={errors.github}
              placeholder="your-github-username"
              fullWidth
            />
            <Text size="xs" variant="secondary" className="mt-1">
              We'll use this to verify your project submissions
            </Text>
          </div>
        ) : (
          <div>
            <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
            <Input
              type="text"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/your-profile"
              fullWidth
            />
            <Text size="xs" variant="secondary" className="mt-1">
              Optional — helps sponsors connect with you
            </Text>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
            className={isSubmitting ? "!bg-gray-400" : ""}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : formData.registrationType === "caseCompetition" ? (
              "Submit Case Competition Registration"
            ) : (
              "Submit Registration"
            )}
          </Button>
        </div>
      </form>

      {/* Sponsor Information */}
      <div className="mt-8 p-6 bg-gradient-to-br from-[var(--theme-gradient-accent)] to-transparent rounded-lg border-2 border-[var(--theme-card-border)]">
        <div className="text-center">
          <Text
            size="lg"
            className="font-bold mb-2 text-[var(--theme-text-primary)]"
          >
            Interested in Sponsoring?
          </Text>
          <Text size="sm" variant="secondary" className="mb-4">
            Support our hackathon and connect with talented developers
          </Text>
          <Link href="/industry">
            <Button variant="secondary" size="md">
              Become a Sponsor
            </Button>
          </Link>
        </div>
      </div>

      {/* Contact Info */}
      <div className="text-center mt-8">
        <Text size="base" variant="secondary" className="mb-2">
          Questions? Contact us at{" "}
          <a
            href="mailto:shivenshekar01@gmail.com"
            className="text-[var(--theme-text-primary)] hover:underline font-semibold"
            data-umami-event="Contact Email Click"
            data-umami-event-location="Hackathon2 Form"
          >
            shivenshekar01@gmail.com
          </a>
        </Text>
      </div>
    </div>
  );
}
