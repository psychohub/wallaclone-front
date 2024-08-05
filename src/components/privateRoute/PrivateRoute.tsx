import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../store";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAppSelector((state: RootState) => state.auth);
	
	if (token) {
		return <>{children}</>;
	}

  return <Navigate to="/login" />;
};

export default PrivateRoute;
