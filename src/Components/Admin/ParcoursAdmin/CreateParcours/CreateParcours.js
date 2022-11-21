import "./Create.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Parcours() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [parcours, setParcours] = useState(false);
  const [nomParcours, setNomParcours] = useState();
  const [dureeParcours, setDureeParcours] = useState();
  const [prix, setPrix] = useState();
  const [niveauDifficulte, setNiveauDifficulte] = useState();
  const [descriptionParcours, setDescriptionParcours] = useState();
  const [imgIllustration, setImgIllustration] = useState([]);
  const headers = {
    "Content-Type": "application/json",
    // authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
  };
  const [image, setImage] = useState([]);

  const UploadImages = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };

    setImage(img);
  };

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
      nomParcours == "" ||
      dureeParcours == "" ||
      prix == "" ||
      niveauDifficulte == "" ||
      descriptionParcours == ""
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
  useEffect(() => {
    LoadParcours();
  }, [parcours, image]);
  return (
    <header>
      <div id="Parcour">
        <div className="scrollbar" id="style-3">
          <ul>
            {data.map((item) => (
              <li key={item._id}>
                <div className="box">
                  <div className="box-inner">
                    <div className="box-front">
                      <h3>{item.nomParcours}</h3>
                      <img
                        alt=""
                        className="img-1"
                        src={`http://127.0.0.1:8080/parcours/${item.imgIllustration}`}
                      ></img>
                    </div>
                    <div className="box-back">
                      <article>
                        <div>
                          <p className="Para">
                            Durée du parcours : {item.dureeParcours}
                          </p>
                        </div>
                        <div>
                          <p className="Para">{item.description}</p>
                        </div>
                        <div>
                          <p className="Para">Prix : {item.prix} €</p>
                        </div>
                        <div>
                          <p className="Para">
                            Niveau de difficulté : {item.niveauDifficulte}
                          </p>
                        </div>

                        <button
                          className="btn"
                          onClick={() => DetailsParcours(item._id)}
                        >
                          Détail du parcours
                        </button>
                      </article>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="Creation-Parcours">
          <p className="Para">Gestion des parcours</p>
        </div>

        <div className="princip">
          <div className="container1">
            <div className="Gestion">
              <p className="Para">Creation des Parcours</p>
            </div>
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
                type="text"
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
                type="text"
                id="prix"
                placeholder="Prix"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
              />
            </div>

            <p className="Nouv-Img">Entrez Nouvelle Image</p>

            <div className="input-img">
              {/* <label className="" htmlFor="img">
                Entrez Nouvelle Image
              </label> */}
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
                type="text"
                id="difficulté"
                placeholder="Niveau difficulté 1 à 3"
                value={niveauDifficulte}
                onChange={(e) => setNiveauDifficulte(e.target.value)}
              />
            </div>
            <div className="btn-01">
              <button onClick={AddParcours}>Valider</button>
            </div>
          </div>
        </div>
        <img alt="" className="imgFond11"></img>
      </div>
    </header>
  );
}

export default Parcours;
