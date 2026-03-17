'use client';

import { memo, useCallback } from 'react';
import { CalendarDay as CalendarDayType, CalendarEvent } from '@/types/calendar';
import { truncateEventSummary } from '@/lib/calendar/utils';

interface CalendarDayProps {
  day: CalendarDayType;
  onSelectDate: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export default memo(function CalendarDay({ day, onSelectDate, onEventClick }: CalendarDayProps) {
  const dayNumber = day.date.getDate();
  const isCurrentMonth = day.isCurrentMonth;
  const isToday = day.isToday;
  const isSelected = day.isSelected;
  const hasEvents = day.hasEvents;

  const handleDayClick = useCallback(() => {
    if (hasEvents && day.events.length > 0 && onEventClick) {
      onEventClick(day.events[0]);
    } else {
      onSelectDate(day.date);
    }
  }, [hasEvents, day.events, day.date, onEventClick, onSelectDate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDayClick();
    }
  }, [handleDayClick]);

  const baseClasses = `
    h-20 rounded-lg cursor-pointer transition-all duration-200
    flex flex-col items-center justify-start relative
    hover:bg-[var(--theme-text-accent)]/10
    ${hasEvents ? 'bg-[var(--theme-text-accent)]/60 hover:bg-[var(--theme-text-accent)]/80' : ''}
    ${isCurrentMonth && !hasEvents ? 'text-[var(--theme-text-primary)]' : 'text-[var(--theme-text-primary)]/40'}
    ${hasEvents ? 'text-white' : ''}
    ${isToday && !hasEvents ? 'ring-2 ring-[var(--theme-text-accent)] bg-[var(--theme-text-accent)]/10' : ''}
    ${isSelected && !hasEvents ? `${isToday ? '' : 'ring-2 ring-[var(--theme-text-accent)]/50'} bg-[var(--theme-text-accent)]/5` : ''}
  `;

  return (
    <div
      className={baseClasses}
      onClick={handleDayClick}
      role="button"
      tabIndex={0}
      aria-label={`${day.date.toLocaleDateString()}${hasEvents ? `, ${day.events.length} events - click to view details` : ''}`}
      onKeyDown={handleKeyDown}
    >
      {/* Day number */}
      <div className={`text-sm font-medium mb-1 pl-2 self-start ${hasEvents ? 'text-white' : ''}`}>
        {dayNumber}
      </div>

      {/* Events - only show if no events (for days without events) */}
      {!hasEvents && (
        <div className="flex-1 w-full">
          {/* Empty space for days without events */}
        </div>
      )}

      {/* Event content - always show the first event's summary when events exist */}
      {hasEvents && (
        <div className="absolute inset-0 flex items-center justify-center px-1">
          <div className="text-white text-[10px] font-medium text-center leading-tight max-w-full overflow-hidden">
            {truncateEventSummary(day.events[0].summary, 30)}
          </div>
        </div>
      )}

    </div>
  );
});
