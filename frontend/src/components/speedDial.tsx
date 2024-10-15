import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import React from "react";
import Statistic from "../icons/statistic";
import Global from "../icons/global";

const SpeedDialElement = () => {
	// icons
	const actions = [
		{ icon: <Statistic />, name: "Statistic" },
		{ icon: <Global />, name: "Global" },
	];

	return (
		<SpeedDial
			ariaLabel="SpeedDial basic example"
			sx={{ position: "absolute", bottom: 16, right: 16 }}
			icon={<SpeedDialIcon />}
		>
			{actions.map((action) => (
				<SpeedDialAction
					sx={{
						background: "var(--primary)",
						":hover": {
							background: "var(--primary)",
						},
					}}
					key={action.name}
					icon={action.icon}
					tooltipTitle={action.name}
				/>
			))}
		</SpeedDial>
	);
};

export default SpeedDialElement;
