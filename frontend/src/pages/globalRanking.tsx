import React, { useState, useEffect } from "react";
import "./css/globalRanking.css";
import { useNavigate } from "react-router-dom";
import Btn from "../components/button";
import ExitIcon from "../icons/exit";
import { UserAPI } from "../api/users";
import UserRanking from "../components/userRanking";
import Ranking from "../icons/ranking";

interface User {
	name: string;
	wins: number;
	points: number;
	medals: number;
	played_polls: number;
  }
  
const GlobalRanking = () => {
    const [rank, setRank] = useState<User[]>([]);
	const navigate = useNavigate();
	const userAPI = new UserAPI();
	function back() {
		navigate("/home");
	}
	
    useEffect(() => {
		async function fetchUsers() {
			try {
				const response = await userAPI.Ranking();

				if (response.statusCode !== 200) {
					throw new Error("Erro ao buscar os dados");
				}
				const data = response.data;
				 const sortedUsers = sortUsersByWinsAndPoints(data);
				 const ranking = sortedUsers.slice(0, 10);
				 setRank(ranking);			 
			} catch (error) {
				console.error("Erro:", error);
			}
		}

		fetchUsers();
	}, []);

	function sortUsersByWinsAndPoints(users: User[]): User[] {
		return users.sort((a: User, b: User) => {
		  if (a.wins > b.wins) return -1;
		  if (a.wins < b.wins) return 1;
	  
		  if (a.points > b.points) return -1;
		  if (a.points < b.points) return 1;
	  
		  return 0;
		});
	  }

	return (
		<div id="globalpage">
			<div id="header">
				<Btn
					type="button"
                    id="back-btn"
                    text={null}
					icon={ExitIcon}
					className="btn-exit"
					onClick={back}
				/>
			<h2><Ranking/> Rank global</h2>
			</div>
            <div id="ranking-container">
				{rank.map((user, index) => (
					<UserRanking  key={user.name} user={user} index={index}/>
				))}
            </div>
		</div>
	);
};

export default GlobalRanking;

