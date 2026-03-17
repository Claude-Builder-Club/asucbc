'use client';

import { memo } from 'react';
import { CalendarMonth, CalendarEvent } from '@/types/calendar';
import { getDayNames } from '@/lib/calendar/utils';
import CalendarDay from './CalendarDay';
import { Text } from '../ui';

interface CalendarGridProps {
  calendarMonth: CalendarMonth;
  onSelectDate: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  isLoading?: boolean;
}

export default memo(function CalendarGrid({
  calendarMonth,
  onSelectDate,
  onEventClick,
  isLoading = false,
}: CalendarGridProps) {
  const dayNames = getDayNames(true);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        {/* Day headers skeleton */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map((day, index) => (
            <div
              key={index}
              className="h-8 flex items-center justify-start"
            >
              <div className="h-4 w-8 bg-[var(--theme-text-primary)]/20 rounded"></div>
            </div>
          ))}
        </div>

        {/* Calendar grid skeleton */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 42 }).map((_, index) => (
            <div
              key={index}
              className="h-20 bg-[var(--theme-text-primary)]/10 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Day of week headers */}
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day, index) => (
          <div
            key={index}
            className="h-8 flex items-center justify-start"
          >
            <Text size="sm" variant="secondary" className="font-medium">
              {day}
            </Text>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarMonth.days.map((day, index) => (
          <CalendarDay
            key={`${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}-${index}`}
            day={day}
            onSelectDate={onSelectDate}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
});
