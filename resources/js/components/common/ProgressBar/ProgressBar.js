import React from "react";
import "./ProgressBar.css";

export const ProgressBar = props => (
  <div className="progress-bar">
    <Filler percentage={props.percentage} />
  </div>
);

export const Filler = props => (
  <div
    className="filler"
    style={{
      width: `${props.percentage}%`
    }}
  />
);
