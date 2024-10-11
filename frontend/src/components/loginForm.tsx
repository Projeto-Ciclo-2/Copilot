import React, { useState } from "react";
import Input from "./input";
import Btn from "./button";
import Notification from "./notification/notification";
import usernameValid from "../validations/username";

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [notification, setNotification] = useState<string | null>(null);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!usernameValid(e.target.value)) {
        e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s]/g, '');
    }
    setUsername(e.target.value);
      };
      const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
      };
      const handleNotificationCLose = () => {
        setNotification(null);
      };
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(username === '' || password === ''){
          setNotification('Os campos não podem estar vazios!')
          setTimeout(() => {
            handleNotificationCLose()
          }, 2000);
        }else{
          const valid = usernameValid(username)
          if(valid){
            console.log(username, password)
          }else{
            setNotification('Nome de usuário e/ou senha incorretos!')
            setTimeout(() => {
              handleNotificationCLose()
            }, 2000);
          }
        }
      };
    return (
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="auth-div">
          <label>Nome de usuário:</label>
          <Input type="text" value={username} onChange={handleUsernameChange}/>
        </div>
        <div className="auth-div">
          <label>Senha:</label>
          <Input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <Btn type="submit" className="auth-btn" text="Entrar" />
        {notification && (
        <Notification
          message={notification}
          onClose={handleNotificationCLose}
        />
      )}
      </form>
    );
  };

export default LoginForm;
