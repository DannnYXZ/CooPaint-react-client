import React from "react";

function Logo(props) {
  return (
      <img src={props.img || "avatar.svg"}/>
  );
}

export default Logo;