import { BrowserRouter, Route, Routes } from "react-router-dom";
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
      <div className="bg-primary h-screen w-full flex">
        <ToastContainer
          position="bottom-right"
          theme="dark"
          toastStyle={{ backgroundColor: "#111827" }}
        />
        <Sidebar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* create a route which take id as dynamic params */}
            <Route path="/buy/:id" element={<BuyGame />} />
            <Route path="/play/:id" element={<PlayGame />} />
          </Routes>
        </BrowserRouter>
      </div>
    </GlobalStateProvider>
  );
}

export default App;
