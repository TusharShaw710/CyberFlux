import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import CyberfluxLoader from "./CyberfluxLoader.jsx";

export const Protected = ({ children }) => {
    const { user } = useSelector((state) => state.auth);    
    const {loading}=useSelector((state)=>state.auth);

    if(loading){
        return <CyberfluxLoader />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;    
}