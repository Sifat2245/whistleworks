
import { createBrowserRouter } from "react-router-dom";
import Home from "@/page/Home";
import RootLayout from "@/layout/RootLayout";


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
        ]
    },
    {
        path: "*",
        element: () => <h1>Page Not Found</h1>,
    }


]);

export default router;
