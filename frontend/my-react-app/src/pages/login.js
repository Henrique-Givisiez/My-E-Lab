import React from 'react';
import "../assets/styles/login.css"
import book_img from '../assets/images/books-svgrepo-com.svg'
import open_book_img from '../assets/images/book-open-svgrepo-com.svg'
import microscope_img from '../assets/images/microscope-svgrepo-com.svg'
import chemistry_img from '../assets/images/lab-svgrepo-com.svg'
import { useNavigate } from "react-router-dom";

function Signup(){
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/");
    }
    return (
        <body>
            <div className='images-background'>
                <div className='line-background'>
                    <img src={open_book_img}></img>
                    <img src={book_img}></img>
                    <img src={microscope_img}></img>
                    <img src={open_book_img}></img>
                    <img src={chemistry_img}></img>
                    <img src={book_img}></img>
                </div>
                <div className='line-background'>
                    <img src={book_img}></img>
                    <img src={chemistry_img}></img>
                    <img src={microscope_img}></img>
                    <img src={open_book_img}></img>
                    <img src={microscope_img}></img>
                    <img src={chemistry_img}></img>
                </div>
                <div className='line-background'>
                    <img src={microscope_img}></img>
                    <img src={open_book_img}></img>
                    <img src={chemistry_img}></img>
                    <img src={microscope_img}></img>
                    <img src={book_img}></img>
                    <img src={open_book_img}></img>
                </div>
            </div>
            <div className='container'>
                <div className='container-header'>
                    <p>Login</p>
                </div>
                <form className='form-login'>
                    <div className='auth-container'>
                        <label htmlFor='login'>
                            <span>Login</span>
                            <span style={{ color: "red"}}> *</span>
                        </label>
                        <input type='text' name='login' className='login-field 'required />
                        <label htmlFor='password'>
                            <span>Senha</span>
                            <span style={{ color: "red"}}> *</span>
                        </label>
                        <input type='password' name='password' className='password-field' required/>
                    </div>
                    <button type='submit'>Registrar</button>
                    <p>Ainda não possui uma conta? Faça o <a onClick={handleClick}>cadastro</a></p>
                </form>
            </div>
        </body>
    )
}

export default Signup;