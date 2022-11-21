import React, { useEffect, useState, useContext } from "react";
import { userContext } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
import "./ProfilGuide.css";


export default function ProfilGuide() {
  const { nom, prenom, profilePicture, description, annees_exp } =
    useContext(userContext);
  return (
    <div>

    <img className="imgProfil1"></img>

      <main className="Mainf1">
        <section className="top-card">
          <img
            className="img-profile"
            src={`http://127.0.0.1:8080/users/${profilePicture}`}
            alt="user picture"
          />
          <div className="menu-icon">
            <div className="menu item1"></div>

            <div className="menu item2"></div>
          </div>
          <div className="name">{/* <p>{nom} <span>{prenom}</span></p> */}</div>
        </section>

        <section className="middle-card">
          <h2 className="Nom-Prenom">
            Bonjour {nom} {prenom}
          </h2>
          <br />
          <h1 className="Titre02">Description</h1>
          <p className="Para-Description">{description}</p>
          <h1 className="Titre02">Expérience</h1>
          <p className="Para-Description">Années d'expérience : {annees_exp}</p>
        </section>
      </main>
    </div>
  );
}
