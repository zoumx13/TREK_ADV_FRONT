import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./AccueilGuide.css";
import { userContext } from "../../../context/userContext";

function AccueilGuide() {
  const { nom, profilePicture } = useContext(userContext);
  const navigate = useNavigate();
  const [calendarDetails, setCalendarDetails] = useState([]);
  const [data, setData] = useState([]);
  const date = new Date();
  const newDate = date.toISOString().slice(0, 10);
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  
  async function LoadResa() {
    let options = {
      method: "GET",
      headers: headers
    };
    // fetch pour récupérer toutes les réservations du guide
    let response = await fetch(
      "http://127.0.0.1:8080/reservations/getAllReservationsByGuide",
      options
    );
    let donnes = await response.json();
    if (!donnes || donnes == undefined) {
      return
    } else {
      // filtre seulement les réservations à venir
      const result = donnes.filter(
        (date) =>
      // console.log("PREMIERE DATE ",date.reservation.dateReservation, "DEUXIEME DATE ",newDate)
        date.reservation.dateReservation >= newDate
      
      );
      setData(result);
      const details = [];
      // création des paramétre d'affichage sur le calendrier
      donnes.map((event) => {
        details.push({
          title: event.nomParcours,
          date: event.reservation.dateReservation,
          url: `http://localhost:3000/reservations/${event.idparcours}/${event.reservation._id}`,
        });
        setCalendarDetails(details);
      });
    }
  }
  const DetailsResa = async (idParcours, idResa) => {
    navigate(`/reservations/${idParcours}/${idResa}`);
  };

  useEffect(() => {
    LoadResa();
  }, []);

  return (
    <header>
      <div id="Acceuil">
        <div className="titre">
          <div className="titreGuide">
            <h3>Consultation des futurs Trek de {nom} </h3>
            <img
              className="profilePicture"
              src={`http://127.0.0.1:8080/users/${profilePicture}`}
            />
          </div>
        </div>

        <div className="Block">
         
          <div id="Parcour">
            <div className="scrollbar" id="style-3">
              <ul>
                {data.map((item) => (
                  <li key={item.reservation._id}>
                    <div className="box">
                      <div className="box-inner">
                        <div className="box-front">
                          <h3>
                            Date de réservation :{" "}
                            {item.reservation.dateReservation}
                          </h3>
                          <img
                            className="img-1"
                            src={`http://127.0.0.1:8080/parcours/${item.imgIllustration}`}
                          ></img>
                        </div>
                        <div className="box-back">
                          <article>
                            <div>
                              <p>Parcours : {item.nomParcours}</p>
                            </div>

                            <button
                              className="btn"
                              onClick={() =>
                                DetailsResa(
                                  item.idparcours,
                                  item.reservation._id
                                )
                              }
                            >
                              Détail de la résa
                            </button>
                          </article>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="calendar">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={calendarDetails}
            />
          </div>
      </div>
    </header>
  );
}

export default AccueilGuide;
