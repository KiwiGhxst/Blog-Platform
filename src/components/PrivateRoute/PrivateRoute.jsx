import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, auth }) => {
  return auth ? element : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
