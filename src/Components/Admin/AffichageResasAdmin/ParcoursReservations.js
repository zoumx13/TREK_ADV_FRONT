import React, { useState, useEffect, useMemo } from "react";
import { SelectColumnFilter } from "./Components/Table/Filter";
import DataTable from "./Components/Table/TableContainer";
import DatePicker from "react-datepicker";
import { Button, Accordion, Modal, Form } from "react-bootstrap";
import Parcours from "./Components/Parcours/Parcours";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";

function ResasAdmin() {
  // STOCK ALL DATA
  const [refresh, setRefresh] = useState(false);
  const [allResa, setAllResa] = useState([]);
  const [listGuide, setListGuide] = useState([]);
  const [listClients, setListClients] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // MODAL
  const [modalIsOpen, setIsOpen] = useState(false);
  const [addGuide, setAddGuide] = useState(false);
  const [deleteGuide, setDeleteGuide] = useState(false);
  const [infoClientsResa, setInfoClientsResa] = useState(false);
  const [clientsByResa, setClientsByResa] = useState([]);
  const [maxClients, setMaxClients] = useState(false);
  const [showClientsList, setShowClentsList] = useState(false);
  const [row, setRow] = useState([]);
  const date = new Date();
  const newDate = date.toISOString().slice(0, 10);
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };

  // CHECKBOX
  const [checkMain, setCheckMain] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  //  DATA TABLE
  const columnsReservations = useMemo(() => [
    {
      Header: "Réservations à venir",
      columns: [
        {
          Header: (
            <>
              <Button
                variant="danger"
                onClick={() => {
                  const boxes = [
                    ...document.getElementsByClassName("checkboxResaSelect"),
                  ];
                  console.log(boxes);
                  for (let i = 0; i < boxes.length; i++) {
                    if (boxes[i]) {
                      console.log(
                        boxes[i].checked,
                        "????????????????????????????"
                      );
                      console.log([i]);
                      console.log("YES");
                    } else {
                      console.log("no");
                    }
                  }
                  // const boxes =
                  //   document.getElementsByClassName("checkboxResaSelect");
                  // // console.log("BOXES", boxes);
                  // for (let i = 0; i < boxes.length; i++) {
                  //   console.log(boxes[i]);
                  // }
                  // // boxes.map((oncheck) => {
                  // //   console.log(oncheck.currentTarget.value);
                  // // });
                  // console.log(boxes.length);
                  console.log("deleteAll");
                }}
              >
                X
              </Button>
              <Form.Check
                id="checkboxResa"
                aria-label="option 1"
                onChange={(e) => {
                  console.log(e.currentTarget.checked);
                  handleChangeBox(e.currentTarget.checked);
                }}
              />
            </>
          ),
          accessor: "_id",
          disableFilters: true,
          Cell: ({ cell: { row } }) => (
            <Form.Check
              aria-label="option 1"
              className="checkboxResaSelect"
              defaultChecked={checkAll}
              onChange={(e) => handleChange(e)}
              value={row}
            />
          ),
        },
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
          Cell: ({ cell: { value, row } }) => (
            <Button
              variant={btnColor(value)}
              onClick={() => {
                setRow(row);
                modifyOpenResa(row.original);
              }}
            >
              {value}
            </Button>
          ),
        },
        {
          id: "clients",
          Header: "Nombre réservations",
          accessor: (r) => {
            return r.clients.length;
          },
          disableFilters: true,
          Cell: ({ cell: { value, row } }) => (
            <>
              <Button
                variant="outline-primary"
                onClick={() => {
                  setRow(row.original);
                  showClients(row.original.clients);
                }}
              >
                {value}
              </Button>
            </>
          ),
        },
        {
          Header: "Nombre clients max",
          accessor: "maxClients",
          disableFilters: true,
          Cell: ({ cell: { value, row } }) => (
            <>
              {maxClients === false ? (
                <>
                  <p>{value}</p>
                  {/* <input type="number" defaultValue={value} /> */}
                  <Button
                    value={row.original.idreservation}
                    onClick={(e) => {
                      console.log("ROW", e.target.value);
                      setMaxClients(true);
                    }}
                  >
                    ?
                  </Button>
                </>
              ) : (
                <>
                  <input type="number" min={"0"} defaultValue={value} />
                  <Button variant="success">V</Button>
                  <Button variant="danger" onClick={() => setMaxClients(false)}>
                    A
                  </Button>
                </>
              )}
            </>
          ),
        },
        // {
        //   id: "idGuide",
        //   Header: "Guide",
        //   accessor: (g) => {
        //     return g.idGuide === "" || g.idGuide === undefined
        //       ? "N/A"
        //       : listGuide
        //       ? listGuide.filter((guide) => guide._id === g.idGuide)[0].nom +
        //         " " +
        //         listGuide.filter((guide) => guide._id === g.idGuide)[0].prenom
        //       : "";
        //   },
        //   Filter: SelectColumnFilter,
        //   filter: "includes",
        //   Cell: ({ cell: { value, row } }) => {
        //     if (value !== "N/A") {
        //       return (
        //         <div>
        //           {value}
        //           <Button
        //             variant="danger"
        //             onClick={() => {
        //               setRow(row.original);
        //               setDeleteGuide(true);
        //               setIsOpen(true);
        //             }}
        //           >
        //             X
        //           </Button>
        //         </div>
        //       );
        //     } else {
        //       return (
        //         <Button
        //           onClick={() => {
        //             setRow(row.original);
        //             setAddGuide(true);
        //             setIsOpen(true);
        //           }}
        //         >
        //           Attribuer
        //         </Button>
        //       );
        //     }
        //   },
        // },
      ],
    },
  ]);
  const columnsUsers = useMemo(() => [
    {
      Header: "Utilisateurs",
      columns: [
        // {
        //   Header: "",
        //   accessor: "_id",
        //   disableFilters: true,
        //   Cell: ({ cell: { row } }) => (
        //     <Form.Select size="sm">
        //       <option>--</option>
        //       <option>Tous</option>
        //     </Form.Select>
        //   ),
        // },
        {
          Header: "Role",
          accessor: "role",
          Filter: SelectColumnFilter,
          filter: "includes",
        },
        {
          Header: "Nom",
          accessor: "nom",
          disableFilters: true,
        },
        {
          Header: "Prénom",
          accessor: "prenom",
          disableFilters: true,
        },
        {
          Header: "Date d'inscription",
          accessor: "dateInscription",
          disableFilters: true,
        },
        {
          Header: "Profil",
          accessor: "_id",
          disableFilters: true,
          Cell: ({ cell: { row } }) => (
            <div>
              <Button onClick={() => console.log("PROFIL", row.original)}>
                {" "}
                Détails
              </Button>
              <Button variant="danger">X</Button>
            </div>
          ),
        },
      ],
    },
  ]);
  const btnColor = (value) => {
    if (value === "Ouverte") {
      return "success";
    } else if (value === "Fermée") {
      return "danger";
    } else if (value === 0) {
      return "outline-primary";
    }
    return "primary";
  };
  // CHECKBOX
  const handleChangeBox = (props) => {
    console.log(props, "PROPS");
    if (props === true) {
      console.log("ON");
      setCheckAll(true);
      setCheckMain(true);
      return true;
    } else {
      console.log("OFF");
      setCheckAll(false);
      setCheckMain(false);
      return false;
    }
  };
  const handleChange = (e) => {
    console.log("individual box", e.target.checked);
  };

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
  async function loadUsers() {
    let options = {
      method: "GET",
      headers: headers,
    };
    let reponse = await fetch("http://127.0.0.1:8080/users/allUsers", options);
    let donnees = await reponse.json();
    const allguides = [];
    const allusers = [];
    const allclients = [];
    donnees.map((user) => {
      if (user.role === "guide") {
        allguides.push(user);
        allusers.push(user);
      }
      if (user.role === "client") {
        allusers.push(user);
        allclients.push(user);
      }
    });
    setListGuide(allguides);
    setAllUsers(allusers);
    setListClients(allclients);
  }

  // CLOSE MODAL
  const closeModal = () => {
    setIsOpen(false);
    setAddGuide(false);
    setDeleteGuide(false);
    setInfoClientsResa(false);
    setShowClentsList(false);
    setMaxClients(false);
    setClientsByResa([]);
    setRow([]);
  };
  // MODIFY RESERVATION
  async function ModifyReservation(
    idParcours,
    idResa,
    modifyDateReservation,
    modifyOpenResa,
    modifyClientsResa,
    modifyMaxClients,
    modifyIdGuide
  ) {
    let data = {
      dateReservation: modifyDateReservation,
      openResa: modifyOpenResa,
      clients: modifyClientsResa,
      maxClients: modifyMaxClients,
      idGuide: modifyIdGuide,
    };
    let options = {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(data),
    };
    let reponse = await fetch(
      `http://127.0.0.1:8080/reservations/modifyReservations/${idParcours}/${idResa}`,
      options
    );
    await reponse.json();
    closeModal();
    setRefresh(!refresh);
    alert(`Réservation mis à jour`);
  }
  // MODIFY OPENRESA
  const modifyOpenResa = (row) => {
    const idParcours = row.idparcours;
    const idResa = row.idreservation;
    const modifyDateReservation = row.dateReservation;
    const modifyOpenResa = !row.openResa;
    const modifyClientsResa = row.clients;
    const modifyMaxClients = row.maxClients;
    const modifyIdGuide = row.idGuide;
    setClientsByResa([]);
    ModifyReservation(
      idParcours,
      idResa,
      modifyDateReservation,
      modifyOpenResa,
      modifyClientsResa,
      modifyMaxClients,
      modifyIdGuide
    );
  };
  // MODIFY GUIDE
  const modifyGuide = async (idGuide) => {
    const idParcours = row.idparcours;
    const idResa = row.idreservation;
    const modifyDateReservation = row.dateReservation;
    const modifyOpenResa = row.openResa;
    const modifyClientsResa = row.clients;
    const modifyMaxClients = row.maxClients;
    const modifyIdGuide = idGuide;
    ModifyReservation(
      idParcours,
      idResa,
      modifyDateReservation,
      modifyOpenResa,
      modifyClientsResa,
      modifyMaxClients,
      modifyIdGuide
    );
  };
  // MODIFY CLIENTS TO RESA
  const modifyClientsResa = async (idClient) => {
    let newList = [];
    if (showClientsList === false) {
      let updateList = row.clients;
      updateList.map((client) => {
        if (client.idClient !== idClient) {
          newList.push(client);
        }
      });
    } else {
      let newClient = [];
      newList = row.clients;
      const clientAdded = listClients.filter((one) => one._id === idClient);
      newClient.push({
        idClient: idClient,
        identifiant: clientAdded[0].identifiant,
        date: Date(),
        etapeCompletee: [],
      });
      newList.push(newClient[0]);
    }
    const idParcours = row.idparcours;
    const idResa = row.idreservation;
    const modifyClientsResa = newList;
    ModifyReservation(idParcours, idResa, modifyClientsResa);
  };
  // SHOW CLIENTS BY RESA
  const showClients = (props) => {
    let listClients = [];
    if (props.length > 0) {
      props.map((clients) => {
        console.log(clients);
        const oneUser = allUsers.filter(
          (user) => user._id === clients.idClient
        );
        listClients.push({
          _id: oneUser[0]._id,
          nom: oneUser[0].nom,
          prenom: oneUser[0].prenom,
          idBooking: clients._id,
        });
      });
      console.log(listClients);
      setClientsByResa(listClients);
    }
    setInfoClientsResa(true);
    setIsOpen(true);
  };

  useEffect(() => {
    loadAllResa();
  }, [refresh]);
  useEffect(() => {
    loadUsers();
  }, [refresh]);

  return (
    <>
      <header>
        <Accordion defaultActiveKey={["0"]} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Parcours</Accordion.Header>
            <Accordion.Body>
              <Parcours />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Réservations</Accordion.Header>
            <Accordion.Body>
              <DataTable columns={columnsReservations} data={allResa} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Utilisateurs</Accordion.Header>
            <Accordion.Body>
              <DataTable columns={columnsUsers} data={allUsers} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Modal
          show={modalIsOpen}
          onHide={closeModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {deleteGuide ? (
                "Supprimer guide"
              ) : infoClientsResa ? (
                "Réservations clients"
              ) : addGuide ? (
                "Attribuer guide"
              ) : (
                <></>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {deleteGuide && "Supprimer le guide de la réservation ?"}
            {showClientsList && (
              <div>
                <label htmlFor="user_select">
                  Sélectionnez un client: &nbsp;&nbsp;
                </label>
                <select name="clients" id="clients">
                  <option value={""}>--</option>
                  {listClients.map((clients) => {
                    return (
                      <option
                        id="guideChoice"
                        value={clients._id}
                        key={clients._id}
                      >
                        {clients.nom} {clients.prenom}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
            {infoClientsResa && (
              <ul className="">
                {clientsByResa.map((client) => (
                  <li
                    id="clientToDelete"
                    key={client.idBooking}
                    value={client._id}
                  >
                    <p>
                      {client.nom} {client.prenom}
                    </p>
                    <Button
                      value={client._id}
                      variant="danger"
                      onClick={(e) => {
                        // console.log(e.target.value);
                        modifyClientsResa(e.target.value);
                      }}
                    >
                      X
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {addGuide && (
              <div>
                <label htmlFor="user_select">
                  Sélectionnez un guide: &nbsp;&nbsp;
                </label>
                <select name="users" id="users">
                  {listGuide.map((guides) => {
                    return (
                      <option
                        id="guideChoice"
                        value={guides._id}
                        key={guides._id}
                      >
                        {guides.nom} {guides.prenom}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {deleteGuide ? (
              <Button
                variant="warning"
                onClick={() => {
                  let idGuide = "";
                  modifyGuide(idGuide);
                  closeModal();
                }}
              >
                Supprimer
              </Button>
            ) : addGuide ? (
              <Button
                variant="warning"
                onClick={() => {
                  let idGuide = document.getElementById("users").value;
                  modifyGuide(idGuide);
                  closeModal();
                }}
              >
                Valider
              </Button>
            ) : showClientsList ? (
              <Button
                variant="primary"
                onClick={() => {
                  let idClient = document.getElementById("clients").value;
                  modifyClientsResa(idClient);
                  closeModal();
                }}
              >
                Valider
              </Button>
            ) : (
              <Button variant="primary" onClick={() => setShowClentsList(true)}>
                Ajouter client
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => {
                closeModal();
              }}
            >
              Revenir
            </Button>
          </Modal.Footer>
        </Modal>
      </header>
    </>
  );
}

export default ResasAdmin;
