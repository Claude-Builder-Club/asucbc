# General

- Any validation/authentication/authorization should be pushed to the edge as maximally necessary

## Building UI Components

- Reference the UI component examples at app/devs/ when building any UI components
- And update app/devs when any new composable UI components are built

## Database Schema

Run this query to understand the database structure:
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
