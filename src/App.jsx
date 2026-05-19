import {BrowserRouter, Routes, Route} from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Login from "./pages/Login.jsx";
import Footer from "./components/Footer/Footer.jsx";

export default function App() {
    return(
        <BrowserRouter>
            <Header/>

            <Routes>

                <Route path="/" element={<Login/>} />

            </Routes>

            <Footer />

        </BrowserRouter>

    )
}

