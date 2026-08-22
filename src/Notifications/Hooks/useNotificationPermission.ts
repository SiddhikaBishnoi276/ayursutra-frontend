import { useState, useCallback, useRef } from "react";
import { requestNotificationPermission } from "../Services/notificationService";
import { useRegisterDeviceTokenMutation } from "../Services/notificationApi";

export const useNotificationPermission = () => {
    const [token, setToken] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");
    const [registerDeviceToken] = useRegisterDeviceTokenMutation();
    const hasRequested = useRef(false);

    const askPermission = useCallback(async () => {
        if (hasRequested.current) return;
        hasRequested.current = true;
        
        setStatus("loading");
        const fcmToken = await requestNotificationPermission();
        if (fcmToken) {
            setToken(fcmToken);
            setStatus("granted");

            try {
                await registerDeviceToken({ token: fcmToken }).unwrap();
            } catch (error) {
                console.error("Failed to register device token with backend:", error);
                // token phir bhi local state mein hai, notification kaam karega
                // lekin backend ko pata nahi chalega jab tak ye retry na ho
            }
        } else {
            setStatus("denied");
        }
    }, [registerDeviceToken]);

    return { token, status, askPermission };
};