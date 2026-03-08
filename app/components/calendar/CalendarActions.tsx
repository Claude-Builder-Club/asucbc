"use client";

import React from "react";
import { getCalendarSubscriptionUrl } from "@/lib/calendar/google";
import { Button } from "../ui";

interface CalendarActionsProps {
  calendarId: string;
  selectedDate?: Date | null;
  className?: string;
  buttonSize?: "sm" | "md" | "lg";
  buttonClassName?: string;
}

export default function CalendarActions({
  calendarId,
  selectedDate,
  className,
  buttonSize = "sm",
  buttonClassName,
}: CalendarActionsProps) {
  const subscriptionUrl = getCalendarSubscriptionUrl(calendarId);

  const handleAddToCalendar = () => {
    window.open(subscriptionUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={className ?? "flex justify-end mt-4"}>
      <Button
        onClick={handleAddToCalendar}
        variant="primary"
        size={buttonSize}
        className={`flex items-center gap-2${buttonClassName ? ` ${buttonClassName}` : ""}`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Add to Calendar
      </Button>
    </div>
  );
}
