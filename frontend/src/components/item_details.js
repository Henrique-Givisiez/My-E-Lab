import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "../assets/styles/details.css";
import placeholder from '../assets/images/placeholder.png';
import SideBar from '../components/sidebar';

function ItemDetails() {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [itemDetails, setItemDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            jwtDecode(token);
        } catch (error) {
            navigate("/login", { state: { message: "Sessão inválida. Faça login novamente." } });
            return;
        }

        fetch(`http://127.0.0.1:5000/items/read/${type}/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    navigate("/login", { state: { message: "Sessão expirada. Faça login novamente." } });
                }
                throw new Error('Erro ao buscar detalhes.');
            }
            return response.json();
        })
        .then(data => {
            if (data.data) {
                setItemDetails(data.data);
            } else {
                navigate("/search", { state: { message: "Item não encontrado." } });
            }
            setLoading(false);
        })
        .catch(error => {
            console.error('Erro:', error);
            setLoading(false);
        });
    }, [type, id, navigate]);

    if (loading) return <p>Carregando detalhes...</p>;
    if (!itemDetails) return <p>Detalhes não disponíveis.</p>;
    var imagem = '';
    if (type !== 'Livro') {
        imagem = itemDetails[6];
    } else {
        imagem = itemDetails[7];
    }
    return (
        <div className="page-container">
            < SideBar />
            <div className="details-container">
                <h1>Detalhes do {type === 'Livro' ? 'Livro' : 'Material Didático'}</h1>
                <div className="details-card">
                    <div className="details-image">
                        {imagem ? (
                            <img 
                                src={`data:image/png;base64,${imagem}`} 
                                alt={itemDetails[1]} 
                            />
                        ) : (
                            <img src={placeholder} alt="Imagem não disponível" />
                        )}
                    </div>
                    <div className="details-info">
                        {type === 'Livro' && itemDetails[0] && (
                            <p><strong>ISBN:</strong> {itemDetails[0]}</p>
                        )}
                        {type !== 'Livro' && itemDetails[0] && (
                            <p><strong>Número de Série:</strong> {itemDetails[0]}</p>
                        )}
                        <p><strong>Nome:</strong> {itemDetails[1]}</p>
                        <p><strong>Categoria:</strong> {itemDetails[3]}</p>
                        {type === 'Livro' && (
                            <p><strong>Autor:</strong> {itemDetails[5]}</p>
                        )}
                        <p><strong>Localização:</strong> {itemDetails[5]}</p>
                        <p><strong>Data de aquisição:</strong> {itemDetails[4]}</p>
                        {itemDetails[2] && (
                            <div className="details-description">
                                <h3>Descrição</h3>
                                <p>{itemDetails[2]}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemDetails;
