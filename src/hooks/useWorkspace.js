import { useOutletContext } from 'react-router-dom'

export default function useWorkspace() {
  return useOutletContext()
}
