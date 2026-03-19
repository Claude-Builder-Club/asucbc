'use client';

import React, { useEffect, useRef } from 'react';
import { CalendarEvent } from '@/types/calendar';
import DOMPurify from 'dompurify';
import { useBatParticles } from '../../hooks/useBatParticles';
import { Heading, Text, Button } from '../ui';

interface EventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCalendar?: () => void;
}

export default function EventModal({ event, isOpen, onClose, onAddToCalendar }: EventModalProps) {
  const { containerRef, particlesRef, createParticles } = useBatParticles();
  const descriptionRef = useRef<HTMLDivElement>(null);
  // Sanitize HTML content to prevent XSS while allowing safe tags like links
  const sanitizeHTML = (html: string): string => {
    // First, normalize self-closing tags to proper HTML format
    const normalizedHTML = html
      .replace(/<wbr\s*\/>/gi, '<wbr>')
      .replace(/<br\s*\/>/gi, '<br>');
    
    return DOMPurify.sanitize(normalizedHTML, {
      ALLOWED_TAGS: ['a', 'p', 'br', 'wbr', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id'],
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
    });
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, isOpen]);

  // Inject external link icons into description hyperlinks
  useEffect(() => {
    if (!descriptionRef.current) return;
    const links = descriptionRef.current.querySelectorAll('a');
    links.forEach((link) => {
      // Skip if icon already added
      if (link.querySelector('.description-link-icon')) return;

      // Ensure description links open in a new tab safely.
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '14');
      svg.setAttribute('height', '14');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.setAttribute('class', 'description-link-icon');
      svg.style.display = 'inline';
      svg.style.verticalAlign = 'middle';
      svg.style.marginLeft = '4px';
      svg.innerHTML = '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>';
      link.appendChild(svg);
    });
  }, [event?.description, isOpen]);

  if (!isOpen || !event) return null;

  const formatEventTime = (event: CalendarEvent) => {
    const start = event.start.dateTime || event.start.date;
    const end = event.end.dateTime || event.end.date;
    
    if (!start) return 'Time not specified';
    
    const startDate = new Date(start);
    const endDate = new Date(end || start);
    
    // Format date
    const dateStr = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    // Format time if it's not an all-day event
    if (event.start.dateTime && event.end.dateTime) {
      const startTime = startDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      const endTime = endDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `${dateStr}, ${startTime} - ${endTime}`;
    } else {
      return dateStr;
    }
  };

  const formatLocation = (location?: string) => {
    return location || 'Location not specified';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[var(--theme-card-bg)] border border-[var(--theme-card-border)] rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="bg-[var(--theme-card-bg)] border-b border-[var(--theme-card-border)] px-6 py-5">
          <div className="flex items-center justify-between">
            <Heading level="h2" animate={false} className="pr-4">
              {event.summary}
            </Heading>
            <button
              onClick={onClose}
              className="text-[var(--theme-text-primary)]/60 hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-button-alternate-bg)] rounded-full p-2 transition-all duration-200 ease-in-out flex-shrink-0"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-[var(--theme-card-bg)]">
          
          {/* Date and Time */}
          <div className="flex items-center space-x-3 p-4 bg-[var(--theme-button-alternate-bg)] rounded-xl border border-[var(--theme-card-border)]">
            <div className="flex-shrink-0 w-10 h-10 bg-[var(--theme-text-accent)]/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--theme-text-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <Text size="sm" variant="primary" className="font-medium">
                {formatEventTime(event)}
              </Text>
            </div>
          </div>
          
          {/* Location */}
          {event.location && (
            <div className="flex items-start space-x-3 p-4 bg-[var(--theme-button-alternate-bg)] rounded-xl border border-[var(--theme-card-border)]">
              <div className="flex-shrink-0 w-10 h-10 bg-[var(--theme-text-accent)]/20 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-5 h-5 text-[var(--theme-text-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <Text size="sm" variant="primary" className="font-medium">
                  {formatLocation(event.location)}
                </Text>
              </div>
            </div>
          )}
          
          {/* Description */}
          {event.description && (
            <div className="space-y-3">
              <Heading level="h4" animate={false} className="text-[var(--theme-text-accent)] uppercase tracking-wide">Description</Heading>
              <div className="p-4 bg-[var(--theme-button-alternate-bg)] rounded-xl border border-[var(--theme-card-border)]">
                <div
                  ref={descriptionRef}
                  className="event-modal-description text-[var(--theme-text-primary)] text-sm leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(event.description) }}
                />
              </div>
            </div>
          )}
          
          {/* External Link */}
          {event.htmlLink && (
            <div className="pt-2">
              <a
                href={event.htmlLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-[var(--theme-text-accent)] hover:text-[var(--theme-button-hover-bg)] transition-colors text-sm font-medium"
              >
                <span>View in Google Calendar</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {onAddToCalendar && (
          <div className="px-6 py-4 bg-[var(--theme-button-alternate-bg)] border-t border-[var(--theme-card-border)]">
            <div ref={containerRef} className="relative z-10">
              <div
                ref={particlesRef}
                className="absolute inset-0 pointer-events-none overflow-visible z-0"
              />
              <Button
                onClick={onAddToCalendar}
                variant="primary"
                size="md"
                fullWidth
                className="relative z-10"
              >
                Add to Calendar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
