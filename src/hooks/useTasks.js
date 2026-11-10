import { useCallback, useEffect, useRef, useState } from 'react'
import { loadWorkspace, saveWorkspace, starterTasks, WORKSPACE_KEY } from '../utils/storage.js'

const CHANNEL_NAME = 'asana-case-study-workspace'
const ACTIVITY_LIMIT = 40

function createId() {
  return crypto.randomUUID()
}

function taskChanges(before, after) {
  const previous = new Map(before.map((task) => [task.id, task]))
  const next = new Map(after.map((task) => [task.id, task]))
  const changes = []

  after.forEach((task) => {
    const oldTask = previous.get(task.id)
    if (!oldTask) {
      changes.push({ action: 'created a task', subject: task.title })
    } else if (JSON.stringify(oldTask) !== JSON.stringify(task)) {
      changes.push({
        action: oldTask.status !== task.status ? `moved a task to ${task.status}` : 'updated a task',
        subject: task.title,
      })
    }
  })

  before.forEach((task) => {
    if (!next.has(task.id)) changes.push({ action: 'deleted a task', subject: task.title })
  })

  return changes
}

function addActivity(activities, { action, subject }) {
  return [{
    id: createId(),
    actor: 'Alex Morgan',
    initials: 'AM',
    color: 'avatar-lavender',
    action,
    subject,
    time: 'Just now',
  }, ...activities].slice(0, ACTIVITY_LIMIT)
}

export default function useTasks() {
  const [workspace, setWorkspace] = useState(loadWorkspace)
  const workspaceRef = useRef(workspace)
  const channelRef = useRef(null)
  const instanceIdRef = useRef(createId())
  const sequenceRef = useRef(0)
  const receivedIdsRef = useRef(new Set())

  useEffect(() => {
    function receiveWorkspace(nextWorkspace) {
      if (
        !nextWorkspace
        || !Array.isArray(nextWorkspace.tasks)
        || !Array.isArray(nextWorkspace.projects)
        || !Array.isArray(nextWorkspace.activities)
        || nextWorkspace.mutationId === workspaceRef.current.mutationId
      ) return

      workspaceRef.current = nextWorkspace
      setWorkspace(nextWorkspace)
      saveWorkspace(nextWorkspace)
    }

    function handleStorage(event) {
      if (event.key !== WORKSPACE_KEY || !event.newValue) return

      try {
        receiveWorkspace(JSON.parse(event.newValue))
      } catch (error) {
        console.error('Unable to synchronize Asana case study workspace from LocalStorage.', error)
      }
    }

    window.addEventListener('storage', handleStorage)
    if ('BroadcastChannel' in window) {
      channelRef.current = new BroadcastChannel(CHANNEL_NAME)
      channelRef.current.onmessage = ({ data }) => {
        if (data?.type !== 'workspace:update' || data.source === instanceIdRef.current) return
        if (receivedIdsRef.current.has(data.id)) return

        receivedIdsRef.current.add(data.id)
        if (receivedIdsRef.current.size > 100) {
          receivedIdsRef.current.delete(receivedIdsRef.current.values().next().value)
        }
        receiveWorkspace(data.workspace)
      }
    }

    return () => {
      window.removeEventListener('storage', handleStorage)
      channelRef.current?.close()
      channelRef.current = null
    }
  }, [])

  const commit = useCallback((mutate, { activities = [] } = {}) => {
    const current = workspaceRef.current
    const next = mutate(current)
    if (next === current) return

    const mutationId = `${instanceIdRef.current}:${++sequenceRef.current}`
    const updated = {
      ...next,
      activities: activities.reduce(addActivity, next.activities),
      mutationId,
    }

    workspaceRef.current = updated
    setWorkspace(updated)
    saveWorkspace(updated)
    channelRef.current?.postMessage({
      type: 'workspace:update',
      id: mutationId,
      source: instanceIdRef.current,
      workspace: updated,
    })
  }, [])

  const updateTasks = useCallback((nextTasks) => {
    const current = workspaceRef.current
    const tasks = typeof nextTasks === 'function' ? nextTasks(current.tasks) : nextTasks
    if (JSON.stringify(tasks) === JSON.stringify(current.tasks)) return
    const changes = taskChanges(current.tasks, tasks)
    commit((workspaceState) => ({ ...workspaceState, tasks }), { activities: changes })
  }, [commit])

  const addProject = useCallback((project) => {
    commit((current) => ({ ...current, projects: [...current.projects, project] }), {
      activities: [{ action: 'created a project', subject: project.name }],
    })
  }, [commit])

  const updateProject = useCallback((projectId, changes) => {
    const currentProject = workspaceRef.current.projects.find((project) => project.id === projectId)
    if (!currentProject) return

    commit((current) => ({
      ...current,
      projects: current.projects.map((project) => project.id === projectId ? { ...project, ...changes } : project),
    }), {
      activities: [{ action: 'updated a project', subject: changes.name || currentProject.name }],
    })
  }, [commit])

  const deleteProject = useCallback((projectId) => {
    const project = workspaceRef.current.projects.find((item) => item.id === projectId)
    if (!project) return

    commit((current) => ({
      ...current,
      projects: current.projects.filter((item) => item.id !== projectId),
      tasks: current.tasks.map((task) => task.projectId === projectId ? { ...task, projectId: '' } : task),
    }), {
      activities: [{ action: 'deleted a project', subject: project.name }],
    })
  }, [commit])

  const resetTasks = useCallback(() => updateTasks(starterTasks), [updateTasks])

  return {
    tasks: workspace.tasks,
    projects: workspace.projects,
    activities: workspace.activities,
    updateTasks,
    addProject,
    updateProject,
    deleteProject,
    resetTasks,
  }
}
