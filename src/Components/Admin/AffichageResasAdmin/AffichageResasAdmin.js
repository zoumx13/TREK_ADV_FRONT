import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import "react-datepicker/dist/react-datepicker.css";
import "./AffichageResasAdmin.css";

function ResasAdmin() {
  const [idParcours, setIdParcours] = useState("");
  const [idResa, setIdResa] = useState("");
  const [data, setData] = useState([]);
  const [index, setIndex] = useState();
  const [indexResa, setIndexResa] = useState();
  const [tabClients, setTabClients] = useState([]);
  const [listGuide, setListGuide] = useState([]);
  const [dateResa, setDateResa] = useState(new Date());
  const [maxClients, setMaxClients] = useState("");
  const [creaResa, setCreaResa] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalGuide, setModalGuide] = useState(false);
  const token = localStorage.getItem("token");
  let subtitle;

  const headers = {
    "Content-Type": "application/json",
    // authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
  };
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const customStylesGuide = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const handleMaxClientsChange = (event) => {
    setMaxClients(event.target.value);
  };

  async function LoadParcours() {
    let options = {
      method: "GET",
      headers: headers,
    };
    let response = await fetch("http://127.0.0.1:8080/parcours/", options);
    let donnes = await response.json();
    if (!donnes) {
      console.log("erreur");
      return;
    } else {
      setData(donnes.reverse());
      console.log("data : ", data);
      console.log("data présente: ", donnes);
    }
  }

  async function CreateResa() {
    let token = localStorage.getItem("token");
    let dataCrea = {
      openResa: true,
      maxClients: maxClients,
      dateReservation: dateResa.toISOString().slice(0, 10),
      idGuide: "",
    };
    let options = {
      method: "PATCH",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
      body: JSON.stringify(dataCrea),
    };
    let response = await fetch(
      "http://127.0.0.1:8080/reservations/createReservations/" + idParcours,
      options
    );
    let donnes = await response.json();
    if (!donnes) {
      console.log("erreur");
      return;
    } else {
      alert("Réservation ouverte");
      window.location.reload();
    }
  }

  async function GetClients() {
    //Je créer un tableau vide
    let tabClientRequest = [];
    let i = 0;
    console.log("index : ", index, ", indexResa : ", indexResa);
    console.log("data : ", data[index].reservations[indexResa].clients);
    let lengthClients = data[index].reservations[indexResa].clients.length;
    console.log(lengthClients);
    //Faire une boucle qui va faire toute la longueur de la liste de clients
    for (i = 0; i < lengthClients; i++) {
      //Si j'ai un tableau de 10clients par ex, je vais récupérer à chaque ligne l'idClientRequest et send une requête pour chaque ID et renvoi les données
      let idClientRequest =
        data[index].reservations[indexResa].clients[i].idClient;
      console.log(idClientRequest);
      //Je récupère les id des clients
      let dataRequest = { userId: idClientRequest };
      let options = {
        method: "POST",
        body: JSON.stringify(dataRequest),
        headers: new Headers({ "Content-Type": "application/json" }),
      };
      let reponse = await fetch(
        "http://127.0.0.1:8080/users/reservationuser",
        options
      );
      let donnees = await reponse.json();
      console.log("donnes : ", donnees);
      //Je renvoi les id dans un tableau
      tabClientRequest.push(donnees.profil);
    }
    //Une fois les infos users récupérer on enregistre dans setTabClients
    setTabClients(tabClientRequest);
    console.log("tabClients : ", tabClients);
  }

  async function ListGuide() {
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    let reponse = await fetch("http://127.0.0.1:8080/users/listguide", options);
    let donnees = await reponse.json();
    console.log("donnes : ", donnees);
    setListGuide(donnees);
  }

  async function AssignGuide() {
    let idGuide = document.getElementById("guideChoice").value;

    console.log("VALUE ", idResa, idGuide);
    let data = {
      idGuide: idGuide,
      resaId: idResa,
    };
    let options = {
      method: "PATCH",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
      body: JSON.stringify(data),
    };
    let reponse = await fetch(
      "http://127.0.0.1:8080/reservations/addGuideReservations/" + idParcours,
      options
    );
    await reponse.json();
    alert("Guide ajouté");
    closeModalGuide();
  }
  function openModal() {
    setIsOpen(true);
  }
  function afterOpenModal() {
    subtitle.style.color = "#f000";
  }
  function closeModal() {
    setIsOpen(false);
  }
  function openModalGuide() {
    setModalGuide(true);
  }
  function afterOpenModalGuide() {
    subtitle.style.color = "#f000";
  }
  function closeModalGuide() {
    setModalGuide(false);
  }

  useEffect(() => {
    //Lance le loadParcours et renvoie des donnees vides au 1er chargement
    LoadParcours();
  }, []);

  useEffect(() => {
    //Renvoie les donnees au 2eme chargement
    console.log("datauseEffect : ", data);
  }, [data]);

  useEffect(() => {
    //Quand on met à jour l'index résas sur le clic sur le bouton on lance getClients et met à jour indexResa
    GetClients();
  }, [indexResa]);

  useEffect(() => {
    //Quand on met à jour l'index résas sur le clic sur le bouton on lance getClients et met à jour indexResa
    ListGuide();
  }, []);

  return (
    <header>
      <div id="Resa">
        <div className="scrollbar2" id="style-4">
          <ul>
            {data?.map((item, index) => (
              <li key={item._id}>
                <div className="box">
                  <div className="box-inner">
                    <div className="box-front">
                      <h3>{item.nomParcours}</h3>
                      <img
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
                        <div>
                          <p className="Para">
                            {" "}
                            Nombre d'étapes : {item.etape.length}
                          </p>
                        </div>
                        <div>
                          <p className="Para">
                            {" "}
                            Nombre de réservations : {item.reservations.length}
                          </p>
                        </div>
                        <button
                          className="btn"
                          onClick={() => {
                            setIdParcours(item._id);
                            setIndex(index);
                            setIdResa("");
                            setTabClients();
                            setCreaResa(false);
                          }}
                        >
                          Détail réservations
                        </button>
                        <button
                          className="btn"
                          onClick={() => {
                            setIdParcours(item._id);
                            setIndex("");
                            setIdResa("");
                            setTabClients();
                            setCreaResa(true);
                          }}
                        >
                          Ouvrir réservation
                        </button>
                      </article>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          {creaResa === true ? (
            <li>
              <article>
                <div>
                  <DatePicker
                    id="date"
                    dateFormat="yyyy-MM-dd"
                    selected={dateResa}
                    onSelect={(date) =>
                      console.log("DATE", date.toISOString().slice(0, 10))
                    }
                    onChange={(date) => setDateResa(date)}
                  />
                  <input
                    type="text"
                    id="maxClients"
                    placeholder="Clients Max "
                    onChange={handleMaxClientsChange}
                  />

                  <button
                    id="btn-resa"
                    onClick={() => {
                      CreateResa();
                      setCreaResa(false);
                    }}
                  >
                    Ouvrir
                  </button>
                </div>
              </article>
            </li>
          ) : (
            <div></div>
          )}

          <div className="scrollbar3" id="style-5">
            <ul id="ul1">
              {data[index]?.reservations?.map((item, index) => (
                <li key={item._id}>
                  <article id="dResa">
                    <div>
                      <p id="1"> Date Réservation : {item.dateReservation}</p>
                    </div>
                    <div>
                      <p id="2">
                        {" "}
                        Nombre de clients inscrits : {item.clients.length}
                      </p>
                    </div>
                    <div>
                      <p id="3"> Nombre de clients max : {item.maxClients}</p>
                    </div>
                    <button
                      id="btn-client"
                      onClick={() => {
                        setIndexResa(index);
                        setIdResa("");
                        openModal();
                      }}
                    >
                      Liste clients
                    </button>
                    <button
                      id="btn-guide"
                      onClick={() => {
                        setIdResa(item._id);
                        setTabClients();
                        openModalGuide();
                      }}
                    >
                      Attribuer Guide
                    </button>
                  </article>
                </li>
              ))}
            </ul>
            <ul>
              <Modal
                ariaHideApp={false}
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >
                <button onClick={closeModal}>close</button>
                {tabClients?.map((item) => {
                  return (
                    <li key={item._id}>
                      <article>
                        <div>
                          <p> Nom : {item.nom}</p>
                        </div>
                        <div>
                          <p> Identifiant : {item.identifiant}</p>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </Modal>
            </ul>

            <Modal
              ariaHideApp={false}
              isOpen={modalGuide}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModalGuide}
              style={customStylesGuide}
              contentLabel="Example Modal"
            >
              <ul>
                <li>
                  <article>
                    <div>
                      <label htmlFor="user_select">
                        Sélectionnez un guide: &nbsp;&nbsp;
                      </label>
                      <select name="users">
                        {listGuide.map((guides) => {
                          return (
                            <option
                              id="guideChoice"
                              value={guides.id}
                              key={guides._id}
                            >
                              {guides.nom} {guides.prenom}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        AssignGuide();
                      }}
                    >
                      Valider
                    </button>
                  </article>
                </li>
              </ul>
            </Modal>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ResasAdmin;
