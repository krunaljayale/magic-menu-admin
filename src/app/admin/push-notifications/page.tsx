"use client";

import React from "react";
import SendPushNotification from "./PushNotification/page";

function PushNotification() {
  const role = localStorage.getItem("admin_role");
  return (
    <>
      {role === "SUPER_ADMIN" ? (
        <SendPushNotification />
      ) : (
        <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300">
          ❌ Access Denied: You are not authorized to send push notifications.
        </div>
      )}
    </>
  );
}

export default PushNotification;
