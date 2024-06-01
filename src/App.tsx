import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { GlobalStateProvider } from "./context/Store";
import HomePage from "./pages/HomePage";
import BuyGame from "./pages/BuyGame";
import Sidebar from "./components/homePageComponents/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlayGame from "./pages/PlayGame";

function App() {
  return (
    <GlobalStateProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div className="bg-primary h-screen w-full flex">
                <ToastContainer
                  position="bottom-right"
                  theme="dark"
                  toastStyle={{ backgroundColor: "#111827" }}
                />
                <Sidebar />
                <Outlet />
              </div>
            }
          >
            <Route index element={<HomePage />} />
            {/* create a route which take id as dynamic params */}
            <Route path="/buy/:id" element={<BuyGame />} />
            <Route path="/play/:id" element={<PlayGame />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalStateProvider>
  );
}

export default App;
