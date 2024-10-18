import React, { ReactNode } from "react";
import { UserAPI } from "../api/users";

interface IUser {
	name: string;
	created_at: Date;
	wins: number;
	points: number;
	medals: number;
	played_polls: number;
}

interface IUserContextType {
	user: IUser | null;
	setUser: (user: IUser) => void;
}

const userAPI = new UserAPI();

export const UserContext = React.createContext<IUserContextType | undefined>(
	undefined
);

export default function UserProvider(props: { children: ReactNode }) {
	const [user, setUser] = React.useState<IUser | null>(null);
	React.useEffect(() => {
		const validateSession = async () => {
			const res = await userAPI.getMyUser();
			if (!res) return console.error("Not possible to find user!", res);

			if (res.error)
				return console.error("Error while fetching the user", res);

			console.log(res);
		};
		validateSession();
	}, []);
	return (
		<UserContext.Provider value={{ user, setUser }}>
			{props.children}
		</UserContext.Provider>
	);
}
