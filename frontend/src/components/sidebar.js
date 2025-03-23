import profile_svg from '../assets/images/profile-icon.svg';
import card_list_svg from '../assets/images/card-list.svg';
import search_svg from '../assets/images/search-icon.svg';
import register_svg from '../assets/images/register-icon.svg';
import users_svg from '../assets/images/users-icon.svg';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../assets/styles/sidebar.css";

function SideBar () {
    const token = sessionStorage.getItem("access_token");
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;
    const [userRole, setUserRole] = useState(role);
    const navigate = useNavigate();

    const getNavLinks = () => {
            const links = [
                { name: "Perfil", roles: ["estudante", "professor", "admin"], img: profile_svg, link_page: "profile" },
                { name: "Empréstimos", roles: ["estudante", "professor", "admin"], img: card_list_svg, link_page: "loans" },
                { name: "Consulta", roles: ["estudante", "professor", "admin"], img: search_svg, link_page: "search" },
                { name: "Cadastro", roles: ["professor", "admin"], img: register_svg, link_page: "register" },
                { name: "Usuários", roles: ["admin"], img: users_svg, link_page: "users" }
            ];
        
            return links.filter(link => link.roles.includes(userRole));
        };
        
    const handleLinkClick = (link_page) => {
        navigate(`/${link_page}`);
    }

    return (
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
    )
}

export default SideBar;