// src/components/common/NotificationBell.jsx
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useState, useRef, useEffect, useCallback } from "react";
import { IoNotificationsOutline, IoClose } from "react-icons/io5";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

const NotificationBell = () => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const observerRef = useRef(null);

  // Fetch notification counts (used for badge)
  const { data: countsData} = useQuery({
    queryKey: ["notification-counts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications/counts");
      return res?.data?.data || { total_unread: 0 };
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const unreadCount = countsData?.total_unread || 0;

  // Fetch paginated notifications
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["my-notifications"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get("/notifications", {
        params: { page: pageParam },
      });
      return res?.data?.data || { notifications: [], pagination: {} };
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination || {};
      return pagination.current_page < pagination.last_page
        ? pagination.current_page + 1
        : undefined;
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const notifications = data?.pages?.flatMap(page => page.notifications) || [];

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId) => {
      await axiosInstance.post(`/notifications/${notificationId}/mark-as-read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
    },
    onError: () => toast.error("Failed to mark as read"),
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/notifications/mark-all-as-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
      toast.success("All marked as read");
    },
    onError: () => toast.error("Failed to mark all as read"),
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId) => {
      await axiosInstance.delete(`/notifications/delete/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
      toast.success("Notification deleted");
    },
    onError: () => toast.error("Failed to delete notification"),
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete("/notifications/clear-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
      toast.success("Read notifications cleared");
    },
    onError: () => toast.error("Failed to clear notifications"),
  });

  // Handlers
  const handleMarkRead = (id, e) => {
    e.stopPropagation();
    markAsReadMutation.mutate(id);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteNotificationMutation.mutate(id);
  };

  const handleMarkAll = (e) => {
    e.stopPropagation();
    if (unreadCount === 0) return;
    markAllAsReadMutation.mutate();
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    clearAllMutation.mutate();
  };

  // Infinite scroll
  const lastNotificationRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const formatTimeAgo = (date) => {
    if (!date) return "Just now";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Some time ago";
    }
  };

  // Helper to get display values safely
  const getNotificationInfo = (notif) => {
    const d = notif.data || {};
    const isAnnouncement = notif.type === "announcement";

    return {
      title: isAnnouncement ? (d.subject || "Announcement") : (d.title || "Notification"),
      message: d.message || "",
      sender: isAnnouncement
        ? (d.creator_name || `User #${d.created_by || "N/A"}`)
        : (d.assigned_by?.name || "System"),
      senderRole: isAnnouncement ? "Director" : (d.assigned_by?.role || ""),
      time: isAnnouncement ? d.sent_at : notif.created_at,
    };
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <IoNotificationsOutline className="text-2xl text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white border-2 border-white animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  disabled={markAllAsReadMutation.isPending}
                  className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                >
                  {markAllAsReadMutation.isPending ? "Marking..." : "Mark all read"}
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  disabled={clearAllMutation.isPending}
                  className="text-sm text-red-600 hover:underline disabled:opacity-50"
                >
                  {clearAllMutation.isPending ? "Clearing..." : "Clear read"}
                </button>
              )}
            </div>
          </div>






          

          <div className="max-h-[28rem] overflow-y-auto">
            {isLoading ? (
              <div className="py-10 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-3">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <IoNotificationsOutline className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm mt-1">New notifications will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif, idx) => {
                  const isUnread = !notif.is_read;
                  const { title, message, sender, senderRole, time } = getNotificationInfo(notif);

                  return (
                    <div
                      key={notif.id}
                      ref={idx === notifications.length - 1 ? lastNotificationRef : null}
                      onClick={(e) => handleMarkRead(notif.id, e)}
                      className={`group relative p-4 cursor-pointer transition-colors ${
                        isUnread
                          ? "bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <button
                        onClick={(e) => handleDelete(notif.id, e)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete"
                      >
                        <IoClose className="w-5 h-5" />
                      </button>

                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium text-sm truncate ${isUnread ? "text-gray-900" : "text-gray-600"}`}>
                            {title}
                          </h4>
                          <p className={`mt-1 text-sm line-clamp-3 ${isUnread ? "text-gray-700 font-medium" : "text-gray-600"}`}>
                            {message}
                          </p>
                          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                            <span className="text-gray-600">
                              {sender} {senderRole && `(${senderRole})`}
                            </span>
                            <span className="text-gray-400">
                              {formatTimeAgo(time)}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <IoNotificationsOutline className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isFetchingNextPage && (
                  <div className="py-6 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-sm">Loading more...</p>
                  </div>
                )}

                {!hasNextPage && notifications.length > 0 && (
                  <div className="py-4 text-center text-gray-400 text-sm">
                    End of notifications
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;