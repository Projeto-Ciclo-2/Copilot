import React from "react";
import RankIcon from "../assets/icons/rankingOrder";

interface User {
	name: string;
	wins: number;
	points: number;
	medals: number;
	played_polls: number;
  }

interface UserRankingProps{
    user: User;
    index: number;
}

const UserRanking: React.FC<UserRankingProps> = ({ user, index }) => {   
    const backgroundColor = (index: number) => {
        switch (index) {
            case 0:
              return '#ffd90097'; // Ouro
            case 1:
              return '#c0c0c0b3'; // Prata
            case 2:
              return '#cd803297'; // Bronze
        }
    }
    const border = (index: number) => {
        switch (index) {
            case 0: 
                return '#b39802';
            case 1:
                return '#9b9999';
            case 2:
                return '#cd7f32';
        }
    }
    return (
        <div className="ranking-card" style={{ backgroundColor: backgroundColor(index), borderColor: border(index)  }}>
            <div className="medal-ranking">
                <RankIcon index={index}/>
            </div>
            <div className="ranking-content">
                <div className="name">
                <h4>{user.name}</h4>
                </div>
                <div className="content">
                <p>{user.wins} vitórias</p>
                <p>{user.points} pontos</p>
                <p>{user.medals} medalhas</p>
                <p>{user.played_polls} jogos concluídos</p>
                </div>
            </div>
        </div>
    )
}

export default UserRanking;