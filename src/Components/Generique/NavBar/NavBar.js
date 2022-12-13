import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../../context/userContext";
import { Form, Modal, Navbar, Container, Nav, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

function NavBar() {
  //NavBar en fonction des rôles utilisation du UseContext
  const { identifiant, setIdentifiant, role, setRole } =
    useContext(userContext);
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const passwordRef = React.useRef();
  const identifiantRef = React.useRef();
  const login = async (identifiant, password) => {
    let data = {
      password: passwordRef.current.value,
      identifiant: identifiantRef.current.value,
    };
    let options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" }),
    };

    let reponse = await fetch("http://127.0.0.1:8080/users/signin", options);

    let donnees = await reponse.json();
    console.log("DONNEES RETURN TOKEN", donnees);
    // Enregistrement du token dans le localStorage
    localStorage.setItem("token", donnees.token);
    setIsOpen(false);
    console.log("DONNEES RETURN TOKEN", donnees);
    if (donnees.message == "Connecté") {
      setIdentifiant(identifiant);
      setRole(donnees.userRole);
      if (donnees.userRole == "admin") {
        alert(donnees.userRole + " " + donnees.message);
        navigate("/AccueilAdmin");
      } else {
        if (donnees.userRole == "guide") {
          alert(donnees.userRole + " " + donnees.message);
          navigate("/AccueilGuide");
        } else {
          alert(
            "Vous n'êtes pas autorisé à naviguer sur ce site web. Veuillez vous rediriger vers l'application mobile!"
          );
          navigate("/AccueilClient");
        }
      }
    } else {
      alert("Identifiant ou Mot de Passe incorrect!");
    }
  };
  async function handleSubmit(e) {
    e.preventDefault();
    const mail = e.target.elements.mail.value;
    const password = e.target.elements.password.value;
    login(mail, password);
  }
  function deconnexion() {
    setIdentifiant("");
    setRole("");
    //On vide le token pour la déconnexion
    localStorage.clear("token");
    //Avec un retour sur la page Home
    navigate("/");
  }

  // function connexion() {
  //   navigate("/connexion");
  // }

  return (
    <>
      <Navbar bg="dark" variant="dark" className="navbar sticky-top">
        <Container>
          <Navbar.Brand className="logo" href="http://localhost:3000">
            <img
              alt=""
              src="/images/MTA.png"
              width="120"
              height="120"
              className="d-inline-block align-top"
            />{" "}
          </Navbar.Brand>
          <Navbar.Brand className="brand" href="http://localhost:3000">
            My Trek Adventure
          </Navbar.Brand>
          <Nav className="allMenu me-auto">
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
                  onClick={() => setIsOpen(true)}
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
                    <Nav.Link className="link-1" href="/createguide">
                      Gestion des Guides
                    </Nav.Link>
                    <Nav.Link className="link-1" href="/AffichageResasAdmin">
                      Gestion Parcours & Réservations
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
      <Modal
        show={modalIsOpen}
        onHide={() => setIsOpen(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Connexion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="login" onSubmit={handleSubmit}>
            <Form.Label>Saisissez vos identifiants et mot de passe</Form.Label>
            <Form.Control
              className="log"
              id="mail"
              type="text"
              placeholder="Email"
              required
              ref={identifiantRef}
            />
            <Form.Control
              className="log"
              id="password"
              type="password"
              placeholder="Password"
              required
              ref={passwordRef}
            />

            <div className="réinitialiser">
              <a href="">Réinitialiser Password</a>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            variant="warning"
            className="btnLog"
            onClick={login}
          >
            <span className="button__text">Connexion</span>
            <i className="button__icon fas fa-chevron-right"></i>
          </Button>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default NavBar;
