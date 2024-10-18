import YesOrNo from "../../assets/svg/yesOrNo";
import "./confirmActionModal.css";

export default function ConfirmActionModal(props: {
	title: string;
	message: string;
	alive: boolean;
	onAccept: () => any;
	onReject: () => any;
	acceptBtnText?: string;
	rejectBtnText?: string;
}) {
	if (!props.alive) return <></>;
	return (
		<div id="modal">
			<div>
				<h4>{props.title}</h4>
				<span>{props.message}</span>
				<YesOrNo />
				<div>
					<button onClick={props.onAccept}>{props.acceptBtnText || "Desejo cancelar"}</button>
					<button onClick={props.onReject}>{props.rejectBtnText || "Continuar criando"}</button>
				</div>
			</div>
		</div>
	);
}
