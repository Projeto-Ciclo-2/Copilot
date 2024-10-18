import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { useCurrentQuestion } from "../context/questionCurrentContext";
import { useNavigate } from "react-router-dom";

const LinearProgressComponent = () => {
	const [progress, setProgress] = React.useState(0);
	let testeTime = 0;

	const navigate = useNavigate();

	const { timeQuestion, currentQuestion, addQuestion, numberOfQuestions } =
		useCurrentQuestion();

	React.useEffect(() => {
		if ((timeQuestion as number) <= 0) return;

		const increment = 100 / ((timeQuestion as number) / 100);

		const timer = setInterval(() => {
			setProgress((oldProgress) => {
				if (oldProgress >= 100) {
					clearInterval(timer);

					// adicionar pergunta
					if ((currentQuestion as number) < numberOfQuestions - 1) {
						addQuestion();
					}
					if ((currentQuestion as number) >= numberOfQuestions - 1) {
						navigate('/ranking')
					}

					return 100;
				}
				return Math.min(oldProgress + increment, 100);
			});
			testeTime += 100;
		}, 100);

		return () => {
			clearInterval(timer);
			setProgress(0);
		};
	}, [timeQuestion as number, currentQuestion]);

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
