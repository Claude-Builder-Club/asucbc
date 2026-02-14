# Inbox

The inbox is a dashboard feature that displays messages to authenticated users. Messages are rendered as interactive tilt cards in a responsive grid, with an overlay panel for reading full message content.

## API Endpoints

### `GET /api/inbox?userId={userId}`

Fetches all messages for a user, ordered by `created_at DESC`. Joins against the `user` table for sender names and `message_reads` to determine read status.

Returns: `Array<{ id, title, body, created_at, sender_name, is_read }>`

### `PATCH /api/inbox`

Marks a message as read by inserting into `message_reads`. Uses `ON CONFLICT DO NOTHING` so duplicate calls are safe.

Body: `{ userId, messageId }`

### `GET /api/inbox/unread-count?userId={userId}`

Returns the count of messages that have no corresponding `message_reads` entry for the user.

Returns: `{ count: number }`

## Database Tables

- **`messages`** — `id`, `title`, `body`, `created_at`, `sender_id`
- **`message_reads`** — `user_id`, `message_id` (unique constraint on the pair)

A message is "unread" if no row exists in `message_reads` for that user + message combination.

## Polling and Real-Time Updates

Both the inbox page and the sidebar unread badge poll their respective endpoints every **60 seconds**.

When a message is marked as read via PATCH, the inbox page dispatches a `CustomEvent("inbox:read")` on `window`. Both the sidebar (`Sidebar.tsx`) and the inbox page itself listen for this event and immediately re-fetch, so:

- The sidebar badge count updates instantly when a message is opened
- The inbox card's "Unread" badge disappears without waiting for the next poll
- New messages from other sources still appear within the 60s polling cycle

## UI

- **Card grid** — Messages displayed in a `1 / 2 / 3` column responsive grid using `react-parallax-tilt` for tilt and glare effects. Non-active cards blur and grayscale when one is selected.
- **Unread indicator** — Unread messages show a red `Badge` component (`variant="error"`) in the top-right of the card.
- **Message overlay** — Clicking a card opens a fixed, viewport-centered panel with a dimmed backdrop. Clicking outside the panel closes it.
- **Loading state** — 6 skeleton placeholders in the same grid layout.
- **Empty state** — Mail icon with "No messages yet" text.
