import { ArrowUpRight, CalendarDays, CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate, teamMembers } from '../utils/sampleData.js'

export default function ProjectCard({ project, tasks, onEdit, onDelete }) {
  const projectTasks = tasks.filter((task) => task.projectId === project.id)
  const completed = projectTasks.filter((task) => task.status === 'Done').length
  const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0
  const members = project.members.map((name) => teamMembers.find((member) => member.name === name)).filter(Boolean)

  return (
    <article className="project-card">
      <div className="project-card-top">
        <span className={`project-icon ${project.color}`}><span /></span>
        <div className="project-card-actions">
          {onEdit && <button className="icon-button" onClick={() => onEdit(project)} aria-label={`Edit ${project.name}`}><Pencil size={14} /></button>}
          {onDelete && <button className="icon-button" onClick={() => onDelete(project)} aria-label={`Delete ${project.name}`}><Trash2 size={15} /></button>}
          <Link className="project-card-arrow" to={`/projects/${project.id}`} aria-label={`Open ${project.name}`}><ArrowUpRight size={17} /></Link>
        </div>
      </div>
      <Link className="project-card-title" to={`/projects/${project.id}`}>{project.name}</Link>
      <p>{project.description}</p>
      <div className="project-progress-label"><span>Progress</span><strong>{progress}%</strong></div>
      <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      <div className="project-card-footer">
        <span className="project-task-count"><CheckCircle2 size={14} />{projectTasks.length} tasks</span>
        <span className="project-members" aria-label={`${members.length} team members`}>
          {members.slice(0, 3).map((member) => <span className={`member-avatar ${member.color}`} key={member.name} title={member.name}>{member.initials}</span>)}
          {members.length > 3 && <span className="member-overflow">+{members.length - 3}</span>}
        </span>
      </div>
      <div className="project-deadline"><CalendarDays size={13} />Due {formatDate(project.deadline)}</div>
    </article>
  )
}
