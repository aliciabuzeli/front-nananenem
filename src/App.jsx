import {BrowserRouter, Routes, Route} from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Login from "./pages/Login.jsx";
import Footer from "./components/Footer/Footer.jsx";
import DashboardAdm from "./pages/DashboardAdm.jsx";

export default function App() {
    return(
        <BrowserRouter>
            <Header/>

            <Routes>

                <Route path="/" element={<Login/>} />
                <Route path="/DashboardAdm" element={<DashboardAdm/>} />

            </Routes>

            <Footer />

        </BrowserRouter>

    )
}

