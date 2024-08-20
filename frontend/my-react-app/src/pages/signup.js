import React from 'react';
import "../assets/styles/signup.css"
import book_img from '../assets/images/books-svgrepo-com.svg'
import open_book_img from '../assets/images/book-open-svgrepo-com.svg'
import microscope_img from '../assets/images/microscope-svgrepo-com.svg'
import chemistry_img from '../assets/images/lab-svgrepo-com.svg'
function Signup(){
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
                    <p>Cadastro</p>
                </div>
                <form className='form-signup'>
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
                    <div className='name-last-name-container'>
                        <div className='name-container'>
                            <label htmlFor='name'>
                                <span>Nome</span>
                                <span style={{ color: "red"}}> *</span>
                            </label>
                            <input type='text' name='name' className='name-field' required/>
                        </div>
                        <div className='last-name-container'>
                            <label htmlFor='last_name'>
                                <span>Sobrenome</span>
                                <span style={{ color: "red"}}> *</span>
                            </label>
                            <input type='text' name='last_name' className='last-name-field' required/>
                        </div>
                    </div> 
                    <div className='select-container'>
                        <div className='select-value'>
                            <label htmlFor='role'>
                                <span>Função</span>
                                <span style={{ color: "red"}}> *</span>
                            </label>
                            <select name="role">
                                <option value="administrador">Administrador</option>
                                <option value="professor">Professor</option>
                                <option value="estudante">Estudante</option>
                            </select>
                        </div>
                        <div className='select-value'>
                            <label htmlFor='gender'>
                                <span>Gênero</span>
                                <span style={{ color: "red"}}> *</span>
                            </label>
                            <select name="gender">
                                <option value="m">Masculino</option>
                                <option value="f">Feminino</option>
                                <option value="n">Não informar</option>
                            </select>
                        </div>
                    </div>
                    <div className='profile-img-container'>
                        <label htmlFor='profile_img'>Foto de perfil</label><br/>
                        <input type='file' name='profile_img'/>
                    </div>
                <button type='submit'>Registrar</button>
                <p>Já possui uma conta? Faça o <a href=''>login</a></p>
                </form>
            </div>
        </body>
    )
}

export default Signup;