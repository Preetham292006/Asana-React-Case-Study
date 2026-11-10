import { activityItems, projects as starterProjects } from './sampleData.js'

export const STORAGE_KEY = 'asana.tasks'
export const PROJECTS_KEY = 'asana.projects'
export const WORKSPACE_KEY = 'asana.workspace'

export const starterTasks = [
  {
    id: 'task-1',
    title: 'Map the new homepage',
    description: 'Lay out the core content and narrative for the redesigned homepage.',
    status: 'Done',
    priority: 'High',
    dueDate: '2026-11-10',
    assignee: 'Sam Rivera',
    projectId: 'website-redesign',
  },
  {
    id: 'task-2',
    title: 'Build component library',
    description: 'Document shared buttons, inputs, and navigation patterns.',
    status: 'In progress',
    priority: 'High',
    dueDate: '2026-11-13',
    assignee: 'Jordan Lee',
    projectId: 'website-redesign',
  },
  {
    id: 'task-3',
    title: 'Review landing page copy',
    description: 'Polish the launch messaging with the content team.',
    status: 'To do',
    priority: 'Medium',
    dueDate: '2026-11-16',
    assignee: 'Alex Morgan',
    projectId: 'product-launch',
  },
  {
    id: 'task-4',
    title: 'Prepare launch email sequence',
    description: 'Draft the announcement and follow-up emails for launch week.',
    status: 'In progress',
    priority: 'Medium',
    dueDate: '2026-11-20',
    assignee: 'Maya Chen',
    projectId: 'product-launch',
  },
  {
    id: 'task-5',
    title: 'Prototype onboarding flow',
    description: 'Explore a simple, welcoming first-run experience for the app.',
    status: 'To do',
    priority: 'High',
    dueDate: '2026-11-21',
    assignee: 'Sam Rivera',
    projectId: 'mobile-app',
  },
  {
    id: 'task-6',
    title: 'Set up app navigation',
    description: 'Create the main navigation structure and responsive shell.',
    status: 'To do',
    priority: 'Low',
    dueDate: '2026-11-25',
    assignee: 'Taylor Kim',
    projectId: 'mobile-app',
  },
  {
    id: 'task-7',
    title: 'Collect brand references',
    description: 'Gather visual inspiration and present directions to the team.',
    status: 'Done',
    priority: 'Low',
    dueDate: '2026-11-08',
    assignee: 'Maya Chen',
    projectId: 'brand-refresh',
  },
  {
    id: 'task-8',
    title: 'Schedule stakeholder review',
    description: 'Find a time for the team to review the design directions.',
    status: 'To do',
    priority: 'Low',
    dueDate: '2026-11-27',
    assignee: 'Alex Morgan',
    projectId: 'brand-refresh',
  },
]

function readJson(key) {
  const raw = localStorage.getItem(key)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch (error) {
    console.error(`Unable to read Asana case study data from ${key}.`, error)
    return null
  }
}

function initialActivities() {
  return activityItems.map((item) => ({
    id: item.id,
    actor: item.name,
    initials: item.initials,
    color: item.color,
    action: item.action,
    subject: item.subject,
    time: item.time,
  }))
}

export function loadWorkspace() {
  const storedWorkspace = readJson(WORKSPACE_KEY)
  if (
    storedWorkspace
    && Array.isArray(storedWorkspace.tasks)
    && Array.isArray(storedWorkspace.projects)
    && Array.isArray(storedWorkspace.activities)
  ) {
    return storedWorkspace
  }

  const savedTasks = readJson(STORAGE_KEY)
  const savedProjects = readJson(PROJECTS_KEY)
  const initialWorkspace = {
    tasks: Array.isArray(savedTasks) ? savedTasks : starterTasks,
    projects: Array.isArray(savedProjects) ? savedProjects : starterProjects,
    activities: initialActivities(),
    mutationId: null,
  }
  saveWorkspace(initialWorkspace)
  return initialWorkspace
}

export function saveWorkspace(workspace) {
  localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace.tasks))
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(workspace.projects))
}

export function saveTasks(tasks) {
  const workspace = loadWorkspace()
  saveWorkspace({ ...workspace, tasks })
}
