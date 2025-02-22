import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import { API_URL } from "../src/config";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchNotifications()
    },[])

    const fetchNotifications = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            const response = await fetch(`${API_URL}/notifications`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch notifications.");

            setNotifications(data);

        } catch (error) {
            console.error("Fetch Notifications Error:", error.message);
            toast.show(error.message || "Failed to fetch notifications", { type: "danger" });
        } finally {
            setLoading(false);
        }
    }

    const markNotificationAsRead = async (notificationId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to mark notification as read.");

            setNotifications(prevNotifications => 
                prevNotifications.map(notification => 
                    notification._id === notificationId 
                        ? { ...notification, read: true } 
                        : notification
                )
            );
        } catch (error) {
            console.error("Mark As Read Error:", error.message);
            toast.show(error.message || "Failed to mark notification as read", { type: "danger" });
        }
    }

    const deleteNotifications = async (notificationIds) => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) return;
      
          const response = await fetch(`${API_URL}/notifications/delete`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids: notificationIds }),
          });
      
          if (!response.ok) throw new Error("Failed to delete notifications.");
      
          setNotifications((prev) => prev.filter((n) => !notificationIds.includes(n._id)));
        } catch (error) {
          console.error("Delete Notifications Error:", error.message);
          toast.show(error.message || "Failed to delete notifications", { type: "danger" });
        }
      };
      

    return (
        <NotificationContext.Provider
           value={{
            notifications,
            fetchNotifications,
            loading,
            markNotificationAsRead,
            deleteNotifications
           }}
        >
            {children}
        </NotificationContext.Provider>
    )
}