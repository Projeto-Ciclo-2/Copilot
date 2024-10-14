import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { config } from "../config";
import { ErrorWhileGeneratingQuiz } from "../utils/Exception";
import { examples } from "./responseExamples";

interface IQuizQuestion {
	statement: string;
	options: string[];
	answer: string;
	explanation: string;
}

type Prompt = string;

export class QuizGenerator {
	private parser = new StringOutputParser();
	private model = new ChatOpenAI({
		model: "gpt-4o-mini",
		apiKey: config.OPENAI_KEY,
	});
	private use_gpt_key: boolean;

	private system_rule = `
		Você é um mestre dos quiz, e está criando um quiz divertido e inteligente.
		O usuário irá inserir um série de informações,
		como o titulo do quiz, a quantidade de perguntas, quantidade de alternativas e o tema do quiz.

		Regras para gerar as perguntas:
			- Cada pergunta deve ser clara e sem ambiguidade,
				o usuário deve ter uma boa experiência ao escolher a resposta.
			- Não pergunte coisas obvias, a única questão fácil deve ser a primeira questão.
				 As perguntas seguintes devem ser mais difíceis.
			- Nunca coloque a resposta no enunciado ou deixe implícito a resposta por meio do enunciado.

		Exemplo de prompt: title: "quiz", theme: "exemplo", number_of_question: "2",  number_of_alternatives: "3"
		Exemplo de resposta: [
			{ "statement": "escolha uma questão.", "options": [
			 		"opção 1", "opção 2", "opção 3"
				], "answer": "0", "explanation": "opção 1 corresponde melhor"
			},
			{ "statement": "escolha uma questão.", "options": [
					"opção 1", "opção 2", "opção 3"
				], "answer": "1" , "explanation": "opção 2 corresponde melhor"
			}
		]
		** responda apenas conforme o modelo de resposta, não acrescente nada e nem remova. **`;

	constructor() {
		if (parseInt(config.USE_GPT_KEY) === 0) {
			console.log(
				"Quiz Generator está usando respostas salvas na memória, para alterar mude o arquivo '.env'"
			);
			this.use_gpt_key = false;
		} else {
			this.use_gpt_key = true;
		}
	}

	public generatePrompt(
		title: string,
		theme: string,
		number_of_question: number,
		number_of_alternatives: number
	) {
		const prompt = `prompt:
			title: "${title}",
			theme: "${theme}",
			number_of_question: "${number_of_question}",
			number_of_alternatives: "${number_of_alternatives}"`;
		return prompt as Prompt;
	}

	public async create(
		prompt: Prompt
	): Promise<IQuizQuestion[] | ErrorWhileGeneratingQuiz> {
		if (!this.use_gpt_key) {
			const x = Math.round(Math.random() * examples.length);
			return this.jsonConstructor(examples[x]);
		}
		try {
			const start = Date.now();
			console.log("Iniciando requisição ao GPT.");
			const messages = [
				new SystemMessage(this.system_rule),
				new HumanMessage(prompt),
			];

			const response = await this.model.invoke(messages);

			const parsedStringResponse = await this.parser.invoke(response);
			const parsedJSON = this.jsonConstructor(parsedStringResponse);

			console.log(
				"Requisição finalizada. Tempo de duração: " +
					(Date.now() - start) +
					"ms"
			);
			return parsedJSON;
		} catch (error) {
			if (error instanceof ErrorWhileGeneratingQuiz) return error;
			if (error instanceof Error) {
				console.log(error);
				return new ErrorWhileGeneratingQuiz(error.message);
			}
			return new ErrorWhileGeneratingQuiz("Unknown error");
		}
	}

	private jsonConstructor(str: string) {
		const parsedJSONResponse = JSON.parse(str);
		if (!parsedJSONResponse) {
			throw new ErrorWhileGeneratingQuiz("Json inválido");
		}
		if (!Array.isArray(parsedJSONResponse)) {
			throw new ErrorWhileGeneratingQuiz("Json is not a Array");
		}
		for (const question of parsedJSONResponse) {
			this.validateQuestion(question);
		}
		return parsedJSONResponse as any[] as IQuizQuestion[];
	}

	private validateQuestion(question: any) {
		if (typeof question !== "object")
			throw new ErrorWhileGeneratingQuiz(
				"Some question is not object type."
			);
		if (!question.statement || typeof question.statement !== "string")
			throw new ErrorWhileGeneratingQuiz(
				"Some question does not has statement key or statement is not a string"
			);

		if (!question.answer || typeof question.answer !== "string")
			throw new ErrorWhileGeneratingQuiz(
				"Some question does not has answer key or answer is not a string"
			);

		if (!question.explanation || typeof question.explanation !== "string")
			throw new ErrorWhileGeneratingQuiz(
				"Some question does not has explanation key or explanation is not a string"
			);

		if (!question.options || !Array.isArray(question.options))
			throw new ErrorWhileGeneratingQuiz(
				"Some question does not has options key or options is not a array"
			);

		for (const option of question.options) {
			if (typeof option !== "string")
				throw new ErrorWhileGeneratingQuiz(
					"Some question has a invalid option"
				);
		}

		return true;
	}
}
