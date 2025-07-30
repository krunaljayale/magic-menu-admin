"use client";

import { API } from "@/constants/api";
import React, { useState } from "react";

function SendPushNotification() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch(`${API.SEND_PUSH_NOTIFICATION}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, message }),
      });

      if (res.ok) {
        setTitle("");
        setMessage("");
        setStatus("✅ Notification sent successfully");
      } else {
        const err = await res.json();
        setStatus(`❌ Failed: ${err.message || "Server error"}`);
      }
    } catch (err) {
      setStatus("❌ Network error");
    }
  };

  return (
    <div className="grid rounded-[10px] bg-white p-6 text-dark shadow-1 dark:bg-gray-dark dark:text-white">
      <div className="mb-6 flex justify-between">
        <h2 className="text-heading-6 font-bold">Send Push Notification</h2>
        <h6 className="text-body-sm font-bold text-gray-6">
          Send to all users
        </h6>
      </div>

      <form
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <div className="col-span-2">
          <label className="mb-2 block text-base font-medium text-gray-700 dark:text-gray-300">
            Notification Title
          </label>
          <input
            type="text"
            className="w-full rounded border border-gray-300 bg-white px-4 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="col-span-2">
          <label className="mb-2 block text-base font-medium text-gray-700 dark:text-gray-300">
            Notification Message
          </label>
          <textarea
            rows={4}
            className="w-full resize-none rounded border border-gray-300 bg-white px-4 py-2 text-base shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            className="hover:bg-primary-dark rounded bg-primary px-6 py-2 text-white shadow-md transition disabled:opacity-50"
            disabled={!title || !message}
          >
            Send Notification
          </button>
        </div>
      </form>

      {status && (
        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          {status}
        </p>
      )}
    </div>
  );
}

export default SendPushNotification;
