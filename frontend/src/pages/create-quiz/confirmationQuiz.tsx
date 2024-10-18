import React from "react";
import MysteryBox from "../../assets/svg/mysteryBox";
import IaStarsIcon from "../../assets/icons/iaStarsIcon";
import PaperPlane from "../../assets/icons/paperPlane";
import Group from "../../assets/icons/group";
import "./css/confirmation.css"

export default function ConfirmationQuiz(props: {
	onAccept: () => any;
	onReject: () => any;
}) {
	return (
		<article id="confirmationQuizContainer">
			<h3>Criar um quiz</h3>
			<MysteryBox />
			<section>
				<h6>As questões são geradas por uma IA</h6>
				<span>Se prepare para o desafio começar!</span>
			</section>
			<section>
				<IaStarsIcon />
				<span>
					Ao clicar em concluir, as perguntas serão geradas
					automaticamente por uma IA!
				</span>
			</section>
			<section>
				<PaperPlane />
				<span>
					Em seguida você será direcionado para a sala de espera.
				</span>
			</section>
			<section>
				<Group />
				<span>Seus amigos conseguirão ver o quiz na tela inicial.</span>
			</section>
			<div>
				<button onClick={props.onReject}>Voltar</button>
				<button onClick={props.onAccept}>Concluir</button>
			</div>
		</article>
	);
}
