import { Bell, Check, RotateCcw, ShieldCheck, UserRound, UsersRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import useWorkspace from '../hooks/useWorkspace.js'
import useTasksContext from '../hooks/useTasksContext.js'

const SETTINGS_KEY = 'asana.preferences'
const defaultPreferences = { emailUpdates: true, deadlineReminders: true, weeklyDigest: false }

function readPreferences() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    if (!saved) return defaultPreferences
    const parsed = JSON.parse(saved)
    return Object.fromEntries(
      Object.entries(defaultPreferences).map(([key, defaultValue]) => [
        key,
        typeof parsed?.[key] === 'boolean' ? parsed[key] : defaultValue,
      ]),
    )
  } catch (error) {
    console.error('Unable to read Asana case study notification preferences.', error)
    return defaultPreferences
  }
}

export default function SettingsPage() {
  const [preferences, setPreferences] = useState(readPreferences)
  const { resetTasks } = useTasksContext()
  const { setNotice } = useWorkspace()

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(preferences))
  }, [preferences])

  function togglePreference(name) {
    setPreferences((current) => ({ ...current, [name]: !current[name] }))
  }

  function restoreSampleTasks() {
    if (!window.confirm('Replace the current task list with the original sample tasks?')) return
    resetTasks()
    setNotice('Sample workspace tasks restored')
  }

  return (
    <div className="page-content settings-page">
      <section className="page-intro"><div><span className="eyebrow">MAKE IT YOURS</span><h1>Settings</h1><p>Manage your workspace preferences and notifications.</p></div></section>
      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Settings sections"><a className="settings-nav-link active" href="#profile"><UserRound size={16} />Profile</a><a className="settings-nav-link" href="#notifications"><Bell size={16} />Notifications</a><a className="settings-nav-link" href="#workspace"><UsersRound size={16} />Workspace</a></nav>
        <div className="settings-content">
          <section className="surface-card settings-card" id="profile">
            <div className="settings-section-heading"><span className="settings-icon"><UserRound size={17} /></span><div><h2>Profile</h2><p>Your personal details for this workspace.</p></div></div>
            <div className="profile-settings"><span className="team-avatar avatar-lavender">AM</span><div><strong>Alex Morgan</strong><span>Product lead · alex@studio.co</span></div><span className="profile-pill">Workspace admin</span></div>
          </section>
          <section className="surface-card settings-card" id="notifications">
            <div className="settings-section-heading"><span className="settings-icon"><Bell size={17} /></span><div><h2>Notifications</h2><p>Choose what updates you’d like to receive.</p></div></div>
            <PreferenceRow title="Task updates" description="Get notified when teammates update tasks you follow." checked={preferences.emailUpdates} onChange={() => togglePreference('emailUpdates')} />
            <PreferenceRow title="Deadline reminders" description="A heads-up when a task deadline is coming up." checked={preferences.deadlineReminders} onChange={() => togglePreference('deadlineReminders')} />
            <PreferenceRow title="Weekly digest" description="A summary of your team’s progress each Monday." checked={preferences.weeklyDigest} onChange={() => togglePreference('weeklyDigest')} />
          </section>
          <section className="surface-card settings-card" id="workspace">
            <div className="settings-section-heading"><span className="settings-icon"><ShieldCheck size={17} /></span><div><h2>Workspace data</h2><p>This educational prototype saves your work in this browser.</p></div></div>
            <div className="data-setting"><div><strong>Restore sample tasks</strong><p>Replace your current task list with the original demo tasks.</p></div><button className="button button-secondary" onClick={restoreSampleTasks}><RotateCcw size={14} />Restore tasks</button></div>
            <p className="privacy-note"><Check size={14} />Your projects and tasks are stored locally and sync across your open tabs.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

function PreferenceRow({ title, description, checked, onChange }) {
  return (
    <div className="preference-row">
      <div><strong>{title}</strong><p>{description}</p></div>
      <button className={`toggle-switch${checked ? ' enabled' : ''}`} role="switch" aria-checked={checked} aria-label={title} onClick={onChange}><span /></button>
    </div>
  )
}
