import { useEffect, useMemo, useState } from 'react'
import { Bell, ChevronRight, Command, Plus, Search, X } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import TaskDialog from './TaskDialog.jsx'
import ProjectDialog from './ProjectDialog.jsx'
import useTasksContext from '../hooks/useTasksContext.js'
import { formatDate } from '../utils/sampleData.js'

const pageTitles = {
  '/': 'Dashboard',
  '/my-tasks': 'My Tasks',
  '/projects': 'Projects',
  '/list-view': 'List View',
  '/board': 'Board View',
  '/team': 'Team',
  '/settings': 'Settings',
}

export default function AppLayout() {
  const { tasks, projects, updateTasks, addProject, updateProject } = useTasksContext()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [dialogTask, setDialogTask] = useState(null)
  const [projectDialog, setProjectDialog] = useState(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const projectMatch = location.pathname.match(/^\/projects\/([^/]+)$/)
  const selectedProject = projectMatch && projects.find((project) => project.id === projectMatch[1])
  const pageTitle = selectedProject?.name || pageTitles[location.pathname] || 'Asana'

  const upcoming = useMemo(() => tasks
    .filter((task) => task.status !== 'Done' && task.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3), [tasks])

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        document.querySelector('.top-search-input')?.focus()
      }
      if (event.key === 'Escape') {
        setNotificationsOpen(false)
        setProfileOpen(false)
        setDialogTask(null)
        setProjectDialog(null)
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  useEffect(() => {
    if (!notice) return undefined
    const timeout = window.setTimeout(() => setNotice(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [notice])

  function createTask(task) {
    updateTasks((current) => [task, ...current])
    setNotice('Task created successfully')
  }

  function saveTask(task, isEditing) {
    if (isEditing) {
      updateTasks((current) => current.map((item) => item.id === task.id ? task : item))
      setNotice('Task updated successfully')
    } else {
      createTask(task)
    }
    setDialogTask(null)
  }

  function saveProject(project) {
    if (projects.some((item) => item.id === project.id)) {
      const { id, ...changes } = project
      updateProject(id, changes)
      setNotice('Project updated successfully')
    } else {
      addProject(project)
      setNotice('Project created successfully')
    }
    setProjectDialog(null)
  }

  function dismissNotification(taskId) {
    updateTasks((current) => current.map((task) => task.id === taskId ? { ...task, status: 'Done' } : task))
    setNotice('Task marked complete')
  }

  return (
    <div className="app-shell">
      <Sidebar onCreateProject={() => setProjectDialog({})} />
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Asana Case Study</span><ChevronRight size={15} /><strong>{pageTitle}</strong></div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={16} />
              <input className="top-search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks, projects..." />
              {search ? <button className="search-clear" aria-label="Clear search" onClick={() => setSearch('')}><X size={14} /></button> : <kbd><Command size={10} /> K</kbd>}
            </label>
            <div className="popover-anchor">
              <button className={`icon-button notification-button${notificationsOpen ? ' is-open' : ''}`} aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false) }}>
                <Bell size={19} />{upcoming.length > 0 && <i />}
              </button>
              {notificationsOpen && (
                <div className="popover notification-popover">
                  <div className="popover-heading"><div><strong>Upcoming deadlines</strong><small>{upcoming.length} tasks need attention</small></div><button className="icon-button" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><X size={16} /></button></div>
                  {upcoming.length ? upcoming.map((task) => (
                    <div className="notification-item" key={task.id}>
                      <span className="notification-dot" />
                      <span className="notification-copy"><strong>{task.title}</strong><small>{task.assignee} · {formatDate(task.dueDate)}</small></span>
                      <button className="notification-done" onClick={() => dismissNotification(task.id)} aria-label={`Complete ${task.title}`}>Done</button>
                    </div>
                  )) : <p className="notification-empty">You’re all caught up. No upcoming tasks.</p>}
                </div>
              )}
            </div>
            <div className="popover-anchor">
              <button className="top-avatar avatar-lavender" aria-label="Open profile menu" aria-expanded={profileOpen} onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false) }}>AM</button>
              {profileOpen && <div className="popover profile-popover"><strong>Alex Morgan</strong><small>alex@studio.co</small><Link to="/settings" onClick={() => setProfileOpen(false)}>Account settings</Link></div>}
            </div>
            <button className="button button-primary top-create" onClick={() => setDialogTask({ task: {}, isEditing: false })}><Plus size={16} /><span>New task</span></button>
          </div>
        </header>
        <Outlet context={{
          search,
          openTaskDialog: (initialTask = {}, isEditing = false) => setDialogTask({ task: initialTask, isEditing }),
          openProjectDialog: (project = null) => setProjectDialog(project || {}),
          setNotice,
        }} />
      </main>
      {dialogTask && <TaskDialog initialTask={dialogTask.task} isEditing={dialogTask.isEditing} onClose={() => setDialogTask(null)} onSave={(task) => saveTask(task, dialogTask.isEditing)} />}
      {projectDialog && <ProjectDialog project={projectDialog.id ? projectDialog : null} onClose={() => setProjectDialog(null)} onSave={saveProject} />}
      {notice && <div className="toast-message" role="status">{notice}</div>}
    </div>
  )
}
