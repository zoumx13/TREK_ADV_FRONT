import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Parcours.css";
import "./parcoursDetails.css";
import "./DetailsResa.css";

export default function ModifyParcours() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [details, setDetails] = useState();
  const [etape, setEtape] = useState(false);
  const [addStep, setAddStep] = useState(false);
  const [modSupStep, setModSupStep] = useState(false);
  const [modSupParcours, setModSupParcours] = useState(false);
  let defaultStep = {
    nomEtape: "",
    numeroEtape: "",
    localisation: [{ lat: "", long: "" }],
    descriptionEtape: "",
  };
  const [stepChoice, setStepChoice] = useState(defaultStep);
  const [idStep, setIdStep] = useState();
  const [nomEtape, setNomEtape] = useState();
  const [numeroEtape, setNumeroEtape] = useState();
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [description, setDescription] = useState();
  const [imgIllustrationEtape, setImgIllustrationEtape] = useState([]);
  const [image, setImage] = useState([]);
  const [nomParcours, setNomParcours] = useState();
  const [dureeParcours, setDureeParcours] = useState();
  const [prix, setPrix] = useState();
  const [niveauDifficulte, setNiveauDifficulte] = useState();
  const [descriptionParcours, setDescriptionParcours] = useState();
  const [imgIllustration, setImgIllustration] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [stepByParcours, setStepByParcours] = useState([]);
  const [centerMap, setCenterMap] = useState([43.2,5.3])
  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  const markerIcon = new L.Icon({
    iconUrl: require("./marker.png"),
    iconSize: [35, 45],
  });

  const UploadImages = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };

    setImage(img);
  };
  const clearInput = async () => {
    setNomEtape("");
    setNumeroEtape("");
    setLat("");
    setLong("");
    setDescription("");
    setImgIllustrationEtape([]);
    setNomParcours("");
    setDureeParcours("");
    setPrix("");
    setNiveauDifficulte("");
    setDescriptionParcours("");
    setImgIllustration([]);
    setImage([]);
  };
  function closeModal() {
    setIsOpen(false);
    setAddStep(false);
    setModSupStep(false);
    setModSupParcours(false);
  }
  const updatePicture = async (id, idStep) => {
    const formData = new FormData();
    formData.append("file", image.data);
    let options = {
      method: "POST",
      headers: {
        Authorization: "bearer " + id,
        // "Content-Type": "multipart/form-data boundary=something",
      },
      body: formData,
    };
    const response = await fetch(
      `http://127.0.0.1:8080/parcours/createImageStep/${id}/${idStep}`,
      options
    );
    let result = await response.json();
    const res = JSON.stringify(result);
    if (res !== '{"message":"Echec"}') {
      setImage([]);
    }
  };
  const chooseAddStep = async (event) => {
    event.preventDefault();
    clearInput();
    setStepChoice(defaultStep);
    if (addStep === false) {
      setAddStep(true);
      setModSupStep(false);
      setModSupParcours(false);
      setIsOpen(true);
    } else {
      setAddStep(false);
      setModSupParcours(false);
      setModSupStep(false);
      setIsOpen(true);
    }
  };
  const chooseModSupStep = async (event) => {
    event.preventDefault();
    clearInput();
    if (modSupStep === false && addStep === true) {
      setModSupStep(true);
      setModSupParcours(false);
      setIsOpen(true);
    } else if (addStep === false) {
      setAddStep(true);
      setModSupStep(true);
      setModSupParcours(false);
      setIsOpen(true);
    } else if (modSupStep === true && addStep === true) {
      setAddStep(false);
      setModSupStep(false);
      setModSupParcours(false);
      setIsOpen(false);
      setStepChoice(defaultStep);
    }
  };
  const chooseModSupParcours = async (event) => {
    clearInput();
    event.preventDefault();
    if (modSupParcours === false) {
      setNomParcours(details.nomParcours);
      setDureeParcours(details.dureeParcours);
      setPrix(details.prix);
      setNiveauDifficulte(details.niveauDifficulte);
      setDescriptionParcours(details.description);
      setImgIllustration(details.imgIllustration);
      setModSupParcours(true);
      setAddStep(false);
      setModSupStep(false);
      setIsOpen(true);
    } else {
      setModSupParcours(false);
      setIsOpen(false);
    }
  };
  const handleStepChange = async (event) => {
    event.preventDefault();
    if (event.target.value !== "") {
      const goodStep = details.etape.filter(
        (step) => step.nomEtape === event.target.value
      );
      setNomEtape(goodStep[0].nomEtape);
      setNumeroEtape(goodStep[0].numeroEtape);
      setLat(goodStep[0].localisation[0].lat);
      setLong(goodStep[0].localisation[0].long);
      setDescription(goodStep[0].descriptionEtape);
      setImgIllustrationEtape(goodStep[0].imgIllustrationEtape);
      setStepChoice(goodStep[0]);
      setIdStep(goodStep[0]._id);
    } else {
      clearInput();
      setStepChoice(defaultStep);
    }
  };
  async function getParcoursDetails(id) {
    let options = {
      method: "GET",
      headers: headers,
    };
    let response = await fetch(`http://127.0.0.1:8080/parcours/${id}`, options);
    let donnes = await response.json();
    if (!donnes) {
      return;
    } else {
      setDetails(donnes);
      const step = [];
      console.log(donnes.etape);
      donnes.etape.map((item) => {
        step.push({
          localisation: [item.localisation[0].lat, item.localisation[0].long],
          nomEtape: item.nomEtape,
          descriptionEtape: item.descriptionEtape,
        });
      });
      setCenterMap(step[0].localisation);
      console.log("etappeeeeeeeee",step[0].localisation)
      setStepByParcours(step);
    }
  }
  const modifyParcours = async (id) => {
    let infoParcours = {
      nomParcours: nomParcours,
      dureeParcours: dureeParcours,
      prix: prix,
      description: descriptionParcours,
      niveauDifficulte: niveauDifficulte,
    };
    if (
      nomParcours === "" ||
      dureeParcours === "" ||
      prix === "" ||
      descriptionParcours === "" ||
      niveauDifficulte === ""
    ) {
      alert("Veuillez remplir tous les champs");
    } else {
      const data = JSON.stringify(infoParcours);
      let options = {
        method: "PATCH",
        headers: headers,
        body: data,
      };
      let response = await fetch(
        `http://127.0.0.1:8080/parcours/modifyParcours/${id}`,
        options
      );
      let donnes = await response.json();
      if (donnes) {
        if (image.data) {
          const formData = new FormData();
          formData.append("file", image.data);
          let options = {
            method: "POST",
            headers: {
              Authorization: "bearer " + id,
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
        alert(`Parcours ${nomParcours} modifié`);
        navigate("/parcours");
      }
    }
  };
  const AddStep = async (event) => {
    event.preventDefault();
    if (
      nomEtape === "" ||
      numeroEtape === "" ||
      lat === "" ||
      long === "" ||
      description === ""
    ) {
      alert("Veuillez remplir tous les champs");
    } else {
      let data = {
        nomEtape: nomEtape,
        numeroEtape: numeroEtape,
        lat: lat,
        long: long,
        descriptionEtape: description,
      };
      const body = JSON.stringify(data);
      let options = {
        method: "PATCH",
        headers: headers,
        body: body,
      };
      let reponse = await fetch(
        `http://127.0.0.1:8080/parcours/addStep/${id}`,
        options
      );
      let donnes = await reponse.json();
      setIdStep(donnes.idStep);
      if (donnes) {
        const idStep = donnes.idStep;
        if (image.data) {
          updatePicture(id, idStep);
        }
        alert(`Etape ${nomEtape} créée`);
        clearInput();
        setAddStep(false);
        setModSupStep(false);
        setEtape(!etape);
      }
    }
  };
  const deleteStep = async (id, idStep) => {
    let options = {
      method: "DELETE",
      headers: headers,
    };
    let response = await fetch(
      `http://127.0.0.1:8080/parcours/deleteStep/${id}/${idStep}`,
      options
    );
    let donnes = await response.json();
    if (donnes) {
      alert(`Etape ${nomEtape} supprimée`);
      setEtape(!etape);
      clearInput();
      setAddStep(false);
      setModSupStep(false);
    }
  };
  const modifyStep = async (id, idStep) => {
    let infoStep = {
      nomEtape: nomEtape,
      numeroEtape: numeroEtape,
      lat: lat,
      long: long,
      descriptionEtape: description,
    };
    if (
      nomEtape === "" ||
      numeroEtape === "" ||
      lat === "" ||
      long === "" ||
      description === ""
    ) {
      alert("Veuillez remplir tous les champs");
    } else {
      const data = JSON.stringify(infoStep);
      let options = {
        method: "POST",
        headers: headers,
        body: data,
      };
      let response = await fetch(
        `http://127.0.0.1:8080/parcours/modifyStep/${id}/${idStep}`,
        options
      );
      let donnes = await response.json();
      if (donnes) {
        if (image.data) {
          updatePicture(id, idStep);
        }
        alert(`Etape ${nomEtape} modifiée`);
        setEtape(!etape);
        clearInput();
        setAddStep(false);
        setModSupStep(false);
      }
    }
  };

  useEffect(() => {
    getParcoursDetails(id);
  }, [etape]);

  return (
    <header>
      <div id="DetailsResa">
        <div className="Creation-Reservation">
          <h3>Détails du parcours</h3>

          <Button variant="warning" onClick={chooseModSupParcours}>
            Modifier parcours
          </Button>
          <Button variant="warning" onClick={chooseAddStep}>
            Ajouter une étape
          </Button>
          <Button variant="warning" onClick={chooseModSupStep}>
            Modifier/Supprimer une étape
          </Button>
        </div>
        <div className="Princi">
          <div className="cartPR">
            <fieldset className="field">
              <h2 className="text_details">
                Détail
                <br />
                du Trek
              </h2>
              {details ? (
                <article key={details._id}>
                  <h3 className="title">{details.nomParcours}</h3>
                  <div>
                    <p className="paragraphe">
                      Durée du parcours : {details.dureeParcours}
                    </p>
                  </div>
                  <div>
                    <p className="paragraphe">{details.description}</p>
                  </div>
                  <div>
                    <p className="paragraphe">Prix : {details.prix} €</p>
                  </div>
                  <div>
                    <p className="paragraphe">
                      Niveau de difficulté : {details.niveauDifficulte}
                    </p>
                  </div>
                  <div>
                    <p className="paragraphe">
                      {" "}
                      Nombre d'étapes : {details.etape.length}
                    </p>
                  </div>
                  <div>
                    <p className="paragraphe">
                      {" "}
                      Nombre de réservations : {details.reservations.length}
                    </p>
                  </div>
                </article>
              ) : (
                <></>
              )}
            </fieldset>
          </div>
          <MapContainer
            className="mapContainerAdmin"
            center={centerMap}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {stepByParcours.map((item) => {
              return (
                <Marker
                  position={item.localisation}
                  key={item.localisation}
                  icon={markerIcon}
                >
                  <Popup>
                    {item.nomEtape} <br /> {item.descriptionEtape}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
      <div>
        <Modal
          show={modalIsOpen}
          onHide={closeModal}
          backdrop="static"
          keyboard={false}
        >
          {addStep !== false ? (
            <div>
              <div className="">
                {modSupStep !== false ? (
                  <>
                    <Modal.Header closeButton>
                      <Modal.Title>
                        Modification/Suppression d'étape
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <label htmlFor="step_select">
                        Sélectionnez une étape: &nbsp;&nbsp;
                      </label>
                      <select
                        value={stepChoice.nomEtape}
                        name="step"
                        onChange={handleStepChange}
                      >
                        <option id="stepChoice" value={""}>
                          --- Sélectionner une étape ---
                        </option>
                        {details.etape.map((etapes) => {
                          return (
                            <option
                              id="stepChoice"
                              value={etapes.id}
                              key={etapes._id}
                            >
                              {etapes.nomEtape}
                            </option>
                          );
                        })}
                      </select>
                    </Modal.Body>
                  </>
                ) : (
                  <Modal.Header closeButton>
                    <Modal.Title>Ajout d'étape</Modal.Title>
                  </Modal.Header>
                )}
              </div>
              <Modal.Body>
                <div className="Nom1">
                  <input
                    type="text"
                    id="Nom"
                    placeholder="Nom étape"
                    value={nomEtape}
                    onChange={(e) => setNomEtape(e.target.value)}
                  />
                </div>
                <div className="NumeroEtape">
                  <input
                    type="text"
                    id="NumeroEtape"
                    placeholder="Numéro étape"
                    value={numeroEtape}
                    onChange={(e) => setNumeroEtape(e.target.value)}
                  />
                </div>

                <div className="Localisation">
                  <input
                    type="text"
                    id="lat"
                    placeholder="Latitude"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                  />
                  <input
                    type="text"
                    id="long"
                    placeholder="Longitude"
                    value={long}
                    onChange={(e) => setLong(e.target.value)}
                  />
                </div>
                <div className="Description1">
                  <textarea
                    type="text"
                    id="descriptionm"
                    placeholder="Description étape"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                {modSupStep === false ? (
                  <div>
                    {!image.preview ? (
                      <p className="Nouv-Img">Entrez Nouvelle Image</p>
                    ) : (
                      <img alt="" src={image.preview} />
                    )}

                    <div className="Image1">
                      <input
                        type="file"
                        name="image"
                        onChange={UploadImages}
                        className="form-control"
                        id="uploadBtn"
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {nomEtape !== "" && modSupStep === true ? (
                  <div>
                    {!image.preview ? (
                      <img
                        alt=""
                        className="img-1"
                        src={`http://127.0.0.1:8080/etapes/${imgIllustrationEtape}`}
                      />
                    ) : (
                      <img alt="" src={image.preview} />
                    )}

                    <div className="Image1">
                      <input
                        type="file"
                        name="image"
                        onChange={UploadImages}
                        className="form-control"
                        id="uploadBtn"
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </Modal.Body>
            </div>
          ) : (
            <></>
          )}
          {modSupParcours === true ? (
            <>
              <Modal.Header closeButton>
                <Modal.Title>Modification/Suppression parcours</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="">
                  <div className="">
                    <input
                      type="text"
                      id="Nom"
                      placeholder="Nom parcours"
                      value={nomParcours}
                      onChange={(e) => setNomParcours(e.target.value)}
                    />
                  </div>
                  <div className="">
                    <input
                      type="text"
                      id="NumeroEtape"
                      placeholder="Durée parcours"
                      value={dureeParcours}
                      onChange={(e) => setDureeParcours(e.target.value)}
                    />
                  </div>
                  <div className="">
                    <input
                      type="text"
                      id="lat"
                      placeholder="Prix"
                      value={prix}
                      onChange={(e) => setPrix(e.target.value)}
                    />
                    <input
                      type="text"
                      id="long"
                      placeholder="Niveau difficulté"
                      value={niveauDifficulte}
                      onChange={(e) => setNiveauDifficulte(e.target.value)}
                    />
                  </div>
                  <div className="">
                    <textarea
                      type="text"
                      id="descriptionm"
                      placeholder="Description parcours"
                      value={descriptionParcours}
                      onChange={(e) => setDescriptionParcours(e.target.value)}
                    />
                  </div>
                  <div>
                    {!image.preview ? (
                      <img
                        alt=""
                        src={`http://127.0.0.1:8080/parcours/${imgIllustration}`}
                      />
                    ) : (
                      <img alt="" src={image.preview} />
                    )}
                    <div className="">
                      <input
                        type="file"
                        name="image"
                        onChange={UploadImages}
                        className="form-control"
                        id="uploadBtn"
                      />
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </>
          ) : (
            <></>
          )}
          <Modal.Footer>
            {addStep === true && modSupStep === false && (
              <Button variant="primary" onClick={AddStep}>
                Valider
              </Button>
            )}
            {modSupStep === true && (
              <>
                <Button
                  variant="primary"
                  onClick={() => modifyStep(id, idStep)}
                >
                  Modifier
                </Button>
                <Button
                  variant="primary"
                  onClick={() => deleteStep(id, idStep)}
                >
                  Supprimer
                </Button>
              </>
            )}
            {modSupParcours === true && (
              <Button
                variant="primary"
                onClick={() => modifyParcours(details._id)}
              >
                Modifier
              </Button>
            )}
            <Button variant="secondary" onClick={closeModal}>
              Annuler
            </Button>
          </Modal.Footer>
        </Modal>
        </div>
    </header>
      );
    }
