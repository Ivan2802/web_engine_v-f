// --------------------------------------------------------------
// При загрузке страницы
let PAGE_DATA = [] // = Массив для отправки на сервер при сохранении
let SITE_ID = 0
let INNER_PAGE = ''
let MAX_BLOCK_INDEX = 0

const parser = new DOMParser()

// Структура PAGE_DATA лога
// [
//     {
//         'site_name':'name',
//         'block_id': 0,
//         'content': {
//              'type': 'add',
//              'what': ``
//          }
//     }
// ]


// ПРИ ИЗМЕНЕИЕ БЛОКОВ ЗАНОСИТЬ ЭТИ ИЗМЕНЕНИЯ В PAGE_DATA

// ----- Получение id сайта из БД sites
function get_site_id_fromDB(){
    data = {
        name: localStorage.getItem('site_name'),
        username: localStorage.getItem('name'),
        password: localStorage.getItem('password')
    }
    return fetch('http://127.0.0.1:8000/api/get_site_id_fromDB', {
        method: 'POST', 
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
}
window.addEventListener('load', () => {
    get_site_id_fromDB()
        .then((data) => {
            return data.json()})
        .then((data) => {
            SITE_ID = data.id
            // ДОбавление сущ блоков в PAGE_DATA
            BLOCK_COUNTER = 0
            for (let i = 0; i < data.page.length; i++) {
                PAGE_DATA.push({
                    'block_id': BLOCK_COUNTER,
                    'content': {
                        'type': 'add',
                        'what': data.page[i]
                    }
                })
                BLOCK_COUNTER += 1
            }

            sectionForBlocks = document.querySelector('.edit_wrapper')
            // Вставка загруженных блоков с сервера
            for (let i = 0; i < PAGE_DATA.length; i++) {

                html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')
                console.log(html_block)
                html_block.setAttribute('id', PAGE_DATA[i].block_id)
                sectionForBlocks.append(html_block)
            }
            MAX_BLOCK_INDEX = PAGE_DATA.length
            vizSetBlockBTN()
            
        })
})
// ----- Функции открытия-закрытия попапов / скрытие / показ
function show(el, stat = 0){
    if (!stat){
        el.classList.remove('not_visible')
        el.classList.add('visible')
    } if (stat == 1){
        el.classList.remove('left')
        el.classList.add('right')
    }
}
function hide(el, stat = 0){
    if (!stat){
        el.classList.remove('visible')
        el.classList.add('not_visible')
    } if (stat == 1){
        el.classList.remove('right')
        el.classList.add('left')
    }
}
function openPopUp(popup){
    popup.classList.remove('disactive')
    popup.classList.add('active')
}
function closePopUp(popup){
    popup.classList.remove('active')
    popup.classList.add('disactive')
}

// ----- Назад
btnBack = document.querySelector('.header_buttons__button_back')
isSavePopUp = document.querySelector('.pop_up_save')
btnBack.addEventListener('click', () => {
    openPopUp(isSavePopUp)
})
// ----- Настройка
btnSetSite = document.querySelector('.header_buttons__button_set')
btnSetSite.addEventListener('click', () => {
    openPopUp(isSavePopUp)
})
// ----- Закрыть
btnClosePopUp = document.querySelector('.save_window_cross')
btnClosePopUp.addEventListener('click', () => {
    closePopUp(isSavePopUp)
})

// ------------------------
// ---- Всплытие кнопок при наведении на блок -----
editButtons = document.querySelector('.edit_set_btns')
addNewBlockBtn = document.querySelector('.edit_main_addbtn')



REDACTED_BLOCK_INDEX = 0
function vizSetBlockBTN(){
    mainBlocks = document.querySelectorAll('.block_to_edit')
    for (let i = 0; i < mainBlocks.length; i++) {
        mainBlocks[i].addEventListener('click', () => {

            // Добавлять значение BLOCK_COUNTER

            show(editButtons)
            REDACTED_BLOCK_INDEX = i
            
            mainBlocks[i].style.border = '5px solid rgb(8, 153, 8)';
            for (let j = 0; j < mainBlocks.length; j++) {
                if(j==i){continue}
                else{
                    mainBlocks[j].style.border = '1px solid #000';
                }               
            }
        } )
    }
}



// ----------------------------------
// Функционал кнопок каждого отдельного блока
crossBTN_block = document.querySelector('.edit_set_btns_right_cross')
crossBTN_block.addEventListener('click', () => {

    id_to_del = mainBlocks[REDACTED_BLOCK_INDEX].id
    new_PAGE_DATA = []
    for (let i = 0; i < PAGE_DATA.length; i++) {
        if (PAGE_DATA[i].block_id != id_to_del){
            new_PAGE_DATA.push(PAGE_DATA[i])
        }
    }
    PAGE_DATA = new_PAGE_DATA


    mainBlocks[REDACTED_BLOCK_INDEX].remove()
    vizSetBlockBTN()
    if (mainBlocks.length == 0){
        hide(editButtons)
    }
})
moveDownBTN_block = document.querySelector('.edit_set_btns_right_arrow_down')
moveDownBTN_block.addEventListener('click', () => {
    rplsed = sectionForBlocks.replaceChild(mainBlocks[REDACTED_BLOCK_INDEX], mainBlocks[REDACTED_BLOCK_INDEX + 1])
    id_to_up = rplsed.id
    id_to_down = mainBlocks[REDACTED_BLOCK_INDEX].id


    new_PAGE_DATA = []
    for (let i = 0; i < mainBlocks.length; i++) {
        if (mainBlocks[i].id != id_to_down && mainBlocks[i].id != id_to_up){
            new_PAGE_DATA.push(PAGE_DATA[i])
        }
        if(mainBlocks[i].id == id_to_down){
            new_PAGE_DATA.push(PAGE_DATA[i + 1])
            new_PAGE_DATA.push(PAGE_DATA[i])
        }
    }
    PAGE_DATA = new_PAGE_DATA

    sectionForBlocks.insertBefore(rplsed, mainBlocks[REDACTED_BLOCK_INDEX])
    REDACTED_BLOCK_INDEX += 1
    vizSetBlockBTN()
})
moveUpBTN_block = document.querySelector('.edit_set_btns_right_arrow_up')
moveUpBTN_block.addEventListener('click', () => {
    rplsed = sectionForBlocks.replaceChild(mainBlocks[REDACTED_BLOCK_INDEX], mainBlocks[REDACTED_BLOCK_INDEX - 1])
    id_to_down = rplsed.id
    id_to_up = mainBlocks[REDACTED_BLOCK_INDEX].id


    new_PAGE_DATA = []
    for (let i = 0; i < mainBlocks.length; i++) {
        if (mainBlocks[i].id != id_to_up && mainBlocks[i].id != id_to_down){
            new_PAGE_DATA.push(PAGE_DATA[i])
        }
        if(mainBlocks[i].id == id_to_down){
            new_PAGE_DATA.push(PAGE_DATA[i + 1])
            new_PAGE_DATA.push(PAGE_DATA[i])
        }
    }
    PAGE_DATA = new_PAGE_DATA

    mainBlocks[REDACTED_BLOCK_INDEX].after(rplsed)
    REDACTED_BLOCK_INDEX -= 1
    vizSetBlockBTN()
})

// ----------------------------------
// НАСТРОЙКА КОНТЕНТА И БЛОКА
setContent = document.querySelector('.set_content')
setContentCross = document.querySelector('.set_content_img_cross')
setContentBtn = document.querySelector('.edit_set_btns_left_content')
setContentBtn.addEventListener('click', () => {
    if (mainBlocks[REDACTED_BLOCK_INDEX].classList[0] == 'picture_b'){
        sc_block = document.querySelector('.set_content')
        sc_block.innerHTML = `
        <img src="images/icons/cross.png" alt="cross" class="set_content_img_cross_pic">
        <div class="set_content_title">Настройка контента</div>
        <div class="set_content_inps">
            <div class="set_content_inps_titile">
                <p class="set_content_inps_titile_text">Загрузить картинку</p>
                <input type="file" class="set_content_inps_pic_inp set_inp">
            </div>
        </div>
        <input type="button" value="Сохранить" class="set_content_save button_green"></input>

        <style>.set_content_img_cross_pic{
        position: absolute;
        right: 10px;
        top: 10px;
        }
        .set_content_img_cross_pic:hover{
            cursor: pointer;
        }</style>
        `
        setContentCross_pic = document.querySelector('.set_content_img_cross_pic')
        setContentCross_pic.addEventListener('click', () => {hide(setContent, 1)})
        show(setContent, 1)

    
        FILE_NAME = ''
        async function uploadImage() {
            const fileInput = document.querySelector('.set_content_inps_pic_inp');
            const file = fileInput.files[0];
            FILE_NAME = file.name
            
            if (!file) {
                alert("Выберите файл!");
                return;
            }
        
            const formData = new FormData();
            formData.append("file", file); 
        
            try {
                const response = await fetch("http://127.0.0.1:8000/api/upload-image", {
                    method: "POST",
                    body: formData,
                });
        
                const result = await response.json();
            } catch (error) {
                console.error("Ошибка:", error);
                alert("Ошибка загрузки файла");
            }
        }

        savePictureBTN = document.querySelector('.set_content_save')
        savePictureBTN.addEventListener('click', () => {
            uploadImage()
            for (let i = 0; i < PAGE_DATA.length; i++) {
                if(PAGE_DATA[i].block_id == mainBlocks[REDACTED_BLOCK_INDEX].id){
                    
                    html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')

                    blokToEditURLForImage = document.querySelectorAll('.block_to_edit')[REDACTED_BLOCK_INDEX]
                    console.log('FILE_NAME = ', FILE_NAME)
                    blokToEditURLForImage.querySelector('img').src = `/home/monkey/Projects/web_engine-main/src/user_images/${FILE_NAME}`

                    new_picture = `<div class="picture_b block_to_edit" id="_"  style="cursor: pointer;border: 0.5px solid black;background-color: rgb(255, 255, 255);padding: 20px;align-items: center;"><h1 style="text-align: center; font-size: 30px; margin-bottom:18px;"></h1><img src="/home/monkey/Projects/web_engine-main/src/user_images/${FILE_NAME}" style="display:block; margin:0 auto;" alt=""></div>\n`
                    PAGE_DATA[i].content.what = new_picture
    
                }
            }
            
        })



    }else if (mainBlocks[REDACTED_BLOCK_INDEX].classList[0] == 'columns_b'){
        sc_block = document.querySelector('.set_content')
        sc_block.innerHTML = `
        <img src="images/icons/cross.png" alt="cross" class="set_content_img_cross_col">
        <div class="set_content_title">Настройка контента</div>
        <div class="set_content_inps">
        <div class="set_content_inps_titile">
            <p class="set_content_inps_titile_text">Заголовок 1 колонки</p>
            <input type="text" placeholder="Заголовок" class="set_content_inps_h_inp1 set_inp">
        </div>
        <div class="set_content_inps_text">
            <p class="set_content_inps_text_text">Текст 1 колонки</p>
            <textarea name="text" id="text" placeholder="Введите текст" class="set_content_inps_text_inp1 set_inp"></textarea>
        </div>
        <div class="set_content_inps_color_bg">
            <p class="set_content_inps_color_bg_text">Цвет 1 колонки</p>
            <input type="color" placeholder="Цвет фона" class="set_content_inps_color_bg_inp1 set_inp">
        </div>
        <div class="set_content_inps_titile">
            <p class="set_content_inps_titile_text">Заголовок 2 колонки</p>
            <input type="text" placeholder="Заголовок" class="set_content_inps_h_inp2 set_inp">
        </div>
        <div class="set_content_inps_text">
            <p class="set_content_inps_text_text">Текст 2 колонки</p>
            <textarea name="text" id="text" placeholder="Введите текст" class="set_content_inps_text_inp2 set_inp"></textarea>
        </div>
        <div class="set_content_inps_color_bg">
            <p class="set_content_inps_color_bg_text">Цвет 2 колонки</p>
            <input type="color" placeholder="Цвет фона" class="set_content_inps_color_bg_inp2 set_inp">
        </div>
        </div>
        <input type="button" value="Сохранить" class="set_content_save_c button_green"></input>

        <style>.set_content_img_cross_col{
        position: absolute;
        right: 10px;
        top: 10px;
        }
        .set_content_img_cross_col:hover{
            cursor: pointer;
        }
        .set_content_save_c{
        background-color: #238D40;
        width: 150px;
        height: 40px;
        }
            </style>
        `
        setContentCross_col = document.querySelector('.set_content_img_cross_col')
        setContentCross_col.addEventListener('click', () => {hide(setContent, 1)})

        show(setContent, 1)


        scTitle1 = document.querySelector('.set_content_inps_h_inp1')
        scColor1 = document.querySelector('.set_content_inps_color_bg_inp1')
        scText1 = document.querySelector('.set_content_inps_text_inp1')
    
        scTitle2 = document.querySelector('.set_content_inps_h_inp2')
        scColor2 = document.querySelector('.set_content_inps_color_bg_inp2')
        scText2 = document.querySelector('.set_content_inps_text_inp2')

        // Показ существующих блоков 
        try{
            scTitle1.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelectorAll('h1')[0].innerHTML
            scColor1.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelectorAll('h1')[0].style.color
            scTitle2.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelectorAll('h1')[1].innerHTML
            scColor2.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelectorAll('h1')[1].style.color
        }catch{}
        try{
            scText1.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelectorAll('p')[0].innerHTML
            scText2.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelectorAll('p')[1].innerHTML
        }catch{}

        scSaveBTN_for_columns = document.querySelector('.set_content_save_c')
        scSaveBTN_for_columns.addEventListener('click', () => {

    
            try{
        
                mainBlocks[REDACTED_BLOCK_INDEX].querySelectorAll('h1')[1].innerHTML = scTitle2.value
                mainBlocks[REDACTED_BLOCK_INDEX].querySelectorAll('h1')[1].style.color = scColor2.value

                mainBlocks[REDACTED_BLOCK_INDEX].querySelectorAll('h1')[0].innerHTML = scTitle1.value
                mainBlocks[REDACTED_BLOCK_INDEX].querySelectorAll('h1')[0].style.color = scColor1.value
        /// ----- СОХРАНЕНИЕ ИЗМЕНЕНИЙ В PAGE_DATA
                for (let i = 0; i < PAGE_DATA.length; i++) {
                    if(PAGE_DATA[i].block_id == mainBlocks[REDACTED_BLOCK_INDEX].id){
        
                        html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')
                        // -------------- CAHNGE html_block ---------------------
        
                        html_block.querySelectorAll('h1')[1].innerHTML = scTitle2.value
                        html_block.querySelectorAll('h1')[1].style.color = scColor2.value
                        html_block.querySelectorAll('h1')[0].innerHTML = scTitle1.value
                        html_block.querySelectorAll('h1')[0].style.color = scColor1.value
        
                        to_what = `${html_block.outerHTML}\n`
                        PAGE_DATA[i].content.what = to_what
        /// -------------------------------
                    }
                }
        
            }catch{}
            try{
        
                mainBlocks[REDACTED_BLOCK_INDEX].querySelectorAll('p')[1].innerHTML = scText2.value
                mainBlocks[REDACTED_BLOCK_INDEX].querySelectorAll('p')[1].style.color = scColor2.value
                mainBlocks[REDACTED_BLOCK_INDEX].querySelectorAll('p')[0].innerHTML = scText1.value
                mainBlocks[REDACTED_BLOCK_INDEX].querySelectorAll('p')[0].style.color = scColor1.value
        /// ----- СОХРАНЕНИЕ ИЗМЕНЕНИЙ В PAGE_DATA
                for (let i = 0; i < PAGE_DATA.length; i++) {
                    if(PAGE_DATA[i].block_id == mainBlocks[REDACTED_BLOCK_INDEX].id){
                        
                        html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')
                        // -------------- CAHNGE html_block ---------------------
        
                        html_block.querySelectorAll('p')[1].innerHTML = scText2.value
                        html_block.querySelectorAll('p')[1].style.color = scColor2.value
                        html_block.querySelectorAll('p')[0].innerHTML = scText1.value
                        html_block.querySelectorAll('p')[0].style.color = scColor1.value
        
                        to_what = `${html_block.outerHTML}\n`
                        PAGE_DATA[i].content.what = to_what
        
                    }
                }
        /// ------------------------------
            }catch{}
    })
    }else{
        setContent.innerHTML = `<img src="images/icons/cross.png" alt="cross" class="set_content_img_cross">
        <div class="set_content_title">Настройка контента</div>
        <div class="set_content_inps">
            <div class="set_content_inps_titile">
                <p class="set_content_inps_titile_text">Заголовок</p>
                <input type="text" placeholder="Заголовок" class="set_content_inps_h_inp set_inp">
            </div>
            <div class="set_content_inps_s_titile">
                <p class="set_content_inps_s_titile_text">Подзаголовок</p>
                <input type="text" placeholder="Подзаголовок" class="set_content_inps_w_inp set_inp">
            </div>
            <div class="set_content_inps_text">
                <p class="set_content_inps_text_text">Текст</p>
                <textarea name="text" id="text" placeholder="Введите текст" class="set_content_inps_text_inp"></textarea>
            </div>
            <div class="set_content_inps_color_bg">
                <p class="set_content_inps_color_bg_text">Цвет</p>
                <input type="color" placeholder="Цвет фона" class="set_content_inps_color_bg_inp set_inp">
            </div>
        </div>
        <input type="button" value="Сохранить" class="set_content_save button_green"></input>`
        show(setContent, 1)
        scTitle = document.querySelector('.set_content_inps_h_inp')
        scSubtitle = document.querySelector('.set_content_inps_w_inp')
        scColor = document.querySelector('.set_content_inps_color_bg_inp')
        scText = document.querySelector('.set_content_inps_text_inp')
        inject_block_content()
        setContentCross = document.querySelector('.set_content_img_cross')
        setContentCross.addEventListener('click', () => {
            hide(setContent, 1)
            scTitle.value = ''
            scSubtitle.value = ''
            scColor.value = '#000'
            scText.value = ''
        })
        function inject_block_content(){
            try{
                scTitle.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').innerHTML
                scSubtitle.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h2').innerHTML
                scColor.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.color
            }catch{}
            try{
                scText.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').innerHTML
                scColor.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.color
            }catch{}
        }
        scSaveBTN = document.querySelector('.set_content_save')
        console.log('441', PAGE_DATA)
        scSaveBTN.addEventListener('click', () => {
            console.log('443', PAGE_DATA)
            console.log('start_wrong_PAGE_DATA')
            try{
                console.log('446', PAGE_DATA)
                mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').innerHTML = scTitle.value
                mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h2').innerHTML = scSubtitle.value
                mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.color = scColor.value
                mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h2').style.color = scColor.value


                /// ----- СОХРАНЕНИЕ ИЗМЕНЕНИЙ В PAGE_DATA
                console.log('452', PAGE_DATA)

                for (let i = 0; i < PAGE_DATA.length; i++) {
                    if(PAGE_DATA[i].block_id == mainBlocks[REDACTED_BLOCK_INDEX].id){

                        html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')
                        // -------------- CAHNGE html_block ---------------------
                        html_block.querySelector('h1').innerHTML = scTitle.value
                        html_block.querySelector('h2').innerHTML = scSubtitle.value
                        html_block.querySelector('h1').style.color = scColor.value
                        html_block.querySelector('h2').style.color = scColor.value

                        to_what = `${html_block.outerHTML}\n`
                        PAGE_DATA[i].content.what = to_what
                /// -------------------------------
                    }
                }
                console.log('468', PAGE_DATA)

            }catch{}
            try{
                mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').innerHTML = scText.value
                mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.color = scColor.value
                mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.color = scColor.value

            
        /// ----- СОХРАНЕНИЕ ИЗМЕНЕНИЙ В PAGE_DATA
                console.log('478', PAGE_DATA)
                for (let i = 0; i < PAGE_DATA.length; i++) {
                    if(PAGE_DATA[i].block_id == mainBlocks[REDACTED_BLOCK_INDEX].id){
                        
                        html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')
                        // -------------- CAHNGE html_block ---------------------
                        html_block.querySelector('p').innerHTML = scText.value
                        html_block.querySelector('p').style.color = scColor.value
                        // html_block.querySelector('h1').style.color = scColor.value
                        // html_block.querySelector('h1').innerHTML = scTitle.value
                        // html_block.querySelector('h2').innerHTML = scSubtitle.value


                        to_what = `${html_block.outerHTML}\n`
                        PAGE_DATA[i].content.what = to_what

                    }
                }
                console.log('496', PAGE_DATA)
        /// ------------------------------
            }catch{}

            hide(setContent, 1)
            scTitle.value = ''
            scSubtitle.value = ''
            scColor.value = '#000'
            scText.value = ''
        })


    }
})



// ----- Блок насройки блока
btnSetBlock = document.querySelector('.edit_set_btns_left_block')
setBlock = document.querySelector('.set_block')
setBlockCross = document.querySelector('.set_block_img_cross')
btnSetBlock.addEventListener('click', () => {
    show(setBlock, 1)
    inject_block_block()
})
setBlockCross.addEventListener('click', () => {
    hide(setBlock, 1)
})
sbHeight = document.querySelector('.set_block_inps_h_inp')
sbWidth = document.querySelector('.set_block_inps_w_inp')
sbLocation = document.querySelector('.set_block_inps_pos_select')
sbPaddings = document.querySelector('.set_block_inps_m_inp')
sbFSTitile = document.querySelector('.set_block_inps_fsh_inp')
sbFSText = document.querySelector('.set_block_inps_fst_inp')
function inject_block_block(){
    try{
        sbHeight.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.height
        sbWidth.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.width
        sbLocation.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.textAlign
        sbPaddings.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.padding
        sbFSTitile.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.fontSize
    }catch{}
    try{
        sbHeight.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.height
        sbWidth.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.width
        sbLocation.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.textAlign
        sbPaddings.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.padding
        sbFSText.value = mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.fontSize
    }catch{}
}
sbSave = document.querySelector('.set_block_save')
sbSave.addEventListener('click', () => {
    try{
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.height = sbHeight.value
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.width = sbWidth.value 
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.textAlign = sbLocation.value
        // mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.padding = sbPaddings.value == '' ? '20px': sbPaddings.value
        mainBlocks[REDACTED_BLOCK_INDEX].style.padding = sbPaddings.value == '' ? '20px': sbPaddings.value

        // mainBlocks[REDACTED_BLOCK_INDEX].style.alignItems = sbLocation.value
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.fontSize = sbFSText.value
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.fontSize = sbFSTitile.value
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.textAlign = sbLocation.value
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h2').style.textAlign = sbLocation.value

        // ----- СОХРАНЕНИЕ ИЗМЕНЕНИЙ В PAGE_DATA
        for (let i = 0; i < PAGE_DATA.length; i++) {
            if(PAGE_DATA[i].block_id == mainBlocks[REDACTED_BLOCK_INDEX].id){
                
                html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')
                // -------------- CAHNGE html_block ---------------------
                html_block.querySelector('p').style.height = sbHeight.value
                html_block.querySelector('p').style.width = sbWidth.value 
                html_block.querySelector('p').style.textAlign = sbLocation.value
                html_block.querySelector('h1').style.textAlign = sbLocation.value
                html_block.querySelector('h2').style.textAlign = sbLocation.value
                // html_block.querySelector('p').style.padding = sbPaddings.value == '' ? '20px': sbPaddings.value
                html_block.style.padding = sbPaddings.value

                // html_block.style.alignItems = sbLocation.value
                html_block.querySelector('p').style.fontSize = sbFSText.value
                html_block.querySelector('h1').style.fontSize = sbFSTitile.value

                to_what = `${html_block.outerHTML}\n`
                PAGE_DATA[i].content.what = to_what

            }
        }
        // -------------------------------------

    }catch{
        mainBlocks[REDACTED_BLOCK_INDEX].style.height = sbHeight.value
        mainBlocks[REDACTED_BLOCK_INDEX].style.width = sbWidth.value
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('h1').style.textAlign = sbLocation.value
        
        mainBlocks[REDACTED_BLOCK_INDEX].querySelector('p').style.textAlign = sbLocation.value
        // mainBlocks[REDACTED_BLOCK_INDEX].style.alignItems = sbLocation.value
        mainBlocks[REDACTED_BLOCK_INDEX].style.padding = sbPaddings.value
        mainBlocks[REDACTED_BLOCK_INDEX].style.fontSize = sbFSText.value

        // ----- СОХРАНЕНИЕ ИЗМЕНЕНИЙ В PAGE_DATAd
        for (let i = 0; i < PAGE_DATA.length; i++) {
            if(PAGE_DATA[i].block_id == mainBlocks[REDACTED_BLOCK_INDEX].id){
                
                html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')
                // -------------- CAHNGE html_block ---------------------
                html_block.style.height = sbHeight.value
                html_block.style.width = sbWidth.value
                html_block.querySelector('h1').style.textAlign = sbLocation.value
                // html_block.querySelector('h2').style.textAlign = sbLocation.value
                html_block.querySelector('p').style.textAlign = sbLocation.value
                // html_block.style.alignItems = sbLocation.value
                html_block.style.padding = sbPaddings.value
                html_block.style.fontSize = sbFSText.value

                to_what = `${html_block.outerHTML}\n`
                PAGE_DATA[i].content.what = to_what

            }
        }
        // -------------------------------------

    }
    hide(setBlock, 1)
    sbHeight.value = ''
    sbWidth.value = ''
    sbLocation.value = ''
    sbPaddings.value = ''
})

// ------- Добавление нового блока --------------
closeBtnAdd = document.querySelector('.add_content_cross')
popupAddBlock = document.querySelector('.add_content')
closeBtnAdd.addEventListener('click', () => {
    closePopUp(popupAddBlock)
})
addNewBlockBtn.addEventListener('click', () => {
    openPopUp(popupAddBlock)
})

// MAIN FUNCTION
// Добавление собственно блока на страницу из списка добавления блоков
blocks = {
    'title_b': document.querySelector('#title_b'),
    'text_b': document.querySelector('#text_b'),
    'columns_b': document.querySelector('#columns_b'),
    'picture_b': document.querySelector('#picture_b'),
    'quote_b': document.querySelector('#quote_b')
}
BLOCK_COUNTER = 0
ks = Object.keys(blocks)
for (let i = 0; i < ks.length; i++) {
    blocks[ks[i]].addEventListener('click', () => {
        closePopUp(popupAddBlock)
        // MAX_BLOCK_INDEX += 1
        visualizateBlock(ks[i])
        document.querySelector('#_').id = MAX_BLOCK_INDEX
        MAX_BLOCK_INDEX += 1
        vizSetBlockBTN()
        
        PAGE_DATA.push({
            'block_id': BLOCK_COUNTER,
            'content': {
                'type': 'add',
                'what': TEMPLATE_BLOCKS[ks[i]]
            }
        })
        BLOCK_COUNTER += 1
    })
}

TEMPLATE_BLOCKS = {
    'title_b': `<div class="title_b block_to_edit" id="_" style="cursor:pointer;border:0.5px solid black;background-color:#fff;padding:20px;"> <h1 style="text-align:center;font-size:40px;">Title</h1> <h2 style="text-align:center;font-size:20px;">Subtitle</h2><p style="font-size:20px;text-align:center;" ></p> </div>\n`,
    'text_b': `<div class="text_b block_to_edit" id="_" style="cursor:pointer;border:0.5px solid black;background-color:#fff;padding:20px;"><h1 style="font-size:40px;"></h1><h2 style="font-size:20px;"></h2> <p style="font-size:20px;" >Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, molestias architecto omnis eveniet alias error laudantium nemo libero praesentium odit harum asperiores, tempore nesciunt obcaecati repellendus. Saepe nihil quae laudantium!</p> </div>\n`,
    'columns_b': `<div class="columns_b block_to_edit" id="_" style="cursor:pointer;border:0.5px solid black;padding:20px;display:flex;justify-content:center;gap:80px;"><div style="width:500px;"><h1 style="text-align:center;font-size:20px;">Subtitle</h1> <p style="font-size:20px;text-align:center;">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus eos assumenda odio alias, quia aperiam accusantium iure asperiores molestias mollitia</p></div><div style="width:500px;"><h1 style="text-align:center;font-size:20px;">Subtitle</h1> <p style="font-size:20px;text-align:center;">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus eos assumenda odio alias, quia aperiam accusantium iure asperiores molestias mollitia</p></div></div>\n`,
    'picture_b': `<div class="picture_b block_to_edit" id="_"  style="cursor: pointer;border: 0.5px solid black;background-color: rgb(255, 255, 255);padding: 20px;align-items: center;"><h1 style="text-align: center; font-size: 30px; margin-bottom:18px;"></h1><img src="./images/logo.png" style="display:block; margin:0 auto;" alt=""></div>\n`,
    'quote_b': `<div class="quote_b block_to_edit" id="_" style="cursor: pointer;border: 0.5px solid black;background-color: rgb(255, 255, 255);padding: 20px;align-items: center;"> <h1 style=" font-weight:400;font-style:italic;text-align: center; font-size: 30px;">Animi natus reprehenderit ipsum veritatis deserunt</h1><h2></h2><p style="font-size:20px;text-align:center;">Lorem Ipsum</p> </div>\n`
}
function visualizateBlock(block){
    sectionForBlocks.insertAdjacentHTML('beforeend', TEMPLATE_BLOCKS[block])
    // PAGE_DATA.push(TEMPLATE_BLOCKS[block])
}

// -----------------------------
// СОХРАНЕНИЕ локальных изменений и отправка их на сервер
saveBTN = document.querySelector('.header_buttons__button_save')
saveBTN.addEventListener('click', () => {
    // УДАЛЕНИЕ ЛИШНИХ СТИЛЕЙ
    for (let i = 0; i < PAGE_DATA.length; i++) {
        html_block = parser.parseFromString(PAGE_DATA[i].content.what, "text/html").querySelector('.block_to_edit')

        html_block.style.cursor = 'auto'
        html_block.style.border = '0px solid #fff'

        to_what = `${html_block.outerHTML}\n`
        PAGE_DATA[i].content.what = to_what
    }


    load_PAGE_DATA_to_server(PAGE_DATA)

})
quitNoBTN = document.querySelector('.save_window_inputs_button_n')
quitNoBTN.addEventListener('click', () => {
    window.location.href = './profile.html'
})
quitYesBTN = document.querySelector('.save_window_inputs_button_y')
quitYesBTN.addEventListener('click', () => {
    window.location.href = './profile.html'
    load_PAGE_DATA_to_server(PAGE_DATA)
})


function load_PAGE_DATA_to_server(index){
    data = {
        'main': index,
        'username': localStorage.getItem('name'),
        'password': localStorage.getItem('password'),
        'site_id': SITE_ID
    }
    return fetch('http://127.0.0.1:8000/api/load_PAGE_DATA_to_server', {
        method: 'POST', 
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data),
        mode: 'no-cors'
    })
}