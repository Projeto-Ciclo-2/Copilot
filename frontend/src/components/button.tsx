import React from "react";

interface ButtonProps {
  type: 'submit' | 'button';
  text: string | null;
  icon?: any | null;
  className?: string;
  onClick?: () => void;
	disabled?: boolean;
}
  
const Btn: React.FC<ButtonProps> = ({
	type,
	text,
  icon,
	className,
	onClick,
	disabled = false,
}) => {
	return (
		<button
			type={type}
			className={className}
			onClick={onClick}
			disabled={disabled}
			style={{
				backgroundColor: disabled ? "gray" : "initial",
				cursor: disabled ? "not-allowed" : "pointer",
			}}
		>
      {icon && icon}
      {text && text}
		</button>
	);
};

export default Btn;
