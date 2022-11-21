import React from "react";
import { Routes, Route, Outlet, Link, BrowserRouter, useNavigate } from "react-router-dom";
import { userContext } from "../../context/userContext";
import { useContext } from "react";



function NavBar() {
  //NavBar en fonction des rôles utilisation du UseContext
  const { identifiant, setIdentifiant, role, setRole } = useContext(userContext);
  const navigate = useNavigate();


  function click() {
    setIdentifiant("");
    setRole("");
    //On vide le token pour la déconnexion 
    localStorage.clear("token");
    //Avec un retour sur la page Home
    navigate("/");
  }

  return (
    <div>
      <nav className="wrapper">
        <img className="logo1" src="/images/MTA.png"></img>
        <a href="#" className="logo">
          My Trek Adventure
        </a>
        <a>
          <Link className="link-1" to="/">
            Home
          </Link>
        </a>
        {/* Affichage de la 1er NavBar si l'identifiant est nul */}
        {!identifiant ? (
          <>
            <ul>
              <li>
                <p>
                  <Link className="link-1" to="/connexion">
                    Connexion
                  </Link>
                </p>
              </li>
              <li>
                <p>
                  <Link className="link-1" to="/présentation">
                    Présentation
                  </Link>
                </p>
              </li>
              <li>
                <p>
                  <Link className="link-1" to="/contact">
                    Contact
                  </Link>
                </p>
              </li>
              <li>
                <p></p>
              </li>
            </ul>
          </>
        ) : (
          <>
            {/* 2eme NavBar si l'identifiant est l'admin avec une condition terner si le role est = à l'admin alors tu affiches cette navbar */}
            {role == "admin" ? (
              <>
                <Link className="link-1" to="/parcours">
                  Gestion des Parcours
                </Link>
                <Link className="link-1" to="/createguide">
                  Gestion des Guides
                </Link>
                <Link className="link-1" to="/AffichageResasAdmin">
                  Gestion des Réservations
                </Link>
              </>
            ) : (
              <>
                {/* 3eme navbar si l'identifiant est le guide avec la condition terner, si le rôle est = au guide alors tu affiches cette navbar */}
                {role == "guide" ? (
                  <>
                    <Link className="link-1" to="/profil">
                      Profil Guide
                    </Link>
                    <Link className="link-1" to="/AccueilGuide">
                      Réservations
                    </Link>
                  </>
                ) : (
                  <>
                    {role == "client" ? (
                      <></>
                    ) : (
                      <></>
                    )}

                  </>
                )}
              </>
            )}
            {/* Pour la déconnexion je clic sur le boutton déconnexion */}
            <button className="button" onClick={click}>
              Déconnexion
            </button>
          </>
        )}
      </nav>
    </div>
  );
}

export default NavBar;
