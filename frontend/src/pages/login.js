import React, {useRef} from 'react';
import "../assets/styles/login.css"
import book_img from '../assets/images/books-svgrepo-com.svg'
import open_book_img from '../assets/images/book-open-svgrepo-com.svg'
import microscope_img from '../assets/images/microscope-svgrepo-com.svg'
import chemistry_img from '../assets/images/lab-svgrepo-com.svg'
import { useNavigate, useLocation } from "react-router-dom";

function Signup(){
    const navigate = useNavigate();
    const handleLinkClick = () => {
        navigate("/");
    }
    const location = useLocation();
    const message = location.state?.message;

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
                    {message && <p>{message}</p>}
                    <form>
                        <div className="login-form_group">
                            <label className="login-sub_title" htmlFor="login">Login</label>
                            <input name="login" placeholder="Digite seu login" className="login-form_style" type="text" required />
                        </div>
                        <div className="login-form_group">
                            <label className="login-sub_title" htmlFor="passsword">Senha</label>
                            <input name="password" placeholder="Digite sua senha" id="password" className="login-form_style" type="password" required/>
                        </div>
                        <div>
                            <button className="login-btn">ENTRAR</button>
                            <p>Não possui uma conta? Faça seu<a className="login-link" href="" onClick={handleLinkClick}>cadastro</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup;