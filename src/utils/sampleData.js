export const projects = [
  {
    id: 'website-redesign',
    name: 'Website redesign',
    description: 'Refresh the marketing site with a clearer story, faster pages, and a brighter visual system.',
    deadline: '2026-12-04',
    color: 'project-indigo',
    members: ['Alex Morgan', 'Sam Rivera', 'Jordan Lee', 'Maya Chen'],
  },
  {
    id: 'product-launch',
    name: 'Product launch',
    description: 'Bring the next product release to market with a coordinated launch across every channel.',
    deadline: '2026-11-28',
    color: 'project-blue',
    members: ['Sam Rivera', 'Taylor Kim', 'Maya Chen'],
  },
  {
    id: 'mobile-app',
    name: 'Mobile app',
    description: 'Design and build a thoughtful companion app for customers on the move.',
    deadline: '2026-12-18',
    color: 'project-cyan',
    members: ['Alex Morgan', 'Jordan Lee', 'Taylor Kim'],
  },
  {
    id: 'brand-refresh',
    name: 'Brand refresh',
    description: 'Create a cohesive brand toolkit and share it with every team.',
    deadline: '2027-01-12',
    color: 'project-violet',
    members: ['Maya Chen', 'Sam Rivera'],
  },
]

export const teamMembers = [
  { name: 'Alex Morgan', role: 'Product lead', initials: 'AM', color: 'avatar-lavender', email: 'alex@studio.co' },
  { name: 'Sam Rivera', role: 'Product designer', initials: 'SR', color: 'avatar-peach', email: 'sam@studio.co' },
  { name: 'Jordan Lee', role: 'Frontend engineer', initials: 'JL', color: 'avatar-mint', email: 'jordan@studio.co' },
  { name: 'Maya Chen', role: 'Marketing lead', initials: 'MC', color: 'avatar-blue', email: 'maya@studio.co' },
  { name: 'Taylor Kim', role: 'Product engineer', initials: 'TK', color: 'avatar-pink', email: 'taylor@studio.co' },
]

export const activityItems = [
  { id: 'activity-1', initials: 'SR', color: 'avatar-peach', name: 'Sam Rivera', action: 'completed the task', subject: 'Map the new homepage', time: '18 min ago' },
  { id: 'activity-2', initials: 'JL', color: 'avatar-mint', name: 'Jordan Lee', action: 'commented on', subject: 'Build component library', time: '1 hr ago' },
  { id: 'activity-3', initials: 'MC', color: 'avatar-blue', name: 'Maya Chen', action: 'created a task in', subject: 'Product launch', time: '3 hrs ago' },
  { id: 'activity-4', initials: 'AM', color: 'avatar-lavender', name: 'Alex Morgan', action: 'updated the timeline for', subject: 'Mobile app', time: 'Yesterday' },
  { id: 'activity-5', initials: 'TK', color: 'avatar-pink', name: 'Taylor Kim', action: 'started working on', subject: 'Set up app navigation', time: 'Yesterday' },
  { id: 'activity-6', initials: 'SR', color: 'avatar-peach', name: 'Sam Rivera', action: 'joined', subject: 'Brand refresh', time: 'Monday' },
]

export function formatDate(date) {
  if (!date) return 'No deadline'
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
