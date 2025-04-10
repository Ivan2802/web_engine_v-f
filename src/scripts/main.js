
// ---------------------------------------------------
// ---- MAIN -----

btnCreateSite = document.querySelector('.main_button')
btnSendFeedback = document.querySelector('.contacts_content_form_button')

btnSignIn = document.querySelector('.header_buttons__button_enter')
popUpSignIn = document.querySelector('.pop_up_signin')
btnCrossSignIn = document.querySelector('.sigin_window_cross')
sigin_name = document.querySelector('.sigin_window_inputs_name')
sigin_password = document.querySelector('.sigin_window_inputs_password')
sigin_reg_user_btn = document.querySelector('.sigin_window_inputs_button')


btnRegister = document.querySelector('.header_buttons__button_register')
popUpRegister = document.querySelector('.pop_up_register')
btnCrossRegister = document.querySelector('.register_window_cross')
register_name = document.querySelector('.register_window_inputs_name')
register_email = document.querySelector('.register_window_inputs_email')
register_password = document.querySelector('.register_window_inputs_password')
register_reg_user_btn = document.querySelector('.register_window_inputs_button')

// Функции открытия-закрытия попапов, очистка полей
function openPopUp(popup){
    popup.classList.remove('disactive')
    popup.classList.add('active')
}
function closePopUp(popup){
    popup.classList.remove('active')
    popup.classList.add('disactive')
}
function clearFields(fields){
    fields.forEach(field => {
        field.value = ''
    })
}

// Кнопка открытия окна регистрации
btnRegister.addEventListener('click', () => {
    openPopUp(popUpRegister)
})
btnCrossRegister.addEventListener('click', () => {
    closePopUp(popUpRegister)
    clearFields([register_name, register_email, register_password])
})

// Кнопка открытия окна входа
// ----- Проверка пользователя в LocalStorage
function check_local_storage(){
    if (localStorage.getItem('name') != null && localStorage.getItem('password') != null){
        return true
    } else {
        return false
    }
}
btnSignIn.addEventListener('click', () => {
    if (!check_local_storage()){
        openPopUp(popUpSignIn)
    } else {
        window.location.href = 'profile.html'
    }
})
btnCrossSignIn.addEventListener('click', () => {
    closePopUp(popUpSignIn)
    clearFields([sigin_name, sigin_password])
})

// Кнопка создать сайт
btnCreateSite.addEventListener('click', () => {
    if (!check_local_storage()){
        openPopUp(popUpRegister)
    } else {
        window.location.href = 'profile.html'
    }
})





// Регистрация пользователя в окне
// ----- Валидация полей ввода
function validate_fields_r(){
    if (register_name.value != '' &&
        register_email.value != '' &&
        register_password.value != ''){
        return true
    }
    else{ return false }
}
// ----- Обработка ошибки валидации
errorMsg_r = document.querySelector('.pop_up_error_r')
function error_r(){
    errorMsg_r.innerHTML = 'Данные введены некорректно!'
    setTimeout(()=>{
        errorMsg_r.innerHTML = ''
    }, 2000)
}
// ----- Показ окна об успешной регистрации и закрытие
popUpSuc = document.querySelector('.pop_up_successfull')
btnCrossSuc = document.querySelector('.successfull_window_cross')
btnCrossSuc_GREEN = document.querySelector('.successfull_window_inputs_button')
function show_ok_r(){
    openPopUp(popUpSuc)
}
btnCrossSuc.addEventListener('click', () => {
    closePopUp(popUpSuc)
})
btnCrossSuc_GREEN.addEventListener('click', () => {
    closePopUp(popUpSuc)
})
// ----- Главная функция отправки данных на сервер
function add_user(){
    user_data = {
        name: register_name.value,
        email: register_email.value,   
        password: register_password.value    
    }
    return fetch('http://127.0.0.1:8000/api/add_user', {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(user_data)
    })
}

// ----- Нажатие на кнопку регистрации
register_reg_user_btn.addEventListener('click', async () => {
    if (true){
        if (validate_fields_r()){
            add_user()
            clearFields([register_name, register_email, register_password])
            closePopUp(popUpRegister)
            show_ok_r()
        }
        else{
            return error_r()
        }
    }
    else {
        console.log('error')
    }
})



// Вход пользователя в окне
// ----- Валидация полей ввода
function validate_fields_s(){
    if (sigin_name.value != '' &&
        sigin_password.value != ''){
        return true
    }
    else{ return false }
}
// ----- Обработка ошибки валидации
errorMsg_s = document.querySelector('.pop_up_error_s')
function error_s(){
    errorMsg_s.innerHTML = 'Данные введены некорректно!'
    setTimeout(()=>{
        errorMsg_s.innerHTML = ''
    }, 2000)
}
// ----- Главная функция отправки данных на сервер
function get_user(){
    user_data = {
        name: sigin_name.value,
        password: sigin_password.value    
    }
    return fetch('http://127.0.0.1:8000/api/get_user', {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(user_data)
    })
}
// ----- Добавление пользователья в LocalStorage при успешном входе
function add_to_local_storage(data){
    localStorage.setItem('name', data.name)
    localStorage.setItem('password', data.password)

}
// ----- Пользователья нет - окно ошибки
errPopUp = document.querySelector('.pop_up_err')
errCrossPopUp = document.querySelector('.err_window_cross')
errCrossPopUp.addEventListener('click', () => {
    closePopUp(errPopUp)
    openPopUp(popUpSignIn)
})
// ----- Продолжить после ошибки
btnError = document.querySelector('.err_window_inputs_button')
btnError.addEventListener('click', () => {
    closePopUp(errPopUp)
    openPopUp(popUpSignIn)
})
// ----- Нажатие на кнопку входа
sigin_reg_user_btn.addEventListener('click', () => {
    if (validate_fields_s()){
        get_user()
            .then((data) => {return data.json()})
            .then((data) => {
                if (data.message == 'error'){
                    openPopUp(errPopUp)
                    closePopUp(popUpSignIn)
                    clearFields([sigin_name, sigin_password])
                } else {
                    add_to_local_storage(data)
                    clearFields([sigin_name, sigin_password])
                    closePopUp(popUpSignIn)
                    window.location.href = 'profile.html'
                }
            })
    }
    else{
        return error_s()
    }
})

// ----- Существует ли пользователь
// function is_user_exist(){
//     user_data = {
//         email: register_email.value,   
//     }
//     fetch('http://127.0.0.1:8000/api/check_is_user_exist', {
//         method: 'POST',
//         headers: { "Accept": "application/json", "Content-Type": "application/json" },
//         body: JSON.stringify(user_data)
//     })
//         .then((data) => {return data.json()})
//         .then((data) => {
//             console.log(data.message == 'error')
//             if (data.message == 'error'){
//                 return false
//             } else {
//                 return true
//             }
//         })
// }