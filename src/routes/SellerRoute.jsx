import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import useRole from "../hooks/useRole";
import PropTypes from "prop-types";


const SellerRoute = ({ children }) => {
    const [role, isLoading] = useRole();

    if (isLoading) return <LoadingSpinner></LoadingSpinner>
    if (role === "Seller") return children;
    return <Navigate to="/dashboard" replace="true"></Navigate>
};

SellerRoute.propTypes = {
    children: PropTypes.element,
}
export default SellerRoute;