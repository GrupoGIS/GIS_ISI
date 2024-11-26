import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: JSX.Element
  role: 'admin' | 'client' | 'driver'
}

const PrivateRoute = ({ children, role }: PrivateRouteProps) => {
  const token = localStorage.getItem('token')
  const userType = localStorage.getItem('userType')

  if (!token) {
    return <Navigate to="/login" />
  }

  if (role !== userType) {
    return <Navigate to="/login" />
  }

  return children
}

export default PrivateRoute
