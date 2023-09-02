import React from "react";
import { ClimbingBoxLoader } from "react-spinners";

function Spinner({ color = "#4B1FED", size }: { color?: string, size: number}) {
  return (
          <div className='icon-container'>
            <ClimbingBoxLoader color={color} size={size} />
          </div>
  )
}


export default Spinner;