import { Navigate, Route, Routes } from 'react-router-dom'
import TasksProvider from './context/TasksProvider.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AppLayout from './components/AppLayout.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import MyTasksPage from './pages/MyTasksPage.jsx'
import BoardPage from './pages/BoardPage.jsx'
import TeamPage from './pages/TeamPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import './App.css'

function App() {
  return (
    <TasksProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
          <Route path="/list-view" element={<MyTasksPage title="List View" />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectsPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TasksProvider>
  )
}

export default App
