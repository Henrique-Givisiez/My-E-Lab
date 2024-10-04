import React, { useEffect,  useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import '../assets/styles/profile.css';

function Profile() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("access_token");
    const decodedToken = jwtDecode(token);
    const user_id = decodedToken.sub;
    
    const [login, setLogin] = useState('');
    const [user_name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [gender, setGender] = useState('');
    const [profileImg, setProfileImg] = useState('');

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }

        if (decodedToken) {
            fetch(`http://127.0.0.1:5000/auth/details/${user_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição, status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                const [ ,login, , name, last_name, role, gender, profile_img] = data.data;
                setLogin(login);
                setName(name);
                setLastName(last_name);
                setRole(role);
                setGender(gender);
                setProfileImg(profile_img);
                console.log(profile_img);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    });

    return (
        <div className="Profile">
            <div className="side-nav">
                <div className="link-pages">
                    <button className="btn-page">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                        </svg>
                        <p>Perfil</p>
                    </button>
                    <button className="btn-page">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-card-list" viewBox="0 0 16 16">
                        <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
                        <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                        </svg>
                        <p>Empréstimos</p>
                    </button>
                    <button className="btn-page">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                        <p>Consulta</p>
                    </button>
                    <button className="btn-page">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                        </svg>
                        <p>Cadastro</p>
                    </button>
                    <button className="btn-page">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-lines-fill" viewBox="0 0 16 16">
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                        </svg>
                        <p>Usuários</p>
                    </button>
                    <button className="btn-page">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-code-slash" viewBox="0 0 16 16">
                        <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"/>
                        </svg>
                        <p>Criador</p>
                    </button>
                </div>
            </div>
            <div className="main-profile">
                <h1>Perfil</h1>
                <div className="profile-img-div-container">
                    <img src={`data:image/jpeg;base64,${profileImg}`} alt="Profile" className="profile-img"></img>
                    <p>Foto de perfil</p>
                </div>
                <div className="profile-info-container">
                        <div className="profile-div-container">
                            <label htmlFor="name">Nome</label>
                            <input type="text" id="name" name="name" value={user_name}></input>
                        </div>
                        <div className="profile-div-container">
                            <label htmlFor="last_name">Sobrenome</label>
                            <input type="text" id="last_name" name="last_name" value={lastName}></input>
                        </div>
                        <div className="profile-div-container">
                            <label htmlFor="role">Função</label>
                            <input type="text" id="role" name="role" value={role}></input>
                        </div>
                        <div className="profile-div-container">
                            <label htmlFor="gender">Gênero</label>
                            <input type="text" id="gender" name="gender" value={gender}></input>
                        </div>
                        <div className="profile-div-container">
                            <label htmlFor="email">E-mail</label>
                            <input type="text" id="email" name="email" value={login}></input>
                        </div>
                        <div className="container-btns">
                            <button className="btn-delete">Excluir conta</button>
                            <button className="btn-edit">Editar</button>
                            <button className="btn-change-password">Alterar senha</button>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;