import { Navigate, Outlet } from 'react-router-dom';

const CustomerProtectedRoute = () => {
  const token = localStorage.getItem('customer_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default CustomerProtectedRoute;
