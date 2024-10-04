import React, {useState, useEffect} from 'react';
import "../assets/styles/login.css"
import book_img from '../assets/images/books-svgrepo-com.svg'
import open_book_img from '../assets/images/book-open-svgrepo-com.svg'
import microscope_img from '../assets/images/microscope-svgrepo-com.svg'
import chemistry_img from '../assets/images/lab-svgrepo-com.svg'
import { useNavigate, useLocation } from "react-router-dom";
import showToastMessage from '../components/toast_message';
import { jwtDecode } from "jwt-decode";

function Login(){
    const navigate = useNavigate();
    const handleLinkClick = () => {
        navigate("/");
    }

    const location = useLocation();
    const message = location.state?.message;
    const success = location.state?.success;

    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = JSON.stringify(formData);

        try {
            const response = await fetch('http://127.0.0.1:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: data,
            });

            const result = await response.json();

            if (response.status === 200) {
                const token = result.access_token;
                sessionStorage.setItem("access_token", token);
                const decodedToken = jwtDecode(token);
                if (decodedToken) {
                    const role = decodedToken.role;
                    const email = decodedToken.email;
                    const user_id = decodedToken.sub;
                    const user_name = decodedToken.name;
                    navigate("/loans", { state: {
                        message: result.msg
                        , role: role
                        , email: email
                        , user_id: user_id
                        , user_name: user_name
                    } });
                } 
            } else {
                showToastMessage(result.msg, result.access_token);
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
        }
    };

    useEffect(() => {
        if (message !== undefined && success !== undefined) {
            showToastMessage(message, success);  
        }
    }, [message, success]); 

    return (
        <div className='login-body'>
            <div className='login-images-background'>
                <div className='login-line-background'>
                    <img src={open_book_img}></img>
                    <img src={book_img}></img>
                    <img src={microscope_img}></img>
                    <img src={open_book_img}></img>
                    <img src={chemistry_img}></img>
                    <img src={book_img}></img>
                </div>
                <div className='login-line-background'>
                    <img src={book_img}></img>
                    <img src={chemistry_img}></img>
                    <img src={microscope_img}></img>
                    <img src={open_book_img}></img>
                    <img src={microscope_img}></img>
                    <img src={chemistry_img}></img>
                </div>
                <div className='login-line-background'>
                    <img src={microscope_img}></img>
                    <img src={open_book_img}></img>
                    <img src={chemistry_img}></img>
                    <img src={microscope_img}></img>
                    <img src={book_img}></img>
                    <img src={open_book_img}></img>
                </div>
            </div>
            <div className="login-container">
                <div className="login-form_area">
                    <p className="login-title">Login</p>
                    <form onSubmit={handleSubmit}>
                        <div className="login-form_group">
                            <label className="login-sub_title" htmlFor="email">Email</label>
                            <input name="email" placeholder="Digite seu email" className="login-form_style" type="email" onChange={handleInputChange} required />
                        </div>
                        <div className="login-form_group">
                            <label className="login-sub_title" htmlFor="password">Senha</label>
                            <input name="password" placeholder="Digite sua senha" id="password" className="login-form_style" type="password" onChange={handleInputChange} required/>
                        </div>
                        <div>
                            <button className="login-btn">ENTRAR</button>
                            <p>Não possui uma conta? Faça seu<a className="login-link" href="#" onClick={handleLinkClick}>cadastro</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;