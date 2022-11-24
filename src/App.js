import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import React from "react";
import Connexion from "./Components/Generique/Connexion/connexion";
import Home from "./Components/Generique/Home/home";
import Contact from "./Components/Generique/Contact/contact";
import Parcours from "./Components/Admin/ParcoursAdmin/CreateParcours/CreateParcours";
// import Footer from './components/footer';

import AccueilAdmin from "./Components/Admin/AccueilAdmin/AccueilAdmin";
import AccueilGuide from "./Components/Guide/AccueilGuide/AccueilGuide";
import AccueilClient from "./Components/Client/AccueilClient";
import ModifyParcours from "./Components/Admin/ParcoursAdmin/ModifyParcours/ModifyParcours";
import ResasAdmin from "./Components/Admin/AffichageResasAdmin/AffichageResasAdmin";
import ProfilGuide from "./Components/Guide/ProfilGuide/ProfilGuide";

import Déconnexion from "./Components/Generique/Deconnexion/deconnexion";
import NavBar from "./Components/Generique/NavBar";

import CreateGuide from "./Components/Admin/CreaModSuppGuide/CreaGuide/CreateGuide";
import ReservationsDetails from "./Components/Guide/DetailsResa/DetailsResa";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" exact element={<Home></Home>}></Route>
        <Route path="/connexion" element={<Connexion></Connexion>}></Route>
        <Route path="/contact" element={<Contact></Contact>}></Route>
        <Route path="/parcours" exact element={<Parcours></Parcours>}></Route>
        <Route
          path="/parcours/details/:id"
          exact
          element={<ModifyParcours />}
        ></Route>
        <Route
          path="/deconnexion"
          element={<Déconnexion></Déconnexion>}
        ></Route>
        <Route
          path="/AccueilAdmin"
          element={<AccueilAdmin></AccueilAdmin>}
        ></Route>
        <Route
          path="/AccueilGuide"
          element={<AccueilGuide></AccueilGuide>}
        ></Route>
        <Route
          path="/profil"
          element={<ProfilGuide></ProfilGuide>}
        ></Route>
        <Route
          path="/reservations/:idParcours/:idResa"
          exact
          element={<ReservationsDetails />}
        ></Route>
        <Route
          path="/AccueilClient"
          element={<AccueilClient></AccueilClient>}
        ></Route>
           <Route
          path="/CreateGuide"
          element={<CreateGuide></CreateGuide>}
        ></Route>
         <Route
          path="/AffichageResasAdmin"
          element={<ResasAdmin></ResasAdmin>}
        ></Route>
      </Routes>
      {/* <div><Footer></Footer></div> */}
    </BrowserRouter>
  );
}

export default App;
