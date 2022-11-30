import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Calendar() {
  const [calendarDetails, setCalendarDetails] = useState([]);
  const [data, setData] = useState([])
  const date = new Date();
  const newDate = date.toISOString().slice(0, 10);
  const details = [];
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ` + token,
  };
  async function loadAllResa() {
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    let reponse = await fetch(
      "http://127.0.0.1:8080/reservations/allReservations",
      options
    );
    let donnees = await reponse.json();
    setData(donnees);
      // création des paramétre d'affichage sur le calendrier
      donnees.map((event) => {  
        details.push({
          title: event.nomParcours,
          date: event.dateReservation,
          url: `http://localhost:3000/reservations/${event.idparcours}/${event.idreservation}`,
        });
        setCalendarDetails(details);
  })
}
  useEffect(() => {
    loadAllResa();
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={calendarDetails}
    />
  );
}
