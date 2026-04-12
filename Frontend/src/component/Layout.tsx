import { useState, useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useLayoutStore } from "../store/userLayoutStore";
import { useThemeStore } from "../store/useThemeStore";

import { useLocation } from "react-router";
import Sidebar from "./Sidebar";
import ChatWindow from "../pages/chatSection/ChatWindow";


const Layout = ({
  children,
  isThemeDialogOpen,
  toggleThemeDialog,
  isStatusPreviewOpen,
  statusPreviewContact,
}: any) => {
  // Global State

  const selectedContact = useLayoutStore((state: any) => state.selectedContact);
  const setSelectedContact = useLayoutStore(
    (state: any) => state.setSelectedContact,
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const { theme, setTheme } = useThemeStore() as { theme: string; setTheme: (theme: string) => void };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 786);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`min-h-screen flex relative ${theme == "dark" ? "bg-gray-600 text-white" : "text-black bg-white"} flex relative `}
    >
      {/* Sidebar only renders on desktop/tablet */}
      {!isMobile && <Sidebar />}

      <div
        className={`flex-1 flex overflow-hidden ${isMobile ? "flex-col" : ""}`}
      >
        <AnimatePresence initial={false}>
          {/* Example condition from the original code */}
          {(!selectedContact || !isMobile) && (
            <motion.div
              key="chatlist"
              initial={{ x: isMobile ? "-100%" : 0 }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className={`w-full md:w-2/5 h-full  ${isMobile ? "pb-16" : ""}`}
            >
              {children}
            </motion.div>
          )}

          {(selectedContact || !isMobile) && (
            <motion.div
              key="chatwindow"
              initial={{ x: isMobile ? "-100%" : 0 }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className={`w-full  h-full`}
            >
              {
                <ChatWindow
                  selectedContact={selectedContact}
                  setSelectedContact={setSelectedContact}
                  isMobile={isMobile}
                />
              }
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isMobile && <Sidebar />}
      {isThemeDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`${theme == "dark" ? "text-white bg-black " : "bg-white text-black"} p-6 rounded-lg`}
          >
            <h2 className="text-2xl font-semibold mb-4">Choose theme</h2>

            <div className="space-y-4">
              <label
                htmlFor=""
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  value={"light"}
                  checked={theme == "light"}
                  onChange={() => setTheme("light")}
                  className="from-radio text-blue-400"
                />
                <span>Light</span>
              </label>

              <label
                htmlFor=""
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  value={"light"}
                  checked={theme == "dark"}
                  onChange={() => setTheme("dark")}
                  className="from-radio text-blue-400"
                />
                <span>Light</span>
              </label>
            </div>

            <button
              onClick={toggleThemeDialog}
              className="mt-6 w-full bg-black text-white py-2  rounded hover:bg-blue-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isStatusPreviewOpen && (
        <div className="fixed inset-0 flex items-center  bg-black bg-opacity-50 z-50">
          {statusPreviewContact}
        </div>
      )}
    </div>
  );
};

export default Layout;
