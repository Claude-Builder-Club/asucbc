"use client";

import { useState, useEffect } from "react";
import { Heading, Text, Label, Input, Button, ButtonGroup } from "./ui";
import ClaudeRedeemCongratulations from "./ClaudeRedeemCongratulations";

interface FormData {
  firstName: string;
  lastName: string;
  asuEmail: string;
  hasReceivedCredits: boolean | null;
  orgId: string;
  latitude: number | null;
  longitude: number | null;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  asuEmail?: string;
  hasReceivedCredits?: string;
  orgId?: string;
  location?: string;
}

export default function ClaudeRedeemForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    asuEmail: "",
    hasReceivedCredits: null,
    orgId: "",
    latitude: null,
    longitude: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownEndTime, setCooldownEndTime] = useState<number | null>(null);

  // Track page view on mount
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).umami) {
      (window as any).umami.track("Claude Redeem - Page View");
    }
  }, []);

  // Check localStorage for submission cooldown on mount
  useEffect(() => {
    const lastSubmission = localStorage.getItem("claudeRedeemLastSubmission");
    if (lastSubmission) {
      const lastSubmissionTime = parseInt(lastSubmission, 10);
      const currentTime = Date.now();
      const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const timeRemaining = lastSubmissionTime + cooldownPeriod - currentTime;

      if (timeRemaining > 0) {
        setCooldownActive(true);
        setCooldownEndTime(lastSubmissionTime + cooldownPeriod);
        // Track cooldown active on page load
        if (typeof window !== "undefined" && (window as any).umami) {
          const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
          (window as any).umami.track("Claude Redeem - Cooldown Active", {
            hoursRemaining: hoursRemaining,
          });
        }
      } else {
        // Cooldown expired, clear localStorage
        localStorage.removeItem("claudeRedeemLastSubmission");
      }
    }
  }, []);

  // Request location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationStatus("loading");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location obtained:", position.coords);
          // Update location status first
          setLocationStatus("success");
          // Then update form data
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          // Clear any location errors
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.location;
            return newErrors;
          });
          // Track successful location access
          if (typeof window !== "undefined" && (window as any).umami) {
            (window as any).umami.track("Claude Redeem - Location Granted");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationStatus("error");
          setErrors((prev) => ({
            ...prev,
            location:
              "Location access is required. Please enable location services.",
          }));
          // Track location access denied
          if (typeof window !== "undefined" && (window as any).umami) {
            (window as any).umami.track("Claude Redeem - Location Denied", {
              errorCode: error.code,
              errorMessage: error.message,
            });
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationStatus("error");
      setErrors({
        location: "Geolocation is not supported by your browser.",
      });
      // Track geolocation not supported
      if (typeof window !== "undefined" && (window as any).umami) {
        (window as any).umami.track("Claude Redeem - Geolocation Unsupported");
      }
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.asuEmail.trim()) {
      newErrors.asuEmail = "ASU email is required";
    } else if (!formData.asuEmail.toLowerCase().endsWith(".edu")) {
      newErrors.asuEmail = "Email must end with .edu";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.asuEmail)) {
      newErrors.asuEmail = "Please enter a valid email address";
    }

    if (formData.hasReceivedCredits === null) {
      newErrors.hasReceivedCredits =
        "Please select whether you've received API credits";
    }

    if (!formData.orgId.trim()) {
      newErrors.orgId = "Claude platform Org ID is required";
    }

    if (formData.latitude === null || formData.longitude === null) {
      newErrors.location = "Location is required to submit the form";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check cooldown before submitting
    if (cooldownActive) {
      setSubmitStatus("error");
      setErrorMessage("You have already submitted a request. Please wait 24 hours before submitting again.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        // Set localStorage cooldown
        localStorage.setItem("claudeRedeemLastSubmission", Date.now().toString());
        setCooldownActive(true);
        setCooldownEndTime(Date.now() + 24 * 60 * 60 * 1000);
        // Track successful submission
        if (typeof window !== "undefined" && (window as any).umami) {
          (window as any).umami.track("Claude Redeem - SUCCESS", {
            email: formData.asuEmail,
            hasReceivedCredits: formData.hasReceivedCredits,
          });
        }
      } else {
        setSubmitStatus("error");
        setErrorMessage(
          data.error || "An error occurred while submitting the form"
        );
        // Track submission error with detailed reason
        if (typeof window !== "undefined" && (window as any).umami) {
          let errorType = "Unknown Error";
          if (response.status === 403) {
            errorType = "Location Too Far";
          } else if (response.status === 400) {
            errorType = "Invalid Email";
          } else if (response.status === 503) {
            errorType = "Service Unavailable";
          }

          (window as any).umami.track("Claude Redeem - FAILED_ATTEMPT", {
            status: response.status,
            errorType: errorType,
            errorMessage: data.error,
            email: formData.asuEmail,
          });
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setErrorMessage("Network error. Please try again.");
      // Track network errors
      if (typeof window !== "undefined" && (window as any).umami) {
        (window as any).umami.track("Claude Redeem - Network Error", {
          error: error instanceof Error ? error.message : "Unknown error",
          email: formData.asuEmail,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show congratulations screen on success
  if (submitStatus === "success") {
    return <ClaudeRedeemCongratulations />;
  }

  // Calculate remaining cooldown time
  const getRemainingTime = () => {
    if (!cooldownEndTime) return "";
    const remaining = cooldownEndTime - Date.now();
    if (remaining <= 0) return "";

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="max-w-2xl mx-auto pt-8 sm:pt-12 md:pt-16">
      <div className="mb-8">
        <Heading level="h2" animate={false} className="mb-4">
          Free Claude API Credits + Pro
        </Heading>
        <Text size="lg" variant="primary" className="mb-2 font-semibold">
          Get free Claude Pro for the semester plus API credits!
        </Text>
        <Text size="sm" variant="secondary">
          All fields marked with * are required. Location verification is required to redeem.
        </Text>
      </div>

      {/* Cooldown Banner */}
      {cooldownActive && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="font-medium text-yellow-600 dark:text-yellow-400">Submission Cooldown Active</p>
          <p className="text-sm mt-1 text-yellow-600/80 dark:text-yellow-400/80">
            You have already submitted a request. Please wait {getRemainingTime()} before submitting again.
          </p>
        </div>
      )}

      {/* Location Status Banner */}
      {locationStatus === "loading" && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="font-medium text-blue-600 dark:text-blue-400">Requesting location access...</p>
          <p className="text-sm mt-1 text-blue-600/80 dark:text-blue-400/80">
            Please allow location access to continue.
          </p>
        </div>
      )}

      {locationStatus === "error" && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="font-medium text-red-600 dark:text-red-400">Location access required</p>
          <p className="text-sm mt-1 text-red-600/80 dark:text-red-400/80">
            {errors.location || "Please enable location services and refresh the page."}
          </p>
        </div>
      )}

      {locationStatus === "success" && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="font-medium text-green-600 dark:text-green-400">Location verified</p>
          <p className="text-sm mt-1 text-green-600/80 dark:text-green-400/80">
            You are eligible to submit the form.
          </p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="font-medium text-red-600 dark:text-red-400">Submission error</p>
          <p className="text-sm mt-1 text-red-600/80 dark:text-red-400/80">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name */}
        <div className={locationStatus === "error" ? "opacity-50" : ""}>
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
            disabled={locationStatus === "error"}
          />
        </div>

        {/* Last Name */}
        <div className={locationStatus === "error" ? "opacity-50" : ""}>
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
            disabled={locationStatus === "error"}
          />
        </div>

        {/* ASU Email */}
        <div className={locationStatus === "error" ? "opacity-50" : ""}>
          <Label htmlFor="asuEmail" required>
            ASU Email (must end in .edu)
          </Label>
          <Input
            type="email"
            id="asuEmail"
            name="asuEmail"
            value={formData.asuEmail}
            onChange={handleInputChange}
            error={errors.asuEmail}
            placeholder="your.email@asu.edu"
            fullWidth
            disabled={locationStatus === "error"}
          />
        </div>

        {/* Has Received Credits */}
        <div className={locationStatus === "error" ? "opacity-50 pointer-events-none" : ""}>
          <Label required>Have you received your API credits?</Label>
          <ButtonGroup
            options={[
              {
                value: true,
                label: "Yes",
                description: "I have received my API credits",
              },
              {
                value: false,
                label: "No",
                description: "I have not received my API credits",
              },
            ]}
            value={formData.hasReceivedCredits}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, hasReceivedCredits: value }));
              if (errors.hasReceivedCredits) {
                setErrors((prev) => ({
                  ...prev,
                  hasReceivedCredits: undefined,
                }));
              }
            }}
            columns={2}
          />
          {errors.hasReceivedCredits && (
            <p className="mt-1 text-sm text-red-600">
              {errors.hasReceivedCredits}
            </p>
          )}
        </div>

        {/* Claude Org ID */}
        <div className={locationStatus === "error" ? "opacity-50" : ""}>
          <Label htmlFor="orgId" required>
            What&apos;s your Claude platform Org ID?
          </Label>
          <Input
            type="text"
            id="orgId"
            name="orgId"
            value={formData.orgId}
            onChange={handleInputChange}
            error={errors.orgId}
            placeholder="org-xxxxxxxxxxxxxxxxxxxxx"
            fullWidth
            disabled={locationStatus === "error"}
          />
          <Text size="xs" variant="secondary" className="mt-2">
            You can find your Org ID in your Claude Console settings
          </Text>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting || locationStatus !== "success" || cooldownActive}
            className={
              isSubmitting || locationStatus !== "success" || cooldownActive
                ? "!bg-gray-400"
                : ""
            }
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
              "Redeem Claude Credits"
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
            data-umami-event-location="Claude Redeem Form"
          >
            shivenshekar01@gmail.com
          </a>
        </Text>
      </div>
    </div>
  );
}
