import {BrowserRouter, Routes, Route} from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Login from "./pages/Login.jsx";
import Footer from "./components/Footer/Footer.jsx";
import DashboardAdm from "./pages/DashboardAdm.jsx";
import DashboardVendedor from "./components/DashboardVendedor1/DashboardVendedor1.jsx";
import Vendedor from "./components/Vendedor1/Vendedor1.jsx";
import EditarCliente from "./components/EditarCliente1/EditarCliente1.jsx";
import CadastroCliente from "./pages/CadastroCliente.jsx";
import CadastroVendedor from "./pages/CadastroVendedor.jsx";
import EdicaoVendedor from "./pages/EdicaoVendedor.jsx";
import ExcluirVendedor from "./pages/ExcluirVendedor.jsx";
import EscolherVendedor from "./pages/EscolherVendedor.jsx";

export default function App() {
    return(
        <BrowserRouter>
            <Header/>

            <Routes>

                <Route path="/" element={<Login/>} />
                <Route path="/DashboardAdm" element={<DashboardAdm/>} />
                <Route path="/DashboardVendedor" element={<DashboardVendedor/>} />
                <Route path="/Vendedor" element={<Vendedor/>} />
                <Route path="/EditarCliente" element={<EditarCliente/>} />
                <Route path="/CadastroCliente" element={<CadastroCliente/>} />
                <Route path="/CadastroVendedor" element={<CadastroVendedor/>} />
                <Route path="/EdicaoVendedor" element={<EdicaoVendedor/>} />
                <Route path="/Excluir" element={<ExcluirVendedor/>} />
                <Route path="/EscolherVendedor" element={<EscolherVendedor/>} />


            </Routes>

            <Footer />

        </BrowserRouter>

    )
}

