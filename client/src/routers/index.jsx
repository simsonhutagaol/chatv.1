import { createBrowserRouter, redirect } from "react-router-dom";
import LoginPage from "../views/LoginPage";
import RegisterPage from "../views/RegisterPage";
import HomePage from "../views/HomePage";
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import LandingPage from "../views/LandingPage";

const socket = io("https://chat-api.simson.id", {
  autoConnect: false,
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: () => {
      if (localStorage.token) {
        Swal.fire({
          icon: "error",
          title: `You are already logged in`,
        });
        return redirect("/homepage");
      }

      return null;
    },
  },
  {
    path: "/register",
    element: <RegisterPage />,
    loader: () => {
      if (localStorage.token) {
        Swal.fire({
          icon: "error",
          title: `You are already logged in`,
        });
        return redirect("/homepage");
      }

      return null;
    },
  },
  {
    path: "/homepage",
    element: <HomePage socket={socket} />,
    loader: () => {
      if (!localStorage.token) {
        Swal.fire({
          icon: "error",
          title: "Login first",
        });
        return redirect("/login");
      }
      return null;
    },
  },
]);

export default router;
