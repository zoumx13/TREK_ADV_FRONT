import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Modal from "react-modal";
import "leaflet/dist/leaflet.css";
import "./DetailsResa.css";
import L from "leaflet";

export default function ReservationsDetails() {
  const navigate = useNavigate();
  let { idParcours, idResa } = useParams();
  const [allParcours, setAllParcours] = useState([]);
  const [allStep, setAllStep] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  let subtitle;

  const markerIcon = new L.Icon({
    iconUrl: require("./marker.png"),
    iconSize: [35, 45],
  });
  const headers = {
    "Content-Type": "application/json",
    // authorization: `Bearer ${JSON.parse(localStorage.getdetails("token"))}`,
  };
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)"
    },
  };
  // Récupération info parcours et infos résa
  async function getResaDetails(idParcours, idResa) {
    let step = [];
    let options = {
      method: "GET",
      headers: headers,
    };
    // fetch pour récupérer infos de la réservation pour un parcours
    let response = await fetch(
      `http://127.0.0.1:8080/reservations/${idParcours}/${idResa}`,
      options
    );
    let donnes = await response.json();
    if (!donnes) {
      console.log("erreur");
      return;
    } else {
      console.log("détails résa: ", donnes);
      // stocks infos parcours pour afficher dans le bloc à droite de la carte
      setAllParcours(donnes[0]);
      // stocks infos clients qui ont réservé
      setAllClients(donnes[2]);
      // stock info étapes pour afficher marker sur la map
      donnes[0].etape.map((item) => {
        step.push({
          localisation: [item.localisation[0].lat, item.localisation[0].long],
          nomEtape: item.nomEtape,
          descriptionEtape: item.descriptionEtape,
        });
      });
      setAllStep(step);
    }
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

  useEffect(() => {
    getResaDetails(idParcours, idResa);
  }, []);

  return (
    <header>
      <div id="DetailsResa">
        <div className="Creation-Reservation">
          <h3>Détails de la Réservation</h3>
        </div>

        <div className="Princi">
          <div className="map">
            <MapContainer
              className="mapContainer"
              center={[43.269605, 5.394641]}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {allStep.map((item) => {
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
          <div className="cartPR">
            <fieldset>
              <legend>
                {" "}
                <h2 className="text_head">
                  Détail
                  <br />
                  du Trek
                </h2>
              </legend>
              <p className="textx1">
                Nom du parcours :<br /> {allParcours.nomParcours}
              </p>
              <p className="textx1">
                Durée du parcours : {allParcours.dureeParcours}{" "}
              </p>
              <p className="textx1">Description :<br /> {allParcours.description}</p>
              <p className="textx1">Nombre d'étape : {allStep.length} </p>
              <p className="textx1">
                Niveau de difficulté : {allParcours.niveauDifficulte}
              </p>
              <p className="textx1" onClick={openModal}>
                Nombre de trekkeurs : {allClients.length}
              </p>
              <img
                className="imgf1"
                src={`http://127.0.0.1:8080/parcours/${allParcours.imgIllustration}`}
              />
            </fieldset>
          </div>
        </div>
      </div>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <button onClick={closeModal}>close</button>
        {allClients.map((clients)=>{
          return(
            <div key={clients._id}>{clients.identifiant}</div>
          )
        })} 
      </Modal>
    </header>
  );
}
