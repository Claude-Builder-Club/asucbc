"use client";

import { useState } from "react";
import { Heading, Text, Label, Input, Button, ButtonGroup } from "./ui";
import HackathonCongratulations from "./HackathonCongratulations";

interface FormData {
  track: string;
  isAsuStudent: boolean;
  isAsuOnlineStudent: boolean;
  firstName: string;
  lastName: string;
  schoolEmail: string;
  year: string;
  hackathonsParticipated: number;
  experienceLevel: string;
  dietaryRestrictions: string;
}

interface FormErrors {
  track?: string;
  isAsuStudent?: string;
  isAsuOnlineStudent?: string;
  firstName?: string;
  lastName?: string;
  schoolEmail?: string;
  year?: string;
  hackathonsParticipated?: string;
  experienceLevel?: string;
}

export default function HackathonSignupForm() {
  const [formData, setFormData] = useState<FormData>({
    track: '',
    isAsuStudent: true,
    isAsuOnlineStudent: false,
    firstName: '',
    lastName: '',
    schoolEmail: '',
    year: '',
    hackathonsParticipated: 0,
    experienceLevel: "",
    dietaryRestrictions: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Function to reset form and go back to registration
  const handleReset = () => {
    setSubmitStatus("idle");
    setFormData({
      track: '',
      isAsuOnlineStudent: false,
      isAsuStudent: true,
      firstName: '',
      lastName: '',
      schoolEmail: '',
      year: '',
      hackathonsParticipated: 0,
      experienceLevel: "",
      dietaryRestrictions: "",
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.track) {
      newErrors.track = "Please select a track";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.schoolEmail.trim()) {
      newErrors.schoolEmail = "School email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.schoolEmail)) {
      newErrors.schoolEmail = "Please enter a valid email address";
    }

    if (!formData.year) {
      newErrors.year = "Year is required";
    }

    if (formData.hackathonsParticipated < 0) {
      newErrors.hackathonsParticipated =
        "Please enter a valid number of hackathons";
    }

    if (!formData.experienceLevel) {
      newErrors.experienceLevel = "Experience level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle number input for hackathonsParticipated
    if (name === "hackathonsParticipated") {
      const numValue = parseInt(value) || 0;
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

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
      const isAsuStudent = formData.isAsuStudent === true;
      const isAsuOnlineStudent = isAsuStudent && formData.isAsuOnlineStudent === true;

      formDataToSend.append('track', formData.track);
      formDataToSend.append('isAsuStudent', String(isAsuStudent));
      formDataToSend.append('isAsuOnlineStudent', String(isAsuOnlineStudent));
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('schoolEmail', formData.schoolEmail);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('hackathonsParticipated', formData.hackathonsParticipated.toString());
      formDataToSend.append('experienceLevel', formData.experienceLevel);
      formDataToSend.append('dietaryRestrictions', formData.dietaryRestrictions);

      const response = await fetch('/api/hackathon', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Track successful submission
        if (typeof window !== 'undefined' && (window as any).umami) {
          (window as any).umami.track('Hackathon Form Submitted', {
            track: formData.track,
            year: formData.year,
            experienceLevel: formData.experienceLevel
          });
        }
        setFormData({
          track: '',
          isAsuStudent: true,
          isAsuOnlineStudent: false,
          firstName: '',
          lastName: '',
          schoolEmail: '',
          year: '',
          hackathonsParticipated: 0,
          experienceLevel: "",
          dietaryRestrictions: "",
        });
      } else {
        setSubmitStatus("error");
        // Track submission error
        if (typeof window !== 'undefined' && (window as any).umami) {
          (window as any).umami.track('Hackathon Form Error', { status: response.status });
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
    return <HackathonCongratulations onReset={handleReset} hackathonName="HackASU 2025" eventDates="November 8-9, 2025" />;
  }

  return (
    <div className="max-w-2xl mx-auto pt-8 sm:pt-12 md:pt-16">
      <div className="mb-8">
        <Heading level="h2" animate={false} className="mb-4">
          Hackathon Registration Form
        </Heading>
        <Text size="sm" variant="secondary">
          All fields marked with * are required.
        </Text>
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
        {/* Track selection */}
        <div>
          <Label htmlFor="track" required>
            Track
          </Label>
          <ButtonGroup
            options={[
              {
                value: "Engineering",
                label: "Engineering",
                description: "Build technical solutions with AI"
              },
              {
                value: "Comprehensive Business Case Competition",
                label: "Business Case",
                description: "Solve business challenges strategically"
              }
            ]}
            value={formData.track}
            onChange={(value) => {
              setFormData((p) => ({ ...p, track: value }));
              if (errors.track) {
                setErrors((prev) => ({ ...prev, track: undefined }));
              }
              // Track track selection
              if (typeof window !== 'undefined' && (window as any).umami) {
                (window as any).umami.track('Hackathon Track Selected', { track: value });
              }
            }}
            columns={2}
          />
          {errors.track && (
            <p className="mt-1 text-sm text-red-600">{errors.track}</p>
          )}
        </div>

        {/* ASU Affiliation */}
        <div>
          <Label required>
            Are you an ASU student?
          </Label>
          <ButtonGroup
            options={[
              {
                value: true,
                label: 'Yes',
                description: 'I am currently enrolled at ASU'
              },
              {
                value: false,
                label: 'No',
                description: 'I am not an ASU Student'
              }
            ]}
            value={formData.isAsuStudent}
            onChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                isAsuStudent: value,
                isAsuOnlineStudent: false,
              }));
              if (typeof window !== 'undefined' && (window as any).umami) {
                (window as any).umami.track('Hackathon ASU Affiliation', { isAsuStudent: value });
              }
            }}
            columns={2}
          />
        </div>

        {/* ASU Online Student Confirmation */}
        {formData.isAsuStudent && (
          <div>
            <Label required>
              Are you an ASU Online Student?
            </Label>
            <ButtonGroup
              options={[
                {
                  value: true,
                  label: 'Yes',
                  description: 'I am an ASU Online student'
                },
                {
                  value: false,
                  label: 'No',
                description: 'I am an in-person student'
                }
              ]}
              value={formData.isAsuOnlineStudent}
              onChange={(value) => {
                setFormData((p) => ({ ...p, isAsuOnlineStudent: value }));
                // Track ASU Online status
                if (typeof window !== 'undefined' && (window as any).umami) {
                  (window as any).umami.track('Hackathon ASU Online Status', { isOnline: value });
                }
              }}
              columns={2}
            />
            <Text size="xs" variant="secondary" className="mt-2">
            We will be verifying each one individually for proof later
            </Text>
          </div>
        )}

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

        {/* School Email */}
        <div>
          <Label htmlFor="schoolEmail" required>
            School Email
          </Label>
          <Input
            type="email"
            id="schoolEmail"
            name="schoolEmail"
            value={formData.schoolEmail}
            onChange={handleInputChange}
            error={errors.schoolEmail}
            placeholder={
              formData.isAsuStudent === false
                ? "name@example.com"
                : "your.email@asu.edu"
            }
            fullWidth
          />
        </div>

        {/* Year */}
        <div>
          <Label htmlFor="year" required>
            Year
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { value: "freshman", label: "Freshman" },
              { value: "sophomore", label: "Sophomore" },
              { value: "junior", label: "Junior" },
              { value: "senior", label: "Senior" },
              { value: "masters", label: "Masters" },
            ].map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={formData.year === option.value ? "secondary" : "outline"}
                size="md"
                onClick={() => {
                  setFormData((p) => ({ ...p, year: option.value }));
                  if (errors.year) {
                    setErrors((prev) => ({ ...prev, year: undefined }));
                  }
                  // Track year selection
                  if (typeof window !== 'undefined' && (window as any).umami) {
                    (window as any).umami.track('Hackathon Year Selected', { year: option.value });
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

        {/* Number of Hackathons Participated */}
        <div>
          <Label htmlFor="hackathonsParticipated" required>
            How many hackathons have you participated in before?
          </Label>
          <Input
            type="number"
            id="hackathonsParticipated"
            name="hackathonsParticipated"
            value={formData.hackathonsParticipated.toString()}
            onChange={handleInputChange}
            error={errors.hackathonsParticipated}
            placeholder="0"
            min={0}
            fullWidth
          />
        </div>

        {/* Experience Level */}
        <div>
          <Label htmlFor="experienceLevel" required>
            Field of Study Experience Level
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: "0-1", label: "0-1 years" },
              { value: "1-2", label: "1-2 years" },
              { value: "2-4", label: "2-4 years" },
              { value: "4+", label: "4+ years" },
            ].map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={formData.experienceLevel === option.value ? "secondary" : "outline"}
                size="md"
                onClick={() => {
                  setFormData((p) => ({ ...p, experienceLevel: option.value }));
                  if (errors.experienceLevel) {
                    setErrors((prev) => ({ ...prev, experienceLevel: undefined }));
                  }
                  // Track experience level selection
                  if (typeof window !== 'undefined' && (window as any).umami) {
                    (window as any).umami.track('Hackathon Experience Selected', { experience: option.value });
                  }
                }}
                className="w-full"
              >
                {option.label}
              </Button>
            ))}
          </div>
          {errors.experienceLevel && (
            <p className="mt-1 text-sm text-red-600">
              {errors.experienceLevel}
            </p>
          )}
        </div>

        {/* Dietary Restrictions */}
        <div>
          <Label htmlFor="dietaryRestrictions">
            Dietary Restrictions
          </Label>
          <Input
            type="text"
            id="dietaryRestrictions"
            name="dietaryRestrictions"
            value={formData.dietaryRestrictions}
            onChange={handleInputChange}
            placeholder="Vegetarian, vegan, gluten-free, etc."
            fullWidth
          />
        </div>

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
            ) : (
              "Submit Hackathon Registration"
            )}
          </Button>
        </div>
      </form>

      {/* Contact Info */}
      <div className="text-center mt-8">
        <Text size="base" variant="secondary" className="mb-2">
          Questions? Contact us at{" "}
          <a
            href="mailto:shivenshekar01@gmail.com"
            className="text-[var(--theme-text-primary)] hover:underline font-semibold"
            data-umami-event="Contact Email Click"
            data-umami-event-location="Hackathon Form"
          >
            shivenshekar01@gmail.com
          </a>
        </Text>
      </div>
    </div>
  );
}
