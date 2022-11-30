import React, { useEffect, useState } from "react";
import LineGraph from "./Components/LineGraph";
import Pie from "./Components/Pie";
import Calendar from "./Components/Calendar";
import "./AccueilAdmin.css";

export default function AccueilAdmin() {
  const [nextTrek, setNextTrek] = useState();
  const [listGuide, setListGuide] = useState([]);
  const [guide, setGuide] = useState();
  const date = new Date();
  const newDate = date.toISOString().slice(0, 10);
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ` + token,
  };

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
    setListGuide(donnees);
  }
  async function nextParcours() {
    let options = {
      method: "GET",
      headers: headers
    };
    // fetch pour récupérer la derniere reservation
    let response = await fetch(
      "http://127.0.0.1:8080/reservations/nextReservation",
      options
    );
    let donnes = await response.json();
    if (!donnes || donnes == undefined) {
      alert("Aucune réservation à venir.");
    } else {
      setNextTrek(donnes);
      let array = [];
      listGuide.map((guides) => {
        if (guides.id === donnes[0].reservation.idGuide) {
          array.push(guides.nom, guides.prenom);
        }
        setGuide(array);
      });
    }
  }


  useEffect(() => {
    ListGuide();
  }, []);

  useEffect(() => {
    nextParcours();
  }, [listGuide]);

  return (
    <div>
      <div className="block-up">
        <div className="calendar">
          <Calendar />
        </div>
        <div className="nextTrek">
          <div className="Next">
            <p className="Next1">Prochaine sortie : </p>
          </div>
          {nextTrek != undefined && guide != undefined && (
            <div className="texteP">
              <p>Le : {nextTrek[0].reservation.dateReservation}</p>
              <p>Site de parcours : {nextTrek[0].parcours.nomParcours}</p>
              <p>
                Guide : {guide[0]} {guide[1]}{" "}
              </p>
              <p>Clients inscrits : {nextTrek[0].reservation.clients.length}</p>
              <p>Clients maximum : {nextTrek[0].reservation.maxClients}</p>
            </div>
          )}
        </div>
        <div className="pie">
          <Pie />
        </div>
      </div>
      <div className="block-down">
        <div className="lineGraph">
          <LineGraph />
        </div>
        <div className="CA">CA</div>
      </div>
    </div>
  );
}
