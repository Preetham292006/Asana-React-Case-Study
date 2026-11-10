# Asana Case Study

An independent educational React prototype for a Full Stack Development Lab case study about project and task management.

> **Academic prototype notice:** “Asana” is used here to identify the subject of the case study. This student project is independently implemented, is not an official Asana product, and is not affiliated with Asana. It uses original application code and assets; it does not represent Asana's actual source code or internal implementation.

## Features

- **Dashboard:** task totals, completion progress, projects, activity, and upcoming deadlines.
- **My Tasks:** task creation, editing, deleting, status updates, and filtering/search.
- **Projects:** project cards and details, project CRUD, team assignments, deadlines, and task-derived progress.
- **List View:** searchable and filterable task list with status, priority, assignee, and project filters.
- **Board View:** To do, In progress, and Completed columns; move tasks by drag-and-drop or status selector.
- **Team and Settings:** sample team directory and browser-local notification preferences.
- **Persistence and tab sync:** LocalStorage stores the workspace and BroadcastChannel synchronizes changes between open tabs, with a `storage` event listener as a fallback.
- Responsive interface, confirmation prompts for destructive actions, and success messages.

Team members and initial activity use sample data. This prototype does not have a backend, authentication, cross-device collaboration, remote notifications, comments, or file attachments.

## Technologies

- React 19, JavaScript, and JSX
- Vite
- React Router
- Lucide React
- HTML5 and standard CSS
- React Hooks and Context
- LocalStorage, BroadcastChannel, and the browser `storage` event

## Installation

Requirements: Node.js and npm versions supported by the installed Vite release, and a modern browser.

```bash
npm install
```

## Run the project

```bash
npm run dev
```

Open the local URL displayed by Vite. Create and preview a production build with:

```bash
npm run build
npm run preview
```

Run the configured lint check:

```bash
npm run lint
```

There is no automated test script configured; see the manual checklist in [CASE_STUDY_NOTES.md](./CASE_STUDY_NOTES.md).

## Project folder structure

```text
.
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ActivityFeed.jsx
│   │   ├── AppLayout.jsx
│   │   ├── BoardTaskCard.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectDialog.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TaskCard.jsx
│   │   └── TaskDialog.jsx
│   ├── context/
│   │   ├── TasksContext.js
│   │   └── TasksProvider.jsx
│   ├── hooks/
│   │   ├── useTasks.js
│   │   ├── useTasksContext.js
│   │   └── useWorkspace.js
│   ├── pages/
│   │   ├── BoardPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MyTasksPage.jsx
│   │   ├── ProjectsPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── TeamPage.jsx
│   ├── utils/
│   │   ├── sampleData.js
│   │   └── storage.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── CASE_STUDY_NOTES.md
├── index.html
├── package.json
└── vite.config.js
```

## Test real-time synchronization

1. Start the app using `npm run dev`.
2. Open the same development URL in two tabs in the same browser profile.
3. In one tab, create, edit, complete, move, or delete a task.
4. Confirm the other tab updates without a refresh.
5. Refresh a tab and confirm that the latest workspace remains saved.

The tabs must share the same origin and browser profile. BroadcastChannel provides immediate tab messaging when available; the `storage` event provides a fallback. This does not synchronize between different devices or users.

See [CASE_STUDY_NOTES.md](./CASE_STUDY_NOTES.md) for the architecture, implementation details, test methodology, and limitations.
