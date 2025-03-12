import "../assets/styles/loans.css";
import React, { useEffect, useState } from 'react';
import showToastMessage from '../components/toast_message';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SideBar from '../components/sidebar';

function Loans() {
    const token = sessionStorage.getItem("access_token");
    const decodedToken = jwtDecode(token);
    const location = useLocation();
    const message = location.state?.message;
    const success = location.state?.success;
    const [loans, setLoans] = useState([]);
    const navigate = useNavigate();
    const user_name = decodedToken.name;

    useEffect(() => {
        if (message !== undefined) {
            showToastMessage(message, success);  
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
            if (response.status == 401) {
                navigate("/login", {state: {message: "Sessão expirada. Faça login novamente.", success: false}});
            }
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
            <SideBar/>
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