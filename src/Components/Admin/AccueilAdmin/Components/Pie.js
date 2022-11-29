import React, { useEffect, useState } from "react";
import PieChart, {
  Series,
  Label,
  Connector,
  Size,
  Export,
} from 'devextreme-react/pie-chart';
import 'devextreme/dist/css/dx.light.css';

export default function Pie() {
  const [parcours, setParcours] = useState([]);
  const [dataPie,setDataPie] = useState([])
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ` + token,
  };

  async function loadParcours() {
    let data = []
    let options = {
      method: "GET",
      headers: headers
    };
    let reponse = await fetch("http://127.0.0.1:8080/parcours/", options);
    let donnees = await reponse.json();
    setParcours(donnees);
    donnees.map((parcours) => {
      data.push({
        nomParcours: parcours.nomParcours,
        nombreReservations: parcours.reservations.length,
      });
    });
    setDataPie(data)
  }
 
  useEffect(() => {
    loadParcours();
  }, []);

  return (
    <PieChart
        id="pie"
        dataSource={dataPie}
        palette="Bright"
        title="Parcours & Réservations"
        // onPointClick={this.pointClickHandler}
        // onLegendClick={this.legendClickHandler}
      >
        <Series
          argumentField="nomParcours"
          valueField="nombreReservations"
        >
          <Label visible={true}>
            <Connector visible={true} width={1} />
          </Label>
        </Series>

        <Size width={500} />
        <Export enabled={true} />
      </PieChart>
  );
}
