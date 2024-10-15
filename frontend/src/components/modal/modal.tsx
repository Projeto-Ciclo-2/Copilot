import React from "react";
import "./modal.css";

export default function CustomModal(props: {
	title: string;
	message: string;
	alive: boolean;
	onClick: () => any;
}) {
	const noClick = (e: React.MouseEvent<any>) => {
		e.stopPropagation();
	};
	if (!props.alive) return <></>;
	return (
		<div id="modal" onClick={props.onClick}>
			<div onClick={noClick}>
				<h4 onClick={noClick}>{props.title}</h4>
				<button onClick={props.onClick}>x</button>
				<span onClick={noClick}>{props.message}</span>
			</div>
		</div>
	);
}
