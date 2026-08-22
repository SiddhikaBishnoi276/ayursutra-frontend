import { useEffect } from "react";
import { useNotificationPermission } from "../Hooks/useNotificationPermission";

const NotificationPermissionPrompt = () => {
    const { status, askPermission } = useNotificationPermission();

    useEffect(() => {
        if (Notification.permission === "default" && status === "idle") {
            // askPermission(); // uncomment agar auto-prompt chahiye
        }
    }, [status, askPermission]);

    if (status === "granted" || Notification.permission === "denied") {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            <div className="text-sm text-gray-700">
                Stay updated with therapy reminders and session alerts.
            </div>
            <button
                onClick={askPermission}
                disabled={status === "loading"}
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
                {status === "loading" ? "Requesting..." : "Enable"}
            </button>
        </div>
    );
};

export default NotificationPermissionPrompt;