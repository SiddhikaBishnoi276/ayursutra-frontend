import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../config/firebaseConfig";

export const requestNotificationPermission = async (): Promise<string | null> => {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return null;

        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });
        
        return token;
    } catch (error) {
        console.error("Notification permission error:", error);
        return null;
    }
};

export const listenForForegroundMessages = (
    callback: (payload: any) => void
) => {
    return onMessage(messaging, callback);
};