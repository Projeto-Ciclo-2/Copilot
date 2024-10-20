import React from "react";
import "./waitRanking.css";
import ImgWaitRankIcon from "../../icons/imgWaitRankIcon";

const WaitRanking = () => {
	return (
		<section id="section-wait-ranking">
			<div id="wait-ranking">
				<h4>Aguenta aí!</h4>
				<p>
					Estamos preparando o ranking<span>...</span>
				</p>
				<ImgWaitRankIcon />
			</div>
		</section>
	);
};

export default WaitRanking;
