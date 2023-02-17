import { Navigate } from 'react-router-dom'
import { useAuthValue } from './AuthContext'
import { auth } from './Firebase'

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuthValue()
  console.log('auth    ', auth.currentUser)

  if (auth?.currentUser == null) {
    return <Navigate to='/' replace />
  }

  return children
}
