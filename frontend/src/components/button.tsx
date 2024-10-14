import React from "react";

interface ButtonProps {
  type: 'submit' | 'button';
  text: string;
  className?: string;
  onClick?: () => void;
}

const Btn: React.FC<ButtonProps> = ({ type, text, className, onClick}) => {
  return (
    <button type={type} className={className} onClick={onClick}>
      {text}
    </button>
  );
};

export default Btn;
