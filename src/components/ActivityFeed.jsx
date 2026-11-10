import { ArrowRight, MessageSquareText } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import useTasksContext from '../hooks/useTasksContext.js'

export default function ActivityFeed() {
  const [showAll, setShowAll] = useState(false)
  const { activities } = useTasksContext()

  return (
    <section className="surface-card activity-card">
      <div className="surface-heading"><div><h2>Recent activity</h2><p>What your team has been up to</p></div><button className="text-action" type="button" onClick={() => setShowAll((current) => !current)}>{showAll ? 'Show less' : 'View activity'}<ArrowRight size={14} /></button></div>
      <div className="activity-list">
        {activities.slice(0, showAll ? activities.length : 4).map((item) => (
          <div className="activity-item" key={item.id}>
            <span className={`member-avatar activity-avatar ${item.color}`}>{item.initials}</span>
            <div className="activity-copy"><p><strong>{item.actor || item.name}</strong> {item.action} <b>{item.subject}</b></p><span>{item.time || 'Recently'}</span></div>
            {item.action?.includes('comment') && <MessageSquareText className="activity-kind" size={15} />}
          </div>
        ))}
      </div>
      {showAll && <Link className="activity-team-link" to="/team">Explore your team <ArrowRight size={13} /></Link>}
    </section>
  )
}
