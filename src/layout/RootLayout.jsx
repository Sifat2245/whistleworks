import Footer from "@/shared/Footer";
import Header from "@/shared/Header";
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