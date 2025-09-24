This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

npm run test 
```
## PROJECT DEV NOTES: React / Next.js (Calls App)
## 1) Routing & Layout (App Router)
• Pages: app/login → src/app/login/page.tsx, app/calls → src/app/calls/page.tsx
• Global layout: src/app/layout.tsx, Wraps Redux <Provider>, MUI ThemeProvider, CssBaseline, common <Header />
• Mounts <TokenRefresher /> and toast provider (react-hot-toast)

## 2) Styling (CSS Modules + MUI)
• Use style.module.scss per component
• When overriding internal MUI classes, wrap with :global(...)
```bash
          Example: remove Select outline in all states
          .select :global(.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline),
          .select :global(.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline),
          .select :global(.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline),
          .select :global(.MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline) {
          border: 0;
          }
```
• Fonts defined in public/styles/globals.scss via @font-face; html, body set to 'Avenir LT Std'.

## 3) Shared UI Components
• Header: MUI AppBar; left logo + right actions (margin-left: auto)
• LabeledTextField: MUI TextField with label + start icon; placeholder size & focus
ring styled via module
• PrimaryButton: Reusable; CSS vars --btn-bg, --btn-py for bg and vertical padding
• ArchiveButton: Two variants (archived pill vs unarchive chip); color="inherit"; MUI classes targeted via :global
• ConfirmDialog: Generic confirmation modal (separate style file)
• AddNotes:
• Shows call metadata
• Scrollable existing notes (newest first)
• Validates textarea non-empty
• Full-width Save button

## 4) Notifications
• Use react-hot-toast:
• Mount <Toaster /> once in layout
• Call anywhere: toast.success('Saved!')
• Alternative: notistack if you want MUI-styled snackbars

## 5) Axios Instance & Interceptors
• Adds Authorization: Bearer <token> from getTicket() to every request
• Response interceptor: detect successful POST/PUT and let caller notify user
```bash
      instance.interceptors.response.use((res) => {
      const m = res.config.method?.toLowerCase();
      const ok = res.status >= 200 && res.status < 300;
      if (ok && (m === 'post' || m === 'put')) {
      // trigger your own notifier here if desired
      }
      return res;
      });
```
## 6) Redux — Auth
• logIn stores access_token, refresh_token, computes expiresAt
• <TokenRefresher /> schedules silent refresh (~9 minutes or from expires_in)
• setTicket(access_token) persists token and feeds axios

## 7) Redux — Calls

State
calls (current page), backupCalls (source for client-side filters), page, perPage, totalCount,
hasNextPage, status, error
Thunks
• fetchCalls({ page, perPage }) → normalizes API to { nodes, totalCount, hasNextPage };
stores array in calls
• addNote({ id, content }) → POST /calls/:id/note; reducer replaces the updated call in
calls + backupCalls
• archiveCall({ id }) → PUT /calls/:id/archive (toggle); reducer replaces updated call
• applyCallUpdate(call) → apply call payload (used by realtime Pusher)
Filtering
• filterCalls(value):
• all → restore backupCalls
• archived / unarchived → filter by is_archived
• otherwise → filter by call_type (case-insensitive)

## 8) Calls Page (UI)
• Loads on page/perPage change
• Client-side filter dropdown (archive/type)
• Table with formatted duration (formatMinutesSeconds)
• Pagination:
• MUI <Pagination /> centered, with “x–y of N results” below
• Active page item color customized to #4f46f8

## 9) Add Notes Flow
• From table row → “Add Note” opens modal with selected call
• Build AddNotesData from CallItem:

• Compute durationReadable via formatMinutesSeconds(row.duration)
• Normalize notes to ensure id/content/created_at
• Save:
• Dispatch addNote({ id, content })
• On success, reducer replaces call; modal closes

## 10) Archive/Unarchive Flow
• Click ArchiveButton → shows ConfirmDialog
• On confirm:
• Dispatch archiveCall({ id })
• Reducer replaces call with API response (toggled is_archived)

## 11) Realtime (Pusher)
• Component: CallsRealtime (client)
• Mount via RealtimeGate inside layout only when logged in (and optionally only on
/calls)
• Pusher config:
• APP_KEY: d44e3d910d38a928e0be
• APP_CLUSTER: eu
• AUTH_ENDPOINT: https://frontend-test-api.aircall.dev/pusher/auth
• Subscribes to private-aircall, listens update-call and dispatches
applyCallUpdate(payload)

## 12) Common Gotchas Solved
• React root duplication for toasts → use a library (react-hot-toast or notistack)
• CSS Modules vs MUI → use :global(.Mui*...) when overriding MUI classes
• Select outline → target fieldset .MuiOutlinedInput-notchedOutline

• Type mismatches:
• Normalize notes when opening modal (ensure created_at), or relax modal
type to store’s CallNote
• Pusher payload typed as CallItem (or Partial<CallItem> & { id: string }
defensively)

• Filtering:
• Always filter from backupCalls; restore full list on “all”

## 13) Useful Utilities
• formatMinutesSeconds(totalSeconds) → { minutes, seconds } or a pretty string (e.g.,
01:40)
• getData/postData/putData wrappers in utils/api (handle JSON + errors)
• getTicket/setTicket in utils/auth (persist token for axios)

## 14) Suggested File Structure
```bash
src/
app/
layout.tsx
login/page.tsx
calls/page.tsx
components/
custom/
Header/
AddNotes/
ConfirmDialog/
core/
PrimaryButton/

ArchiveButton/
LabeledTextField/
system/
CallsRealtime.tsx
RefreshToken.tsx
redux/
features/
Auth/authSlice.ts
Calls/callsSlice.ts
store.ts
lib/
theme.ts
axios.ts
utils/
api.ts
auth.ts
helper.ts
public/
styles/globals.scss
images/...
```
## 15) Conventions
• App Router with client components for interactive parts
• All component styles in CSS Modules; no inline sx except tiny layout tweaks
• Thunks return normalized shapes; reducers replace updated calls
• Realtime updates merged via applyCallUpdate to keep UI in sync

## Thank you for giving me this oppoertunity. I hope we can work and learn toghether to develop great systems.
