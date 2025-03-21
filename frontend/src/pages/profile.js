import React, { useEffect,  useState, useRef } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import '../assets/styles/profile.css';
import SideBar from '../components/sidebar';
import showToastMessage from '../components/toast_message';
import profile_svg from '../assets/images/profile-icon.svg';
import pencil_square_svg from '../assets/images/pencil-square.svg';
function Profile() {
  const navigate = useNavigate();
  const [user_id, setUserId] = useState(0);
  const [login, setLogin] = useState('');
  const [user_name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [changePassword, setChangePassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formDisabled, setFormDisabled] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [role, setRole] = useState('');

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

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (!changePassword) {
            setChangePassword(true);
        } else {
            setChangePassword(false);
        }
    };
    
    const handleCancelButton = (e) => {
        e.preventDefault();
        setIsEditing(false);
        setFormDisabled(true);
        setNewImg(null);
    };
    
    const [formData, setFormData] = useState({
        new_name: '',
        new_last_name: '',
        new_gender: '',
        new_role: '',
        new_email: '',
        new_profile_img: '',
        new_password: '',
    });
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    
    const [newImg, setNewImg] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const imageURL = URL.createObjectURL(file); 
          setNewImg(imageURL); 
          setProfileImg(null);
        }
          setFormData({
            ...formData,
            new_profile_img: file,
        })
      };
    
    const [confirm_password, setPassword] = useState('');

    const handleShowSaveConfirm = (e) => {
        e.preventDefault();
        if (!isSaving) {
            setIsSaving(true);
        } else {   
            setIsSaving(false);
        }
      };

    const handleShowDeleteConfirm = (e) => {
        e.preventDefault();
        if (!isDeleting) {
          setIsDeleting(true);
        } else {   
          setIsDeleting(false);
        }
      };
      
    const handleBackgroundClick = (e) => {
        if (e.target.className === 'form-confirm-password-background') {
            setIsSaving(false);
            setIsDeleting(false);
            setChangePassword(false);
        }
    };
    
    const handleConfirmPassword = (e) => {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
        e.preventDefault();
        return fetch('http://127.0.0.1:5000/auth/confirm_password', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ confirm_password }),
        })
        .then((response) => response.json())
        .then((data) => {
            const success = data.success;
            setPassword('');
            return success;
        })
        .catch((error) => {
            console.error('Error:', error);
            setPassword('');
        });
    };

    const fileInputRef = useRef(null);

    const handleButtonClick = (e) => {
      if (isEditing){
        e.preventDefault();
        fileInputRef.current.click();
      }
    };

    const handleSaveButton = async (e) => {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
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
      
    const handleDeleteButton = async (e) => {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:5000/auth/delete/${user_id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
            });
        
            const result = await response.json();
        
            if (response.ok) {
                navigate("/login");
            } else {
                showToastMessage(result.msg, false);
            }
        } catch (error) {
            showToastMessage('Erro ao deletar perfil. Tente novamente.', false);
        }
    }
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
  
    const handleNewPasswordChange = (e) => {
      setNewPassword(e.target.value);
      checkPasswords(e.target.value, confirmNewPassword);
    };
  
    const handleConfirmNewPasswordChange = (e) => {
      setConfirmNewPassword(e.target.value);
      checkPasswords(newPassword, e.target.value);
    };
  
    const checkPasswords = (password1, password2) => {
      setPasswordsMatch(password1 === password2);
    };

    const handleLogoutButton = async (e) => {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
      e.preventDefault();
      try {
        const response = await fetch(`http://127.0.0.1:5000/auth/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
        });
    
        if (response.status == 204) {
            navigate("/login");
        }
    } catch (error) {
        showToastMessage('Erro ao sair da conta. Tente novamente.', false);
    }
    }
  
    const handleFormChangePassword = async (e) => {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
        e.preventDefault();
        if (passwordsMatch) {
            try {
                const formData = new FormData();
                formData.append('old_password', oldPassword);
                formData.append('new_password', newPassword);
                const response = await fetch(`http://127.0.0.1:5000/auth/change_password`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData,
                });
    
                const result = await response.json();
                if (response.ok) {
                    setIsEditing(false);
                    setIsSaving(false);
                    setFormDisabled(true); 
                    showToastMessage(result.msg, true); 
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    } else {
                    showToastMessage(result.msg, false);
                    }
                } catch (error) {
                    console.error('Erro ao atualizar senha:', error);
                    showToastMessage(error, false);
                }

    } else {
        showToastMessage('As senhas não coincidem', false);
    }};
      
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
        navigate("/login");
        return;
      }
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken?.sub);

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
                if (!newImg) {
                setProfileImg(profile_img);
                }

            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    });

    return (
<div className="Profile">
  <SideBar />
  <form id='form-update' className="main-profile">
  <h1>Perfil</h1>
  <div className="profile-img-div-container" style={{ position: 'relative' }}>
{profileImg ? (
  <img
    onClick={handleButtonClick}
    src={`data:image/jpeg;base64,${profileImg}`}
    alt="Profile"
    className="profile-img"
    onMouseEnter={() => isEditing && setIsHovered(true)}
    onMouseLeave={() => isEditing && setIsHovered(false)}
    style={{
      opacity: isEditing && isHovered ? 0.5 : 1,
      cursor: isEditing && isHovered ? "pointer" : "default",
    }}
  />
) : newImg ? (
  <img
    onClick={handleButtonClick}
    src={newImg}
    alt="Profile"
    className="profile-img"
    onMouseEnter={() => isEditing && setIsHovered(true)}
    onMouseLeave={() => isEditing && setIsHovered(false)}
    style={{
      opacity: isEditing && isHovered ? 0.5 : 1,
      cursor: isEditing && isHovered ? "pointer" : "default",
    }}
  />
) : (
  <img
    onClick={handleButtonClick}
    src={profile_svg}
    alt="Profile Icon"
    className="profile-icon-svg"
    onMouseEnter={() => isEditing && setIsHovered(true)}
    onMouseLeave={() => isEditing && setIsHovered(false)}
    style={{
      opacity: isEditing && isHovered ? 0.5 : 1,
      cursor: isEditing && isHovered ? "pointer" : "default",
    }}
  />
)}


    {isEditing && (
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{display: 'none'}}
        ref={fileInputRef}
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
      <input type="text" id="name-input" name="new_name" placeholder={user_name} disabled={formDisabled} onChange={handleInputChange} />
    </div>
    <div className="profile-div-container">
      <label htmlFor="last_name">Sobrenome</label>
      <input type="text" id="last_name-input" name="new_last_name" placeholder={lastName} disabled={formDisabled} onChange={handleInputChange} />
    </div>
    <div className="profile-div-container">
      <label htmlFor="gender">Gênero</label>
      {!isEditing ? (
        <input type="text" placeholder={gender} disabled={formDisabled} />
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
      <input type="email" id="email-input" name="new_email" placeholder={login} disabled={formDisabled} onChange={handleInputChange} />
    </div>
    <div className="container-btns">
      {isEditing && (
        <>
          <button className="btn-delete" id="btn-cancel" onClick={handleCancelButton}>
            Cancelar
          </button>
          <button className="btn-save" id="btn-save" onClick={handleShowSaveConfirm}>
            Salvar
          </button>
        </>
      )}
      {!isEditing && (
        <>
          <button className="btn-delete" id="btn-delete" onClick={handleLogoutButton} style={{marginRight:"10px"}}>
            Logout
          </button>
          <button className="btn-delete" id="btn-delete" onClick={handleShowDeleteConfirm}>
            Excluir conta
          </button>
          <button className="btn-edit" id="btn-edit" onClick={handleEditButton}>
            Editar
          </button>
          <button className="btn-change-password" id="btn-change-password" onClick={handleChangePassword}>
            Alterar senha
          </button>
        </>
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
              <button onClick={(e) =>{
                e.preventDefault();
                handleConfirmPassword(e).then((result) => {
                    result ? handleSaveButton(e) : showToastMessage("Senha incorreta! Tente novamente", result);
                });
              }} 
              className='btn-save'>
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}
      {isDeleting && (
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
              <button onClick={(e) => {
              e.preventDefault();
              handleConfirmPassword(e).then((result) => {
                  result ? handleDeleteButton(e) : showToastMessage("Senha incorreta! Tente novamente", result);
              });
            }} 
              className='btn-save'>
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}
      {changePassword && (
        <div className='form-confirm-password-background' onClick={handleBackgroundClick}>
          <div className='form-confirm-password-container'>
            <form className='form-confirm-password'>
              <label htmlFor="oldPassword">Digite a senha antiga</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <label htmlFor="newPassword">Digite a nova senha</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    required
                />
                <label htmlFor="confirm_new_password">Confirme a nova senha</label>
                <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={handleConfirmNewPasswordChange}
                    required
                />
                {!passwordsMatch && <p style={{ color: 'red' }}>As senhas não coincidem</p>}
              <button className='btn-save' onClick={handleFormChangePassword}>Salvar</button>
            </form>
          </div>
        </div>
      )
      }
    </div>
  </div>
</form>

</div>
    )
}

export default Profile;