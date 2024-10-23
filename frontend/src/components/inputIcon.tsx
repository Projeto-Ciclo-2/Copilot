import React, { ReactNode } from "react";
import "./css/inputIcon.css";

export default function InputIcon(props: {
	children: ReactNode;
	label: string;
	value?: string | number | undefined;
	setValue?: (value: any) => any;
	placeholder?: string;
	type?: React.HTMLInputTypeAttribute | undefined;
	selectInput?: boolean;
	selectOptions?: number[] | string[];
}) {
	const [err, setErr] = React.useState("");
	const selectOptions = React.useMemo(() => {
		if (props.selectInput && props.selectOptions) {
			return props.selectOptions.map((opt) => (
				<option value={opt} key={window.crypto.randomUUID()}>
					{opt}
				</option>
			));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.selectInput, props.selectOptions, props.value]);

	const validateInput = (e: React.FormEvent<HTMLInputElement>) => {
		if (e.target instanceof HTMLInputElement && props.setValue) {
			const value = e.target.value;
			const input = e.target;

			const invalid = /[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s]+/.test(value);
			const bigger = value.length >= 50;

			if (invalid || bigger) {
				input.value = input.value
					.replaceAll(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s]+/g, "")
					.slice(0, 50);

				input.classList.add("shakeIt");
				setTimeout(() => input.classList.remove("shakeIt"), 100);
			}
			props.setValue(input.value);
		}
	};

	const selectThis = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (!props.setValue || !props.selectOptions) {
			setErr("Erro ao tratar input, reinicie a página.");
			return;
		}
		const value =
			props.type === "number"
				? (Number.parseInt(e.target.value) as never)
				: (e.target.value as never);

		if (!props.selectOptions.includes(value)) {
			setErr(
				"você selecionou algo inválido, parabéns, nada irá acontecer."
			);
			return;
		}
		props.setValue(value);
	};

	const input = (
		<input
			style={{ borderColor: err && `var(--red)` }}
			id={props.label + "input"}
			type={props.type}
			placeholder={props.placeholder}
			value={props.value}
			onInput={validateInput}
			onChange={validateInput}
			onPaste={validateInput}
			onBlur={validateInput}
		/>
	);
	const select = (
		<select
			style={{ borderColor: err && `var(--red)` }}
			defaultValue={
				typeof props.value == "number" ? props.value : props.placeholder
			}
			onChange={selectThis}
		>
			<option value={props.placeholder} disabled>
				{props.placeholder}
			</option>
			{selectOptions}
		</select>
	);
	return (
		<fieldset id="inputIcon">
			<div>
				{props.children}
				<label htmlFor={props.label + "input"}>{props.label}</label>
			</div>
			{props.selectInput ? select : input}
			<span>{err}</span>
		</fieldset>
	);
}
