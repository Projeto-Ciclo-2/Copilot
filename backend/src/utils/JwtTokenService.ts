import jwt from "jsonwebtoken";

interface IJwt {
	user_id: string;
}

export default class JwtTokenService {
	public static verify(token: string) {
		return jwt.verify(token, process.env.SECRET_KEY || "");
	}

	public static create(data: IJwt) {
		return jwt.sign(data, process.env.SECRET_KEY || "");
	}
}
