import { useState } from 'react'
import { X } from 'lucide-react'
import { teamMembers } from '../utils/sampleData.js'

const colors = ['project-indigo', 'project-blue', 'project-cyan', 'project-violet']

export default function ProjectDialog({ project, onClose, onSave }) {
  const [values, setValues] = useState(() => ({
    name: project?.name || '',
    description: project?.description || '',
    deadline: project?.deadline || '',
    color: project?.color || colors[0],
    members: project?.members || ['Alex Morgan'],
  }))

  function updateField(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function toggleMember(name) {
    setValues((current) => ({
      ...current,
      members: current.members.includes(name)
        ? current.members.filter((member) => member !== name)
        : [...current.members, name],
    }))
  }

  function submit(event) {
    event.preventDefault()
    const id = project?.id || `project-${crypto.randomUUID()}`
    onSave({ ...values, id })
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="task-dialog project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
        <div className="dialog-heading">
          <div><span className="eyebrow">YOUR WORKSPACE</span><h2 id="project-dialog-title">{project ? 'Edit project' : 'Create a project'}</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        </div>
        <form onSubmit={submit}>
          <label className="form-field">Project name<input autoFocus required maxLength={70} name="name" value={values.name} onChange={updateField} placeholder="e.g. Website redesign" /></label>
          <label className="form-field">Description<textarea rows={3} name="description" value={values.description} onChange={updateField} placeholder="What are you working toward?" /></label>
          <div className="form-row">
            <label className="form-field">Deadline<input type="date" name="deadline" value={values.deadline} onChange={updateField} /></label>
            <label className="form-field">Project color<select name="color" value={values.color} onChange={updateField}>{colors.map((color, index) => <option value={color} key={color}>Color {index + 1}</option>)}</select></label>
          </div>
          <fieldset className="member-picker">
            <legend>Project members</legend>
            <div className="member-picker-list">
              {teamMembers.map((member) => (
                <label key={member.name}><input type="checkbox" checked={values.members.includes(member.name)} onChange={() => toggleMember(member.name)} /><span className={`member-avatar ${member.color}`}>{member.initials}</span>{member.name}</label>
              ))}
            </div>
          </fieldset>
          <div className="dialog-actions"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary">{project ? 'Save changes' : 'Create project'}</button></div>
        </form>
      </section>
    </div>
  )
}
