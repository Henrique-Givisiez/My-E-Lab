import React from 'react';
import "../assets/styles/signup.css"
import book_img from '../assets/images/books-svgrepo-com.svg'
import open_book_img from '../assets/images/book-open-svgrepo-com.svg'
import microscope_img from '../assets/images/microscope-svgrepo-com.svg'
import chemistry_img from '../assets/images/lab-svgrepo-com.svg'
import { useNavigate } from "react-router-dom";

function Signup(){
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/login");
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
            <div className="container">
                <div className="form_area">
                    <p className="title">Cadastro</p>
                    <form>
                        <div className="form_group">
                            <label className="sub_title" for="login">Login</label>
                            <input name="login" placeholder="Digite seu login" className="form_style" type="text" />
                        </div>
                        <div className="form_group">
                            <label className="sub_title" for="passsword">Senha</label>
                            <input name="password" placeholder="Digite sua senha" id="password" className="form_style" type="password" required/>
                        </div>
                        <div className="form_group">
                            <label className="sub_title" for="password">Senha</label>
                            <input placeholder="Digite sua senha" id="password" className="form_style" type="password" required/>
                        </div>
                        <div className="form_group">
                            <label className="sub_title" for="password">Senha</label>
                            <input placeholder="Digite sua senha" id="password" className="form_style" type="password" required/>
                        </div>
                        <div className="form_group">
                            <label className="sub_title" for="password">Senha</label>
                            <input placeholder="Digite sua senha" id="password" className="form_style" type="password" required/>
                        </div>
                        <div className="form_group">
                            <label className="sub_title" for="password">Senha</label>
                            <input placeholder="Digite sua senha" id="password" className="form_style" type="password" required/>
                        </div>
                        <div>
                            <button className="btn">SIGN UP</button>
                            <p>Have an Account? <a className="link" href="">Login Here!</a></p><a className="link" href="">
                        </a></div><a className="link" href=""></a>
                    </form>
                </div>
                <a class="link" href=""></a>
            </div>
        </body>
    )
}

export default Signup;