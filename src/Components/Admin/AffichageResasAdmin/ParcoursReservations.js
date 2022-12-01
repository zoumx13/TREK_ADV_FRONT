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
  const [allParcours, setAllParcours] = useState([]);
  const [allResa, setAllResa] = useState([]);
  const [listGuide, setListGuide] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // //MODIFY RESERVATION
  // const [idParcours, setIdParcours] = useState("");
  // const [idResa, setIdResa] = useState("");
  // const [dateResa, setDateResa] = useState(new Date());
  // const [openResa, setOpenResa] = useState();
  // const [clientsResa, setClientsResa] = useState([]);
  // const [maxClients, setMaxClients] = useState();
  // const [idGuide, setIdGuide] = useState();

  // MODAL
  const [modalIsOpen, setIsOpen] = useState(false);
  const [addGuide, setAddGuide] = useState(false);
  const [deleteGuide, setDeleteGuide] = useState(false);
  const [infoClientsResa, setInfoClientsResa] = useState(false);
  const [clientsByResa, setClientsByResa] = useState([]);
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
                    if (boxes[i].checked) {
                      console.log([i]);
                    }
                    console.log("no");
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
                disabled={disableBtn(value)}
                variant={btnColor(value)}
                onClick={() => {
                  setRow(row.original.clients);
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
  const disableBtn = (value) => {
    if (value === 0) {
      return true;
    } else {
      return false;
    }
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
  async function loadUsers() {
    let options = {
      method: "GET",
      headers: headers,
    };
    let reponse = await fetch("http://127.0.0.1:8080/users/allUsers", options);
    let donnees = await reponse.json();
    const allguides = [];
    const allusers = [];
    donnees.map((user) => {
      if (user.role === "guide") {
        allguides.push(user);
        allusers.push(user);
      }
      if (user.role === "client") {
        allusers.push(user);
      }
    });
    setListGuide(allguides);
    setAllUsers(allusers);
  }

  // CLOSE MODAL
  const closeModal = () => {
    setIsOpen(false);
    setDeleteGuide(false);
    setInfoClientsResa(false);
    setAddGuide(false);
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
  // SHOW CLIENTS BY RESA
  const showClients = (props) => {
    let listClients = [];
    if (props.length > 0) {
      props.map((clients) => {
        const oneUser = allUsers.filter(
          (user) => user._id === clients.idClient
        );
        listClients.push({
          _id: oneUser[0].id,
          nom: oneUser[0].nom,
          prenom: oneUser[0].prenom,
        });
      });
      setClientsByResa(listClients);
      setInfoClientsResa(true);
      setIsOpen(true);
    }
  };

  useEffect(() => {
    LoadParcours();
  }, [refresh]);
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
            {deleteGuide ? (
              "Supprimer le guide de la réservation ?"
            ) : infoClientsResa ? (
              <ul className="">
                {clientsByResa.map((client) => (
                  <li key={client._id}>
                    <p>
                      {client.nom} {client.prenom}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
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
                  setIsOpen(false);
                  setDeleteGuide(false);
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
            ) : (
              <></>
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
