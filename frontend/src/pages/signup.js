import React, {useRef, useState, useEffect} from 'react';
import "../assets/styles/signup.css"
import book_img from '../assets/images/books-svgrepo-com.svg'
import open_book_img from '../assets/images/book-open-svgrepo-com.svg'
import microscope_img from '../assets/images/microscope-svgrepo-com.svg'
import chemistry_img from '../assets/images/lab-svgrepo-com.svg'
import upload_svg from '../assets/images/upload.svg'
import { useNavigate, useLocation } from "react-router-dom";
import showToastMessage from '../components/toast_message';

function Signup(){
    const [password, setPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const checkPasswordStrength = (password) => {
        let strength = 0;

        // Critérios de força da senha
        if (password.length >= 8) strength += 1;             // Comprimento mínimo
        if (/[A-Z]/.test(password)) strength += 1;            // Letras maiúsculas
        if (/[a-z]/.test(password)) strength += 1;            // Letras minúsculas
        if (/\d/.test(password)) strength += 1;               // Números
        if (/[@$!%*?&#]/.test(password)) strength += 1;       // Caracteres especiais

        // Classificação da senha
        if (strength <= 2) return 'Fraca';
        if (strength === 3) return 'Média';
        if (strength >= 4) return 'Forte';
    };

    const navigate = useNavigate();
    const handleLinkClick = () => {
        navigate("/login");
    }

    const location = useLocation();
    const message = location.state?.message;
    const success = location.state?.success;

    const fileInputRef = useRef(null);

    const handleButtonClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };


    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        last_name: '',
        role: 'admin',
        gender: 'm',
        profile_img: null
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        try {
            const response = await fetch('http://127.0.0.1:5000/auth/signup', {
                method: 'POST',
                body: data,
            });

            const result = await response.json();

            if (response.status === 201) {
                navigate("/login", { state: {success: result.success, message: result.msg,} });
            } else {
                showToastMessage(result.msg, result.success);
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            showToastMessage('Erro ao enviar formulário. Tente novamente.', false)
        }
    };

    useEffect(() => {
        if (message !== undefined && success !== undefined) {
            showToastMessage(message, success);  
        }
    }, [message, success]); 

    return (
        <div className='signup-body'>
            <div className='signup-images-background'>
                <div className='signup-line-background'>
                    <img src={open_book_img}></img>
                    <img src={book_img}></img>
                    <img src={microscope_img}></img>
                    <img src={open_book_img}></img>
                    <img src={chemistry_img}></img>
                    <img src={book_img}></img>
                </div>
                <div className='signup-line-background'>
                    <img src={book_img}></img>
                    <img src={chemistry_img}></img>
                    <img src={microscope_img}></img>
                    <img src={open_book_img}></img>
                    <img src={microscope_img}></img>
                    <img src={chemistry_img}></img>
                </div>
                <div className='signup-line-background'>
                    <img src={microscope_img}></img>
                    <img src={open_book_img}></img>
                    <img src={chemistry_img}></img>
                    <img src={microscope_img}></img>
                    <img src={book_img}></img>
                    <img src={open_book_img}></img>
                </div>
            </div>
            <div className="signup-container">
                <div className="signup-form_area">
                    <p className="signup-title">Cadastro</p>
                    <form onSubmit={handleSubmit}>
                        <div className="signup-form_group">
                            <label className="signup-sub_title" htmlFor="email">Email</label>
                            <input name="email" placeholder="Digite seu email" className="signup-form_style" type="email" onChange={handleInputChange} required />
                        </div>
                        <div className="signup-form_group">
                            <label className="signup-sub_title" htmlFor="password">Senha</label>
                            <input name="password" placeholder="Digite sua senha" id="password" className="signup-form_style" type="password" onChange={(e) => {handlePasswordChange(e); handleInputChange(e)}} value={password} required/>
                            <p style={{marginBottom:"0px"}}>Senha <strong>{passwordStrength}</strong></p>
                        </div>
                        <div className="signup-form_group">
                            <label className="signup-sub_title" htmlFor="name">Nome</label>
                            <input name="name" placeholder="Digite seu nome" id="name" className="signup-form_style" type="text" onChange={handleInputChange} required/>
                        </div>
                        <div className="signup-form_group">
                            <label className="signup-sub_title" htmlFor="last_name">Sobrenome</label>
                            <input name="last_name" placeholder="Digite seu sobrenome" id="last_name" className="signup-form_style" type="text" onChange={handleInputChange} required/>
                        </div>
                        <div className='signup-select-group'>
                            <div className="signup-form_group">
                                <label className="signup-sub_title" htmlFor="role">Função</label>
                                <select name="role" id="role" className='signup-form_style' style={{backgroundColor: "white", width:"145px", cursor:"pointer"}} onChange={handleInputChange} >
                                    <option value="admin">Administrador</option>
                                    <option value="estudante">Estudante</option>
                                    <option value="professor">Professor</option>
                                </select>
                            </div>
                            <div className="signup-form_group">
                                <label className="signup-sub_title" htmlFor="gender">Gênero</label>
                                <select name="gender" id="gender" className='signup-form_style' style={{backgroundColor: "white", width:"148px", cursor:"pointer"}} onChange={handleInputChange}>
                                    <option value="m">Masculino</option>
                                    <option value="f">Feminino</option>
                                    <option value="n">Não informar</option>
                                </select>
                            </div>
                        </div>
                        <div className="signup-form_group">
                            <label className="signup-sub_title" htmlFor="profile_img">Foto de perfil</label>
                            <input type="file" name="profile_img" ref={fileInputRef} className="signup-file_input" onChange={handleFileChange} />
                            <button className='signup-btn_upload' onClick={handleButtonClick} id="btn-upload-img"><img src={upload_svg} alt="Upload"></img>Anexar foto de perfil</button>
                        </div>
                        <div>
                            <button className="signup-btn">REGISTRAR</button>
                            <p>Já possui uma conta? Faça seu<a className="signup-link" href="#" onClick={handleLinkClick}>login</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup;