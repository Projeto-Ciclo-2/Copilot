import React from "react";

interface ButtonProps {
  type: 'submit' | 'button';
  text: string | null;
  icon: any | null;
  className?: string;
  onClick?: () => void;
}

const Btn: React.FC<ButtonProps> = ({ type, text, icon, className, onClick}) => {
  return (
    <button type={type} className={className} onClick={onClick}>
      {icon && icon}
      {text && text}
    </button>
  );
};

export default Btn;
