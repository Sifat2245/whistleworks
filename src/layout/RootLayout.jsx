import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { Outlet, ScrollRestoration } from "react-router-dom";

const RootLayout = () => {
    return (
        <div className="w-full">
            <Header />
            <Outlet />
            <Footer />
            <ScrollRestoration />
        </div>
    )
};
export default RootLayout;