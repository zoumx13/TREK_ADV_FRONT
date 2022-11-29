import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Modal } from "react-bootstrap";

function Parcours() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [parcours, setParcours] = useState(false);
  const [nomParcours, setNomParcours] = useState();
  const [dureeParcours, setDureeParcours] = useState();
  const [prix, setPrix] = useState();
  const [niveauDifficulte, setNiveauDifficulte] = useState();
  const [descriptionParcours, setDescriptionParcours] = useState();
  const [image, setImage] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  const UploadImages = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);
  };
  function closeModal() {
    setIsOpen(false);
  }
  async function LoadParcours() {
    let options = {
      method: "GET",
      headers: headers,
    };
    let response = await fetch("http://127.0.0.1:8080/parcours/", options);
    let donnes = await response.json();
    if (!donnes) {
      return;
    } else {
      setData(donnes.reverse());
    }
  }
  const DetailsParcours = async (id) => {
    navigate(`/parcours/details/${id}`);
  };
  const AddParcours = async (event) => {
    event.preventDefault();
    if (
      nomParcours === "" ||
      dureeParcours === "" ||
      prix === "" ||
      niveauDifficulte === "" ||
      descriptionParcours === ""
    ) {
      alert("Veuillez remplir tous les champs");
    } else {
      let data = {
        nomParcours: nomParcours,
        dureeParcours: dureeParcours,
        description: descriptionParcours,
        prix: prix,
        niveauDifficulte: niveauDifficulte,
      };
      const body = JSON.stringify(data);
      let options = {
        method: "POST",
        headers: headers,
        body: body,
      };
      let reponse = await fetch(
        "http://127.0.0.1:8080/parcours/createParcours",
        options
      );
      let donnes = await reponse.json();
      if (donnes) {
        const id = donnes._id;
        if (image.data) {
          const formData = new FormData();
          formData.append("file", image.data);
          let options = {
            method: "POST",
            // headers : headers,
            headers: {
              Authorization: "bearer " + token,
              // "Content-Type": "multipart/form-data boundary=something",
            },
            body: formData,
          };
          const response = await fetch(
            `http://127.0.0.1:8080/parcours/createImageParcours/${id}`,
            options
          );
          let result = await response.json();
          const res = JSON.stringify(result);
          if (res !== '{"message":"Echec"}') {
            setImage([]);
          }
        }
      }
      alert(`Parcours ${nomParcours} créé`);
      setNomParcours("");
      setDescriptionParcours("");
      setNiveauDifficulte("");
      setPrix("");
      setDureeParcours("");
      setParcours(!parcours);
    }
  };
  const deleteParcours = async (id) => {
    let options = {
      method: "DELETE",
      headers: headers,
    };
    let response = await fetch(
      `http://127.0.0.1:8080/parcours/deleteParcours/${id}`,
      options
    );
    await response.json();
    setParcours(!parcours);
    alert(`Parcours supprimé.`);
  };
  useEffect(() => {
    LoadParcours();
  }, [parcours, image]);
  return (
    <header>
      <div id="Parcour">
        <div className="scrollbar" id="style-3">
          <ul className="d-flex">
            {data.map((item) => (
              <li key={item._id}>
                <Card style={{ width: "18rem", height: "100%" }}>
                  <Card.Img
                    variant="top"
                    src={`http://127.0.0.1:8080/parcours/${item.imgIllustration}`}
                  />
                  <Card.Body>
                    <Card.Title>{item.nomParcours}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => DetailsParcours(item._id)}
                    >
                      Détails
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => deleteParcours(item._id)}
                    >
                      Supprimer
                    </Button>
                  </Card.Body>
                </Card>
              </li>
            ))}
          </ul>
        </div>

        <div className="Creation-Parcours">
          <p className="Para">Gestion des parcours</p>
          <Button variant="warning" onClick={() => setIsOpen(true)}>
            <span>Créer parcours</span>
          </Button>
        </div>
        <Modal
          show={modalIsOpen}
          onHide={closeModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Création parcours</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="Nom">
              <input
                type="text"
                id="Nom"
                placeholder="Nom parcours"
                value={nomParcours}
                onChange={(e) => setNomParcours(e.target.value)}
              />
            </div>
            <div className="Durée">
              <input
                type="time"
                min="0:00"
                id="durée"
                placeholder="Durée du parcours"
                value={dureeParcours}
                onChange={(e) => setDureeParcours(e.target.value)}
              />
            </div>
            <div className="Description">
              <textarea
                type="text"
                id="descriptionm"
                placeholder="Description"
                value={descriptionParcours}
                onChange={(e) => setDescriptionParcours(e.target.value)}
              />
            </div>
            <div className="Prix">
              <input
                type="number"
                min="0"
                id="prix"
                placeholder="Prix"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
              />
            </div>

            {!image.preview ? (
              <p className="Nouv-Img">Entrez Nouvelle Image</p>
            ) : (
              <img src={image.preview} />
            )}

            <div className="input-img">
              <input
                type="file"
                name="image"
                onChange={UploadImages}
                className="form-control"
                id="uploadBtn"
              />
            </div>
            <div className="Difficulté">
              <input
                type="number"
                min="1"
                max="3"
                id="difficulté"
                placeholder="Niveau difficulté 1 à 3"
                value={niveauDifficulte}
                onChange={(e) => setNiveauDifficulte(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => AddParcours()}>
              Valider
            </Button>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </header>
  );
}

export default Parcours;
