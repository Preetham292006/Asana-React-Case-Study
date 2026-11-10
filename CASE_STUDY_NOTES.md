# Full Stack Development Lab Case Study Notes

## Case study title

**“Asana: Re-engineered the frontend using React to handle real-time task board syncs and instant updates across collaborative workspaces.”**

> **Scope and attribution:** This is an independent educational prototype for the case study. It uses original implementation code and assets, is not an official Asana product, and is not affiliated with Asana. It does not claim to represent Asana's source code or internal architecture. The technical explanations below describe this prototype only.

## 1. Introduction to Asana

Asana is a work-management product used by teams to organize work, coordinate projects, and track progress. Products in this category commonly represent work as projects and tasks, provide multiple ways to view that work, and help team members understand responsibility and deadlines. These general product ideas provide context for this case study. The application described here is an independent educational prototype, not Asana's own software.

## 2. Overview of the case study topic

This case study explores how a React frontend can present a collaborative project workspace and update its interface immediately after a user action. The prototype provides sample projects and team members, My Tasks, a List View, project details, a dashboard, and a three-column Kanban Board.

The prototype demonstrates synchronization between browser tabs using browser APIs. It does not implement a backend or real multi-user collaboration over a network. The phrase “real-time sync” in this case study means near-immediate updates between open tabs on the same origin and within the same browser profile.

## 3. Problem statement

When project information is kept in separate lists or changed without a shared application state, users may see inconsistent task statuses, project progress, or task assignments. A useful project-management interface should respond promptly when work changes, preserve changes after a page refresh, and keep views such as the dashboard, task list, and board consistent.

The educational problem is to build a simple React frontend that demonstrates these behaviors without depending on a server or a complex architecture.

## 4. Objectives

- Build a responsive project-management interface using React, JavaScript, and JSX.
- Demonstrate reusable components and functional components with Hooks.
- Support task and project creation, editing, and deletion.
- Keep dashboards, task lists, project details, and the Kanban board consistent with centralized state.
- Preserve workspace data using LocalStorage.
- Synchronize workspace updates across same-origin tabs using BroadcastChannel and a storage-event fallback.
- Explain the design and browser API choices in a way that is appropriate for an undergraduate engineering lab.

## 5. Proposed solution

The prototype uses a single React application with route-level pages and reusable interface components. A `TasksProvider` exposes centralized workspace state through React Context. Task and project actions update that state; React then re-renders the affected views. Workspace changes are serialized to LocalStorage and announced to other open tabs.

The solution is intentionally client-side. It is suitable for demonstrating interface state, persistence, and same-browser tab messaging, but it does not provide a shared server-side workspace.

## 6. System architecture

```text
Browser
└── React application
    ├── BrowserRouter
    │   └── AppLayout
    │       ├── Sidebar and shared top bar
    │       ├── Dashboard
    │       ├── My Tasks and List View
    │       ├── Projects and project details
    │       ├── Kanban Board
    │       ├── Team
    │       └── Settings
    ├── TasksProvider / TasksContext
    │   └── useTasks
    │       ├── Workspace state and mutation functions
    │       ├── LocalStorage read/write
    │       ├── BroadcastChannel publisher/listener
    │       └── storage-event listener
    └── Utilities
        ├── starter project, task, team, and activity data
        └── workspace storage helpers
```

The application starts in `src/main.jsx`, which renders the app inside `React.StrictMode` and `BrowserRouter`. `src/App.jsx` defines routes and wraps them in `TasksProvider`. Page components obtain workspace data through `useTasksContext`; shared layout actions and search are provided to routes through React Router's outlet context.

There is no API server or database in this architecture. The browser's LocalStorage is the persistent store for the current browser profile.

## 7. Technologies used

| Technology | Use in the prototype |
|---|---|
| React 19 | Renders the interface from reusable components and state. |
| JavaScript and JSX | Implements application logic and React component markup. |
| Vite | Runs the local development server and creates the production build. |
| React Router | Provides client-side routes for dashboard, My Tasks, projects, List View, Board View, team, and settings. |
| React Hooks | `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, and `useContext` manage component and shared state. |
| React Context | Makes task and project workspace state available throughout the routed application. |
| Lucide React | Supplies the interface icons. |
| HTML5 and standard CSS | Provide semantic interface elements, styling, and responsive layouts. |
| LocalStorage | Saves the workspace and notification preferences in the browser. |
| BroadcastChannel | Sends workspace updates to other same-origin tabs. |
| `storage` event | Provides a cross-tab update listener as a fallback when a LocalStorage value changes. |
| Oxlint | Runs the configured source lint check. |

## 8. ReactJS concepts demonstrated

- **Functional components:** Each page and reusable interface element is a JavaScript function that returns JSX.
- **JSX:** HTML-like syntax is used inside JavaScript to describe the interface. JavaScript values can be inserted with braces, for example to show a task title.
- **Props:** Components receive values and callbacks from their parent. For example, task cards receive a task and callbacks for editing, deleting, and changing status.
- **State with `useState`:** State stores values that can change, such as a dialog's form values, filters, open menus, and the active workspace.
- **Effects with `useEffect`:** Effects connect React to browser APIs. The prototype uses them to register and clean up cross-tab listeners and to persist notification preferences.
- **Context with `useContext`:** Context shares the workspace state across pages without manually passing it through every intermediate component.
- **Custom Hooks:** `useTasks` contains workspace behavior; `useTasksContext` reads shared task state; `useWorkspace` reads the route layout's outlet context.
- **Derived data and `useMemo`:** Dashboard counts, visible task collections, project progress, and filtered lists are calculated from workspace data rather than maintained as separate, potentially stale copies.
- **Event handling:** Form submits, button clicks, select changes, and drag-and-drop events call handlers that update the application.
- **Conditional rendering:** The UI shows dialogs, empty states, project details, notifications, and task lists only when the related conditions apply.
- **Lists and keys:** Projects and tasks are rendered from arrays, with stable IDs used as React keys.
- **Controlled forms:** Dialog input values are kept in React state and updated from input events.
- **Routing:** React Router changes the displayed page without a full-page navigation for normal in-app links.

In simple terms, when a user changes a task, the handler updates React state. Components that read that state render the new value, and the persistence/synchronization effects make it available after a refresh or in another open tab.

## 9. Component architecture

### Application and shared state

- `src/main.jsx` — mounts the React application and enables routing.
- `src/App.jsx` — declares routes and the shared state provider.
- `src/context/TasksContext.js` — creates the context for workspace data.
- `src/context/TasksProvider.jsx` — calls `useTasks` and makes its returned state and functions available through Context.
- `src/hooks/useTasks.js` — owns task/project/activity state, workspace mutations, LocalStorage persistence, and cross-tab synchronization.
- `src/hooks/useTasksContext.js` — reads the workspace context and reports an error if used outside the provider.
- `src/hooks/useWorkspace.js` — reads the shared layout context supplied by React Router's `Outlet`.

### Shared interface components

- `AppLayout.jsx` — shared sidebar, top bar, search, notification and profile menus, task/project dialogs, and transient success message.
- `Sidebar.jsx` — route navigation and recent project links.
- `TaskCard.jsx` and `BoardTaskCard.jsx` — task summaries and task actions in list and board layouts.
- `ProjectCard.jsx` — project summary and task-derived progress.
- `TaskDialog.jsx` and `ProjectDialog.jsx` — controlled forms for creating and editing records.
- `ActivityFeed.jsx` — displays the workspace activity list.

### Pages

- `Dashboard.jsx` — task statistics, overall progress, recent projects, activity, and deadlines.
- `MyTasksPage.jsx` — task search and status/priority/assignee/project filters.
- `ProjectsPage.jsx` — project listing, project creation entry point, project details, and associated tasks.
- `BoardPage.jsx` — To do, In progress, and Completed columns, with task status controls and drag-and-drop.
- `TeamPage.jsx` — sample team directory and task counts derived from the task assignments.
- `SettingsPage.jsx` — browser-local notification preferences and sample-task restoration.

## 10. State management explanation

`useTasks` loads an initial workspace and keeps it in React state. The workspace contains `tasks`, `projects`, `activities`, and a `mutationId`. The provider exposes the state and functions such as `updateTasks`, `addProject`, `updateProject`, `deleteProject`, and `resetTasks`.

Mutation functions create a changed workspace object instead of changing existing arrays in place. `commit` updates a ref to the latest workspace, updates React state, saves the new data, and broadcasts it to other tabs. The ref gives event handlers a current workspace value even when an asynchronous browser event arrives between renders.

The UI derives values such as task counts and project completion percentages from the current tasks. For example, a project's completion percentage is the number of its completed tasks divided by the number of tasks associated with that project; a project with no tasks reports zero percent.

## 11. Real-time synchronization explanation

When a local mutation is committed, the prototype:

1. Creates a mutation identifier from the current tab's instance ID and an increasing sequence number.
2. Adds relevant activity entries for task/project changes.
3. Updates in-memory React state and writes the workspace to LocalStorage.
4. Posts a `workspace:update` message, including the updated workspace snapshot, over the `asana-case-study-workspace` BroadcastChannel.

Another tab validates the received workspace, ignores messages from itself, ignores duplicate message IDs held in a bounded set, updates its local React state, and saves the received workspace. It does not re-broadcast received updates, which prevents a broadcast loop. The app also listens for changes to the combined workspace LocalStorage key and applies valid incoming snapshots as a fallback.

These updates are fast browser messages, but simultaneous independent edits are not merged. The prototype applies the latest snapshot it receives and does not provide conflict resolution, operational transformation, or a CRDT.

## 12. LocalStorage implementation

`src/utils/storage.js` defines these data keys:

- `asana.workspace` — combined workspace snapshot containing tasks, projects, activities, and synchronization metadata.
- `asana.tasks` — compatibility copy of the task array.
- `asana.projects` — compatibility copy of the project array.

`loadWorkspace()` first uses the combined workspace when its task, project, and activity properties are arrays. Otherwise, it attempts to load the separate task and project keys and falls back to starter data when those values are absent or invalid. It then builds an initial activity list and saves the initial combined workspace.

`saveWorkspace()` serializes the combined workspace and the compatibility task/project arrays. This makes changes survive refreshes in the same browser profile. These keys are not an account or a secure database; clearing browser storage removes the saved data. JSON parse failures are logged and treated as unavailable data, and invalid preferences use default values.

Notification settings are saved separately under `asana.preferences`.

## 13. BroadcastChannel implementation

The synchronization implementation is in `src/hooks/useTasks.js`.

- Channel name: `asana-case-study-workspace`.
- Message type: `workspace:update`.
- Message contents: mutation ID, source tab ID, and the workspace snapshot.
- Source filtering: a tab ignores messages marked with its own instance ID.
- Duplicate filtering: message IDs already in the receiver's set are ignored; the set is limited to 100 entries.
- Loop prevention: receiving a remote snapshot updates state and storage but does not call the local commit/broadcast path.
- Cleanup: the effect removes the `storage` listener and closes the BroadcastChannel when the provider unmounts.
- Fallback: the browser `storage` event reads changes to `asana.workspace` made in a different same-origin tab.

BroadcastChannel and LocalStorage are scoped to a browser origin/profile. They do not send data to another device, a server, or a different browser profile.

## 14. Application modules

| Module | Implemented behavior |
|---|---|
| Dashboard | Totals for all, completed, pending, and in-progress tasks; overall completion; recent projects; activity; and upcoming task deadlines. |
| My Tasks | Task creation, editing, deletion, completion/status changes, title search, and status/priority/assignee/project filters. |
| List View | A separate route showing the searchable and filterable task list. |
| Kanban Board | Three status columns; task cards can be moved by drag-and-drop or a status selector; board tasks can be added, edited, and deleted. The board supports sorting by due date. |
| Projects | Project creation, editing, deletion, project cards, task-derived progress, deadlines, team member display, and project detail pages. Deleting a project keeps its tasks and clears their project association. |
| Team | Sample member profiles and counts derived from current task assignees; the member directory itself is static sample data. |
| Settings | Toggle and persist browser-local notification preferences; confirm before replacing the current task list with starter tasks. |
| Shared layout | Route navigation, global search input, upcoming-deadline menu, account menu, dialogs, confirmation prompts, and transient status messages. |

## 15. Testing methodology

The project has build and lint scripts but no automated unit- or browser-test script. Verification is therefore a combination of static checks and manual browser testing.

### Static checks

```bash
npm run build
npm run lint
```

The production build checks that Vite can transform and bundle the app. Oxlint checks the source for configured lint issues.

### Manual functional checklist

1. Open the dashboard and check that Dashboard, My Tasks, Projects, List View, Board View, Team, and Settings routes load and sidebar links navigate.
2. Create, edit, complete, change status, and delete a task. Confirm that delete prompts for confirmation.
3. Search for a task title and apply status, priority, assignee, and project filters on My Tasks.
4. Move a task between all three Kanban columns by drag-and-drop and by the status selector.
5. Create, edit, open, and delete a project. Check that task-derived project progress updates and that deleting a project retains its tasks without an association.
6. Refresh the browser and verify that workspace and notification-preference data persist.
7. Open two tabs at the same local URL and verify that task creation, editing, deletion, and status changes appear in the other tab without refreshing.
8. Use a narrow viewport and check that navigation and page content remain usable without horizontal overflow.
9. Inspect browser developer tools for page errors while exercising the flows.

Browser verification during this project covered all listed routes, task/project operations, task filters, board drop handling/status persistence, LocalStorage persistence, settings persistence, and a narrow mobile viewport. Cross-tab behavior is implemented with BroadcastChannel and a storage-event fallback; run the two-tab checklist in the target browser to verify that environment specifically.

## 16. Results

The completed prototype demonstrates a consistent client-side workspace: task and project changes update views that depend on the shared React state; task totals and project completion are derived from current records; changes are persisted in LocalStorage; and a board status change can be made through drag-and-drop or a selector.

The app's configured production build and lint commands complete successfully. Manual browser checks found and helped correct a task-dialog callback issue, verified route rendering and responsive navigation, and confirmed the principal CRUD and persistence paths.

## 17. Limitations

- No backend, account system, access control, shared database, or server-authoritative state.
- Synchronization is limited to open tabs in the same origin and browser profile; it is not collaboration across different devices.
- Concurrent updates are whole-workspace snapshots and are not merged. Conflicts can overwrite one another depending on update order.
- LocalStorage is browser-local, synchronous, and subject to browser storage restrictions or user clearing.
- The team directory, actors, starter tasks/projects, and initial activity feed are sample data. Activity attribution for new changes uses the prototype's fixed Alex Morgan identity; it is not authenticated user identity.
- Notification settings are preferences stored locally; there is no email, push, or scheduled notification service.
- There are no task comments, attachments, permissions, server-side validation, or automated test runner configured.
- The interface is a prototype; it is not Asana's production interface or implementation.

## 18. Future enhancements

- Add a backend API and shared database with authentication and role-based permissions.
- Synchronize updates across devices through a server-backed real-time channel such as WebSockets or Server-Sent Events.
- Add conflict detection and resolution for concurrent edits.
- Replace static team and sample activity data with data tied to authenticated users and recorded events.
- Add automated unit, component, and end-to-end tests.
- Improve accessibility with keyboard-operable Kanban movement, focus management for dialogs, and additional screen-reader announcements.
- Add richer task collaboration such as comments, attachments, and notifications only when backed by corresponding data and services.

## 19. Conclusion

The Asana case-study prototype is a small, understandable React application demonstrating how component composition, Hooks, Context, derived state, LocalStorage, and BroadcastChannel can work together in a browser-based project-management interface. It offers useful learning examples for immediate UI updates and same-browser tab synchronization while making clear that real multi-user collaboration requires a backend, identity, authorization, and conflict-handling design.

## 20. References

1. Asana, product overview: <https://asana.com/product>. Used for high-level context about the category of work-management software, not as evidence of this prototype's implementation.
2. React documentation, “Built-in React Hooks”: <https://react.dev/reference/react>.
3. React documentation, “Passing Data Deeply with Context”: <https://react.dev/learn/passing-data-deeply-with-context>.
4. React Router documentation: <https://reactrouter.com/>.
5. MDN Web Docs, `BroadcastChannel`: <https://developer.mozilla.org/docs/Web/API/BroadcastChannel>.
6. MDN Web Docs, `Window.localStorage`: <https://developer.mozilla.org/docs/Web/API/Window/localStorage>.
7. MDN Web Docs, `storage` event: <https://developer.mozilla.org/docs/Web/API/Window/storage_event>.
8. Vite documentation: <https://vite.dev/guide/>.

Project implementation and feature descriptions in these notes are based on this prototype's source code. External product and API references are provided for background and further study.
