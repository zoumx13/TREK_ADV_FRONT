import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Modal } from "react-bootstrap";

function CreateGuide() {
  const navigate = useNavigate();
  const [allGuides, setAllGuides] = useState([]);
  const [addGuide, setAddGuide] = useState(false);
  const [modSupGuide, setModSupGuide] = useState(false);
  const [image, setImage] = useState([]);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [description, setDescription] = useState("");
  const [identifiant, setIdentifiant] = useState("");
  const [xp, setXp] = useState("");
  const [photo_profil, setPhoto_profil] = useState([]);
  const [guide, setGuide] = useState(false);
  const [idGuide, setIdGuide] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  // const [goodPassword, setGoodPassword] = useState("");
  let token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
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
    setImage(img);
  };

  const clearInput = async () => {
    setNom("");
    setPrenom("");
    setDescription("");
    setXp("");
    setIdentifiant("");
    setPhoto_profil([]);
    setImage([]);
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
  const chooseAddGuide = async (event) => {
    event.preventDefault();
    clearInput();
    setAddGuide(true);
    setModSupGuide(false);
    setIsOpen(true);
  };
  const chooseModSupGuide = async (event) => {
    event.preventDefault();
    clearInput();
    setModSupGuide(true);
    setAddGuide(false);
    setIsOpen(true);
  };
  function closeModal() {
    setIsOpen(false);
    setModSupGuide(false);
    setAddGuide(false);
  }
  const handleGuideChange = async (event) => {
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
      if (!goodGuide[0].photo_profil) {
        setPhoto_profil([]);
      } else {
        setPhoto_profil(goodGuide[0].photo_profil);
      }
      setIdGuide(goodGuide[0].id);
    }
  };

  async function ListGuide() {
    let options = {
      method: "GET",
      headers: headers,
    };
    let reponse = await fetch("http://localhost:8080/users/listguide", options);
    let donnees = await reponse.json();
    if (!donnees) {
      return;
    } else {
      setAllGuides(donnees);
    }
  }

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
        headers: headers,
        body: JSON.stringify(data),
      };
      let reponse = await fetch(
        "http://127.0.0.1:8080/users/createguide",
        options
      );
      let donnees = await reponse.json();
      if (donnees) {
        const id = donnees._id;
        if (image.data) {
          const formData = new FormData();
          formData.append("file", image.data);
          let options = {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
              // "Content-Type": "multipart/form-data boundary=something",
            },
            body: formData,
          };
          const response = await fetch(
            `http://127.0.0.1:8080/users/imgUser/${id}`,
            options
          );
          let result = await response.json();
          const res = JSON.stringify(result);
          if (res !== '{"message":"Echec"}') {
            setImage([]);
          }
        }
      }
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
      alert(`Nouveau guide ${donnees.nom} ${donnees.prenom} créé.`);
      clearInput();
      closeModal() 
      setGuide(!guide);
    }
  }

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
        headers: headers,
        body: JSON.stringify(data),
      };
      let reponse = await fetch(
        `http://127.0.0.1:8080/users/modifyGuideadmin/${idGuide}`,
        options
      );
      await reponse.json();
      if (image.data) {
        const formData = new FormData();
        formData.append("file", image.data);
        let options = {
          method: "POST",
          headers: {
            Authorization: "bearer " + token,
            // "Content-Type": "multipart/form-data boundary=something",
          },
          body: formData,
        };
        const response = await fetch(
          `http://127.0.0.1:8080/users/imgUser/${idGuide}`,
          options
        );
        let result = await response.json();
        const res = JSON.stringify(result);
        if (res !== '{"message":"Echec"}') {
          setImage([]);
        }
      }
      alert(`Guide ${nom} ${idGuide} mis à jour`);
      closeModal() 
      clearInput();
      setGuide(!guide);
    }
  };

  const deleteGuide = async () => {
    let options = {
      method: "DELETE",
      headers: headers,
    };
    let reponse = await fetch(
      "http://127.0.0.1:8080/users/deleteGuideadmin/" + idGuide,
      options
    );
    await reponse.json();
    alert(`Guide ${nom} ${prenom} supprimé`);
    clearInput();
    closeModal() 
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
          <Button variant="warning" onClick={chooseAddGuide}>
            <span>Ajouter un guide</span>
          </Button>
          <Button variant="warning" onClick={chooseModSupGuide}>
            <span>Modifier/Supprimer un guide</span>
          </Button>
        </div>

        <div className="princip1">
          <Modal
            show={modalIsOpen}
            onHide={closeModal}
            backdrop="static"
            keyboard={false}
          >
            {addGuide === true || modSupGuide === true ? (
                <div className="PageCreaGuide">
                  {modSupGuide === true ? (
                    <>
                      <Modal.Header closeButton>
                        <Modal.Title>
                          Modification/Suppression de guide
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form.Select
                          aria-label="Floating label select example"
                          // value={stepChoice.nomEtape}
                          name="step"
                          onChange={handleGuideChange}
                        >
                          <option id="stepChoice" value={""}>
                            --- Sélectionner un guide ---
                          </option>
                          {allGuides.map((guide) => {
                            return (
                              <option
                                id="stepChoice"
                                value={guide.id}
                                key={guide.id}
                              >
                                {guide.nom} {guide.prenom}
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Modal.Body>
                    </>
                  ) : (
                    <Modal.Header closeButton>
                      <Modal.Title>Ajout de guide</Modal.Title>
                    </Modal.Header>
                  )}
                  <Modal.Body>
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
                    </div>
                    <div>
                      {photo_profil != "" && !image.preview && (
                        <img
                          src={`http://127.0.0.1:8080/users/${photo_profil}`}
                        />
                      )}
                      {photo_profil && image.preview && (
                        <img src={image.preview} />
                      )}
                    </div>
                    <div className="input-img1">
                      <input
                        type="file"
                        name="image"
                        onChange={UploadImages}
                        className="form-control"
                        id="uploadBtn"
                      />
                    </div>
                  </Modal.Body>
                  {/* <div className="btn-02">
                    {addGuide === true ? (
                      <div>
                        <button onClick={NewGuide}>Valider</button>
                        <button onClick={() => setAddGuide(false)}>
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                    {modSupGuide === true ? (
                      <div>
                        <button onClick={() => modifyGuide()}>Modifier</button>
                        <button onClick={() => deleteGuide()}>Supprimer</button>
                        <button onClick={() => setModSupGuide(false)}>
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div> */}
                </div>
            ) : (
              <></>
            )}
            <Modal.Footer>
              {modSupGuide === true && (
                <>
              <Button variant="primary" onClick={() => modifyGuide()}>
              Modifier
            </Button>
            <Button variant="primary" onClick={() => deleteGuide()}>
              Supprimer
            </Button>
            </>
              )}
            {addGuide === true && (
            <Button variant="primary" onClick={() => NewGuide()}>
            Valider
          </Button>
            )}

              <Button variant="secondary" onClick={closeModal}>
                Annuler
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default CreateGuide;
