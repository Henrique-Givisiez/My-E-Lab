import "../assets/styles/users.css";
import React, { useEffect, useState } from 'react';
import showToastMessage from '../components/toast_message';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import profile_svg from '../assets/images/profile-icon.svg';
import card_list_svg from '../assets/images/card-list.svg';
import search_svg from '../assets/images/search-icon.svg';
import register_svg from '../assets/images/register-icon.svg';
import users_svg from '../assets/images/users-icon.svg';
import dev_svg from '../assets/images/dev-icon.svg';
import { jwtDecode } from "jwt-decode";

function Users() {
    const token = sessionStorage.getItem("access_token");
    const decodedToken = jwtDecode(token);
    const location = useLocation();
    const message = location.state?.message;
    const success = location.state?.success;
    const [users, setUsers] = useState({ data: [] });
    const navigate = useNavigate();
    const role = decodedToken.role;
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(role);
    const [query, setQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    
    const getNavLinks = () => {
        const links = [
            { name: "Perfil", roles: ["estudante", "professor", "admin"], img: profile_svg, link_page: "profile" },
            { name: "Empréstimos", roles: ["estudante", "professor", "admin"], img: card_list_svg, link_page: "loans" },
            { name: "Consulta", roles: ["estudante", "professor", "admin"], img: search_svg, link_page: "search" },
            { name: "Cadastro", roles: ["professor", "admin"], img: register_svg, link_page: "register" },
            { name: "Usuários", roles: ["admin"], img: users_svg, link_page: "users" },
            { name: "Criador", roles: ["estudante", "professor", "admin"], img: dev_svg, link_page: "dev" },
        ];
    
        return links.filter(link => link.roles.includes(userRole));
    };
    
    const handleLinkClick = (link_page) => {
        navigate(`/${link_page}`);
    }

    useEffect(() => {
        if (message !== undefined) {
            showToastMessage(message);  
        }
    }, [message]); 
    
    useEffect(() => {
        document.body.style.backgroundColor = 'beige'; 
        document.body.style.fontFamily = '"Poppins", sans-serif';
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);
    
    useEffect(() => {
        const token = sessionStorage.getItem("access_token");
    
        if (!token) {
            navigate("/login");
        }
        
        fetch("http://127.0.0.1:5000/auth/all-users", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    navigate("/login", { state: {success: false, message: "Sessão expirada. Faça login novamente."} });
                }
                throw new Error('Erro na requisição, status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            setUsers(data);
            setLoading(false);
            setFilteredData(data.data);
        })
        .catch((error) => {
            console.error('Error:', error);
            setLoading(false);
        });
    }, []);


    const handleSearch = (e) => {
      const searchQuery = e.target.value.toLowerCase();
      setQuery(searchQuery);
  
      const results = users.data.filter(
        (user) =>
          user.Email.toLowerCase().includes(searchQuery) ||
          user.Nome_Sobrenome.toLowerCase().includes(searchQuery) ||
          user.Funcao.toLowerCase().includes(searchQuery) ||
          user.Genero.toLowerCase().includes(searchQuery)
      );
      setFilteredData(results);
    };
    
    return (

        <div className="users">
            <div className="side-nav">
                <div className="link-pages">
                    {getNavLinks().map((link) => (
                        <button key={link.name} className="btn-page" onClick={() => handleLinkClick(link.link_page)}>
                            <img src={link.img}></img>
                        <p>{link.name}</p>
                        </button>
                    ))}
                </div>
            </div>
            {loading ? (
            <p>Carregando usuários...</p>
        ) : (
            <div className="main-users">
                <h1 style={{marginLeft:'15px'}}>Usuários</h1>
                <input
                    className="search-bar"
                    type="text"
                    placeholder="Pesquisar usuário"
                    value={query}
                    onChange={handleSearch}
                    />
                <table>
                    <tbody>
                    {filteredData.length >= 0 ? (
                        Array.from({ length: Math.ceil(filteredData.length / 3) }, (_, rowIndex) => (
                        <tr key={rowIndex} className="row-card">
                            {filteredData
                            .slice(rowIndex * 3, rowIndex * 3 + 3)
                            .map((user) => (
                                <td key={user.Email} className="data-card">
                                <div className="card-user">
                                    {user.Imagem_perfil ? (
                                    <div className="card-user-img">
                                        <img
                                        className="profile-img"
                                        src={`data:image/png;base64,${user.Imagem_perfil}`}
                                        alt="Imagem de perfil"
                                        />
                                    </div>
                                    ) : (
                                    <div className="card-user-img">
                                        <img
                                        className="profile-icon-svg"
                                        src={profile_svg}
                                        alt="Imagem de perfil"
                                        />
                                    </div>
                                    )}
                                    <div className="card-user-info">
                                    <p>Email: {user.Email}</p>
                                    <p>Nome: {user.Nome_Sobrenome}</p>
                                    <p>Função: {user.Funcao}</p>
                                    <p>Gênero: {user.Genero}</p>
                                    </div>
                                </div>
                                </td>
                            ))}
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="3" className="no-results">
                            Nenhum resultado encontrado.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    )
}

export default Users;