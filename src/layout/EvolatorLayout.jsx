import { useState } from "react";
import DashboardHeader from "@/components/shared/DashboardHeader";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import { Outlet } from "react-router-dom";

const EvolatorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-neutral-50">
      {/* Sidebar — full height on the left */}
      <DashboardSidebar
        role="evaluator"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Content area (right of the sidebar) — topbar scrolls away, sidebar stays */}
      <div className="w-full lg:pl-[272px]">
        <DashboardHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="w-full">
          <div className="mx-auto w-full max-w-[1620px] px-4 pt-4 pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EvolatorLayout;
