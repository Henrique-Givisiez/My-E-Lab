import "../assets/styles/search.css";
import React, { useEffect, useState } from 'react';
import showToastMessage from '../components/toast_message';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SideBar from '../components/sidebar';
import placeholder from '../assets/images/placeholder.png';
function Search() {
    const location = useLocation();
    const message = location.state?.message;
    const [items, setItems] = useState({ data: [] });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);

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
        
        fetch("http://127.0.0.1:5000/items/read-all", {
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
            setItems(data);
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
    
        const results = items.data.filter(
          (item) =>
            item.nome.toLowerCase().includes(searchQuery) ||
            item.categoria.toLowerCase().includes(searchQuery) ||
            item.type.toLowerCase().includes(searchQuery) ||
            item.localizacao.toLowerCase().includes(searchQuery)
        );
        setFilteredData(results);
      };

    return (
    <div className="users">
        <SideBar />
        <div className="main-users">
            <h1 style={{marginLeft:'15px'}}>Livros e Materiais</h1>
            <div className="search-container">
            <input
                className="search-bar"
                type="text"
                placeholder="Busque por livros ou materiais"
                value={query}
                onChange={handleSearch}
            />
            </div>

            {loading ? (
            <p className="loading-text">Carregando itens...</p>
            ) : (
            <div className="item-list">
                {filteredData.length > 0 ? (
                filteredData.map((item) => (
                    <div key={item.id} className="item-card">
                    <div className="item-image">
                        {item.imagem ? (
                        <img
                            src={`data:image/png;base64,${item.imagem}`}
                            alt={item.nome}
                        />
                        ) : (
                        <img src={placeholder} alt="Imagem não disponível" />
                        )}
                    </div>
                    <div className="item-info">
                        <h3 className="item-title">{item.nome}</h3>
                        <p className="item-location">{item.localizacao}</p>
                        <p className="item-location">{item.type}</p>
                    </div>
                    <button className="details-button"  onClick={() => navigate(`/detalhes/${item.type}/${item.id}`)}>VER DETALHES</button>
                    </div>
                ))
                ) : (
                <p className="no-results">Nenhum resultado encontrado.</p>
                )}
            </div>
            )}
        </div>
        </div>
    )
}

export default Search