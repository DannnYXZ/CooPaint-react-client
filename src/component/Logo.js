import React from "react";

function Logo(props) {
  return (
      <img src={props.img || "avatar.svg"} style={{width: 32, height: 32}}/>
  );
}

export default Logo;