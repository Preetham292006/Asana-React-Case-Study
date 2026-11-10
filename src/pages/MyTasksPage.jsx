import { useMemo, useState } from 'react'
import { CalendarDays, ListFilter, Plus } from 'lucide-react'
import TaskCard from '../components/TaskCard.jsx'
import useWorkspace from '../hooks/useWorkspace.js'
import useTasksContext from '../hooks/useTasksContext.js'
import { teamMembers } from '../utils/sampleData.js'

const taskFilters = ['All tasks', 'To do', 'In progress', 'Done']

export default function MyTasksPage({ title = 'My Tasks' }) {
  const { tasks, projects, updateTasks } = useTasksContext()
  const { search, openTaskDialog, setNotice } = useWorkspace()
  const [filter, setFilter] = useState('All tasks')
  const [projectFilter, setProjectFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesText = task.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filter === 'All tasks' || task.status === filter
    const matchesProject = projectFilter === 'all' || task.projectId === projectFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    const matchesAssignee = assigneeFilter === 'all' || task.assignee === assigneeFilter
    return matchesText && matchesStatus && matchesProject && matchesPriority && matchesAssignee
  }), [assigneeFilter, filter, priorityFilter, projectFilter, search, tasks])

  function changeStatus(id, status) {
    updateTasks((current) => current.map((task) => task.id === id ? { ...task, status } : task))
  }

  function deleteTask(id) {
    updateTasks((current) => current.filter((task) => task.id !== id))
  }

  return (
    <div className="page-content">
      <section className="page-intro">
        <div><span className="eyebrow">{title === 'List View' ? 'WORKSPACE TASKS' : 'YOUR WORKSPACE'}</span><h1>{title}</h1><p>{title === 'List View' ? 'Review and organize every task in a clear, sortable list.' : 'All the work your team is moving forward, in one place.'}</p></div>
        <button className="button button-primary" onClick={() => openTaskDialog()}><Plus size={16} />New task</button>
      </section>
      <section className="surface-card task-page-card">
        <div className="task-page-toolbar">
          <div className="filter-tabs" role="tablist" aria-label="Filter by status">
            {taskFilters.map((item) => <button key={item} role="tab" aria-selected={filter === item} className={`filter-tab${filter === item ? ' selected' : ''}`} onClick={() => setFilter(item)}>{item}<span>{item === 'All tasks' ? tasks.length : tasks.filter((task) => task.status === item).length}</span></button>)}
          </div>
          <div className="task-filter-controls">
            <label className="select-filter"><ListFilter size={15} /><select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} aria-label="Filter by priority"><option value="all">All priorities</option><option>High</option><option>Medium</option><option>Low</option></select></label>
            <label className="select-filter"><select value={assigneeFilter} onChange={(event) => setAssigneeFilter(event.target.value)} aria-label="Filter by assignee"><option value="all">All assignees</option>{teamMembers.map((member) => <option key={member.name}>{member.name}</option>)}</select></label>
            <label className="select-filter"><select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} aria-label="Filter by project"><option value="all">All projects</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
          </div>
        </div>
        <div className="task-list">
          {visibleTasks.length ? visibleTasks.map((task) => <TaskCard key={task.id} task={task} onStatusChange={changeStatus} onDelete={deleteTask} onEdit={(item) => openTaskDialog(item, true)} onNotice={setNotice} />) : <div className="empty-state"><CalendarDays size={23} /><h3>No matching tasks</h3><p>Try a different search or create a task for your team.</p><button className="button button-secondary" onClick={() => openTaskDialog()}><Plus size={15} />Create a task</button></div>}
        </div>
      </section>
    </div>
  )
}
