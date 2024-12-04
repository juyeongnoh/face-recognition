import React from "react";

const Progress = ({ value, max }) => {
  return (
    <div className={`w-64 bg-gray-200 rounded-full h-2.5`}>
      <div
        className="bg-[#ff625d] h-2.5 rounded-full"
        style={{ width: `${(value / max) * 100}%` }}></div>
    </div>
  );
};

export default Progress;
