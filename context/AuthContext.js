import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../src/config";
import { useToast } from "react-native-toast-notifications";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    await getCurrentUser();
                }
            } catch (error) {
                console.log("Error loading user:", error);
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // Function to fetch the current user's details from the database
    const getCurrentUser = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            const response = await fetch(`${API_URL}/auth/me`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch user details.")

                await AsyncStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
        } catch (error) {
            toast.show(error.message || "Get Current User Error:", error.message, { type: "danger" });
        }
    }

    //  Register function
    const register = async ( name, email, password ) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed')
            
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem("user", JSON.stringify(data.user))
                setUser(data.user)

                toast.show("Registration successful!", { type: "success" })

                return { success: true, user: data.user };

        } catch (error) {
            toast.show(error.message || "Registration failed", { type: "danger" });
            return { success: false, message: error.message };
        }
    }

    const login = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Login failed");

            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);

            toast.show("Login successful!", { type: "success" }); 
        } catch (error) {
            toast.show(error.message || "Login failed", { type: "danger" });
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        setUser(null);
        toast.show("Logged out successfully!", { type: "info" });
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
