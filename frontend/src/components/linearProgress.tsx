import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useCurrentQuestion } from "../context/questionCurrentContext";
import { usePolls } from "../context/PollsContext";

interface ILinearProps {
	initialRender: boolean;
}

const LinearProgressComponent: React.FC<ILinearProps> = ({ initialRender }) => {
	const [progress, setProgress] = React.useState(0);

	const { currentPoll } = usePolls();

	const {
		timeQuestion,
		currentQuestion,
		timeNextQuestion,
		showAlternative,
		setShowAlternative,
	} = useCurrentQuestion();

	React.useEffect(() => {
		if (showAlternative === "alternative") {
			if ((timeQuestion as number) <= 0) return;
			let time = timeQuestion as number;
			if (initialRender && currentPoll?.started_at && timeQuestion) {
				console.log("%cSincronizou!!!!!!!!!!!!!!", "color: #69e769");

				const sinc =
					currentPoll?.started_at + timeQuestion + 10000 - Date.now();
				time = sinc;
			}
			console.log(`%time = ${timeQuestion}`, "color: blue");

			const increment = 100 / (time / 100);
			const timer = setInterval(() => {
				setProgress((oldProgress) => {
					if (oldProgress >= 100) {
						clearInterval(timer);

						setShowAlternative("response"); // Mostrar porcentagem
						timeNextQuestion(10000); // 10 segundos para exibir próxima questão

						return 100;
					}
					return Math.min(oldProgress + increment, 100);
				});
			}, 100);
			return () => {
				clearInterval(timer);
				setProgress(0);
			};
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeQuestion, currentQuestion]);

	return (
		<Box sx={{ width: "100%" }}>
			<LinearProgress
				sx={{
					height: "1rem",
					borderRadius: "1rem",
					color: "var(--primary)",
				}}
				variant="determinate"
				value={progress}
			/>
		</Box>
	);
};

export default LinearProgressComponent;
