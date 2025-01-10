import React from "react";

interface RadialProgressProps {
  value: number;
}

function RadialProgress({ value }: RadialProgressProps) {
  return (
    <div
      className="radial-progress"
      style={{ "--value": `${value}` } as React.CSSProperties}
      role="progressbar"
    >
      {value}%
    </div>
  );
}

export default RadialProgress;
