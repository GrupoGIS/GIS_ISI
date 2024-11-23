import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: JSX.Element
  role: 'admin' | 'client' | 'driver'
}

const PrivateRoute = ({ children, role }: PrivateRouteProps) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')

  if (!token) {
    return <Navigate to="/login" />
  }

  if (role !== userRole) {
    return <Navigate to="/login" />
  }

  return children
}

export default PrivateRoute
