import {
  BarChart3,
  CheckSquare2,
  CircleHelp,
  FolderKanban,
  LayoutDashboard,
  List,
  ListTodo,
  Settings2,
  Users2,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import useTasksContext from '../hooks/useTasksContext.js'

const navigation = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/my-tasks', label: 'My Tasks', icon: ListTodo },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/list-view', label: 'List View', icon: List },
  { to: '/board', label: 'Board View', icon: BarChart3 },
  { to: '/team', label: 'Team', icon: Users2 },
]

export default function Sidebar({ onCreateProject }) {
  const { projects } = useTasksContext()

  return (
    <aside className="sidebar">
      <NavLink className="brand" to="/" aria-label="Asana Case Study dashboard">
        <span className="brand-mark"><CheckSquare2 size={20} strokeWidth={2.5} /></span>
        <span>Asana</span>
      </NavLink>

      <div className="workspace-switcher">
        <span className="workspace-avatar">A</span>
        <span className="workspace-name">Asana Case Study<small>Educational workspace</small></span>
      </div>

      <div className="sidebar-section-label">Workspace</div>
      <nav className="sidebar-nav" aria-label="Workspace navigation">
        {navigation.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-section-label projects-label">
        <span>Recent projects</span>
        <button type="button" aria-label="Create project" onClick={onCreateProject}>+</button>
      </div>
      <div className="sidebar-projects">
        {projects.slice(0, 3).map((project) => (
          <NavLink className="project-link" key={project.id} to={`/projects/${project.id}`}>
            <span className={`project-dot ${project.color}`} />
            <span>{project.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-bottom">
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/settings" aria-label="Settings" title="Settings">
          <Settings2 size={18} strokeWidth={1.8} /><span>Settings</span>
        </NavLink>
        <a className="help-card" href="mailto:lab-support@example.com">
          <CircleHelp size={18} />
          <span>Need a hand?<small>Contact our support team</small></span>
        </a>
        <div className="profile">
          <span className="profile-avatar avatar-lavender">AM</span>
          <span>Alex Morgan<small>Workspace admin</small></span>
        </div>
      </div>
    </aside>
  )
}
