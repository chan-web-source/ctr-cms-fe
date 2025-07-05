import { Outlet } from "react-router";
import Navbar from "./components/LeftPanel";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./context/useAuth";
import React from "react";

function App() {
  return (
    <>
      <UserProvider>
        {/* <Navbar /> */}
        <Outlet />
        <ToastContainer />
      </UserProvider>
    </>
  );
}

export default App;
