import "../assets/styles/register.css";
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
import upload_svg from '../assets/images/upload.svg'
import { jwtDecode } from "jwt-decode";

function Register() {
    const token = sessionStorage.getItem("access_token");
    const decodedToken = jwtDecode(token);
    const location = useLocation();
    const message = location.state?.message;
    const navigate = useNavigate();
    const role = decodedToken.role;
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
            navigate("/login", {state: {message: "Acesso negado. Faça login novamente."}});
        }
    }, []);

    return (

        <div className="register">
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
            <div className="main-register">
                <h1 style={{marginLeft:'15px'}}>Cadastrar item</h1>
                <form style={{width:"fit-content"}}>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="item_type">Tipo</label>
                            <select name="item_type" className='register-form_style' style={{backgroundColor: "white", width: "725px", cursor:"pointer"}}>
                                <option value="book">Livro</option>
                                <option value="material">Material</option>
                            </select>
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="title">Nome</label>
                        <input name="title" className="register-form_style" type="text" required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="author">Autor</label>
                        <input name="author" className="register-form_style" type="text" required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="location">Localização</label>
                        <input name="location" className="register-form_style" type="text" required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="location">Descrição</label>
                        <textarea name="location" className="register-form_style" required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="date">Data de Aquisição</label>
                        <input name="date" className="register-form_style" type="date" required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="book_cover">Capa do Livro</label>
                        <input type="file" name="book_cover" className="signup-file_input"/>
                        <button className='register-btn_upload'><img src={upload_svg} alt="Upload"></img>Anexar imagem</button>
                    </div>
                    <div className="register-btn-div">
                        <button className="register-btn">CADASTRAR</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;