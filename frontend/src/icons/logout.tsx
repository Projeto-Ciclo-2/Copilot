import React from "react";
import type { SVGProps } from "react";

export default function Logout(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="34"
			height="34"
			viewBox="0 0 24 24"
		>
			<path
				fill="none"
				stroke="white"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="m12 15l3-3m0 0l-3-3m3 3H4m0-4.752V7.2c0-1.12 0-1.68.218-2.108c.192-.377.497-.682.874-.874C5.52 4 6.08 4 7.2 4h9.6c1.12 0 1.68 0 2.107.218c.377.192.683.497.875.874c.218.427.218.987.218 2.105v9.607c0 1.118 0 1.677-.218 2.104a2 2 0 0 1-.875.874c-.427.218-.986.218-2.104.218H7.197c-1.118 0-1.678 0-2.105-.218a2 2 0 0 1-.874-.874C4 18.48 4 17.92 4 16.8v-.05"
			></path>
		</svg>
	);
}
