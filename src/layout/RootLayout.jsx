import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { Outlet, ScrollRestoration } from "react-router-dom";
import DynamicTitleManager from "@/components/common/DynamicTitleManager";

const RootLayout = () => {
    return (
        <div className="w-full">
            <DynamicTitleManager />
            <Header />
            <Outlet />
            <Footer />
            <ScrollRestoration />
        </div>
    )
};
export default RootLayout;