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

  // Fetch notification counts
  const { data: countsData } = useQuery({
    queryKey: ["notification-counts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications/counts");
      return res?.data?.data || { total_unread: 0 };
    },
    refetchInterval: 60000,
    staleTime: 30000,
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
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const pages = data?.pages || [];
  const notifications = pages.flatMap(page => page.notifications) || [];

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId) => {
      await axiosInstance.post(`/notifications/${notificationId}/mark-as-read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
    },
    onError: () => {
      toast.error("Failed to mark as read");
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/notifications/mark-all-as-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
      toast.success("All notifications marked as read");
    },
    onError: () => {
      toast.error("Failed to mark all as read");
    },
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
    onError: () => {
      toast.error("Failed to delete notification");
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete("/notifications/clear-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
      toast.success("All notifications cleared");
    },
    onError: () => {
      toast.error("Failed to clear notifications");
    },
  });

  // Handlers
  const handleNotificationClick = (notifId, e) => {
    e.stopPropagation();
    if (markAsReadMutation.isPending) return;
    markAsReadMutation.mutate(notifId);
  };

  const handleDeleteClick = (notifId, e) => {
    e.stopPropagation();
    if (deleteNotificationMutation.isPending) return;
    deleteNotificationMutation.mutate(notifId);
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    if (unreadCount === 0 || markAllAsReadMutation.isPending) return;
    markAllAsReadMutation.mutate();
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    if (notifications.length === 0 || clearAllMutation.isPending) return;
    clearAllMutation.mutate();
  };

  // Infinite scroll
  const lastNotificationRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // Click outside to close
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

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Just now";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Some time ago";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        aria-label="Notifications"
      >
        <IoNotificationsOutline className="text-2xl text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center size-5 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute -right-4 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={markAllAsReadMutation.isPending}
                  className="text-sm text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {markAllAsReadMutation.isPending ? "Marking..." : "Mark all as read"}
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  disabled={clearAllMutation.isPending}
                  className="text-sm text-red-500 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {clearAllMutation.isPending ? "Clearing..." : "Clear all"}
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-10 text-gray-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-3">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <IoNotificationsOutline className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No notifications yet</p>
                <p className="text-sm mt-1">You&apos;ll see notifications here when available</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif, index) => {
                  const isUnread = !notif.is_read;

                  return (
                    <div
                      ref={index === notifications.length - 1 ? lastNotificationRef : null}
                      key={notif.id}
                      onClick={(e) => handleNotificationClick(notif.id, e)}
                      className={`relative p-5 transition-colors cursor-pointer ${
                        isUnread
                          ? "bg-blue-50/50 hover:bg-blue-50 border-l-4 border-l-primary"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <button
                        onClick={(e) => handleDeleteClick(notif.id, e)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete notification"
                      >
                        <IoClose className="w-5 h-5" />
                      </button>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-sm truncate ${isUnread ? "text-gray-900" : "text-gray-600"}`}>
                            {notif.data?.title || "Untitled"}
                          </h4>
                          <p className={`text-sm mt-1 line-clamp-3 leading-relaxed ${isUnread ? "text-gray-700" : "text-gray-500"}`}>
                            {notif.data?.message}
                          </p>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-500">
                              By {notif.data?.assigned_by?.name || "N/A"} ({notif.data?.assigned_by?.role || ""})
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatTimeAgo(notif.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IoNotificationsOutline className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isFetchingNextPage && (
                  <div className="text-center py-6 text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <p className="mt-2 text-sm">Loading more...</p>
                  </div>
                )}

                {!hasNextPage && notifications.length > 0 && (
                  <div className="text-center py-3 text-gray-400 text-sm">
                    You&apos;ve reached the end
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