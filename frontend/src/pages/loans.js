import "../assets/styles/loans.css";
import React, { useEffect } from 'react';

function Loans() {
    useEffect(() => {
        document.body.style.backgroundColor = 'beige'; 
        document.body.style.fontFamily = '"Poppins", sans-serif';
        return () => {
          document.body.style.backgroundColor = '';
        };
      }, []);
    return (
        <div className="loans">
            <div className="side-nav">
                <div className="link-pages">
                    <button className="btn-page">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                        </svg>
                        <p>Perfil</p>
                    </button>
                    <button className="btn-page">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-card-list" viewBox="0 0 16 16">
                        <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
                        <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                        </svg>
                        <p>Empréstimos</p>
                    </button>
                    <button className="btn-page">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                        </svg>
                        <p>Consulta</p>
                    </button>
                    <button className="btn-page">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                        </svg>
                        <p>Cadastro</p>
                    </button>
                    <button className="btn-page">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-lines-fill" viewBox="0 0 16 16">
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                        </svg>
                        <p>Usuários</p>
                    </button>
                    <button className="btn-page">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-code-slash" viewBox="0 0 16 16">
                        <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"/>
                        </svg>
                        <p>Criador</p>
                    </button>
                </div>
            </div>
            <div className="main">
                <h1>Seus empréstimos, Henrique!</h1>
                <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Data de empréstimo</th>
                        <th>Data de devolução</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>As brumas de avalon</td>
                        <td>Livro</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolver">Devolver</button></td>
                    </tr>
                    <tr>
                        <td>Guerra dos Tronos</td>
                        <td>Livro</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolver">Devolver</button></td>
                    </tr>
                    <tr>
                        <td>Microscópio eletrônico</td>
                        <td>Material</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolvido">Devolvido</button></td>
                    </tr>
                    <tr>
                        <td>Introdução à Engenharia de Produção</td>
                        <td>Livro</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolver">Devolver</button></td>
                    </tr>
                    <tr>
                        <td>Equipamento de Teste de Qualidade de Água</td>
                        <td>Material</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolvido">Devolvido</button></td>
                    </tr>
                    <tr>
                        <td>As brumas de avalon</td>
                        <td>Livro</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolver">Devolver</button></td>
                    </tr>
                    <tr>
                        <td>Guerra dos Tronos</td>
                        <td>Livro</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolver">Devolver</button></td>
                    </tr>
                    <tr>
                        <td>Microscópio eletrônico</td>
                        <td>Material</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolvido">Devolvido</button></td>
                    </tr>
                    <tr>
                        <td>Introdução à Engenharia de Produção</td>
                        <td>Livro</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolver">Devolver</button></td>
                    </tr>
                    <tr>
                        <td>Equipamento de Teste de Qualidade de Água</td>
                        <td>Material</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolvido">Devolvido</button></td>
                    </tr>
                    <tr>
                        <td>As brumas de avalon</td>
                        <td>Livro</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolver">Devolver</button></td>
                    </tr>
                    <tr>
                        <td>Guerra dos Tronos</td>
                        <td>Livro</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolver">Devolver</button></td>
                    </tr>
                    <tr>
                        <td>Microscópio eletrônico</td>
                        <td>Material</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolvido">Devolvido</button></td>
                    </tr>
                    <tr>
                        <td>Introdução à Engenharia de Produção</td>
                        <td>Livro</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolver">Devolver</button></td>
                    </tr>
                    <tr>
                        <td>Equipamento de Teste de Qualidade de Água</td>
                        <td>Material</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolvido">Devolvido</button></td>
                    </tr>
                    <tr>
                        <td>As brumas de avalon</td>
                        <td>Livro</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolver">Devolver</button></td>
                    </tr>
                    <tr>
                        <td>Guerra dos Tronos</td>
                        <td>Livro</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolver">Devolver</button></td>
                    </tr>
                    <tr>
                        <td>Microscópio eletrônico</td>
                        <td>Material</td>
                        <td>10/10/2023</td>
                        <td>10/11/2023</td>
                        <td><button className="btn-devolvido">Devolvido</button></td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default Loans;