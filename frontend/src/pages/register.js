import "../assets/styles/register.css";
import React, { useEffect, useState, useRef } from 'react';
import showToastMessage from '../components/toast_message';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import upload_svg from '../assets/images/upload.svg'
import SideBar from "../components/sidebar";

function Register() {
    const token = sessionStorage.getItem("access_token");
    const location = useLocation();
    const message = location.state?.message;
    const navigate = useNavigate();
    const [bookContainer, setBookContainer] = useState(true);
    const [bookFormData, setBookFormData] = useState({
        item_type: 'book',
        ISBN: '',
        title: '',
        description: '',
        category: '',
        date: '',
        author: '',
        location: '',
        img: null
    });
    const [materialFormData, setMaterialFormData] = useState({
        item_type: 'material',
        serial_number: '',
        name: '',
        description: '',
        category: '',
        date: '',
        location: '',
        img: null
    });

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

                
        fetch("http://127.0.0.1:5000/auth/token-valid", {
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
        .catch((error) => {
            console.error('Error:', error);
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (bookContainer) {
            setBookFormData({
                ...bookFormData,
                [name]: value,
            });
        } else {
            setMaterialFormData({
                ...materialFormData,
                [name]: value,
            });
        };
    };

    const fileInputRef = useRef(null);
    
    const handleButtonClick = (e) => {
        e.preventDefault();
            fileInputRef.current.click();
    };
    
    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value === "book") {
            setBookContainer(true);
        } else {
            setBookContainer(false);
        }
    };

    const handleFileChange = (e) => {
        if (bookContainer) {
            setBookFormData({
                ...bookFormData,
                img: e.target.files[0],
            });
        } else {
            setMaterialFormData({
                ...materialFormData,
                img: e.target.files[0],
            });
        };
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        if (bookContainer) {    
            Object.keys(bookFormData).forEach(key => {
                data.append(key, bookFormData[key]);
            });
        } else {
            Object.keys(materialFormData).forEach(key => {
                data.append(key, materialFormData[key]);
            });
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/items/register', {
                method: 'POST',
                body: data,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const result = await response.json();
            showToastMessage(result.msg, result.success);
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            showToastMessage('Erro ao enviar formulário. Tente novamente.', false)
        }
    };

    return (

        <div className="register">
            <SideBar />
            <div className="main-register">
                <h1 style={{marginLeft:'15px'}}>Cadastrar item</h1>
                {bookContainer ? (
                    <form style={{width:"fit-content"}} onSubmit={handleSubmit}>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="item_type">Tipo</label>
                            <select onChange={handleSelectChange} name="item_type" className='register-form_style' style={{backgroundColor: "white", width: "725px", cursor:"pointer"}}>
                                <option value="book">Livro</option>
                                <option value="material">Material</option>
                            </select>
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="ISBN">ISBN</label>
                        <input name="ISBN" className="register-form_style" type="text" onChange={handleInputChange} required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="title">Titulo</label>
                        <input name="title" className="register-form_style" type="text" onChange={handleInputChange} required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="category">Categoria</label>
                        <input name="category" className="register-form_style" type="text" onChange={handleInputChange} required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="author">Autor</label>
                        <input name="author" className="register-form_style" type="text" onChange={handleInputChange} required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="location">Localização</label>
                        <input name="location" className="register-form_style" type="text" onChange={handleInputChange} required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="description">Descrição</label>
                        <textarea name="description" className="register-form_style" onChange={handleInputChange} required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="date">Data de Aquisição</label>
                        <input name="date" className="register-form_style" type="date" onChange={handleInputChange} required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="book_cover">Capa do Livro</label>
                        <input type="file" name="book_cover" ref={fileInputRef} className="signup-file_input" onChange={handleFileChange}/>
                        <button className='register-btn_upload' onClick={handleButtonClick}><img src={upload_svg} alt="Upload"></img>Anexar imagem</button>
                    </div>
                    <div className="register-btn-div">
                        <button className="register-btn" type="submit">CADASTRAR</button>
                    </div>
                </form>
        ): (
                <form style={{width:"fit-content"}} onSubmit={handleSubmit}>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="item_type">Tipo</label>
                            <select onChange={handleSelectChange} name="item_type" className='register-form_style' style={{backgroundColor: "white", width: "725px", cursor:"pointer"}}>
                                <option value="book">Livro</option>
                                <option value="material">Material</option>
                            </select>
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="serial_number">Número de Série</label>
                        <input name="serial_number" className="register-form_style" type="text" onChange={handleInputChange} required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="name">Nome</label>
                        <input name="name" className="register-form_style" type="text" onChange={handleInputChange} required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="description">Descrição</label>
                        <textarea name="description" className="register-form_style" onChange={handleInputChange} required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="category">Categoria</label>
                        <input name="category" className="register-form_style" type="text" onChange={handleInputChange} required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="location">Localização</label>
                        <input name="location" className="register-form_style" type="text" onChange={handleInputChange} required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="date">Data de Aquisição</label>
                        <input name="date" className="register-form_style" type="date" onChange={handleInputChange} required />
                    </div>
                    <div className="register-form_group">
                        <label className="register-sub_title" htmlFor="book_cover">Foto do Material</label>
                        <input type="file" name="book_cover" ref={fileInputRef} className="signup-file_input" onChange={handleFileChange}/>
                        <button className='register-btn_upload' onClick={handleButtonClick}><img src={upload_svg} alt="Upload"></img>Anexar imagem</button>
                    </div>
                    <div className="register-btn-div">
                        <button className="register-btn" type="submit">CADASTRAR</button>
                    </div>
            </form>
        )}
            </div>
        </div>
    )
}

export default Register;