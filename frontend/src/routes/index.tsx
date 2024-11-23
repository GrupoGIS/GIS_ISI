import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Login from '@/pages/login'
import RegisterClient from '@/pages/admin/register-client'
import RegisterVehicle from '@/pages/admin/register-vehicle'
import RegisterProduct from '@/pages/admin/register-product'
// import ProductList from '@/pages/client/product-list'
// import TrackDelivery from '@/pages/client/track-delivery'
// import DriverTrack from '@/pages/driver/driver-track'

import PrivateRoute from './private-route'

const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/adm/register/client"
        element={
          <PrivateRoute role="admin">
            <RegisterClient />
          </PrivateRoute>
        }
      />
      <Route
        path="/adm/register/vehicle"
        element={
          <PrivateRoute role="admin">
            <RegisterVehicle />
          </PrivateRoute>
        }
      />
      <Route
        path="/adm/register/product"
        element={
          <PrivateRoute role="admin">
            <RegisterProduct />
          </PrivateRoute>
        }
      />

      {/* Client Routes */}
      {/* <Route
        path="/client/products"
        element={
          <PrivateRoute role="client">
            <ProductList />
          </PrivateRoute>
        }
      />
      <Route
        path="/client/track/:id"
        element={
          <PrivateRoute role="client">
            <TrackDelivery />
          </PrivateRoute>
        }
      /> */}

      {/* Driver Routes */}
      {/* <Route
        path="/driver/track"
        element={
          <PrivateRoute role="driver">
            <DriverTrack />
          </PrivateRoute>
        }
      /> */}

      {/* Default Route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
)

export default AppRouter
