import React from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../context/userContext";
import { useContext } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function NavBar() {
  //NavBar en fonction des rôles utilisation du UseContext
  const { identifiant, setIdentifiant, role, setRole } =
    useContext(userContext);
  const navigate = useNavigate();

  function deconnexion() {
    setIdentifiant("");
    setRole("");
    //On vide le token pour la déconnexion
    localStorage.clear("token");
    //Avec un retour sur la page Home
    navigate("/");
  }

  function connexion(){
    navigate("/connexion")
  }

  return (
    <Navbar bg="dark" variant="dark" className=" sticky-top  ">
      <Container>
        <Navbar.Brand href="#">
          <img
            alt=""
            src="/images/MTA.png"
            width="120"
            height="120"
            className="d-inline-block align-top"
          />{" "}
            My Trek Adventure
        </Navbar.Brand>
        <Nav className="me-auto">
          {/* Affichage de la 1er NavBar si l'identifiant est nul */}
          {!identifiant ? (
            <>
              <Nav.Link className="link-1" href="/">
                Accueil
              </Nav.Link>

              <Nav.Link className="link-1" href="/contact">
                Contact
              </Nav.Link>

              <Button
                type="submit"
                variant="warning"
                className="button"
                onClick={connexion}
              >
                Connexion
              </Button>
            </>
          ) : (
            <>
              {/* 2eme NavBar si l'identifiant est l'admin avec une condition terner si le role est = à l'admin alors tu affiches cette navbar */}
              {role == "admin" ? (
                <>
                  <Nav.Link className="link-1" href="/AccueilAdmin">
                    Accueil
                  </Nav.Link>
                  <Nav.Link className="link-1" href="/parcours">
                    Gestion des Parcours
                  </Nav.Link>
                  <Nav.Link className="link-1" href="/createguide">
                    Gestion des Guides
                  </Nav.Link>
                  <Nav.Link className="link-1" href="/AffichageResasAdmin">
                    Gestion des Réservations
                  </Nav.Link>
                </>
              ) : (
                <>
                  {/* 3eme navbar si l'identifiant est le guide avec la condition terner, si le rôle est = au guide alors tu affiches cette navbar */}
                  {role == "guide" ? (
                    <>
                      <Nav.Link className="link-1" href="/profil">
                        Profil Guide
                      </Nav.Link>
                      <Nav.Link className="link-1" href="/AccueilGuide">
                        Réservations
                      </Nav.Link>
                    </>
                  ) : (
                    <>{role == "client" ? <></> : <></>}</>
                  )}
                </>
              )}
              {/* Pour la déconnexion je clic sur le boutton déconnexion */}
              <Button
                type="submit"
                variant="warning"
                className="button"
                onClick={deconnexion}
              >
                Déconnexion
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
