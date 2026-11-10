import { useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, CheckCircle2, CircleDashed, Clock3, Plus, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import ActivityFeed from '../components/ActivityFeed.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import TaskCard from '../components/TaskCard.jsx'
import useWorkspace from '../hooks/useWorkspace.js'
import useTasksContext from '../hooks/useTasksContext.js'

export default function Dashboard() {
  const { tasks, projects, updateTasks, deleteProject } = useTasksContext()
  const { search, openTaskDialog, openProjectDialog, setNotice } = useWorkspace()
  const searchQuery = search.toLowerCase()
  const [now] = useState(() => new Date())
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'
  const today = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
  const counts = {
    completed: tasks.filter((task) => task.status === 'Done').length,
    pending: tasks.filter((task) => task.status === 'To do').length,
    inProgress: tasks.filter((task) => task.status === 'In progress').length,
  }
  const progress = tasks.length ? Math.round((counts.completed / tasks.length) * 100) : 0
  const upcoming = useMemo(() => tasks
    .filter((task) => task.status !== 'Done' && task.dueDate && `${task.title} ${task.assignee}`.toLowerCase().includes(searchQuery))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4), [searchQuery, tasks])
  const recentTasks = tasks.filter((task) => (search || task.status !== 'Done') && task.title.toLowerCase().includes(searchQuery)).slice(0, 4)
  const visibleProjects = projects.filter((project) => `${project.name} ${project.description}`.toLowerCase().includes(searchQuery)).slice(0, 3)

  function changeStatus(id, status) {
    updateTasks((current) => current.map((task) => task.id === id ? { ...task, status } : task))
  }

  function deleteTask(id) {
    updateTasks((current) => current.filter((task) => task.id !== id))
  }

  function removeProject(project) {
    if (!window.confirm(`Delete "${project.name}"? Its tasks will be kept without a project.`)) return
    deleteProject(project.id)
    setNotice('Project deleted')
  }

  return (
    <div className="page-content">
      <section className="welcome-row">
        <div>
          <span className="eyebrow">{today}</span>
          <h1>{greeting}, Alex <span className="wave">✦</span></h1>
          <p>Here’s a little snapshot of your team’s progress today.</p>
        </div>
        <button className="button button-primary" onClick={() => openTaskDialog()}><Plus size={16} />Create a task</button>
      </section>

      <section className="stats-grid" aria-label="Task overview">
        <article className="stat-card stat-indigo">
          <span className="stat-icon"><CheckCircle2 size={18} /></span>
          <span className="stat-label">Total tasks</span>
          <strong>{tasks.length}</strong>
          <span className="stat-caption"><TrendingUp size={13} /> Your team’s active workload</span>
        </article>
        <article className="stat-card stat-green">
          <span className="stat-icon"><CheckCircle2 size={18} /></span>
          <span className="stat-label">Completed</span>
          <strong>{counts.completed}</strong>
          <span className="stat-caption"><span className="trend">↗ {progress}%</span> of all tasks</span>
        </article>
        <article className="stat-card stat-amber">
          <span className="stat-icon"><CircleDashed size={18} /></span>
          <span className="stat-label">Pending</span>
          <strong>{counts.pending}</strong>
          <span className="stat-caption">Ready to be picked up</span>
        </article>
        <article className="stat-card stat-blue">
          <span className="stat-icon"><Clock3 size={18} /></span>
          <span className="stat-label">In progress</span>
          <strong>{counts.inProgress}</strong>
          <span className="stat-caption">Currently being worked on</span>
        </article>
      </section>

      <section className="progress-overview surface-card">
        <div className="progress-overview-copy">
          <span className="progress-ornament">✳</span>
          <span className="eyebrow">TEAM MOMENTUM</span>
          <h2>Small steps add up.</h2>
          <p>Your team has completed <strong>{counts.completed} of {tasks.length}</strong> tasks across all projects.</p>
        </div>
        <div className="progress-overview-meter">
          <div className="progress-ring" style={{ '--progress': `${progress}%` }}><div><strong>{progress}%</strong><small>complete</small></div></div>
          <div className="progress-key"><span><i className="key-completed" />Completed <b>{counts.completed}</b></span><span><i className="key-remaining" />Remaining <b>{tasks.length - counts.completed}</b></span></div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div><h2>Recent projects</h2><p>Keep an eye on your team’s latest work.</p></div>
          <Link className="text-action" to="/projects">All projects <ArrowRight size={14} /></Link>
        </div>
        <div className="project-grid">
          {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} tasks={tasks} onEdit={openProjectDialog} onDelete={removeProject} />)}
          {!visibleProjects.length && <div className="empty-panel">No projects match “{search}”.</div>}
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <ActivityFeed />
        <section className="surface-card deadline-card">
          <div className="surface-heading"><div><h2>Upcoming deadlines</h2><p>Coming up next on your calendar</p></div><CalendarDays size={17} className="muted-icon" /></div>
          {upcoming.length ? <div className="deadline-list">
            {upcoming.map((task) => (
              <div className="deadline-item" key={task.id}>
                <span className="deadline-date"><strong>{new Date(`${task.dueDate}T00:00:00`).getDate()}</strong><small>{new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short' })}</small></span>
                <span className="deadline-copy"><strong>{task.title}</strong><small>{projects.find((project) => project.id === task.projectId)?.name || 'Workspace task'}</small></span>
                <span className={`priority priority-${task.priority.toLowerCase()}`}><i />{task.priority}</span>
              </div>
            ))}
          </div> : <div className="empty-inline">No upcoming deadlines. You’re all caught up!</div>}
          <Link className="deadline-link" to="/my-tasks">See all tasks <ArrowRight size={13} /></Link>
        </section>
      </section>

      <section className="dashboard-section compact-tasks">
        <div className="section-heading"><div><h2>Pick up where you left off</h2><p>A few tasks that could use your attention.</p></div><Link className="text-action" to="/my-tasks">My tasks <ArrowRight size={14} /></Link></div>
        <div className="task-list">
          {recentTasks.map((task) => <TaskCard key={task.id} task={task} onStatusChange={changeStatus} onDelete={deleteTask} onEdit={(item) => openTaskDialog(item, true)} onNotice={setNotice} />)}
          {!recentTasks.length && <div className="empty-panel">Nothing on your plate. Create a task to get started.</div>}
        </div>
      </section>
    </div>
  )
}
