import React, {useContext} from "react";
import { useNavigate, }from "react-router-dom";
import { userContext } from "../../../context/userContext";
import { Button, Form } from "react-bootstrap";

function Connexion() {
  //Création du UseContext
  const { identifiant, setIdentifiant, role, setRole } =
    useContext(userContext);
  const navigate = useNavigate();
  const login = async (identifiant, password) => {
    let data = { password: password, identifiant: identifiant };
    let options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({ "Content-Type": "application/json" }),
    };

    let reponse = await fetch("http://127.0.0.1:8080/users/signin", options);

    let donnees = await reponse.json();

    // Enregistrement du token dans le localStorage
    localStorage.setItem("token", donnees.token);
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

  return (
    <header>
      <div className="home">
        {/* <body classname="img"> */}

        <div className="img1"> </div>

        {/* <h2 className="heading">My Trek Adventure</h2> */}

        {/* </body> */}

        <div className="fondVert1"></div>

        <div className="Connexion">
          <Form className="login" onSubmit={handleSubmit}>
            <Form.Label>Connexion</Form.Label>
            <Form.Control
              className="log"
              id="mail"
              type="text"
              placeholder="Email"
              required
            />
            <Form.Control
              className="log"
              id="password"
              type="password"
              placeholder="Password"
              required
            />

            <div className="réinitialiser">
              <a href="">Réinitialiser Password</a>
            </div>
            <div>
              <Button type="submit" variant="warning" className="button"  >
                <span className="button__text">Connexion</span>
                <i className="button__icon fas fa-chevron-right"></i>
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </header>
  );
}

export default Connexion;
