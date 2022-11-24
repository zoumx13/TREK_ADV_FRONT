import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./AccueilAdmin.css";

function AccueilAdmin() {
    const [nextTrek,setNextTrek] = useState();
    const [listGuide, setListGuide] = useState([]);
    const [calendarDetails, setCalendarDetails] = useState([]);
    const date = new Date();
    const newDate = date.toISOString().slice(0, 10);
    const [guide,setGuide] = useState();
    const token = localStorage.getItem("token");

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
      setListGuide(donnees)
    }
    async function nextParcours() {
      let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      // fetch pour récupérer la derniere reservation
      let response = await fetch(
        "http://127.0.0.1:8080/reservations/nextReservation",
        options
      );
      let donnes = await response.json();
      if (!donnes || donnes == undefined) {
        alert("Aucune réservation à venir.")
      } else {
        setNextTrek(donnes)
        let array =[]
        listGuide.map((guides)=>{
        if(guides.id===donnes[0].reservation.idGuide){
          array.push(guides.nom, guides.prenom)
        }
        setGuide(array)
      })
      }
    }

    useEffect(()=>{
      ListGuide();
    },[])

    useEffect(() => {
      nextParcours();
    },[listGuide]);

  return (
    <div>
      <div className="imgAccueilAdmin">
        <div className="Welcome">
          <p className="W1">Bienvenue Admin</p>
        </div>
        <div className="Next">
          <p className="Next1">Prochaine sortie : </p>
        </div>
        {nextTrek != undefined && guide != undefined &&
        <div className="texteP">
          <p>Le : {nextTrek[0].reservation.dateReservation}</p>
          <p>Site de parcours : {nextTrek[0].parcours.nomParcours}</p>
          <p>Guide : {guide[0]} {guide[1]} </p>
          <p>Clients inscrits : {nextTrek[0].reservation.clients.length}</p>
          <p>Clients maximum : {nextTrek[0].reservation.maxClients}</p>
        </div>
        }
        <div className="calendar">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={calendarDetails}
        />
      </div>
      </div>
    </div>
  );
}

export default AccueilAdmin;
