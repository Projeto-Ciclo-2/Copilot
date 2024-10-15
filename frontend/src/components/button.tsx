import React from "react";

interface ButtonProps {
	type: "submit" | "button";
	text: string;
	className?: string;
	onClick?: () => void;
	disabled?: boolean;
}

const Btn: React.FC<ButtonProps> = ({
	type,
	text,
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
			{text}
		</button>
	);
};

export default Btn;
