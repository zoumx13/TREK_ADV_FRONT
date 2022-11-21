import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreaGuide.css";

function CreateGuide() {
  const navigate = useNavigate();
  const [allGuides, setAllGuides] = useState([]);
  const [addGuide, setAddGuide] = useState(false);
  const [modSupGuide, setModSupGuide] = useState(false);
  const [img, setImg] = useState([]);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [description, setDescription] = useState("");
  const [identifiant, setIdentifiant] = useState("");
  const [xp, setXp] = useState("");
  const [guide, setGuide] = useState(false);
  const [idGuide, setIdGuide] = useState("");
  // const [goodPassword, setGoodPassword] = useState("");
  let token = localStorage.getItem("token");
  const numbers = "0123456789";
  const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const specialCharacters = "!'^+%&/()=?_#$½§{[]}|;:>÷`<.*-@é";
  const passwordLength = 8;

  const UploadImages = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };

    setImg(img);
  };

  const clearInput = async () => {
    setNom("");
    setPrenom("");
    setDescription("");
    setXp("");
    setIdentifiant("");
  };

  function createPassword() {
    let password = "";
    const characterList = `${numbers}${upperCaseLetters}${lowerCaseLetters}${specialCharacters}`;
    const characterListLength = characterList.length;

    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.round(Math.random() * characterListLength);
      password = password + characterList.charAt(characterIndex);
      console.log(password);
    }

    return password;
  }

  async function ListGuide() {
    let options = {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
    };
    let reponse = await fetch("http://localhost:8080/users/listguide", options);
    let donnees = await reponse.json();
    if (!donnees) {
      return;
    } else {
      setAllGuides(donnees);
    }
  }

  const chooseAddGuide = async (event) => {
    event.preventDefault();
    clearInput();
    // setGuideChoice(defaultStep);
    if (addGuide === false) {
      setAddGuide(true);
      setModSupGuide(false);
    } else {
      setAddGuide(false);
    }
  };

  const chooseModSupGuide = async (event) => {
    event.preventDefault();
    clearInput();
    if (modSupGuide === false) {
      setModSupGuide(true);
      setAddGuide(false);
    } else {
      setModSupGuide(false);
    }
  };

  const handleStepChange = async (event) => {
    event.preventDefault();
    clearInput();
    if (event.target.value !== "") {
      const goodGuide = allGuides.filter(
        (guide) => guide.id === event.target.value
      );
      if (!goodGuide[0].nom) {
        setNom("");
      } else {
        setNom(goodGuide[0].nom);
      }
      if (!goodGuide[0].prenom) {
        setPrenom("");
      } else {
        setPrenom(goodGuide[0].prenom);
      }
      if (!goodGuide[0].annees_exp) {
        setXp("");
      } else {
        setXp(goodGuide[0].annees_exp);
      }
      if (!goodGuide[0].description) {
        setDescription("");
      } else {
        setDescription(goodGuide[0].description);
      }
      if (!goodGuide[0].identifiant) {
        setIdentifiant("");
      } else {
        setIdentifiant(goodGuide[0].identifiant);
      }
      setIdGuide(goodGuide[0].id);
    }
  };

  async function NewGuide() {
    if (identifiant == "" || nom == "" || prenom == "") {
      alert("Veuillez remplir les champs Nom, Prenom et identifiant.");
    } else {
      let goodPassword = createPassword();
      let data = {
        role: "guide",
        nom: nom,
        prenom: prenom,
        description: description,
        annees_exp: xp,
        identifiant: identifiant,
        password: goodPassword,
      };
      let options = {
        method: "POST",

        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }),
        body: JSON.stringify(data),
      };
      let reponse = await fetch(
        "http://127.0.0.1:8080/users/createguide",
        options
      );
      let donnees = await reponse.json();
      alert("Félicitation, le guide a été ajouté!");
      clearInput();
      setGuide(!guide);
      let data2 = {
        mail: identifiant,
        password: goodPassword,
      };
      let options2 = {
        method: "POST",

        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }),
        body: JSON.stringify(data2),
      };
      let reponse2 = await fetch(
        "http://127.0.0.1:8080/users/mailguide",
        options2
      );
      let donnees2 = await reponse2.json();
      console.log("MAIL", donnees2);
    }
  }
  //     if (donnees) {
  //         console.log("guide créé :", donnees);
  //         setGuide(!guide);
  // }

  // async function LoadGuide() {
  //     let options = {
  //       method: "GET",
  //       headers: headers,
  //     };
  //     let response = await fetch("http://127.0.0.1:8080/users/guide", options);
  //     let donnes = await response.json();
  //     if (!donnes) {
  //       console.log("erreur");
  //       return;
  //     } else {
  //       setGuide(donnees.reverse());
  //       console.log("data présente: ", donnees);
  //     }
  //   }

  //   navigate(`/users/guide/`);

  //   useEffect(() => {
  //     LoadGuide();
  //   }, [guide]);

  const modifyGuide = async () => {
    let data = {
      nom: nom,
      prenom: prenom,
      identifiant: identifiant,
      description: description,
      annees_exp: xp,
    };
    if (nom == "" || prenom == "" || identifiant == "") {
      alert("Veuillez remplir les champs Nom, Prénom, et Identifiant");
    } else {
      let options = {
        method: "PATCH",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }),
        body: JSON.stringify(data),
      };
      let reponse = await fetch(
        "http://127.0.0.1:8080/users/modifyGuideadmin/" + idGuide,
        options
      );
      await reponse.json();
      alert("Guide mis à jour");
      clearInput();
      setGuide(!guide)
    }
  };

  const deleteGuide = async () => {
    let options = {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
    };
    let reponse = await fetch(
      "http://127.0.0.1:8080/users/deleteGuideadmin/" + idGuide,
      options
    );
    await reponse.json();
    alert("Guide supprimé");
    clearInput();
    setGuide(!guide);
  };

  useEffect(() => {
    ListGuide();
  }, [guide]);

  return (
    // Pour afficher les guides à disposition
    <div id="createguide">
      <div className="imgCreaGuide">
        <div className="Creation-Parcours">
          <p>Gestion des Guides</p>
        </div>

        <div className="princip1">
          <div className="container2">
            <div className="Gestion1">
              <button className="btnAdd" onClick={chooseAddGuide}>
                <span>Ajouter un guide</span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>
              <button className="btnAdd" onClick={chooseModSupGuide}>
                <span>Modifier/Supprimer un guide</span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>
            </div>

            {addGuide === true || modSupGuide === true ? (
              <div>
                <div className="PageCreaGuide">
                  {modSupGuide === true ? (
                    <div>
                      <label for="step_select">
                        Sélectionnez un guide: &nbsp;&nbsp;
                      </label>
                      <select
                        // value={stepChoice.nomEtape}
                        name="step"
                        onChange={handleStepChange}
                      >
                        <option id="stepChoice" value={""}>
                          --- Sélectionner un guide ---
                        </option>
                        {allGuides.map((guide) => {
                          return (
                            <option
                              id="stepChoice"
                              value={guide.id}
                              key={guide._id}
                            >
                              {guide.nom} {guide.prenom}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className="Nom1">
                    <input
                      type="text"
                      id="nom"
                      placeholder="Nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                    />
                  </div>

                  <div className="Prénom1">
                    <input
                      type="text"
                      id="prenom"
                      placeholder="Prénom"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                    />
                  </div>

                  <div className="Description2">
                    <textarea
                      type="text"
                      id="descriptionm"
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="AnnéesXP1">
                    <input
                      type="text"
                      id="annees_exp"
                      placeholder="Années d'expérience"
                      value={xp}
                      onChange={(e) => setXp(e.target.value)}
                    />
                  </div>

                  <div className="email1">
                    <input
                      type="email"
                      id="identifiant"
                      placeholder="identifiant"
                      value={identifiant}
                      onChange={(e) => setIdentifiant(e.target.value)}
                    />
                    <p className="Nouv-Img1">Entrez une photo de profil</p>

                    <div className="input-img1">
                      {/* //             <label className="" htmlFor="img">
//               Entrez Nouvelle Photo de Profil
//             </label> */}
                      <input
                        type="file"
                        name="image"
                        onChange={UploadImages}
                        className="form-control"
                        id="uploadBtn"
                      />
                    </div>
                  </div>
                  <div className="btn-02">
                    {addGuide === true ? (
                      <div>
                        <button onClick={NewGuide}>Valider</button>
                        <button>Annuler</button>
                      </div>
                    ) : (
                      <></>
                    )}
                    {modSupGuide === true ? (
                      <div>
                        <button onClick={()=> modifyGuide()}>Modifier</button>
                        <button onClick={() => deleteGuide()}>Supprimer</button>
                        <button>Annuler</button>
                      </div>
                    ) : (
                      <></>
                    )}
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

export default CreateGuide;
