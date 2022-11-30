import React, { useState, useEffect, useMemo } from "react";
import { SelectColumnFilter } from "./Components/Filter";
import DataTable from "./Components/TableContainer";
import DatePicker from "react-datepicker";
import { Button, Card, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "./AffichageResasAdmin.css";

function ResasAdmin() {
  // STOCK ALL DATA
  const [refresh, setRefresh] = useState(false);
  const [allParcours, setAllParcours] = useState([]);
  const [allResa, setAllResa] = useState([]);
  const [listGuide, setListGuide] = useState([]);



  const [displayResa, setDisplayResa] = useState(false);
  const [index, setIndex] = useState();
  const [indexResa, setIndexResa] = useState();
  const [tabClients, setTabClients] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);


  //MODIFY RESERVATION
  const [idParcours, setIdParcours] = useState("");
  const [idResa, setIdResa] = useState("");
  const [dateResa, setDateResa] = useState(new Date());
  const [openResa, setOpenResa] = useState(false);
  const [clientsResa,setClientsResa] = useState([])
  const [maxClients, setMaxClients] = useState();
  const [idGuide,setIdGuide] = useState()




  const date = new Date();
  const newDate = date.toISOString().slice(0, 10);
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  const closeModal = () => {
    setIsOpen(false);
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
          id: "openResa",
          Header: "Réservation ouverte",
          accessor: (b) => {
            return b.openResa ? "Ouverte" : "Fermée";
          },
          Filter: SelectColumnFilter,
          filter: "includes",        
          Cell: ({ cell: { value, row } }) => <Button variant={btnResa(value)}
          onClick={()=>{
            setOpenResa(!row.original.openResa)
            ModifyReservation(row.original)}
          }
          >{value}</Button>,          
        },
        {
          id: "clients",
          Header: "Nombre réservations",
          accessor: (r) => {
            return r.clients.length;
          },
          disableFilters: true,
        },
        {
          Header: "Nombre clients max",
          accessor: "maxClients",
          disableFilters: true,
        },
        // {
        //   id: "idGuide",
        //   Header: "Guide",
        //   accessor: (g) => {
        //     return g.idGuide === "" || g.idGuide === undefined
        //       ? "N/A"
        //       : listGuide.filter((guide) => guide.id === g.idGuide)[0].nom +
        //           " " +
        //           listGuide.filter((guide) => guide.id === g.idGuide)[0].prenom;
        //   },
        //   Filter: SelectColumnFilter,
        //   filter: "includes",
        // },
      ],
    },
  ]);
  const btnResa = ( value ) => {
    if (value === "Ouverte") {
      return "success";
    } else {
      return "danger";
    }
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
      setAllParcours(donnes.reverse());
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
  async function ListGuide() {
    let options = {
      method: "GET",
      headers: headers,
    };
    let reponse = await fetch("http://127.0.0.1:8080/users/listguide", options);
    let donnees = await reponse.json();
    setListGuide(donnees);
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
      setIsOpen(false);
      setRefresh(!refresh);
    }
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

  // MODIFY RESERVATION
  async function ModifyReservation(row){
    let data = {
      dateReservation: row.dateReservation,
      openResa: openResa,
      clients: row.clients,
      maxClients: row.maxClients,
      idGuide: row.idGuide,
    };
    // let idParcours = row.idparcours
    // let idResa = row.idreservation
    console.log("DATA", data)
    console.log( row.idparcours, row.idreservation)
    let options = {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(data),
    };
    let reponse = await fetch(
      // `http://127.0.0.1:8080/reservations/modifyReservations/${idParcours}/${idResa}`,
      `http://127.0.0.1:8080/reservations/modifyReservations/${row.idparcours}/${row.idreservation}`,
      options
    );
    await reponse.json();
    alert(`Réservation mis à jour`);
    setRefresh(!refresh);
  }

  useEffect(() => {
    //Quand on met à jour l'index résas sur le clic sur le bouton on lance getClients et met à jour indexResa
    ListGuide();
  }, []);
  useEffect(() => {
    //Lance le loadParcours et renvoie des donnees vides au 1er chargement
    LoadParcours();
  }, [refresh]);
  useEffect(() => {
    loadAllResa();
  }, [refresh]);
  useEffect(() => {
    //Quand on met à jour l'index résas sur le clic sur le bouton on lance getClients et met à jour indexResa
    GetClients();
  }, [indexResa]);

  return (
    <>
      <header>
        <div id="Resa">
          <div className="scrollbar2" id="style-4">
            <ul className="d-flex">
              <div className="scrollbar" id="style-3">
                <ul className="d-flex">
                  {allParcours.map((item) => (
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
                            onClick={() => {
                              setOpenResa(!openResa);
                              setDisplayResa(false);
                              setIdParcours(item._id);
                              setIndex("");
                              setIdResa("");
                              setTabClients();
                              setIsOpen(true);
                            }}
                          >
                            Ouvrir une réservation
                          </Button>
                        </Card.Body>
                      </Card>
                    </li>
                  ))}
                </ul>
                <Modal
                  show={modalIsOpen}
                  onHide={closeModal}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Ouvrir une réservation</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <DatePicker
                      id="date"
                      dateFormat="yyyy-MM-dd"
                      selected={dateResa}
                      onChange={(date) => setDateResa(date)}
                    />
                    <input
                      type="number"
                      id="maxClients"
                      min="1"
                      placeholder="Clients Max "
                      onChange={(event) => setMaxClients(event.target.value)}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary" onClick={() => CreateResa()}>
                      Valider
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsOpen(false)}
                    >
                      Annuler
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
              {/* {allParcours?.map((item, index) => (
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
            ))} */}
            </ul>
            <DataTable columns={columns} data={allResa}/>
          </div>
          <div>
            {/* {displayResa === true && (
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
          )} */}
          </div>
        </div>
      </header>
    </>
  );
}

export default ResasAdmin;
