import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useState, useRef, useEffect, useCallback } from "react";
import { IoNotificationsOutline, IoClose, IoCalendar, IoPerson, IoDocumentText, IoTrash } from "react-icons/io5";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

const NotificationBell = () => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const observerRef = useRef(null);

  // Fetch unread count
  const { data: countsData } = useQuery({
    queryKey: ["notification-counts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications/counts");
      return res?.data?.data || { total_unread: 0 };
    },
    refetchInterval: 30000, // more responsive
  });

  const unreadCount = countsData?.total_unread || 0;

  // Infinite query for notifications
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["my-notifications"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get("/notifications", { params: { page: pageParam } });
      return res?.data?.data || { notifications: [], pagination: {} };
    },
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.current_page < lastPage.pagination?.last_page
        ? lastPage.pagination.current_page + 1
        : undefined,
    refetchInterval: 60000,
  });

  const notifications = data?.pages?.flatMap((p) => p.notifications) || [];

  // Mutations (unchanged — good)
  const markAsReadMutation = useMutation({
    mutationFn: (id) => axiosInstance.post(`/notifications/${id}/mark-as-read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => axiosInstance.post("/notifications/mark-all-as-read"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
      toast.success("All marked as read");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/notifications/delete/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
      toast.success("Deleted");
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: () => axiosInstance.delete("/notifications/clear-read"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
      toast.success("Cleared");
    },
  });

  // Click handlers
  const handleClick = (notif, e) => {
    e.stopPropagation();
    if (!notif.is_read) {
      markAsReadMutation.mutate(notif.id);
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  // Infinite scroll
  const lastRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const timeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const getNotificationIcon = (type, dataType) => {
    if (type === "announcement") return <IoDocumentText className="w-6 h-6 text-primary" />;
    if (dataType?.includes("assigned") || dataType?.includes("jourcy")) return <IoPerson className="w-6 h-6 text-primary" />;
    if (dataType?.includes("removed")) return <IoTrash className="w-6 h-6 text-red-600" />;
    if (dataType?.includes("schedule")) return <IoCalendar className="w-6 h-6 text-primary" />;
    return <IoNotificationsOutline className="w-6 h-6 text-primary" />;
  };

  const getActor = (data) => {
    return (
      data?.assigned_by ||
      data?.removed_by ||
      data?.published_by ||
      (data?.creator_name && { name: data.creator_name, role: "Director" }) ||
      null
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full"
        aria-label="Notifications"
      >
        <IoNotificationsOutline className="text-2xl text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-2xl border border-black/20 z-50 overflow-hidden">
          <div className="p-4 border-b border-black/25 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex gap-4 text-sm">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending}
                  className="text-primary hover:underline disabled:opacity-50"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => clearAllMutation.mutate()}
                  disabled={clearAllMutation.isPending}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="max-h-112 overflow-y-auto">
            {isLoading ? (
              <div className="py-12 text-center text-gray-500">
                <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full mx-auto"></div>
                <p className="mt-3">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <IoNotificationsOutline className="w-16 h-16 mx-auto mb-4 opacity-40" />
                <p className="text-lg">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif, idx) => {
                  const isUnread = !notif.is_read;
                  const d = notif.data || {};
                  const actor = getActor(d);

                  return (
                    <div
                      key={notif.id}
                      ref={idx === notifications.length - 1 ? lastRef : null}
                      onClick={(e) => handleClick(notif, e)}
                      className={`p-4 cursor-pointer transition-colors relative ${
                        isUnread
                          ? "bg-indigo-50/60 hover:bg-indigo-50 border-l-4 border-primary"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <button
                        onClick={(e) => handleDelete(notif.id, e)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                      >
                        <IoClose className="w-5 h-5" />
                      </button>

                      <div className="flex gap-4">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-gray-100/80 flex items-center justify-center">
                          {getNotificationIcon(notif.type, d.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium text-base ${isUnread ? "text-gray-900" : "text-gray-700"}`}>
                            {d.title || d.subject || "Notification"}
                          </h4>

                          <p className={`mt-1 text-sm leading-relaxed ${isUnread ? "text-gray-800 font-medium" : "text-gray-600"}`}>
                            {d.message}
                          </p>

                          {d.camp?.name && (
                            <p className="mt-2 text-xs text-gray-500">
                              Camp: <span className="font-medium">{d.camp.name}</span>
                            </p>
                          )}

                          {d.game_slot && (
                            <p className="mt-1 text-xs text-gray-600">
                              {d.game_slot.date?.slice(0, 10)} • {d.game_slot.start_time?.slice(0, 5)} –{" "}
                              {d.game_slot.end_time?.slice(0, 5)} @ {d.game_slot.court_name}
                            </p>
                          )}

                          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                            {actor && (
                              <span>
                                {d.type?.includes("removed") ? "Removed by" : "By"}{" "}
                                <span className="font-medium">{actor.name}</span> • {actor.role}
                              </span>
                            )}
                            <span>{timeAgo(notif.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isFetchingNextPage && (
                  <div className="py-6 text-center text-gray-500">
                    <div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full mx-auto"></div>
                  </div>
                )}

                {!hasNextPage && notifications.length > 0 && (
                  <div className="py-4 text-center text-gray-400 text-sm">End of notifications</div>
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