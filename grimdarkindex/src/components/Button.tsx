import React, { ReactNode } from "react";

interface Props {
  children: string;
  color?: "primary" | "secondary" | "danger";
  onClick: () => void;
  image?: string;
  width?: string;
}

const Button = ({ children, onClick, color = "primary", image }: Props) => {
  return (
    <button type="button" className={"btn btn-" + color} onClick={onClick}>
      {children}
      <img src={"/images/" + image} />
    </button>
  );
};

export default Button;
