import { useMemo } from 'react'
import { ArrowLeft, ArrowUpRight, CalendarDays, CheckCircle2, Pencil, Plus, Trash2, Users2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard.jsx'
import TaskCard from '../components/TaskCard.jsx'
import useWorkspace from '../hooks/useWorkspace.js'
import useTasksContext from '../hooks/useTasksContext.js'
import { formatDate } from '../utils/sampleData.js'

export default function ProjectsPage() {
  const { projectId } = useParams()
  const { tasks, projects, updateTasks, deleteProject } = useTasksContext()
  const { search, openTaskDialog, openProjectDialog, setNotice } = useWorkspace()
  const navigate = useNavigate()
  const project = projects.find((item) => item.id === projectId)

  const visibleProjects = useMemo(() => projects.filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(search.toLowerCase())), [projects, search])
  const projectTasks = useMemo(() => tasks.filter((task) => task.projectId === projectId && task.title.toLowerCase().includes(search.toLowerCase())), [projectId, search, tasks])

  function changeStatus(id, status) {
    updateTasks((current) => current.map((task) => task.id === id ? { ...task, status } : task))
  }

  function deleteTask(id) {
    updateTasks((current) => current.filter((task) => task.id !== id))
  }

  function removeProject(item) {
    if (!window.confirm(`Delete "${item.name}"? Its tasks will be kept without a project.`)) return
    deleteProject(item.id)
    setNotice('Project deleted')
    navigate('/projects')
  }

  if (projectId && !project) {
    return <div className="page-content"><div className="empty-state surface-card"><h1>Project not found</h1><p>This project may have been moved or removed.</p><Link className="button button-secondary" to="/projects">Back to projects</Link></div></div>
  }

  if (!project) {
    return (
      <div className="page-content">
        <section className="page-intro">
          <div><span className="eyebrow">WORKSPACE OVERVIEW</span><h1>Projects</h1><p>Good work happens when everyone knows what they’re working toward.</p></div>
          <button className="button button-primary" onClick={() => openProjectDialog()}><Plus size={16} />New project</button>
        </section>
        <div className="project-summary-strip"><span><strong>{projects.length}</strong> active projects</span><span><strong>{tasks.length}</strong> total tasks</span><span><strong>{tasks.filter((task) => task.status === 'Done').length}</strong> tasks completed</span></div>
        <div className="projects-page-grid">{visibleProjects.map((item) => <ProjectCard key={item.id} project={item} tasks={tasks} onEdit={openProjectDialog} onDelete={removeProject} />)}{!visibleProjects.length && <div className="empty-panel">No projects match “{search}”.</div>}</div>
      </div>
    )
  }

  const completed = projectTasks.filter((task) => task.status === 'Done').length
  const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0

  return (
    <div className="page-content">
      <Link to="/projects" className="back-link"><ArrowLeft size={15} />All projects</Link>
      <section className="project-detail-hero surface-card">
        <div className="project-detail-main">
          <span className={`project-icon ${project.color}`}><span /></span>
          <span className="eyebrow">PROJECT OVERVIEW</span>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <div className="project-detail-meta"><span><CalendarDays size={15} />Due {formatDate(project.deadline)}</span><span><Users2 size={15} />{project.members.length} members</span><span><CheckCircle2 size={15} />{projectTasks.length} tasks</span></div>
        </div>
        <div className="project-detail-actions">
          <button className="button button-secondary" onClick={() => openProjectDialog(project)}><Pencil size={14} />Edit project</button>
          <button className="button button-secondary danger-button" onClick={() => removeProject(project)}><Trash2 size={14} />Delete</button>
        </div>
        <div className="detail-progress"><div className="progress-ring" style={{ '--progress': `${progress}%` }}><div><strong>{progress}%</strong><small>complete</small></div></div><span>Project progress</span></div>
        <div className="project-detail-team">{project.members.map((name) => <span key={name} title={name}>{name.split(' ').map((part) => part[0]).join('')}</span>)}</div>
      </section>
      <section className="dashboard-section project-task-section">
        <div className="section-heading"><div><h2>Project tasks <span className="task-count">{projectTasks.length}</span></h2><p>Track progress and keep the momentum going.</p></div><button className="button button-primary" onClick={() => openTaskDialog({ projectId: project.id })}><Plus size={15} />Add task</button></div>
        <div className="task-list">
          {projectTasks.length ? projectTasks.map((task) => <TaskCard key={task.id} task={task} onStatusChange={changeStatus} onDelete={deleteTask} onEdit={(item) => openTaskDialog(item, true)} onNotice={setNotice} />) : <div className="empty-state surface-card"><CheckCircle2 size={23} /><h3>No tasks in this project yet</h3><p>Create a task and assign it to this project.</p><button className="button button-secondary" onClick={() => openTaskDialog({ projectId: project.id })}><Plus size={15} />Create a task</button></div>}
        </div>
      </section>
      <Link to="/board" className="text-action project-board-link">Open the team board <ArrowUpRight size={14} /></Link>
    </div>
  )
}
