import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../store";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAppSelector((state: RootState) => state.auth);
	
	if (token) {
		return <Navigate to="/" />;
	}

  return <>{children}</>;
};

export default PublicRoute;
