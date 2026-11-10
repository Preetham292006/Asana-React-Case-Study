import TasksContext from './TasksContext.js'
import useTasks from '../hooks/useTasks.js'

export default function TasksProvider({ children }) {
  const taskState = useTasks()

  return (
    <TasksContext.Provider value={taskState}>
      {children}
    </TasksContext.Provider>
  )
}
