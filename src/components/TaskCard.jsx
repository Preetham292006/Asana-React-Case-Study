import { CalendarDays, Check, Circle, Pencil, Trash2 } from 'lucide-react'
import useTasksContext from '../hooks/useTasksContext.js'

function formatDueDate(date) {
  if (!date) return 'No due date'
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TaskCard({ task, onStatusChange, onDelete, onEdit, onNotice }) {
  const { projects } = useTasksContext()

  function confirmDelete() {
    if (!window.confirm(`Delete "${task.title}"? This action cannot be undone.`)) return
    onDelete(task.id)
    onNotice?.('Task deleted')
  }

  return (
    <article className={`task-card${task.status === 'Done' ? ' task-complete' : ''}`}>
      <button
        className={`task-check${task.status === 'Done' ? ' checked' : ''}`}
        aria-label={task.status === 'Done' ? `Mark ${task.title} as not done` : `Mark ${task.title} as done`}
        onClick={() => {
          onStatusChange(task.id, task.status === 'Done' ? 'To do' : 'Done')
          onNotice?.('Task status updated')
        }}
      >
        {task.status === 'Done' ? <Check size={14} /> : <Circle size={18} />}
      </button>
      <div className="task-main">
        <div className="task-title-row">
          <h3>{task.title}</h3>
          <div className="task-actions">
            {onEdit && <button className="icon-button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}><Pencil size={14} /></button>}
            <button className="icon-button" onClick={confirmDelete} aria-label={`Delete ${task.title}`}><Trash2 size={15} /></button>
          </div>
        </div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta">
          <span className={`priority priority-${task.priority.toLowerCase()}`}><span />{task.priority}</span>
          <span className="task-due"><CalendarDays size={14} />{formatDueDate(task.dueDate)}</span>
          {task.projectId && <span className="task-project">{projects.find((project) => project.id === task.projectId)?.name || 'Workspace'}</span>}
          <span className="task-assignee"><span className="assignee-avatar">{task.assignee.split(' ').map((part) => part[0]).join('')}</span>{task.assignee}</span>
        </div>
      </div>
      <select
        className={`status-select status-${task.status.toLowerCase().replaceAll(' ', '-')}`}
        aria-label={`Status for ${task.title}`}
        value={task.status}
        onChange={(event) => {
          onStatusChange(task.id, event.target.value)
          onNotice?.('Task status updated')
        }}
      >
        <option>To do</option>
        <option>In progress</option>
        <option>Done</option>
      </select>
    </article>
  )
}
