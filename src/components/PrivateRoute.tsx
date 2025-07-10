// This component previously handled authentication checks.
// Authentication has been disabled for demo purposes so it
// simply renders its children.

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export default PrivateRoute;