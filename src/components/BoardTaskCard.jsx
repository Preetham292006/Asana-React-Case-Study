import { CalendarDays, GripVertical, Pencil, Trash2 } from 'lucide-react'
import { teamMembers } from '../utils/sampleData.js'

export default function BoardTaskCard({ task, onStatusChange, onEdit, onDelete, onNotice }) {
  const member = teamMembers.find((item) => item.name === task.assignee)

  function confirmDelete() {
    if (!window.confirm(`Delete "${task.title}"? This action cannot be undone.`)) return
    onDelete(task.id)
    onNotice?.('Task deleted')
  }

  return (
    <article
      className="board-task-card"
      draggable
      onDragStart={(event) => event.dataTransfer.setData('text/task-id', task.id)}
    >
      <div className="board-card-top"><span className={`priority-dot priority-dot-${task.priority.toLowerCase()}`} />{task.priority} priority<div className="board-card-actions"><button className="icon-button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}><Pencil size={13} /></button><button className="icon-button" onClick={confirmDelete} aria-label={`Delete ${task.title}`}><Trash2 size={14} /></button><span className="drag-handle" aria-hidden="true"><GripVertical size={16} /></span></div></div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="board-card-footer">
        <span className="board-due"><CalendarDays size={13} />{task.dueDate ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}</span>
        <span className={`member-avatar ${member?.color || 'avatar-lavender'}`} title={task.assignee}>{member?.initials || task.assignee.split(' ').map((part) => part[0]).join('')}</span>
      </div>
      <label className="board-status-control"><span>Move to</span><select value={task.status} aria-label={`Move ${task.title}`} onChange={(event) => { onStatusChange(task.id, event.target.value); onNotice?.('Task status updated') }}><option>To do</option><option>In progress</option><option>Done</option></select></label>
    </article>
  )
}
