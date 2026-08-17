import { Navigate } from 'react-router-dom';
import AppNavbar from './AppNavbar';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <AppNavbar />
      {children}
    </>
  );
}

export default ProtectedRoute;