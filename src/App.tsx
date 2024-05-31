import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalStateProvider } from "./context/Store";
import { ThirdwebProvider } from "thirdweb/react";
import HomePage from "./pages/HomePage";
import BuyGame from "./pages/BuyGame";
import Sidebar from "./components/homePageComponents/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <GlobalStateProvider>
      <ThirdwebProvider>
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
              //create a route which take id as dynamic params
              <Route path="/buy/:id" element={<BuyGame />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ThirdwebProvider>
    </GlobalStateProvider>
  );
}

export default App;
