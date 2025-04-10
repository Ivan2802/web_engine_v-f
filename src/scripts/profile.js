
// --------------------------------------------------------------
// При загрузке страницы

// ---- Получение данных пользователя для загрузке его данных
function get_user_data_for_profile(){
    data = {
        user: {'name': localStorage.getItem('name'), 'password': localStorage.getItem('password')}
    }
    return fetch('http://127.0.0.1:8000/api/get_user_data_for_profile',  {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
}

// ---- Генерация карточек сайтов
sitesContainer = document.querySelector('.profile_container_sites')
countMoreSites = document.querySelector('.profile_create_site_counter')
maxCountSites = 10
function generate_sites(data, sites_count){
    template = document.createElement('div')
    template.classList.add('profile_projects')
    for (let i = 0; i < sites_count; i++) {
        template.innerHTML += `<div class="profile_projects_card">
                    <div class="profile_projects_card_text">
                        <div class="profile_projects_card_title">${data[i].name}</div>
                        <div class="profile_projects_card_link"> <a href="${data[i].link}">${data[i].link.slice(54)}</a>  </div>
                    </div>
                    <div class="profile_projects_buttons">
                        <input type="button" value="Редактировать" class="button_green profile_projects_buttons_edit">
                        <input type="button" value="Настройка" class="button_blue profile_projects_buttons_setting">
                    </div>
                </div> `
    }
    sitesContainer.appendChild(template)
    countMoreSites.innerHTML = maxCountSites - sites_count
}


// ---- Настройка определенной страницы сайта
// ---- Загрузка имени в профиль при зарузке страницы
nameProfileField = document.querySelector('.header_profile_name')
window.addEventListener('load', () => {
    nameProfileField.innerHTML = atob(localStorage.getItem('name'))
    get_user_data_for_profile()
        .then((data) => {return data.json()})
        .then((data) => {
            countSites = data.length
            generate_sites(data, countSites)

            // ----- Настройка 
            btnEditSite = document.querySelectorAll('.profile_projects_buttons_edit')
            siteCardTitles = document.querySelectorAll('.profile_projects_card_title')

            btnSettings = document.querySelectorAll('.profile_projects_buttons_setting')
            for (let i = 0; i < countSites; i++) {
                btnSettings[i].addEventListener('click', () => {
                    window.location.href = './settings.html'
                    localStorage.setItem('list_id_site', i)
                    localStorage.setItem('site_name', siteCardTitles[i].innerHTML)
                })
                btnEditSite[i].addEventListener('click', () => {
                    window.location.href = './edit.html'
                    localStorage.setItem('site_name', siteCardTitles[i].innerHTML)
                })
            }

            // - Получение id сайта из БД
            // function get_site_id_fromDB(){
            //     data = {
            //         user: {'name': localStorage.getItem('name'), 'password': localStorage.getItem('password')},
            //         site_name: 
            //     }
            //     return fetch('')
            // }
            // btnEditSite = document.querySelectorAll('.profile_projects_buttons_edit')
            // for (let i = 0; i < countSites; i++) {
            //     btnEditSite[i].addEventListener('click', () => {
            //         get_user_data_for_profile()
            //             .then((data) => {return data.json()})
            //             .then((data) => {
            //                 console.log(data)
            //                 for (let i = 0; i < data.length; i++) {     
            //                 }
            //             })
            //         // get_site_id_fromDB()
            //         //     .then((data) => {return data.json()})
            //         //     .then((data) => {
            //         //         localStorage.setItem('id_site', data)
            //         //     })
            //         // window.location.href = './edit.html'
            //         // localStorage.setItem('list_id_site', i)
            //     })
            // }


        })
})


// ----- PROFILE -----
btnGoOut = document.querySelector('.header_buttons__button_out')

// Выход из аккаунта
function del_local_storage(){
    localStorage.removeItem('name')
    localStorage.removeItem('password')
}
btnGoOut.addEventListener('click', () => {
    del_local_storage()
    window.location.href = './index.html'
})


// ----- Переход на создание сайта
btnCInitSite = document.querySelector('.profile_create_site_button')
btnCInitSite.addEventListener('click', () => {
    if (+(countMoreSites.innerHTML) > 0){
        window.location.href = './site_init.html'
    }
})