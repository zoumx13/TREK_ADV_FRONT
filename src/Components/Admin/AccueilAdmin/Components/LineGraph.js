import React from "react";
import SelectBox from "devextreme-react/select-box";
import {
  Chart,
  Series,
  ArgumentAxis,
  CommonSeriesSettings,
  CommonAxisSettings,
  Grid,
  Export,
  Legend,
  Margin,
  Tooltip,
  Label,
  Format,
} from "devextreme-react/chart";

export default function LineGraph() {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ` + token,
  };
  return (
    <div>
      <Chart
        palette="Green"
        // dataSource={sharingStatisticsInfo}
        title="A DEFINIR"
      >
        {/* <CommonSeriesSettings argumentField="year" type={this.state.type} /> */}
        <CommonAxisSettings>
          <Grid visible={true} />
        </CommonAxisSettings>
        {/* {architectureSources.map((item) => (
          <Series key={item.value} valueField={item.value} name={item.name} />
        ))} */}
        <Margin bottom={20} />
        <ArgumentAxis allowDecimals={false} axisDivisionFactor={60}>
          <Label>
            <Format type="decimal" />
          </Label>
        </ArgumentAxis>
        <Legend verticalAlignment="top" horizontalAlignment="right" />
        <Export enabled={true} />
        <Tooltip enabled={true} />
      </Chart>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Series Type </span>
          {/* <SelectBox
            dataSource={this.types}
            value={this.state.type}
            onValueChanged={this.handleChange}
          /> */}
        </div>
      </div>
    </div>
  );
}
