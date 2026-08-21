import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../app/firebase";

export const requestNotificationPermission = async (): Promise<string | null> => {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return null;

        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        return token; // is token ko backend ko POST karna hoga
    } catch (error) {
        console.error("Notification permission error:", error);
        return null;
    }
};

export const listenForForegroundMessages = (
    callback: (payload: unknown) => void
) => {
    return onMessage(messaging, callback);
};