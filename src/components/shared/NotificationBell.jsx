import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useState, useRef, useEffect, useLayoutEffect, useCallback, useId } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import {
  IoNotificationsOutline,
  IoNotifications,
  IoClose,
  IoCalendar,
  IoPerson,
  IoDocumentText,
  IoTrash,
  IoCheckmarkDone,
  IoCheckmarkCircleOutline,
  IoNotificationsOffOutline,
} from "react-icons/io5";

/* ── Type → visual meta ─────────────────────────────────── */
const getNotificationMeta = (type, dataType = "") => {
  if (type === "announcement")
    return { Icon: IoDocumentText, tile: "bg-sky-50", iconColor: "text-sky-600", label: "Announcement" };
  if (dataType?.includes("assigned") || dataType?.includes("jourcy"))
    return { Icon: IoPerson, tile: "bg-violet-50", iconColor: "text-violet-600", label: "Assignment" };
  if (dataType?.includes("removed"))
    return { Icon: IoTrash, tile: "bg-red-50", iconColor: "text-red-500", label: "Removed" };
  if (dataType?.includes("schedule"))
    return { Icon: IoCalendar, tile: "bg-amber-50", iconColor: "text-amber-600", label: "Schedule" };
  return { Icon: IoNotificationsOutline, tile: "bg-gray-100", iconColor: "text-gray-500", label: "Notification" };
};

const getActor = (data) =>
  data?.assigned_by ||
  data?.removed_by ||
  data?.published_by ||
  (data?.creator_name && { name: data.creator_name, role: "Director" }) ||
  null;

const timeAgo = (date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "recently";
  }
};

/* ── Message with inline expand/collapse ────────────────── */
const TruncatedMessage = ({ text, unread }) => {
  const msgRef = useRef(null);
  const [isClamped, setIsClamped] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Show "See more" only when the message actually overflows the 2-line clamp.
  // useLayoutEffect measures before paint so the button doesn't flash in late;
  // also collapses any open item when its message changes.
  useLayoutEffect(() => {
    const el = msgRef.current;
    if (!el) return;
    setIsClamped(el.scrollHeight > el.clientHeight + 1);
    setExpanded(false);
  }, [text]);

  return (
    <div>
      <p
        ref={msgRef}
        className={`mt-0.5 text-xs leading-relaxed ${expanded ? "" : "line-clamp-2"} ${
          unread ? "font-medium text-gray-700" : "text-gray-500"
        }`}
      >
        {text}
      </p>
      {isClamped && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          aria-expanded={expanded}
          className="mt-1 rounded underline text-[11px] font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};

/* ── Small presentational pieces ────────────────────────── */
const SkeletonItem = () => (
  <div className="flex items-start gap-3.5 p-4 animate-pulse">
    <div className="size-11 shrink-0 rounded-xl bg-gray-100" />
    <div className="flex-1 space-y-2 pt-0.5">
      <div className="h-3.5 w-2/3 rounded-full bg-gray-100" />
      <div className="h-3 w-full rounded-full bg-gray-100" />
      <div className="h-3 w-1/3 rounded-full bg-gray-100" />
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, tileClass, iconClass, title, subtitle }) => (
  <div className="px-6 py-14 text-center">
    <div className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl ${tileClass}`}>
      <Icon className={`size-8 ${iconClass}`} />
    </div>
    <p className="text-sm font-semibold text-gray-800">{title}</p>
    <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
  </div>
);

const NotificationItem = ({ notif, isLast, lastRef, onOpen, onDelete, isDeleting }) => {
  const isUnread = !notif.is_read;
  const d = notif.data || {};
  const { Icon, tile, iconColor, label } = getNotificationMeta(notif.type, d.type);
  const actor = getActor(d);

  return (
    <motion.div
      ref={isLast ? lastRef : null}
      onClick={onOpen}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`group relative flex cursor-pointer gap-3.5 p-4 pl-5 transition-colors duration-200 ${
        isUnread ? "bg-primary/[0.045] hover:bg-primary/[0.08]" : "hover:bg-gray-50"
      }`}
    >
      {isUnread && (
        <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-primary" aria-hidden="true" />
      )}

      <button
        onClick={onDelete}
        disabled={isDeleting}
        aria-label="Delete notification"
        title="Delete notification"
        className="absolute top-3 right-3 z-10 flex size-7 items-center justify-center rounded-full text-gray-300 transition-all duration-200 hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
      >
        {isDeleting ? (
          <div className="size-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-red-500" />
        ) : (
          <IoClose className="size-4.5" />
        )}
      </button>

      <div
        role="img"
        aria-label={label}
        title={label}
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tile}`}
      >
        <Icon className={`size-5 ${iconColor}`} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1 pr-5">
        <h4
          className={`min-w-0 truncate text-sm ${
            isUnread ? "font-semibold text-gray-900" : "font-medium text-gray-800"
          }`}
        >
          {d.title || d.subject || "Notification"}
        </h4>

        {d.message && <TruncatedMessage text={d.message} unread={isUnread} />}

        {(d.camp?.name || d.game_slot) && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {d.camp?.name && (
              <span className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                {d.camp.name}
              </span>
            )}
            {d.game_slot && (
              <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-medium text-gray-600">
                <IoCalendar className="size-3" />
                {d.game_slot.date?.slice(0, 10)} • {d.game_slot.start_time?.slice(0, 5)} –{" "}
                {d.game_slot.end_time?.slice(0, 5)} • {d.game_slot.court_name}
              </span>
            )}
          </div>
        )}

        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-gray-400">
          {actor ? (
            <span className="min-w-0 truncate">
              {d.type?.includes("removed") && <span className="text-gray-400">Removed by </span>}
              <span className="font-medium text-gray-500">{actor.name}</span>
              <span className="text-gray-300"> • {actor.role}</span>
            </span>
          ) : (
            <span />
          )}
          <time className="shrink-0" title={new Date(notif.created_at).toLocaleString()}>
            {timeAgo(notif.created_at)}
          </time>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main component ─────────────────────────────────────── */
const NotificationBell = () => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();
  const instanceId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [confirmClear, setConfirmClear] = useState(false);
  const confirmTimerRef = useRef(null);
  const dropdownRef = useRef(null);
  const observerRef = useRef(null);

  // Fetch unread count
  const { data: countsData } = useQuery({
    queryKey: ["notification-counts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications/counts");
      return res?.data?.data || { total_unread: 0 };
    },
    refetchInterval: 30000,
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
  const unreadLoaded = notifications.filter((n) => !n.is_read).length;
  const filtered = filter === "unread" ? notifications.filter((n) => !n.is_read) : notifications;

  const mapNotifications = (fn) => (old) =>
    old
      ? {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            notifications: p.notifications.map(fn),
          })),
        }
      : old;

  const decrementCount = (by = 1) =>
    queryClient.setQueryData(["notification-counts"], (old) => ({
      ...old,
      total_unread: Math.max(0, (old?.total_unread || 0) - by),
    }));

  // Mutations — with optimistic updates for a snappy feel
  const markAsReadMutation = useMutation({
    mutationFn: (id) => axiosInstance.post(`/notifications/${id}/mark-as-read`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["my-notifications"] });
      const prevNotifications = queryClient.getQueryData(["my-notifications"]);
      const prevCounts = queryClient.getQueryData(["notification-counts"]);
      queryClient.setQueryData(
        ["my-notifications"],
        mapNotifications((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      decrementCount();
      return { prevNotifications, prevCounts };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prevNotifications) queryClient.setQueryData(["my-notifications"], ctx.prevNotifications);
      if (ctx?.prevCounts) queryClient.setQueryData(["notification-counts"], ctx.prevCounts);
      toast.error("Couldn't update notification");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => axiosInstance.post("/notifications/mark-all-as-read"),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["my-notifications"] });
      const prevNotifications = queryClient.getQueryData(["my-notifications"]);
      const prevCounts = queryClient.getQueryData(["notification-counts"]);
      queryClient.setQueryData(["my-notifications"], mapNotifications((n) => ({ ...n, is_read: true })));
      queryClient.setQueryData(["notification-counts"], () => ({ total_unread: 0 }));
      return { prevNotifications, prevCounts };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevNotifications) queryClient.setQueryData(["my-notifications"], ctx.prevNotifications);
      if (ctx?.prevCounts) queryClient.setQueryData(["notification-counts"], ctx.prevCounts);
      toast.error("Couldn't mark all as read");
    },
    onSuccess: () => toast.success("All marked as read"),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/notifications/delete/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["my-notifications"] });
      const prevNotifications = queryClient.getQueryData(["my-notifications"]);
      const prevCounts = queryClient.getQueryData(["notification-counts"]);
      const target = prevNotifications?.pages?.flatMap((p) => p.notifications)?.find((n) => n.id === id);
      queryClient.setQueryData(
        ["my-notifications"],
        (old) =>
          old
            ? {
                ...old,
                pages: old.pages.map((p) => ({
                  ...p,
                  notifications: p.notifications.filter((n) => n.id !== id),
                })),
              }
            : old
      );
      if (target && !target.is_read) decrementCount();
      return { prevNotifications, prevCounts };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prevNotifications) queryClient.setQueryData(["my-notifications"], ctx.prevNotifications);
      if (ctx?.prevCounts) queryClient.setQueryData(["notification-counts"], ctx.prevCounts);
      toast.error("Couldn't delete notification");
    },
    onSuccess: () => toast.success("Deleted"),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: () => axiosInstance.delete("/notifications/clear-read"),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["my-notifications"] });
      const prev = queryClient.getQueryData(["my-notifications"]);
      queryClient.setQueryData(
        ["my-notifications"],
        (old) =>
          old
            ? {
                ...old,
                pages: old.pages.map((p) => ({
                  ...p,
                  notifications: p.notifications.filter((n) => n.is_read),
                })),
              }
            : old
      );
      return prev;
    },
    onError: (_err, _vars, prev) => {
      queryClient.setQueryData(["my-notifications"], prev);
      toast.error("Couldn't clear notifications");
    },
    onSuccess: () => toast.success("Cleared"),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-counts"] });
    },
  });

  /* ── Interactions ─────────────────────────────────────── */
  const handleClick = (notif, e) => {
    e.stopPropagation();
    if (!notif.is_read) markAsReadMutation.mutate(notif.id);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    clearTimeout(confirmTimerRef.current);
    setConfirmClear(false);
    clearAllMutation.mutate();
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

  // Close on outside click + Escape
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setIsOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("mousedown", handler);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  // Auto-load more when on Unread tab but the loaded pages contain no unread yet
  useEffect(() => {
    if (filter === "unread" && filtered.length === 0 && notifications.length > 0 && hasNextPage && unreadCount > 0) {
      fetchNextPage();
    }
  }, [filter, filtered.length, notifications.length, hasNextPage, unreadCount, fetchNextPage]);

  useEffect(() => () => clearTimeout(confirmTimerRef.current), []);

  const tabs = [
    { id: "all", label: "All", count: notifications.length },
    { id: "unread", label: "Unread", count: unreadLoaded },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`relative flex size-10 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${
          isOpen
            ? "bg-primary/10 text-primary"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-95"
        }`}
      >
        {isOpen ? (
          <IoNotifications className="text-[22px]" />
        ) : (
          <IoNotificationsOutline className="text-[22px]" />
        )}

        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key={unreadCount}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 py-0.5 text-[10px] font-bold leading-none text-white shadow-sm"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="dialog"
            aria-label="Notification center"
            className="absolute top-full right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-900/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-white to-primary/[0.04] px-4 pt-4 pb-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                    : "You're all caught up"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending || unreadCount === 0}
                  aria-label="Mark all as read"
                  title="Mark all as read"
                  className="flex size-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-40"
                >
                  {markAllAsReadMutation.isPending ? (
                    <div className="size-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
                  ) : (
                    <IoCheckmarkDone className="size-4" />
                  )}
                </button>
                <button
                  onClick={handleClearAll}
                  disabled={clearAllMutation.isPending || notifications.length === 0}
                  aria-label="Clear read notifications"
                  title={confirmClear ? "Click again to confirm" : "Clear read notifications"}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:pointer-events-none disabled:opacity-40 ${
                    confirmClear
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "text-gray-400 hover:bg-red-50 hover:text-red-500"
                  }`}
                >
                  {clearAllMutation.isPending ? (
                    <div
                      className={`size-3.5 animate-spin rounded-full border-2 ${
                        confirmClear ? "border-white/30 border-t-white" : "border-gray-300 border-t-red-500"
                      }`}
                    />
                  ) : (
                    <IoTrash className="size-3.5" />
                  )}
                  {confirmClear ? "Sure?" : "Clear read"}
                </button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="border-b border-gray-100 px-4 py-2.5">
              <div className="flex w-fit items-center gap-1 rounded-full bg-gray-100 p-1">
                {tabs.map((t) => {
                  const active = filter === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setFilter(t.id)}
                      className={`relative rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        active ? "text-primary" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId={`${instanceId}-pill`}
                          className="absolute inset-0 rounded-full bg-white shadow-sm"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        {t.label}
                        {t.count > 0 && (
                          <span
                            className={`rounded-full px-1.5 py-px text-[10px] font-semibold leading-none ${
                              active ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {t.count}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List */}
            <div className="max-h-[min(28rem,calc(100vh-11rem))] overflow-y-auto overscroll-contain">
              {isLoading ? (
                <div className="divide-y divide-gray-50">
                  <SkeletonItem />
                  <SkeletonItem />
                  <SkeletonItem />
                </div>
              ) : notifications.length === 0 ? (
                <EmptyState
                  icon={IoNotificationsOffOutline}
                  tileClass="bg-gray-50"
                  iconClass="text-gray-300"
                  title="You're all caught up"
                  subtitle="New notifications will appear here."
                />
              ) : filtered.length === 0 ? (
                isFetchingNextPage ? (
                  <div className="flex items-center justify-center gap-2 py-10 text-xs text-gray-400">
                    <div className="size-3.5 animate-spin rounded-full border-2 border-gray-200 border-t-primary" />
                    Looking for unread…
                  </div>
                ) : (
                  <EmptyState
                    icon={IoCheckmarkCircleOutline}
                    tileClass="bg-emerald-50"
                    iconClass="text-emerald-400"
                    title="No unread notifications"
                    subtitle="You've read everything."
                  />
                )
              ) : (
                <>
                  <div className="divide-y divide-gray-50">
                    {filtered.map((notif, idx) => (
                      <NotificationItem
                        key={notif.id}
                        notif={notif}
                        isLast={idx === filtered.length - 1}
                        lastRef={lastRef}
                        onOpen={(e) => handleClick(notif, e)}
                        onDelete={(e) => handleDelete(notif.id, e)}
                        isDeleting={deleteMutation.isPending && deleteMutation.variables === notif.id}
                      />
                    ))}
                  </div>

                  {isFetchingNextPage && (
                    <div className="flex items-center justify-center gap-2 py-4 text-xs text-gray-400">
                      <div className="size-3.5 animate-spin rounded-full border-2 border-gray-200 border-t-primary" />
                      Loading more…
                    </div>
                  )}

                  {!hasNextPage && filter === "all" && notifications.length > 0 && (
                    <div className="flex items-center justify-center gap-1.5 py-4 text-[11px] text-gray-300">
                      <IoCheckmarkCircleOutline className="size-3.5" />
                      You&apos;re all caught up
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
