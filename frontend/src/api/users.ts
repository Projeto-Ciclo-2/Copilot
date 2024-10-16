export class UserAPI {
	private url = "http://localhost:5000/api";

	public async singIn(name: string, password: string): Promise<any> {
		try {
			const apiURL = this.url + "/users";
			const requestOptions: RequestInit = this.getRequestOptions("POST", {
				name,
				password,
			});
			const res = await fetch(apiURL, requestOptions);
			const result = await res.json();
			return result;
		} catch (err: any) {
			return { error: true, err };
		}
	}

	public async logIn(name: string, password: string): Promise<any> {
		try {
			const apiURL = this.url + "/login";
			const requestOptions: RequestInit = this.getRequestOptions("POST", {
				name,
				password,
			});
			const res = await fetch(apiURL, requestOptions);
			const result = await res.json();

			if (result.statusCode) return result;
			return { statusCode: res.status, result };
		} catch (err) {
			return { error: true, err };
		}
	}

	public async logout(): Promise<any> {
		try {
			const apiURL = this.url + "/logout";
			const requestOptions: RequestInit =
				this.getRequestOptions("DELETE");
			const res = await fetch(apiURL, requestOptions);
			const result = await res.json();
			return result;
		} catch (err) {
			return { error: true, err };
		}
	}

	private getRequestOptions(
		method: "POST" | "GET" | "DELETE",
		obj: object = {}
	): RequestInit {
		return {
			method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(obj),
		};
	}
}
