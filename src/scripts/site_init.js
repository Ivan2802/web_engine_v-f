
// --------------------------------------------------------------
// При загрузке страницы
// ---- Загрузка имени в профиль при зарузке страницы
nameProfileField = document.querySelector('.header_profile_name')
window.addEventListener('load', () => {
    nameProfileField.innerHTML = atob(localStorage.getItem('name'))
})

// ----- SITE INIT -----
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

// ----- Назад кнопка
btnGoBack = document.querySelector('.init_button_back_input')

btnGoBack.addEventListener('click', () => {
    window.location.href = './profile.html'
})
// ----- Вкладки выбора шаблона
function openTab(tab){
    tab.classList.remove('disactive')
    tab.classList.add('active')
}
function closeTab(tabs){
    tabs.forEach(tab => {
        tab.classList.remove('active')
        tab.classList.add('disactive')
    })
}
blog = document.querySelector('.init_blog')
blog_view = document.querySelector('.init_content_view_blog')
anketa = document.querySelector('.init_anketa')
anketa_view = document.querySelector('.init_content_view_anketa')
portfolio = document.querySelector('.blog_portfolio')
portfolio_view = document.querySelector('.init_content_view_portfolio')
multilink = document.querySelector('.blog_multilink')
multilink_view = document.querySelector('.init_content_view_multilink')

blog.addEventListener('click', () => {
    openTab(blog_view)
    closeTab([anketa_view, portfolio_view, multilink_view])
    blog.classList.add('selected_grey')
    anketa.classList.remove('selected_grey')
    portfolio.classList.remove('selected_grey')
    multilink.classList.remove('selected_grey')
})
anketa.addEventListener('click', () => {
    openTab(anketa_view)
    closeTab([blog_view, portfolio_view, multilink_view])
    anketa.classList.add('selected_grey')
    blog.classList.remove('selected_grey')
    portfolio.classList.remove('selected_grey')
    multilink.classList.remove('selected_grey')
})
portfolio.addEventListener('click', () => {
    openTab(portfolio_view)
    closeTab([anketa_view, blog_view, multilink_view])
    portfolio.classList.add('selected_grey')
    anketa.classList.remove('selected_grey')
    blog.classList.remove('selected_grey')
    multilink.classList.remove('selected_grey')
})
multilink.addEventListener('click', () => {
    openTab(multilink_view)
    closeTab([anketa_view, portfolio_view, blog_view])
    multilink.classList.add('selected_grey')
    anketa.classList.remove('selected_grey')
    portfolio.classList.remove('selected_grey')
    blog.classList.remove('selected_grey')
})

// ----- Отправить данные на создание сайта

function add_site_to_db(){
    data = {
        name: siteName.value,
        template: 'template',
        link: 'https://your_easy_site/name.html',
        status: 'Local',
        user: {'name': localStorage.getItem('name'), 'password': localStorage.getItem('password')}
    }
    return fetch('http://127.0.0.1:8000/api/create_site', {
        method: 'POST',
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
        // mode: 'no-cors'
    })
}
// ----- Сбор данных сайта
siteName = document.querySelector('.init_content_input_name_input')
siteSelectedTemplate = document.querySelector('.selected_grey')

btnCreateSite = document.querySelector('.init_content_button_init ')
btnCreateSite.addEventListener('click', () => {
    add_site_to_db()
        .then(() => {
            window.location.href = './profile.html'
        })
})