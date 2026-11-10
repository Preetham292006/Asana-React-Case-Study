import { useState } from 'react'
import { X } from 'lucide-react'
import { teamMembers } from '../utils/sampleData.js'
import useTasksContext from '../hooks/useTasksContext.js'

const emptyTask = {
  title: '',
  description: '',
  status: 'To do',
  priority: 'Medium',
  dueDate: '',
  assignee: 'Alex Morgan',
  projectId: '',
}

export default function TaskDialog({ initialTask = {}, isEditing = false, onClose, onSave }) {
  const { projects } = useTasksContext()
  const [task, setTask] = useState(() => {
    const requestedProjectId = initialTask.projectId || (isEditing ? '' : projects[0]?.id || '')
    const projectId = projects.some((project) => project.id === requestedProjectId) ? requestedProjectId : ''
    return { ...emptyTask, ...initialTask, projectId }
  })

  function handleSubmit(event) {
    event.preventDefault()
    onSave({ ...task, id: task.id || crypto.randomUUID() })
  }

  function updateField(event) {
    setTask((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="task-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog-heading">
          <div><span className="eyebrow">YOUR WORKSPACE</span><h2 id="dialog-title">{isEditing ? 'Edit task' : 'Create a task'}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="form-field">Task name<input autoFocus required maxLength={100} name="title" value={task.title} onChange={updateField} placeholder="What needs to get done?" /></label>
          <label className="form-field">Description<textarea name="description" rows={3} value={task.description} onChange={updateField} placeholder="Add a few details..." /></label>
          <div className="form-row">
            <label className="form-field">Priority<select name="priority" value={task.priority} onChange={updateField}><option>Low</option><option>Medium</option><option>High</option></select></label>
            <label className="form-field">Due date<input type="date" name="dueDate" value={task.dueDate} onChange={updateField} /></label>
          </div>
          <div className="form-row">
            <label className="form-field">Project<select name="projectId" value={task.projectId || ''} onChange={updateField}><option value="">No project</option>{projects.map((project) => <option value={project.id} key={project.id}>{project.name}</option>)}</select></label>
            <label className="form-field">Assignee<select name="assignee" value={task.assignee} onChange={updateField}>{teamMembers.map((member) => <option value={member.name} key={member.name}>{member.name}</option>)}</select></label>
          </div>
          <div className="dialog-actions"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">{isEditing ? 'Save changes' : 'Create task'}</button></div>
        </form>
      </section>
    </div>
  )
}
