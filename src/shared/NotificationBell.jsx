// src/components/common/NotificationBell.jsx
import { useState, useRef, useEffect } from "react";
import { IoNotificationsOutline } from "react-icons/io5";

const NotificationBell = ({ badgeCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dummy notifications - replace with real API data later
  const notifications = [
    {
      id: 1,
      title: "New evaluation submitted",
      message: "John Doe evaluated Referee #27",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Rankings updated",
      message: "Summer Camp rankings refreshed",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "New referee joined",
      message: "Sarah Smith registered",
      time: "3 hours ago",
      read: true,
    },
  ];

  const unreadCount = badgeCount > 0 ? badgeCount : notifications.filter(n => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        aria-label="Notifications"
      >
        <IoNotificationsOutline className="text-2xl text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center size-5 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button className="text-sm text-[#00AEEF] hover:underline font-medium">
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No notifications yet</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notif.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2.5 h-2.5 bg-[#00AEEF] rounded-full ml-3 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 text-center bg-gray-50">
            <button className="text-sm font-medium text-[#00AEEF] hover:underline">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;