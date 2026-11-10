import { Mail, Plus, Search, UsersRound } from 'lucide-react'
import { useMemo } from 'react'
import useWorkspace from '../hooks/useWorkspace.js'
import useTasksContext from '../hooks/useTasksContext.js'
import { teamMembers } from '../utils/sampleData.js'

export default function TeamPage() {
  const { tasks } = useTasksContext()
  const { search } = useWorkspace()
  const members = useMemo(() => teamMembers.filter((member) => `${member.name} ${member.role} ${member.email}`.toLowerCase().includes(search.toLowerCase())), [search])
  const completed = tasks.filter((task) => task.status === 'Done').length

  return (
    <div className="page-content">
      <section className="page-intro">
        <div><span className="eyebrow">STUDIO WORKSPACE</span><h1>Your team</h1><p>Meet the people building great things together.</p></div>
        <a className="button button-primary" href="mailto:lab-support@example.com?subject=Join%20my%20project%20workspace"><Plus size={16} />Invite a teammate</a>
      </section>
      <section className="team-summary surface-card">
        <div className="team-summary-icon"><UsersRound size={20} /></div><div><strong>{teamMembers.length} people</strong><span>Everyone’s in the loop and moving forward.</span></div>
        <div className="team-summary-metrics"><span><strong>{tasks.length}</strong> assigned tasks</span><span><strong>{completed}</strong> completed</span></div>
      </section>
      <section className="team-section">
        <div className="section-heading"><div><h2>Workspace members <span className="task-count">{members.length}</span></h2><p>Collaborators across all projects.</p></div><div className="team-filter-label"><Search size={15} />{search ? `Matching “${search}”` : 'All members'}</div></div>
        <div className="team-grid">
          {members.map((member) => {
            const assignedTasks = tasks.filter((task) => task.assignee === member.name)
            const doneTasks = assignedTasks.filter((task) => task.status === 'Done').length
            return (
              <article className="team-card surface-card" key={member.email}>
                <div className="team-card-top"><span className={`team-avatar ${member.color}`}>{member.initials}</span><span className="member-presence"><i />Active</span></div>
                <h3>{member.name}</h3><p className="team-role">{member.role}</p><a className="team-email" href={`mailto:${member.email}`}><Mail size={14} />{member.email}</a>
                <div className="team-card-footer"><span><strong>{assignedTasks.length}</strong> assigned</span><span><strong>{doneTasks}</strong> completed</span></div>
              </article>
            )
          })}
          {!members.length && <div className="empty-panel">No team members match “{search}”.</div>}
        </div>
      </section>
    </div>
  )
}
