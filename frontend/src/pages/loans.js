import "../assets/styles/loans.css";
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

function Loans() {
    const token = sessionStorage.getItem("access_token");
    const decodedToken = jwtDecode(token);
    const location = useLocation();
    const message = location.state?.message;
    const login = location.state?.login;
    const user_id = location.state?.user_id;
    const [loans, setLoans] = useState([]);
    const navigate = useNavigate();
    const role = decodedToken.role;
    const user_name = decodedToken.name;

    const [userRole, setUserRole] = useState(role);
    
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
        
        fetch("http://127.0.0.1:5000/loans/read-by-user", {
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
            setLoans(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }, []);

    const returnLoan = (id) => {
        const token = sessionStorage.getItem("access_token");
        fetch(`http://127.0.0.1:5000/loans/return/${id}`, {
            method: 'PUT',
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
        .then(updatedLoan => {
            setLoans(prevLoans =>
                prevLoans.map(loan => 
                    loan.Id_emprestimo === updatedLoan.Id_emprestimo
                    ? { ...loan, Status_atual: "devolvido" }
                    : loan                )
            );

            const button = document.getElementById(`returnBtn-${id}`);
            if (button) {
                button.className = "btn-devolvido";
                button.textContent = "Finalizado";
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    return (

        <div className="loans">
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
            <div className="main-loans">
                <h1>Seus empréstimos, {user_name}</h1>
                <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Data de empréstimo</th>
                        <th>Data de devolução</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {loans.map((loans) => (
                        <tr key={loans.Id_emprestimo}>
                            <td>{loans.nome_titulo}</td>
                            <td>{loans.tipo_item}</td>
                            <td>{loans.Data_Emprestimo}</td>
                            <td>{loans.Data_Devolucao}</td>
                            <td><button id={`returnBtn-${loans.Id_emprestimo}`} onClick={() => returnLoan(loans.Id_emprestimo)} disabled={loans.Status_atual === "finalizado"} className={loans.Status_atual === "emprestado" ? "btn-devolver" : "btn-devolvido"}>{loans.Status_atual === "emprestado" ? "Devolver" : "Finalizado"}</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default Loans;