import React, { useEffect,  useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import '../assets/styles/profile.css';
import profile_svg from '../assets/images/profile-icon.svg';
import card_list_svg from '../assets/images/card-list.svg';
import search_svg from '../assets/images/search-icon.svg';
import register_svg from '../assets/images/register-icon.svg';
import users_svg from '../assets/images/users-icon.svg';
import dev_svg from '../assets/images/dev-icon.svg';
import pencil_square_svg from '../assets/images/pencil-square.svg';

import showToastMessage from '../components/toast_message';
function Profile() {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("access_token");
    const decodedToken = jwtDecode(token);
    const user_id = decodedToken.sub;
    const current_role_user = decodedToken.role;
    
    const [login, setLogin] = useState('');
    const [user_name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [gender, setGender] = useState('');
    const [profileImg, setProfileImg] = useState('');
    
    const [userRole, setUserRole] = useState(current_role_user);
    
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
    
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formDisabled, setFormDisabled] = useState(true);

    const [isHovered, setIsHovered] = useState(false);
    
    const handleEditButton = (e) => {
        
        e.preventDefault();
        if (!isEditing) {
            setIsEditing(true);
            setFormDisabled(false); 
        } else {
            
            setIsEditing(false);
            setFormDisabled(true);
        }
    };

    
    const handleCancelButton = (e) => {
        e.preventDefault();
        setIsEditing(false);
        setFormDisabled(true);
    };
    
    const [formData, setFormData] = useState({
        new_name: '',
        new_last_name: '',
        new_gender: '',
        new_role: '',
        new_email: '',
        new_profile_img: ''
    });
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            profile_img: e.target.files[0],
        });
    };
    
    const [confirm_password, setPassword] = useState('');

    const handleShowConfirm = (e) => {
        e.preventDefault();
        if (!isSaving) {
            setIsSaving(true);
        } else {   
            setIsSaving(false);
        }
      };

    const handleBackgroundClick = (e) => {
        if (e.target.className === 'form-confirm-password-background') {
            setIsSaving(false);
        }
    };
    
    const handleConfirmPassword = async (e) => {
        e.preventDefault();
        fetch('http://127.0.0.1:5000/auth/confirm_password', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ confirm_password }),
        })
        .then((response) => response.json())
        .then((data) => {
        if (data.success) {
            handleSaveButton(e);
        } else {
            showToastMessage("Senha incorreta. Tente novamente!", false);
        }
        setPassword('');
        })
        .catch((error) => {
            console.error('Error:', error);
            setPassword('');
        });
    };

    const handleSaveButton = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        
        try {
            const response = await fetch(`http://127.0.0.1:5000/auth/update/${user_id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }, 
            body: data,
            });
        
            const result = await response.json();
        
            if (response.ok) {
            console.log('Perfil atualizado com sucesso:', result);
            setIsEditing(false);
            setIsSaving(false);
            setFormDisabled(true); 
            showToastMessage(result.msg, true); 
            } else {
            showToastMessage(result.msg, false);
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            showToastMessage('Erro ao atualizar perfil. Tente novamente.', false);
        }
    };
      
      
    useEffect(() => {
        document.body.style.backgroundColor = 'beige'; 
        document.body.style.fontFamily = '"Poppins", sans-serif';
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);
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
                if (!response.ok && response.status == 401) {
                    navigate("/login", {state: {message: "Sessão expirada. Faça login novamente.", success: false}});
                } else if (!response.ok) {
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
                    {getNavLinks().map((link) => (
                        <button key={link.name} className="btn-page" onClick={() => handleLinkClick(link.link_page)}>
                            <img src={link.img}></img>
                        <p>{link.name}</p>
                        </button>
                    ))}
                </div>
            </div>
            <form id='form-update' className="main-profile">
                <h1>Perfil</h1>
                <div className="profile-img-div-container" style={{ position: 'relative'}}>
                    {profileImg ? (
                        <img
                        src={`data:image/jpeg;base64,${profileImg}`}
                        alt="Profile"
                        className="profile-img"
                        onMouseEnter={() =>  isEditing &&setIsHovered(true)}
                        onMouseLeave={() =>  isEditing &&setIsHovered(false)}
                        style={{opacity: isEditing && isHovered ? 0.5 : 1, transition: 'opacity 0.2s ease-in-out', cursor: 'pointer'}}
                        />
                    ) : (
                        <img
                        src={profile_svg}
                        alt="Profile"
                        className="profile-icon-svg"
                        onMouseEnter={() =>  isEditing && setIsHovered(true)}
                        onMouseLeave={() =>  isEditing && setIsHovered(false)}
                        style={{opacity: isEditing && isHovered ? 0.5 : 1, transition: 'opacity 0.2s ease-in-out', cursor: 'pointer'}}
                        />
                    )}
                    {isHovered && (
                        <img
                        src={pencil_square_svg}
                        alt="Hover Icon"
                        style={{
                            position: 'absolute',
                            top: '35px',
                            left: '35px',
                            width: '30px',
                            height: '30px',
                            pointerEvents: 'none',

                        }}
                        />
                    )}
                    <p>Foto de perfil</p>
                </div>
                <div className="profile-info-container">
                        <div className="profile-div-container">
                            <label htmlFor="name">Nome</label>
                            <input type="text" id="name-input" name="new_name" placeholder={user_name} disabled={formDisabled} onChange={handleInputChange}></input>
                        </div> 
                        <div className="profile-div-container">
                            <label htmlFor="last_name">Sobrenome</label>
                            <input type="text" id="last_name-input" name="new_last_name" placeholder={lastName} disabled={formDisabled} onChange={handleInputChange}></input>
                        </div>
                        <div className="profile-div-container">
                            <label htmlFor="gender">Gênero</label>
                            {!isEditing ? (
                                <input type="text" placeholder={gender} disabled={formDisabled}></input>
                            ) : (
                                <select name="new_gender" placeholder={gender} onChange={handleInputChange}>
                                        <option value="m">Masculino</option>
                                        <option value="f">Feminino</option>
                                        <option value="n">Não informar</option>
                                </select>
                            )}
                        </div>
                        <div className="profile-div-container">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" id="email-input" name="new_email" placeholder={login} disabled={formDisabled} onChange={handleInputChange}></input>
                        </div>
                        <div className="container-btns">
                            {isEditing && (
                                <button className="btn-delete" id="btn-cancel" onClick={handleCancelButton}>
                                Cancelar
                                </button>
                            )}
                            {isEditing && (
                                <button className="btn-save" id="btn-save" onClick={handleShowConfirm} >
                                Salvar
                                </button>
                            )}
                            {!isEditing && (
                                <button className="btn-delete" id="btn-delete">
                                Excluir conta
                                </button>
                            )}
                            {!isEditing && (
                            <button className="btn-edit" id="btn-edit" onClick={handleEditButton}>
                                Editar
                            </button>
                            )}
                            {!isEditing && (
                                <button className="btn-change-password" id="btn-change-password">
                                Alterar senha
                                </button>
                            )}
                            {isSaving && (
                                <div className='form-confirm-password-background' onClick={handleBackgroundClick}>
                                    <div className='form-confirm-password-container'>
                                        <form className='form-confirm-password'>
                                            <label htmlFor="password">Digite sua senha para confirmar as alterações</label>
                                            <input
                                                type="password"
                                                value={confirm_password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                />
                                            <button onClick={handleConfirmPassword} className='btn-save'>Salvar</button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                </div>
            </form>
        </div>
    )
}

export default Profile;