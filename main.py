from fastapi import FastAPI
from fastapi import Depends, Body, File, Form, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import *
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

app = FastAPI()

Base.metadata.create_all(bind=engine)
def get_db():
    db = LocalSession()
    try: yield db
    finally: db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"] 
)

# app.mount("/", StaticFiles(directory="src", html=True))


@app.post('/api/add_user')
async def add_user(data = Body(), db: Session = Depends(get_db)):
    user = User(
        name = data['name'],
        email = data['email'],
        password = data['password']
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.post('/api/check_is_user_exist')
async def add_user(data = Body(), db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data['email']).first() != None:
        return {'message': 'error'}
    return {'message': 'ok'}

@app.post('/api/get_user')
async def get_user(data = Body(), db: Session = Depends(get_db)):
    user = {'name': '','id': '', 'password': '', 'message': ''}
    if db.query(User).filter(User.name == data['name']).first() != None and db.query(User).filter(User.password == data['password']).first() != None:
        user['name'] = encode64(data['name'])
        user['id'] = db.query(User).filter(User.name == data['name']).first().id
        user['password'] = encode64(db.query(User).filter(User.name == data['name']).first().password)
        user['message'] = 'ok'
    else: return {'message':'error'}
    return user

import base64
def encode64(string):
    return base64.b64encode(string.encode('utf-8'))
def decode64(string):
    return base64.b64decode(string.encode('utf-8')).decode('utf-8')

# import json


# Функции создания файла сайта и его имени 
def create_filename(user_name, user_id, site_id):
    file_name = str(user_id) + str(user_name) + str(site_id)
    file_name = file_name.replace('=', '')
    return file_name
def create_file(file_name, site_name):
    with open(f'./src/user_sites/{file_name}.html', 'w') as file:
        file.write(f'''''')

@app.post('/api/create_site')
async def create_site(data = Body(), db: Session = Depends(get_db)):
    user_name = data['user']['name']
    user_password = data['user']['password']
    if db.query(User).filter(User.name == decode64(user_name)).first() != None and db.query(User).filter(User.password == decode64(user_password)).first() != None:
        user_id = int(db.query(User).filter(User.name == decode64(user_name)).first().id)
        site = Site(name = data['name'], status = data['status'], template = data['template'], link = data['link'], user = user_id)
        db.add(site)
        db.commit()
        db.refresh(site)

        # !!! Локальная ссылка
        fn =  create_filename(user_name, user_id, site.id)

        site.link = f'/home/monkey/Projects/web_engine-main/src/user_sites/{fn}.html'
        db.commit()
        db.refresh(site)

        # Создание файла с сайтом
        create_file(fn, site.name)

    else: return {'message':'error'}
    return site

@app.post('/api/get_user_data_for_profile')
def get_user_data_for_profile(data = Body(), db: Session = Depends(get_db)):
    user_name = data['user']['name']
    user_password = data['user']['password']
    if db.query(User).filter(User.name == decode64(user_name)).first() != None and db.query(User).filter(User.password == decode64(user_password)).first() != None:
        user_id = int(db.query(User).filter(User.name == decode64(user_name)).first().id)
        sites = [site for site in db.query(Site).filter(Site.user == user_id)]
    else: return {'message':'error'}
    return sites





@app.post('/api/set_site')
def set_site(data = Body(), db: Session = Depends(get_db)):
    name = data['name']
    status = db.query(Site).filter(Site.name == data['name']).first().status
    mini_set_site = {'name': name, 'status': status}
    return mini_set_site



@app.post('/api/change_settings')
def set_site(data = Body(), db: Session = Depends(get_db)):
    name_old = data['name_old']
    name_new = data['name_new']
    site = db.query(Site).filter(Site.name == name_old).first()
    site.name = name_new
    db.commit()
    return {'message':'ok'}

@app.post('/api/delete_site')
def set_site(data = Body(), db: Session = Depends(get_db)):
    name_old = data['name_old']
    site = db.query(Site).filter(Site.name == name_old).first()
    db.delete(site)
    db.commit()
    return {'message':'ok'}



# попытка написать оброботчик префлайтов корсов для ориджина на *
# @app.options('/api/get_site_id_fromDB')
# def f():
#     return Response(headers={"access-control-allow-headers": "access-control-allow-origin", "access-control-allow-origin": "*"})

@app.post('/api/get_site_id_fromDB')
async def get_site_id_fromDB(data = Body(), db: Session = Depends(get_db)):
    name = data['name']
    site_id = db.query(Site).filter(Site.name == name).first().id

    response_data = {'id': site_id, 'page': []}

    user_name = data['username']
    user_password = data['password']
    if db.query(User).filter(User.name == decode64(user_name)).first() != None and db.query(User).filter(User.password == decode64(user_password)).first() != None:
        user_id = int(db.query(User).filter(User.name == decode64(user_name)).first().id)

        file_name = create_filename(user_name, user_id, site_id)
        response_data['page'] = read_file(file_name)
        return response_data
    else:
        return {'message':'error WITH REGISTRATION'}

# ВЫНОСИТЬ ФУНКЦИИ РАБОТЫ С ФАЙЛАМИ ОТДЕЛЬНО ИНАЧЕ НЕ ПОЛУЧАЕТСЯ И КОРС БЛОЧИТ
def read_file(f_name):
    with open(f'/home/monkey/Projects/web_engine-main/src/user_sites/{f_name}.html', 'r') as file:
        
        for_PAGE_DATA = []
        lines = file.readlines()
        for i in range(0, len(lines)):
            for_PAGE_DATA.append(lines[i])

        return for_PAGE_DATA


import json
@app.post('/api/load_PAGE_DATA_to_server')
async def load_PAGE_DATA_to_server(data = Body(), db: Session = Depends(get_db)):
    user_name = json.loads(data)['username']
    user_password = json.loads(data)['password']
    if db.query(User).filter(User.name == decode64(user_name)).first() != None and db.query(User).filter(User.password == decode64(user_password)).first() != None:
        user_id = int(db.query(User).filter(User.name == decode64(user_name)).first().id)
        site_id = int(json.loads(data)['site_id'])
        
        file_name = create_filename(user_name, user_id, site_id)
        add_to_file(json.loads(data)['main'], file_name)
    else:
        return {'message': 'error'}

def add_to_file(data, file_name):
    with open(f'./src/user_sites/{file_name}.html', 'w') as file:
        for i in range(len(data)):
            file.write(data[i]['content']['what'])

# Получение картинки
# @app.post('/api/load_picture')
# def load_picture(data = Body()):
#     pict = data['image']
#     return {'message':pict}


# @app.post("/file/upload-file")
# def upload_file(file: UploadFile):
#   return file

@app.post('/api/load_picture')
async def create_upload_file(uploaded_file: UploadFile = File(...)):    
    file_location = f"./src/user_images/{uploaded_file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(uploaded_file.file.read())
    return {"info": f"file '{uploaded_file.filename}' saved at '{file_location}'"}

# @app.post('/api/load_picture')
# async def create_upload_file(data = Body()):    
#     uploaded_file = data['image']
#     file_location = f"./src/user_images/{uploaded_file.filename}"
#     with open(file_location, "wb+") as file_object:
#         file_object.write(uploaded_file.file.read())
#     return {"info": f"file '{uploaded_file.filename}' saved at '{file_location}'"}
# from typing import Annotated
# @app.post("/api/load_picture")
# async def create_file(
#     file: Annotated[bytes, File()]
# ):
#     return {
#         "file_size": len(file)
#     }


from threading import Timer

@app.post("/api/download_file")
async def download_site(data = Body(), db: Session = Depends(get_db)):
    site_id = data['site_id']
    user_name = data['user_name']
    user_password = data['user_password']
    site_name_original = data['site_name']

    if db.query(User).filter(User.name == decode64(user_name)).first() != None and db.query(User).filter(User.password == decode64(user_password)).first() != None:
        user_id = int(db.query(User).filter(User.name == decode64(user_name)).first().id)


    site_name = create_filename(user_name, user_id, site_id)
    file_path = f'/home/monkey/Projects/web_engine-main/src/user_sites/{site_name}.html'

    file = open(f'/home/monkey/Projects/web_engine-main/src/user_sites/{site_name}.html', 'r')
    old_file = file.read()
    file.close()

    file = open(f'/home/monkey/Projects/web_engine-main/src/user_sites/{site_name}.html', 'w')
    new_file = f'''<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{site_name_original}</title>
    </head>
    <body>
        {old_file}
    </body>
    </html>''' 
    file.write(new_file)
    file.close()



    def delayed_action():
        file = open(f'/home/monkey/Projects/web_engine-main/src/user_sites/{site_name}.html', 'w')
        file.write(old_file)
        file.close()

    timer = Timer(1, delayed_action)
    timer.start()


    return FileResponse(
        file_path,
        filename=f"{site_name}.html",
        media_type="application/octet-stream"
    )
    

@app.post("/api/upload-image") 
async def upload_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        with open(f"/home/monkey/Projects/web_engine-main/src/user_images/{file.filename}", "wb") as f:
            f.write(contents)
        
        return {"message": "Image uploaded!", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))