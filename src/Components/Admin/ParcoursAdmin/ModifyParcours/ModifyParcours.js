import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Parcours.css";
import "./parcoursDetails.css";

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
  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  }

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
    setImage([])
  };
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
    if (modSupStep === true) {
      setModSupStep(false);
    } else {
      setAddStep(!addStep);
      setModSupParcours(false);
    }
  };
  const chooseModSupStep = async (event) => {
    event.preventDefault();
    clearInput();
    if (modSupStep === false && addStep === true) {
      setModSupStep(true);
      setModSupParcours(false);
    } else if (addStep === false) {
      setAddStep(true);
      setModSupStep(true);
      setModSupParcours(false);
    } else if (modSupStep === true && addStep === true) {
      setAddStep(false);
      setModSupStep(false);
      setModSupParcours(false);
      setStepChoice(defaultStep);
    }
  };
  const chooseModSupParcours = async (event) => {
    clearInput()
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
    } else {
      setModSupParcours(false);
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
      nomParcours == "" ||
      dureeParcours == "" ||
      prix == "" ||
      descriptionParcours == "" ||
      niveauDifficulte == ""
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
      nomEtape == "" ||
      numeroEtape == "" ||
      lat == "" ||
      long == "" ||
      description == ""
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
      nomEtape == "" ||
      numeroEtape == "" ||
      lat == "" ||
      long == "" ||
      description == ""
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
    <div>
      <header>
        <div className="DetailsParcours">
          <p>Détails du parcours</p>
        </div>
      </header>
      <div>
        <div className="cardElo">
          <div className="imgParcoursDetails">
            <div className="test">
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
          </div>
        </div>
        <div className="containeur">
          <div className="Liste">
            <button className="btnAdd" onClick={chooseModSupParcours}>
              Modifier parcours
            </button>
            <button className="btnAdd" onClick={chooseAddStep}>
              Ajouter une étape
            </button>
            <button className="btnAdd" onClick={chooseModSupStep}>
              Modifier/Supprimer une étape
            </button>
          </div>
        </div>
        <div>
          {addStep !== false ? (
            <div>
              <div className="champInput">
                {modSupStep !== false ? (
                  <div>
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
                  </div>
                ) : (
                  <></>
                )}

                <div className="FV">
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
                  {modSupStep == false ? (
                    <div>
                      {!image.preview ? (
                        <p className="Nouv-Img">Entrez Nouvelle Image</p>
                      ) : (
                        <img src={image.preview} />
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
                  {nomEtape != "" && modSupStep === true ? (
                    <div>
                      {!image.preview ? (
                        <img
                          className="img-1"
                          src={`http://127.0.0.1:8080/etapes/${imgIllustrationEtape}`}
                        />
                      ) : (
                        <img src={image.preview} />
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

                  <div>
                    {modSupStep === true ? (
                      <div>
                        <button
                          className="btnAdd"
                          onClick={() => modifyStep(id, idStep)}
                        >
                          <span>Modifier</span>
                          <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                        <button
                          className="btnAdd"
                          onClick={() => deleteStep(id, idStep)}
                        >
                          <span>Supprimer</span>
                          <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                        <button
                          className="btnAdd"
                          onClick={() => {
                            setAddStep(false);
                            setModSupStep(false);
                          }}
                        >
                          <span>Annuler</span>
                          <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button className="btnAdd" onClick={AddStep}>
                          <span>Valider</span>
                          <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                        <button
                          className="btnAdd"
                          onClick={() => {
                            setAddStep(false);
                            setModSupStep(false);
                          }}
                        >
                          <span>Annuler</span>
                          <i className="button__icon fas fa-chevron-right"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div>
            {modSupParcours == true ? (
              <div className="FV">
                <div className="Nom1">
                  <input
                    type="text"
                    id="Nom"
                    placeholder="Nom parcours"
                    value={nomParcours}
                    onChange={(e) => setNomParcours(e.target.value)}
                  />
                </div>

                <div className="NumeroEtape">
                  <input
                    type="text"
                    id="NumeroEtape"
                    placeholder="Durée parcours"
                    value={dureeParcours}
                    onChange={(e) => setDureeParcours(e.target.value)}
                  />
                </div>

                <div className="Localisation">
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
                <div className="Description1">
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
                      src={`http://127.0.0.1:8080/parcours/${imgIllustration}`}
                    />
                  ) : (
                    <img src={image.preview} />
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
                <div>
                  <div>
                    <button
                      className="btnAdd"
                      onClick={() => modifyParcours(details._id)}
                    >
                      <span>Modifier</span>
                      <i className="button__icon fas fa-chevron-right"></i>
                    </button>
                    <button
                      className="btnAdd"
                      onClick={() => {
                        setModSupParcours(false);
                      }}
                    >
                      <span>Annuler</span>
                      <i className="button__icon fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
