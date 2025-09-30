import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
    const axiosSecure = useAxiosSecure()
    const { user } = useAuth()
    console.log("email", user);
    const { data: role, isLoading } = useQuery({
        queryKey: ["role", user?.email],
        enabled: !!user,
        queryFn: async () => {
            const { data } = await axiosSecure(`/users/role/${user?.email}`)
            return data.role
        }
    })
    return [role, isLoading]
};

export default useRole;