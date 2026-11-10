import { useMemo, useState } from 'react'
import { ArrowDownUp, Plus } from 'lucide-react'
import BoardTaskCard from '../components/BoardTaskCard.jsx'
import useWorkspace from '../hooks/useWorkspace.js'
import useTasksContext from '../hooks/useTasksContext.js'

const columns = [
  { status: 'To do', title: 'To do', color: 'column-todo' },
  { status: 'In progress', title: 'In progress', color: 'column-progress' },
  { status: 'Done', title: 'Completed', color: 'column-done' },
]

export default function BoardPage() {
  const { tasks, updateTasks } = useTasksContext()
  const { search, openTaskDialog, setNotice } = useWorkspace()
  const [sortDescending, setSortDescending] = useState(true)
  const visibleTasks = useMemo(() => tasks
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDescending
      ? (b.dueDate || '').localeCompare(a.dueDate || '')
      : (a.dueDate || '').localeCompare(b.dueDate || '')), [search, sortDescending, tasks])

  function changeStatus(id, status) {
    updateTasks((current) => current.map((task) => task.id === id ? { ...task, status } : task))
  }

  function dropTask(event, status) {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/task-id')
    if (id) {
      changeStatus(id, status)
      setNotice(`Task moved to ${status}`)
    }
  }

  function deleteTask(id) {
    updateTasks((current) => current.filter((task) => task.id !== id))
  }

  return (
    <div className="page-content board-page">
      <section className="page-intro">
        <div><span className="eyebrow">TEAM WORKFLOW</span><h1>Kanban board</h1><p>A clear view of what’s moving and what’s next.</p></div>
        <button className="button button-primary" onClick={() => openTaskDialog()}><Plus size={16} />Add task</button>
      </section>
      <div className="board-toolbar"><span>All projects <i /> {visibleTasks.length} tasks</span><button className="button button-secondary" onClick={() => setSortDescending((current) => !current)}><ArrowDownUp size={15} />{sortDescending ? 'Latest due first' : 'Soonest due first'}</button></div>
      <section className="kanban-columns" aria-label="Task board">
        {columns.map((column) => {
          const columnTasks = visibleTasks.filter((task) => task.status === column.status)
          return (
            <section className={`kanban-column ${column.color}`} key={column.status} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropTask(event, column.status)}>
              <header className="kanban-column-heading"><span className="column-status-dot" /><h2>{column.title}</h2><span className="column-count">{columnTasks.length}</span><button className="icon-button column-add" onClick={() => openTaskDialog({ status: column.status })} aria-label={`Add task to ${column.title}`}><Plus size={17} /></button></header>
              <div className="kanban-card-list">
                {columnTasks.map((task) => <BoardTaskCard key={task.id} task={task} onStatusChange={changeStatus} onEdit={(item) => openTaskDialog(item, true)} onDelete={deleteTask} onNotice={setNotice} />)}
                {!columnTasks.length && <div className="column-empty">Drop a task here</div>}
              </div>
            </section>
          )
        })}
      </section>
    </div>
  )
}
