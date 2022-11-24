import React from "react";
import {
    Chart,
    PieSeries,
    Title,
  } from "@devexpress/dx-react-chart-material-ui";

export default function Pie(){
      // Sample data for PIE
  const dataPie = [
    { argument: "Monday", value: 10 },
    { argument: "Tuesday", value: 40 },
    { argument: "Wednesday", value: 10 },
    { argument: "Thursday", value: 20 },
    { argument: "Friday", value: 20 },
  ];
    return(
        <Chart data={dataPie}>
        <PieSeries valueField="value" argumentField="argument" />
        <Title text="Réservations par parcours" />
      </Chart>
    )
}