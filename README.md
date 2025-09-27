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
## 1) Routing, Layout & Middleware (App Router)
• Pages: app/login → src/app/login/page.tsx, app/calls → src/app/calls/page.tsx <br>
• Global layout: src/app/layout.tsx, Wraps Redux <Provider>, MUI ThemeProvider, CssBaseline, common <Header /> <br>
• Middleware: The middleware.ts intercepts every request, checks for a valid auth cookie, and redirects users to /login if missing or /calls if already logged in. <br>

## 2) Styling (CSS Modules + MUI)
• Use style.module.scss per component <br>
• When overriding internal MUI classes, wrap with :global(...) <br>
```bash
          Example: remove Select outline in all states
          .select :global(.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline),
          .select :global(.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline),
          .select :global(.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline),
          .select :global(.MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline) {
          border: 0;
          }
```
• Fonts defined in public/styles/globals.scss via @font-face; html, body set to 'Avenir LT Std'. <br>

## 3) Shared UI Components
• Header: MUI AppBar; left logo + right actions (margin-left: auto) <br>
• LabeledTextField: MUI TextField with label + start icon; placeholder size & focus
ring styled via module <br>
• PrimaryButton: Reusable; CSS vars --btn-bg, --btn-py for bg and vertical padding <br>
• ArchiveButton: Two variants (archived pill vs unarchive chip); color="inherit"; MUI classes targeted via :global <br>
• ConfirmDialog: Generic confirmation modal (separate style file) <br>
• AddNotes: <br>
• Shows call metadata <br>
• Scrollable existing notes (newest first) <br>
• Validates textarea non-empty <br>
• Full-width Save button <br>

## 4) Notifications 
• Use react-hot-toast: <br>
• Mount <Toaster /> once in layout <br>
• Call anywhere: toast.success('Saved!') <br>
• Alternative: notistack if you want MUI-styled snackbars <br>

## 5) Axios Instance & Interceptors
• Adds Authorization: Bearer <token> from getTicket() to every request <br>
• Response interceptor: detect successful POST/PUT and let caller notify user <br>
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
• logIn stores access_token, refresh_token, computes expiresAt <br>
• <TokenRefresher /> schedules silent refresh (~9 minutes or from expires_in) <br>
• setTicket(access_token) persists token and feeds axios <br>

## 7) Redux — Calls

State: <br>
• calls (current page), backupCalls (source for client-side filters), page, perPage, totalCount,
hasNextPage, status, error <br>
Thunks: <br>
• fetchCalls({ page, perPage }) → normalizes API to { nodes, totalCount, hasNextPage };
stores array in calls <br>
• addNote({ id, content }) → POST /calls/:id/note; reducer replaces the updated call in
calls + backupCalls <br>
• archiveCall({ id }) → PUT /calls/:id/archive (toggle); reducer replaces updated call <br>
• applyCallUpdate(call) → apply call payload (used by realtime Pusher) <br>
Filtering: <br>
• filterCalls(value): <br>
• all → restore backupCalls <br>
• archived / unarchived → filter by is_archived <br>
• otherwise → filter by call_type (case-insensitive) <br>

## 8) Calls Page (UI)
• Loads on page/perPage change <br>
• Client-side filter dropdown (archive/type) <br>
• Table with formatted duration (formatMinutesSeconds) <br>
• Pagination: <br>
• MUI <Pagination /> centered, with “x–y of N results” below <br>
• Active page item color customized to #4f46f8 <br>

## 9) Add Notes Flow
• From table row → “Add Note” opens modal with selected call <br>
• Build AddNotesData from CallItem: <br>

• Compute durationReadable via formatMinutesSeconds(row.duration) <br>
• Normalize notes to ensure id/content/created_at <br>
Save:  <br>
• Dispatch addNote({ id, content }) <br>
• On success, reducer replaces call; modal closes <br>

## 10) Archive/Unarchive Flow
• Click ArchiveButton → shows ConfirmDialog <br>
• On confirm: <br>
• Dispatch archiveCall({ id }) <br>
• Reducer replaces call with API response (toggled is_archived) <br>

## 11) Realtime (Pusher)
• Component: CallsRealtime (client) <br>
• Mount via RealtimeGate inside layout only when logged in (and optionally only on
/calls) <br>
• Pusher config:
• APP_KEY: d44e3d910d38a928e0be <br>
• APP_CLUSTER: eu <br>
• AUTH_ENDPOINT: https://frontend-test-api.aircall.dev/pusher/auth <br>
• Subscribes to private-aircall, listens update-call and dispatches
applyCallUpdate(payload) <br>

## 12) Common Gotchas Solved
• React root duplication for toasts → use a library (react-hot-toast or notistack) <br>
• CSS Modules vs MUI → use :global(.Mui*...) when overriding MUI classes <br>
• Select outline → target fieldset .MuiOutlinedInput-notchedOutline <br>
 
Type mismatches: <br>
• Normalize notes when opening modal (ensure created_at), or relax modal
type to store’s CallNote <br>
• Pusher payload typed as CallItem (or Partial<CallItem> & { id: string }
defensively) <br>

Filtering: <br>
• Always filter from backupCalls; restore full list on “all” <br><br>

## 13) Useful Utilities
• formatMinutesSeconds(totalSeconds) → { minutes, seconds } or a pretty string (e.g.,
01:40) <br>
• getData/postData/putData wrappers in utils/api (handle JSON + errors) <br>
• getTicket/setTicket in utils/auth (persist token for axios) <br>

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
• App Router with client components for interactive parts <br>
• All component styles in CSS Modules; no inline sx except tiny layout tweaks <br>
• Thunks return normalized shapes; reducers replace updated calls <br>
• Realtime updates merged via applyCallUpdate to keep UI in sync <br>

## 16) Tested Component

• src/components/core/LabeledTextField/index.tsx <br>

• src/components/core/PrimaryButton/index.tsx <br>

• src/components/core/ArchiveButton/index.tsx <br>

• src/components/custom/AddNotes/index.tsx <br>

• src/components/custom/ConfirmDialog/index.tsx <br>

• src/components/custom/Header/index.tsx <br>

• src/components/system/TokenRefresher.tsx <br>

• src/components/system/CallsRealtime.tsx<br> 

• src/components/core/Select/Select.test.jsx<br>

• src/components/core/Table/Table.test.jsx<br>

## 17)Test Results
```bash
Test Suites: 9 passed, 9 total
Tests:       53 passed, 53 total
Snapshots:   0 total
Time:        12.954 s, estimated 13 s
```
## Thank you for giving me this opportunity. I hope we can work and learn toghether to develop great systems.
