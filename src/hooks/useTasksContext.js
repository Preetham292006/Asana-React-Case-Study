import { useContext } from 'react'
import TasksContext from '../context/TasksContext.js'

export default function useTasksContext() {
  const context = useContext(TasksContext)

  if (!context) {
    throw new Error('useTasksContext must be used within TasksProvider')
  }

  return context
}
