export default function CampMobileStickyBar({
  showMobileBar,
  price,
  statusMeta,
  onRegisterClick,
}) {
  return (
    <div
      aria-hidden={!showMobileBar}
      inert={!showMobileBar}
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 transition-transform duration-300 ease-out ${
        showMobileBar
          ? "translate-y-0"
          : "translate-y-full pointer-events-none"
      }`}
    >
      <div className="bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-6px_24px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
            Camp Fee
          </p>
          <p className="text-lg font-bold text-gray-900 leading-tight truncate">
            {price}
            <span className="text-xs font-medium text-gray-400 ml-1.5">
              · {statusMeta.label}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={onRegisterClick}
          className="shrink-0 bg-primary hover:bg-[#0099d4] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-primary/25 active:scale-95 transition-all cursor-pointer"
        >
          Register Now
        </button>
      </div>
    </div>
  );
}
