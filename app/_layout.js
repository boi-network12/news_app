import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "react-native-toast-notifications"; 
import { NotificationProvider } from "../context/NotificationContext";
import { PostProvider } from "../context/PostContext";

export default function RootLayout() {
    return (
        <ToastProvider>
            <AuthProvider>
                <NotificationProvider>
                    <PostProvider>
                        <Stack>
                            <Stack.Screen name="index" options={{ headerShown: false }} />
                        </Stack>
                    </PostProvider>
                </NotificationProvider>
            </AuthProvider>
        </ToastProvider>
    );
}
