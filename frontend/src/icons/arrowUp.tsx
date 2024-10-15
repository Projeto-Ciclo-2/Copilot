import React from "react";

interface arrowProps {
	color: '#fff' | '#000';
}

function ArrowUp(props: arrowProps) {
	return (
		<svg
			width="29"
			height="28"
			viewBox="0 0 29 28"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4.63998 14.115C4.63998 9.039 9.04798 4.935 14.5 4.935C19.952 4.935 24.36 9.039 24.36 14.115C24.36 19.191 19.952 23.295 14.5 23.295C9.04798 23.295 4.63998 19.191 4.63998 14.115ZM23.2 14.115C23.2 9.633 19.314 6.015 14.5 6.015C9.68598 6.015 5.79998 9.633 5.79998 14.115C5.79998 18.597 9.68598 22.215 14.5 22.215C19.314 22.215 23.2 18.597 23.2 14.115Z"
				fill={props.color}
			/>
			<path
				d="M13.514 18.597L18.328 14.115L13.514 9.63301L14.326 8.87701L19.952 14.115L14.326 19.353L13.514 18.597Z"
				fill={props.color}
			/>
			<path
				d="M19.14 13.575V14.655H9.28001V13.575H19.14Z"
				fill={props.color}
			/>
		</svg>
	);
}

export default ArrowUp;
