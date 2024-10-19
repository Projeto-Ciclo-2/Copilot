import React from "react";
import { Link } from "react-router-dom";

export default function WebSocketError(props: { reason: string }): JSX.Element {
	const containerStyle: React.CSSProperties = {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		height: "100vh",
		backgroundColor: "#f8d7da",
		color: "#721c24",
		textAlign: "center",
		padding: "20px",
	};

	const headingStyle: React.CSSProperties = {
		fontSize: "2rem",
		marginBottom: "1rem",
		color: "#721c24",
	};

	const linkStyle: React.CSSProperties = {
		textDecoration: "none",
		color: "#fff",
		backgroundColor: "#007bff",
		padding: "10px 20px",
		borderRadius: "5px",
		transition: "background-color 0.3s ease",
	};

	const linkHoverStyle: React.CSSProperties = {
		backgroundColor: "#0056b3",
	};

	return (
		<div style={containerStyle}>
			<h1 style={headingStyle}>
				Houve um erro ao conectar o web socket, volte para a página
				inicial!
			</h1>
			<p>{props.reason}</p>
			<Link
				to={"/home"}
				style={linkStyle}
				onMouseOver={(e) => {
					if (linkHoverStyle.backgroundColor) {
						e.currentTarget.style.backgroundColor =
							linkHoverStyle.backgroundColor;
					}
				}}
				onMouseOut={(e) => {
					if (linkStyle.backgroundColor)
						e.currentTarget.style.backgroundColor =
							linkStyle.backgroundColor;
				}}
			>
				Voltar a home
			</Link>
		</div>
	);
}
