import React, { useState, useEffect, useMemo } from "react";
import { SelectColumnFilter } from "./Components/Filter";
import Table from "./Components/TableContainer";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "./AffichageResasAdmin.css";

function ResasAdmin() {
  const [refresh, setRefresh] = useState(false);
  const [allParcours, setAllParcours] = useState([]);
  const [allResa, setAllResa] = useState([]);
  const [idParcours, setIdParcours] = useState("");
  const [idResa, setIdResa] = useState("");
  const [openResa, setOpenResa] = useState(false);
  const [displayResa, setDisplayResa] = useState(false);
  const [index, setIndex] = useState();
  const [indexResa, setIndexResa] = useState();
  const [tabClients, setTabClients] = useState([]);
  const [listGuide, setListGuide] = useState([]);
  const [dateResa, setDateResa] = useState(new Date());
  const [maxClients, setMaxClients] = useState();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalGuide, setModalGuide] = useState(false);
  const date = new Date();
  const newDate = date.toISOString().slice(0, 10);
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  const columns = useMemo(() => [
    {
      Header: "Réservations à venir",
      columns: [
        {
          Header: "Nom parcours",
          accessor: "nomParcours",
          Filter: SelectColumnFilter,
          filter: "includes",
        },
        {
          Header: "Date",
          accessor: "dateReservation",
          disableFilters: true,
        },
        {
          id: 'openResa',
          Header: "Réservation ouverte",
          accessor : b => {return b.openResa ? "Ouverte" : "Fermée"},
          Filter: SelectColumnFilter,
          filter: "includes",
        },
        {
          id: "clients",
          Header: "Nombre réservations",
          accessor: r => {return r.clients.length},
          // accessor: "clients",
          disableFilters: true,
          // Cell: ({ cell: { value } }) => value.length,
        },
        {
          Header: "Nombre clients max",
          accessor: "maxClients",
          disableFilters: true,
        },
        {
          id: 'idGuide',
          Header: "Guide",
          accessor: g => {return g.idGuide==="" ? "***" : (
            listGuide.filter((guide) => guide.id === g.idGuide)[0].nom +
            " " +
            listGuide.filter((guide) => guide.id === g.idGuide)[0].prenom
          )},
          Filter: SelectColumnFilter,
          filter: "includes",
        },
      ],
    },
  ]);
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
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  function openModalGuide() {
    setModalGuide(true);
  }
  function closeModalGuide() {
    setModalGuide(false);
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
      setAllParcours(donnes.reverse());
    }
  }
  async function CreateResa() {
    let dataCrea = {
      openResa: true,
      maxClients: maxClients,
      dateReservation: dateResa.toISOString().slice(0, 10),
    };
    let options = {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(dataCrea),
    };
    let response = await fetch(
      "http://127.0.0.1:8080/reservations/createReservations/" + idParcours,
      options
    );
    let donnes = await response.json();
    if (!donnes) {
      return;
    } else {
      alert("Réservation ouverte");
      setRefresh(!refresh);
    }
  }
  async function ListGuide() {
    let options = {
      method: "GET",
      headers: headers,
    };
    let reponse = await fetch("http://127.0.0.1:8080/users/listguide", options);
    let donnees = await reponse.json();
    setListGuide(donnees);
  }
  async function AssignGuide() {
    let idGuide = document.getElementById("guideChoice").value;
    let data = {
      idGuide: idGuide,
      resaId: idResa,
    };
    let options = {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(data),
    };
    let reponse = await fetch(
      "http://127.0.0.1:8080/reservations/addGuideReservations/" + idParcours,
      options
    );
    await reponse.json();
    alert("Guide ajouté");
    setRefresh(!refresh);
    closeModalGuide();
  }
  async function GetClients() {
    if (allParcours != "") {
      //Je créer un tableau vide
      let tabClientRequest = [];
      let lengthClients =
        allParcours[index].reservations[indexResa].clients.length;
      console.log("LENGTH CLIENT ", lengthClients, index, indexResa);
      //Faire une boucle qui va faire toute la longueur de la liste de clients
      for (let i = 0; i < lengthClients; i++) {
        //Si j'ai un tableau de 10clients par ex, je vais récupérer à chaque ligne l'idClientRequest et send une requête pour chaque ID et renvoi les données
        let idClientRequest =
          allParcours[index].reservations[indexResa].clients[i].idClient;
        console.log("TESSSSSSSSSSSSSSST ", idClientRequest, 1);
        //Je récupère les id des clients
        let dataRequest = { userId: idClientRequest };
        let options = {
          method: "POST",
          body: JSON.stringify(dataRequest),
          headers: headers,
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
      console.log("tabClients : ", tabClientRequest);
    }
  }
  async function loadAllResa() {
    let options = {
      method: "GET",
      headers: headers,
    };
    let reponse = await fetch(
      "http://127.0.0.1:8080/reservations/allReservations",
      options
    );
    let donnees = await reponse.json();
    const array = donnees.filter((date) => date.dateReservation >= newDate);
    setAllResa(array);
  }

  useEffect(() => {
    //Lance le loadParcours et renvoie des donnees vides au 1er chargement
    LoadParcours();
  }, [refresh]);
  useEffect(() => {
    loadAllResa();
  }, [refresh]);
  useEffect(() => {
    //Quand on met à jour l'index résas sur le clic sur le bouton on lance getClients et met à jour indexResa
    ListGuide();
  }, []);
  useEffect(() => {
    //Quand on met à jour l'index résas sur le clic sur le bouton on lance getClients et met à jour indexResa
    GetClients();
  }, [indexResa]);

  return (
    <header>
      <div id="Resa">
        <div className="scrollbar2" id="style-4">
          <ul className="d-flex">
            {allParcours?.map((item, index) => (
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
                        <Button
                          variant="warning"
                          className="btn"
                          onClick={() => {
                            setDisplayResa(!displayResa);
                            setOpenResa(false);
                            setIdParcours(item._id);

                            setIndex(index);
                            setIdResa("");
                            setTabClients();
                          }}
                        >
                          Détail réservations
                        </Button>
                        <Button
                          variant="warning"
                          className="btn"
                          onClick={() => {
                            setOpenResa(!openResa);
                            setDisplayResa(false);
                            setIdParcours(item._id);

                            setIndex("");
                            setIdResa("");
                            setTabClients();
                          }}
                        >
                          Ouvrir réservation
                        </Button>
                      </article>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Table columns={columns} data={allResa} />
        </div>
        <div>
          {openResa === true && (
            <li>
              <article>
                <div>
                  <DatePicker
                    id="date"
                    dateFormat="yyyy-MM-dd"
                    selected={dateResa}
                    // onSelect={(date) =>
                    //   console.log("DATE", date.toISOString().slice(0, 10))
                    // }
                    onChange={(date) => setDateResa(date)}
                  />
                  <input
                    type="number"
                    id="maxClients"
                    min="1"
                    placeholder="Clients Max "
                    onChange={(event) => setMaxClients(event.target.value)}
                  />

                  <Button
                    variant="warning"
                    id="btn-resa"
                    onClick={() => {
                      CreateResa();
                      setOpenResa(false);
                    }}
                  >
                    Ouvrir
                  </Button>
                </div>
              </article>
            </li>
          )}

          {displayResa === true && (
            <div className="scrollbar3" id="style-5">
              <ul id="ul1">
                {allParcours[index]?.reservations?.map((item, index) => (
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
                      <Button
                        variant="warning"
                        id="btn-client"
                        onClick={() => {
                          setIndexResa(index);
                          setIdResa("");
                          openModal();
                        }}
                      >
                        Liste clients
                      </Button>
                      <Button
                        variant="warning"
                        id="btn-guide"
                        onClick={() => {
                          setIdResa(item._id);
                          setTabClients();
                          openModalGuide();
                        }}
                      >
                        Attribuer Guide
                      </Button>
                    </article>
                  </li>
                ))}
              </ul>
              <ul>
                <Modal
                  ariaHideApp={false}
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  style={customStyles}
                  contentLabel="Example Modal"
                >
                  <Button variant="warning" onClick={closeModal}>
                    close
                  </Button>
                  {tabClients?.map((item) => {
                    return (
                      <li key={item._id}>
                        <article>
                          <div>
                            <p> Nom : {item.nom}</p>
                          </div>
                          <div>
                            <p> Prenom : {item.prenom}</p>
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
                      <Button
                        variant="warning"
                        onClick={() => {
                          AssignGuide();
                        }}
                      >
                        Valider
                      </Button>
                    </article>
                  </li>
                </ul>
              </Modal>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default ResasAdmin;
