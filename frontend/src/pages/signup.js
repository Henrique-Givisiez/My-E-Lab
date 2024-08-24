import React, {useRef, useState} from 'react';
import "../assets/styles/signup.css"
import book_img from '../assets/images/books-svgrepo-com.svg'
import open_book_img from '../assets/images/book-open-svgrepo-com.svg'
import microscope_img from '../assets/images/microscope-svgrepo-com.svg'
import chemistry_img from '../assets/images/lab-svgrepo-com.svg'
import upload_svg from '../assets/images/upload.svg'
import { useNavigate } from "react-router-dom";

function Signup(){
    const navigate = useNavigate();
    const handleLinkClick = () => {
        navigate("/login");
    }

    const fileInputRef = useRef(null);

    const handleButtonClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };


    const [formData, setFormData] = useState({
        login: '',
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
                navigate("/login", { state: { message: result.msg } });
            } else {
                alert(`Erro: ${result.msg}`);
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
        }
    };
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
                            <label className="signup-sub_title" htmlFor="login">Login</label>
                            <input name="login" placeholder="Digite seu login" className="signup-form_style" type="text" onChange={handleInputChange} required />
                        </div>
                        <div className="signup-form_group">
                            <label className="signup-sub_title" htmlFor="password">Senha</label>
                            <input name="password" placeholder="Digite sua senha" id="password" className="signup-form_style" type="password" onChange={handleInputChange} required/>
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