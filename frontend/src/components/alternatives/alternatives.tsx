import React, { ReactNode, useRef } from "react";
import "./alternatives.css";

interface alternativeProps {
	type: "standard" | "correct" | "wrong" | "chose" | "disabled";
	item: number;
	content: string;
	confirmed: boolean;
	icon?: ReactNode;
	render: "alternative" | "response";
	percentage?: string | number;
	onClick?: () => void;
}

const Alternative: React.FC<alternativeProps> = ({
	type,
	item,
	content,
	confirmed,
	icon,
	percentage,
	render,
	onClick,
}) => {
	const itemLabels = ["a", "b", "c", "d", "e"];
	const itemContent = itemLabels[item] || "";

	const alternativeRef = useRef<HTMLDivElement | null>(null);

	function alterStyle() {
		document.querySelectorAll(".chose").forEach((element) => {
			element.classList.remove("chose");
		});

		if (type === "standard") {
			alternativeRef?.current?.classList.add("chose");
		}
	}

	return (
		<div
			className={`${type} alternative`}
			onClick={() => {
				if (onClick) {
					onClick();
				}
				alterStyle();
			}}
			ref={alternativeRef}
		>
			<div className="content-alternative">
				<div className="item-alternative">{itemContent}</div>
				<p>{content}</p>
			</div>

			{/* Exibir porcentagem */}
			{/* {render === 'response' && (
				<div className="div-percentage">
					{icon}
					<p>{percentage} %</p>
				</div>
			)} */}
		</div>
	);
};

export default Alternative;
