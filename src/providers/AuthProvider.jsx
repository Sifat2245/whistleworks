import { AuthContext } from "@/context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN
const AuthProvider = ({ children }) => {

    const [accessToken, setAccessToken] = useState(() => {
        return localStorage.getItem(ACCESS_TOKEN_KEY) || null;
    })

    const queryClient = useQueryClient()


    // note: single storage handler
    useEffect(() => {
        const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY) || null;
        if (storedToken !== accessToken) {
            setAccessToken(storedToken)
        };

        const handleStorageChange = (e) => {
            if (e.key === ACCESS_TOKEN_KEY) {
                setAccessToken(e.newValue || null);
            };
        }
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [accessToken])

    // note:  handle login
    const setToken = (token) => {
        if (token) {
            localStorage.setItem(ACCESS_TOKEN_KEY, token)
        } else {
            localStorage.removeItem(ACCESS_TOKEN_KEY)
        }
    }

    // note: handle login
    const handleLogin = (token) => {
        setToken(token)
        setAccessToken(token); // Update React state
    }

    // note: lgoout api
    const logOutMutation = useMutation({
        mutationKey: ["logout"],
        mutationFn: async () => {
            if (!accessToken) return null;
            try {
                // so something
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/logout`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                return response?.data;
            } catch (error) {
                toast.error(error?.message || "Failed to logout. Please try again.");
                return null;
            }
        },
        onMutate: () => {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            setAccessToken(null);
        },
        onSuccess: (response) => {
            toast.success(response?.message || "Logged out successfully !!");
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to logout. Please try again.");
        },
        onSettled: () => {
            queryClient.clear()
        }
    });

    // note: handle logout
    const handleLogout = async () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setAccessToken(null);
        await logOutMutation.mutateAsync();
    };

    // note: fetch user data with react-query
    const { data: userData, refetch: userRefetch, isFetching } = useQuery({
        queryKey: ["userData"],
        queryFn: async () => {
            if (!accessToken) return null;
            try {
                // so something
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user-details`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                return response.data?.data?.user || null
            } catch (error) {
                // do something
                console.error("Error fetching user data:", error)
                if (error.response?.status === 401) {
                    setToken(null)
                    handleLogout()
                }
                return null;
            }
        },
        enabled: !!accessToken,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        staleTime: 0,
        cacheTime: 0,
    });
    const userRole = userData?.role;
    console.log("User Data-->", userData);

    // note: export all 
    return (
        <AuthContext.Provider value={{
            userData,
            userRefetch,
            handleLogin,
            handleLogout,
            accessToken,
            userRole,
            isLoading: !!accessToken && (isFetching || userData === undefined)
        }}>
            {children}
        </AuthContext.Provider>
    )
};
export default AuthProvider;