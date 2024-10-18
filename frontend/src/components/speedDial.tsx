import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import React from "react";
import Statistic from "../icons/statistic";
import Global from "../icons/global";
import { useNavigate } from "react-router-dom";

const SpeedDialElement = () => {
	const navigate = useNavigate()
	// icons
	const actions = [
		{ icon: <Statistic />, name: "Statistic", route: "/statistic" },
		{ icon: <Global />, name: "Global", route: "/global" },
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
					onClick={() => navigate(action.route)}
				/>
			))}
		</SpeedDial>
	);
};

export default SpeedDialElement;
