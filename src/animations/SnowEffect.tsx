import React from "react";
import Snowfall from "react-snowfall";

const SnowEffect: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
      <Snowfall
        snowflakeCount={50} // number of snow particles
        color="#666666ff" // slightly dull white
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
            pointerEvents: "none", // allows clicking through
          zIndex: 1,
        }}
        radius={[1, 3]} // snowflake size
        speed={[0.2, 0.7]} // 👈 slow falling speed
        wind={[-0.5, 0.5]} // small left-right movement
      />
    </div>
  );
};

export default SnowEffect;
