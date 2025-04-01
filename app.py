from flask import Flask, render_template,request,url_for,jsonify,make_response,send_from_directory,session
from flask_mysqldb import MySQL
from flask_login import login_required, current_user
from flask import request, url_for, redirect, flash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import click
import re
import ast
from markupsafe import escape
from moviepy.editor import VideoFileClip  
from PIL import Image  
import numpy as np  
import os  
from os.path import join, getctime  
import json
import copy
import time
import threading
import sys
import shutil
from flask_cors import CORS
import re
from datetime import datetime, timedelta
import time

class log:
    def __init__(self):
        self.txtf = open('Systemlog.txt','a+',encoding='utf-8')
        self.savelist = False
        self.stop_event2 = threading.Event()

    def listfo_start(self):
        def listen2():
            time.sleep(5)
            self.txtf.flush()
            self.savelist = False
        self.thread2 = threading.Thread(target=listen2,daemon=False)
        self.thread2.start()

    def save(self):
        if self.savelist == False:
            self.savelist = not self.savelist
            self.listfo_start()

    def logtime(self):
        current_time_str_direct = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        return current_time_str_direct
    
    def errorlog(self,errorinfo,LEVEL = 0):
        st = f'SYSTEM ERROR : errorinfo is {errorinfo} - time to the in {self.logtime()}  $ALARM LEVEL = {LEVEL}\n'
        self.txtf.write(st)
        self.save()

    def loging(self,loginginfo,LEVEL = 0):
        st = f'SYSTEM LOGING : {loginginfo} loging - time to the in {self.logtime()}  $ALARM LEVEL = {LEVEL}\n'
        self.txtf.write(st)
        self.save()

    def inof(self,alinof,LEVEL = 0):
        st = f'SYSTEM INOF : {alinof} info - time to the in {self.logtime()}  $ALARM LEVEL = {LEVEL}\n'
        self.txtf.write(st)
        self.save()
    def deletesave(self,deletesaveinfo,LEVEL = 0):
        st = f'时间:{self.logtime()}->删除了{deletesaveinfo}'
    def inofclose(self):
        self.txtf.close()


def get_directories_sorted_by_creation_time(directory_path):  
    # 获取指定目录下的所有目录名  
    directories = [d for d in os.listdir(directory_path) if os.path.isdir(join(directory_path, d))]  
      
    # 获取每个目录的完整路径  
    full_paths = [join(directory_path, d) for d in directories]  
      
    # 根据创建时间排序  
    sorted_directories = sorted(full_paths, key=getctime, reverse=True)  
      
    # 提取排序后的目录名  
    sorted_directory_names = [os.path.basename(d) for d in sorted_directories]  
      
    return sorted_directory_names



def list_directory_contents(directory):
    name = []
    for root, dirs, files in os.walk(directory):  
        lis = []
        for file_name in files:  
            # 获取文件名（不包括路径）  
            file_base_name = os.path.basename(file_name)  
            # 获取文件扩展名（假设有一个点，并且点后面是扩展名）  
            _, file_extension = os.path.splitext(file_base_name)  
            file_extension = file_extension.lower()  # 转换为小写以进行不区分大小写的比较  
              
            # 检查文件扩展名是否在允许的列表中  
            if file_extension in ['.mp4', '.png', '.jpg', '.gif']:  
                t = str(root).split('/')[-1]+'/'
                lis.append(f'{t}{file_name}')
        if len(lis) >= 2:
            if lis[0].split('.')[-1] != 'mp4':
                lis[0],lis[1] = lis[1],lis[0]
            name.append(lis[:2])
        lis = []
    return name



def find_in_array(text_parts, array):
    arrys = []
    # print(re.search(r'[A-Za-z0-9]',text_parts))
    if re.search(r'[A-Za-z0-9]',text_parts): 
        for sublist in array:
            for element in sublist:   
                if text_parts in element.split('/')[-1]:
                    if sublist not in arrys:  
                        arrys.append(sublist)
    else:
        for sublist in array:
            for element in sublist:  
                for char in text_parts:  
                    if char in element:
                        if sublist not in arrys:  
                            arrys.append(sublist)
    file_path = os.path.join(os.path.dirname(__file__), 'history.json')
    if os.path.exists(file_path):
        with open('history.json','r+',encoding='utf-8') as f:
            try:
                nextjson = json.load(f)
            except json.JSONDecodeError:
                pass
        if re.search(r'[A-Za-z0-9]',text_parts): 
            for key,value in nextjson.items():
                if text_parts in key:
                    if value not in arrys:
                        arrys.append(value)
                        # print(value)
        else:
            for key,value in nextjson.items():
                if text_parts in key:
                    for i in value:
                        if i not in arrys:
                            arrys.append(i)
        # print(arrys)
    return arrys


def jstime(last_recorded_time_str):
    current_time = datetime.now()
    # print(f"当前时间: {current_time}")
    last_recorded_time = datetime.strptime(last_recorded_time_str, "%Y-%m-%d %H:%M:%S")
    # print(f"上一次记录时间: {last_recorded_time}")
    
    # 计算时间差
    time_difference = current_time - last_recorded_time
    # print(f"时间差: {time_difference}")
    
    # 判断时间差是否超过5天
    if time_difference > timedelta(days=5):
        return [True, current_time]
    else:
        return [False, current_time]

script_path = os.path.abspath(sys.argv[0])
# 获取脚本文件所在的目录
script_dir = os.path.dirname(script_path)
os.chdir("F:/HSMP4")
current_working_directory = os.getcwd()

# 打印当前的工作目录
# print("当前的工作目录是:", current_working_directory)


config = {"path":"F:/HSMP4/431960","resources":"431960","SinglePersonmoodstart":False,"QuickLoading":True,"time":"2025-2-26 12:00:00"}
try:
    with open('config.json','r+',encoding='utf-8') as f:
        try:
            config = json.load(f)
        except json.JSONDecodeError:
            print("无法打开配置文件")
        f.close()
except:
    pass

max_content = 8
directory_path = config["path"]  # 替换为你的目录路径  

SinglePersonmood = {'index':None,'mp4All':False,'history':None,'live':None}
SinglePersonmoodstart = config['SinglePersonmoodstart']
if SinglePersonmoodstart:
    if os.path.exists('SinglePersondata.json'):
        try:
            with open('SinglePersondata.json','r',encoding='utf-8') as SinglePersonmoodJsonOpen:
                SinglePersonmood = json.load(SinglePersonmoodJsonOpen)
        except:
            SinglePersonmood = {'index':None,'mp4All':False,'history':None,'live':None}
    else:
        SinglePersonmood = {'index':None,'mp4All':False,'history':None,'live':None}


Navsystem = ["/system" if SinglePersonmoodstart else "/systemoff","/systemoff" if SinglePersonmoodstart else "/system"]
print(f'服务路由:{Navsystem}')

def saveSinglePersondata():
    print('保存SinglePersondata')
    global SinglePersonmood
    with open('SinglePersondata.json','w',encoding='utf-8') as SinglePersonmoodJsonOpen:
        SinglePersonmoodJsonOpen.write(json.dumps(SinglePersonmood,ensure_ascii=False, indent=4))




app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev'
CORS(app)
n = []
# print(config)
start_time = time.time()
if config['QuickLoading']:
    print('快速加载中')
    iftime = jstime(config['time'])
    if os.path.exists('QuickLoadingConfig.json') and not iftime[0]:
        with open('QuickLoadingConfig.json','r',encoding='utf-8') as f:
            n = json.load(f)
            print('快速加载完成')
    else:
        if iftime[0] == True:
            print('超过5天,正在更新快速加载文件资源')
        sorted_files = get_directories_sorted_by_creation_time(directory_path) 
        for i in sorted_files:
            n2 = list_directory_contents(f'{config["path"]}/{i}')
            if len(n2) > 0:
                n.append(n2[0])
        with open('QuickLoadingConfig.json','w',encoding='utf-8') as f:
            f.write(json.dumps(n,ensure_ascii=False, indent=4))
        if iftime[0] == True:
            print('更新完成' if len(n) > 0 else '更新失败')
            with open('config.json','r',encoding='utf-8') as f:
                config = json.load(f)
            with open('config.json','w',encoding='utf-8') as f:
                config['time'] = iftime[1].strftime("%Y-%m-%d %H:%M:%S")
                f.write(json.dumps(config,ensure_ascii=False, indent=4))
else:
    sorted_files = get_directories_sorted_by_creation_time(directory_path) 
    for i in sorted_files:
        n2 = list_directory_contents(f'{config["path"]}/{i}')
        if len(n2) > 0:
            n.append(n2[0])

print('加载成功' if len(n) > 0 else '加载失败')
end_time = time.time()
elapsed_time = end_time - start_time
 
print(f"加载总耗时:{elapsed_time:.6f} 秒")

MEDIA_DIR = 'C:/Users/Administrator/Desktop/mp4'
 
# 确保目录存在
if not os.path.exists(MEDIA_DIR):
    os.makedirs(MEDIA_DIR)
 
# 路由来提供视频文件
@app.route('/media/video/<filename>')
def video(filename):
    print(MEDIA_DIR)
    print(filename)
    print(MEDIA_DIR + '/' + filename)
    return send_from_directory(MEDIA_DIR,filename)
 
# 路由来提供图片文件
@app.route('/media/image/<filename>')
def image(filename):
    return send_from_directory(MEDIA_DIR ,filename)


static_folder = os.path.join(os.path.dirname(__file__), '431960')  
logs = log()
@app.route(f'/{config["resources"]}/<path:filename>', methods=['GET'])  
def custom_static(filename):
    return send_from_directory(static_folder,filename)

@app.route('/filehistory',methods=['GET', 'POST'])
def filehistory():
    if request.method == 'POST':
        filehistory = request.get_json()
        filename = filehistory['filename']
        if filename.endswith('.mp4'):
            filehistory = session.get('history', None)
            if filehistory == None:
                session['history'] = []
                filehistory = []
            if filename not in filehistory:
                filehistory.append(filename)
                if len(filehistory) > 20:
                    filehistory.pop(0)
                session['history'] = filehistory
            print('记观看录',filehistory)
            return jsonify(code='ok')
    if request.method == 'GET':
        filehistory = session.get('history', None)
        if filehistory == None:
            return "无法获取历史记录"
        myhistory = []
        out = config['resources']
        filehistory = [fileitem.replace(f'/{out}/','') for fileitem in filehistory]
        print('历史记录',filehistory)
        for file in filehistory:
            for i in n:
                print(file,i[0])
                if file in i[0]:
                    myhistory.append(i)
                    break
        print('历史记录',myhistory)
        return render_template('LiveVideo.html',filepath=myhistory[::-1],title="history")


# @app.route('/myhistory',methods=['GET', 'POST'])
# def myhistory():
    
@app.route('/',methods=['GET', 'POST'])
def index():
    session['index'] = '1'
    return jsonify(filepath=n[12:16],indexs = '1')

@app.route('/login',methods=['GET', 'POST'])
def login():
    return render_template('MP4.html')


@app.route('/logout',methods=['GET', 'POST'])
def clear_session():
    session['live']=[]
    print(session['live'])
    return jsonify({'status': 'ok'})

@app.route('/sessionsearch',methods=['GET', 'POST'])
def sessionsearch():
    return jsonify(data=str(session))


@app.route(Navsystem[0],methods=['GET', 'POST'])
def system():
    print('端点访问')
    indexlist = SinglePersonmood['index']
    if indexlist == None:
        print('没有index')
        SinglePersonmood['index'] = '1'
        print('记录',SinglePersonmood['index'])
        indexlist = '1'
    sessionhistory = SinglePersonmood['history']
    if sessionhistory == None:
        print('没有history')
        SinglePersonmood['history'] = []
        sessionhistory = SinglePersonmood['history']
    mp4All = SinglePersonmood['mp4All']
    if mp4All == None:
        SinglePersonmood['mp4All'] = False
        mp4All = SinglePersonmood['mp4All']
        # return jsonify(filepath=n[12:16],indexs = '1')
    print('当前index',indexlist)
    if request.method == 'POST':
        if request.content_type == 'application/json':
            jsondata = request.get_json()
            cs = jsondata['cs']
            if jsondata.get('indexnum', None) is not None:
                print('找到index',jsondata['indexnum'])
                indexlist=jsondata['indexnum']
            else:
                print('没有index')
            global max_content
            print('list')
            if cs == 'off':
                if len(n) // max_content - int(indexlist) > 0:
                    SinglePersonmood['index'] = str(int(indexlist)+1)
                    saveSinglePersondata()
                    return jsonify(code='ok',indexs=SinglePersonmood['index'])
                else:
                    return jsonify(code='no',indexs=SinglePersonmood['index'])
            elif cs == 'on':
                if int(indexlist)-1 >= 0:
                    SinglePersonmood['index'] = str(int(indexlist)-1)
                    saveSinglePersondata()
                    return jsonify(code='ok',indexs=SinglePersonmood['index'])
                else:
                    return jsonify(code='no',indexs=SinglePersonmood['index'])
            elif cs == 'indexgo':
                print("申请引索",indexlist)
                if len(n) / max_content - int(indexlist) > 0:
                    SinglePersonmood['index'] = str(int(indexlist))
                    saveSinglePersondata()
                    return jsonify(code='ok',indexs=SinglePersonmood['index'])
                else:
                    return jsonify(code='no',indexs=SinglePersonmood['index'])
            elif cs == 'Paon':
                SinglePersonmood['index'] = str(len(n) // max_content - 1)
                saveSinglePersondata()
                return jsonify(code='ok',indexs=SinglePersonmood['index'])
            elif cs == 'next':
                SinglePersonmood['mp4All'] = True
                return jsonify(code='ok',indexs=SinglePersonmood['index'])
                # return render_template('searchVideo.html',filepath=result,indexs = '1',text=text,arrylen = len(result))
            elif cs == 'maxlines':
                maxline = jsondata['max']
                max_content = int(maxline)
                return jsonify(code='ok',indexs=SinglePersonmood['index'])
            elif cs == 'live':
                get_live_video = SinglePersonmood['live']
                if get_live_video == None:
                    get_live_video = []
                live = [jsondata.get('name',None),jsondata.get('value',None)]
                get_live_video.append(live)
                SinglePersonmood['live'] = get_live_video
                saveSinglePersondata()
                return jsonify(code='ok',indexs=SinglePersonmood['index'],state='ok')
            elif cs == 'outlive':
                get_live_video = SinglePersonmood['live']
                live = [jsondata.get('name',None),jsondata.get('value',None)]
                try:
                    get_live_video.remove(live)
                    SinglePersonmood['live'] = get_live_video
                    saveSinglePersondata()
                except ValueError:
                    return jsonify(code='okout',indexs=SinglePersonmood['index'],state='no')
                return jsonify(code='okout',indexs=SinglePersonmood['index'],state='ok')
        else:
            if request.form.get('cs', None) == 'new':
                text = request.form.get('text', None)
                if text != '' and text not in sessionhistory:
                    print(text,sessionhistory)
                    sessionhistory.append(text)
                    if len(sessionhistory) > 10:
                        sessionhistory.pop(0)
                    print(sessionhistory)
                    SinglePersonmood['history'] = sessionhistory
                    print('搜索历史记录',SinglePersonmood['history'])
                result = find_in_array(text, n)
                print('返回搜索内容',result)
                saveSinglePersondata()
                return render_template('searchVideo.html',filepath=result,indexs = '1',text=text,arrylen = len(result),inputSearch = SinglePersonmood['history'][::-1])
    elif request.method == 'GET':
        print('访问index',indexlist)
        Allindex = len(n) // max_content
        liveAll = SinglePersonmood['live']
        islive = []
        if mp4All:
            SinglePersonmood['mp4All'] = False
            if liveAll != None:
                for i in liveAll:
                    if i in n:
                        islive.append(i)
            else:
                islive = []
            return jsonify(filepath=n,indexs = int(indexlist)+1,Allindex = Allindex,inputSearch = SinglePersonmood['history'][::-1],islive=islive)
        if liveAll != None:
            for i in liveAll:
                if i in n[int(indexlist)*max_content:int(indexlist)*max_content+max_content]:
                    islive.append(i)
        else:
            islive = []
        print('找到的喜欢内容',islive)
        return jsonify(filepath=n[int(indexlist)*max_content:int(indexlist)*max_content+max_content],indexs = int(indexlist)+1,Allindex = Allindex,inputSearch = SinglePersonmood['history'][::-1],islive=islive)
    return jsonify(code='null')

@app.route(Navsystem[1],methods=['GET', 'POST'])
def system2():
    print('端点访问2')
    indexlist = session.get('index', None)
    if indexlist == None:
        print('没有index')
        session['index'] = '1'
        print('记录',session['index'])
        indexlist = '1'
    sessionhistory = session.get('history', None)
    if sessionhistory == None:
        print('没有history')
        session['history'] = []
        sessionhistory = session.get('history', None)
    mp4All = session.get('mp4All', None)
    if mp4All == None:
        session['mp4All'] = False
        mp4All = session.get('mp4All', None)
        # return jsonify(filepath=n[12:16],indexs = '1')
    print('当前index',indexlist)
    if request.method == 'POST':
        if request.content_type == 'application/json':
            jsondata = request.get_json()
            cs = jsondata['cs']
            if jsondata.get('indexnum', None) is not None:
                print('找到index',jsondata['indexnum'])
                indexlist=jsondata['indexnum']
            global max_content
            print('list')
            if cs == 'off':
                if len(n) // max_content - int(indexlist) > 0:
                    session['index'] = str(int(indexlist)+1)
                    return jsonify(code='ok',indexs=session['index'])
                else:
                    return jsonify(code='no',indexs=session['index'])
            elif cs == 'on':
                if int(indexlist)-1 >= 0:
                    session['index'] = str(int(indexlist)-1)
                    return jsonify(code='ok',indexs=session['index'])
                else:
                    return jsonify(code='no',indexs=session['index'])
            elif cs == 'indexgo':
                print(indexlist)
                if len(n) / max_content - int(indexlist) > 0:
                    session['index'] = str(int(indexlist))
                    return jsonify(code='ok',indexs=session['index'])
                else:
                    return jsonify(code='no',indexs=session['index'])
            elif cs == 'Paon':
                session['index'] = str(len(n) // max_content - 1)
                return jsonify(code='ok',indexs=session['index'])
            elif cs == 'next':
                session['mp4All'] = True
                return jsonify(code='ok',indexs=session['index'])
                # return render_template('searchVideo.html',filepath=result,indexs = '1',text=text,arrylen = len(result))
            elif cs == 'maxlines':
                maxline = jsondata['max']
                max_content = int(maxline)
                return jsonify(code='ok',indexs=session['index'])
            elif cs == 'live':
                get_live_video = session.get('live',None)
                if get_live_video == None:
                    get_live_video = []
                live = [jsondata.get('name',None),jsondata.get('value',None)]
                get_live_video.append(live)
                session['live'] = get_live_video
                return jsonify(code='ok',indexs=session['index'],state='ok')
            elif cs == 'outlive':
                get_live_video = session.get('live',None)
                live = [jsondata.get('name',None),jsondata.get('value',None)]
                try:
                    get_live_video.remove(live)
                    session['live'] = get_live_video
                except ValueError:
                    return jsonify(code='okout',indexs=session['index'],state='no')
                return jsonify(code='okout',indexs=session['index'],state='ok')
        else:
            if request.form.get('cs', None) == 'new':
                text = request.form.get('text', None)
                if text != '' and text not in sessionhistory:
                    print(text,sessionhistory)
                    sessionhistory.append(text)
                    if len(sessionhistory) > 10:
                        sessionhistory.pop(0)
                    print(sessionhistory)
                    session['history'] = sessionhistory
                    print('搜索历史记录',session.get('history', None))
                result = find_in_array(text, n)
                print('返回搜索内容',result)
                return render_template('searchVideo.html',filepath=result,indexs = '1',text=text,arrylen = len(result),inputSearch = session.get('history', None)[::-1])
    elif request.method == 'GET':
        print('访问index',indexlist)
        Allindex = len(n) // max_content
        liveAll = session.get('live', None)
        islive = []
        if mp4All:
            session['mp4All'] = False
            if liveAll != None:
                for i in liveAll:
                    if i in n:
                        islive.append(i)
            else:
                islive = []
            return jsonify(filepath=n,indexs = int(indexlist)+1,Allindex = Allindex,inputSearch = session.get('history', None)[::-1],islive=islive)
        if liveAll != None:
            for i in liveAll:
                if i in n[int(indexlist)*max_content:int(indexlist)*max_content+max_content]:
                    islive.append(i)
        else:
            islive = []
        print('找到的喜欢内容',islive)
        return jsonify(filepath=n[int(indexlist)*max_content:int(indexlist)*max_content+max_content],indexs = int(indexlist)+1,Allindex = Allindex,inputSearch = session.get('history', None)[::-1],islive=islive)
    return jsonify(code='null')




@app.route('/searchVideo',methods=['GET', 'POST'])
def searchVideo():
    return render_template('searchVideo.html')

@app.route('/live',methods=['GET', 'POST'])
def live():
    if not SinglePersonmoodstart:
        livecent = session.get('live', None)
    else:
        livecent = SinglePersonmood['live']
    return render_template('LiveVideo.html',filepath=livecent[::-1],title="live")

@app.route('/systemctl',methods=['GET', 'POST'])
def systemctl():
    if request.method == 'POST':
        json_data = request.get_json()
        file_path = os.path.join(os.path.dirname(__file__), 'history.json')
        
        # 检查文件是否存在
        if not os.path.exists(file_path):
            with open('history.json','w+',encoding='utf-8') as fs:
                nextjson = {json_data['value']:[[json_data['key'],json_data['videogif']]]}
                print('写入1')
                fs.write(json.dumps(nextjson, ensure_ascii=False, indent=4))
        else:
            with open('history.json','r',encoding='utf-8') as f:
                # print(f.read())
                f.seek(0)
                nextjson = json.load(f)
                jsoncopy = copy.deepcopy(nextjson)
                f.close()
                # print(json_data,'\\\\\\\\\\\\\\\\\\\\\\\\')
            if json_data['onname'] == '':
                if json_data['value'] in nextjson:
                    # print("没有找到")
                    nextjson[json_data['value']].append([json_data['key'],json_data['videogif']])
                else:
                    # print("找到了")
                    nextjson[json_data['value']] = [[json_data['key'],json_data['videogif']]]
                # print('写入2')
                with open('history.json','w+',encoding='utf-8') as fs:
                    fs.write(json.dumps(nextjson, ensure_ascii=False, indent=4))
            else:
                if json_data['onname'] in nextjson:
                    nextjson[json_data['onname']].remove([json_data['key'],json_data['videogif']])
                    if len(nextjson[json_data['onname']]) == 0:
                        del nextjson[json_data['onname']]
                if json_data['value'] in nextjson:
                    # print('没有找到2')
                    nextjson[json_data['value']].append([json_data['key'],json_data['videogif']])
                else:
                    # print('找到了2')
                    nextjson[json_data['value']] = [[json_data['key'],json_data['videogif']]]
                # print('写入3')
                with open('history.json','w+',encoding='utf-8') as fs:
                    fs.write(json.dumps(nextjson, ensure_ascii=False, indent=4))
    print("添加成功")
    return jsonify({'status': 'ok'})


@app.route('/delete',methods=['GET', 'POST'])
def delete():
    if request.method == 'POST':
        json_data = request.get_json()
        print(json_data)
        file_path = os.path.join(os.path.dirname(__file__), 'history.json')
        delete_key = json_data['key']
        removemkdir = config["resources"]+"/"+"/".join(delete_key.split("/")[:-1])
        shutil.rmtree(removemkdir)
        logs.deletesave(deletesaveinfo=delete_key)
        print(removemkdir+"删除成功")
        # 检查文件是否存在
        # 检查文件是否存在
        if not os.path.exists(file_path):
            with open('history.json','r',encoding='utf-8') as f:
                nextjson = json.load(f)
                xun = False
                for key,value in nextjson.items():
                    for i in value:
                        if i[0] == json_data['key']:
                            value.remove(i)
                            with open('history.json','w',encoding='utf-8') as f:
                                f.write(json.dumps(nextjson,ensure_ascii=False, indent=4))
                            print("json文件已更新,找到已移除")
                            xun = True
                            break
                    if xun:
                        break
        for values in n:
            if values[0] == delete_key:
                n.remove(values)
                print("播放列表已移除")
        return jsonify({'status': 'ok'})



@app.route('/JSONgetname',methods=['GET', 'POST'])
def JSONgetname():
    if request.method == 'POST':
        json_data = request.get_json()
        file_path = os.path.join(os.path.dirname(__file__), 'history.json')
        if os.path.exists(file_path):
            with open('history.json','r+',encoding='utf-8') as f:
                try:
                    nextjson = json.load(f)
                except json.JSONDecodeError:
                    pass
        try:
            for key,value in nextjson.items():
                for i in value:
                    if i[0] == json_data['key']:
                        return jsonify({'name': key})
                # if value[0] == json_data['key']:
                #     return jsonify({'name': key})
        except UnboundLocalError:
            pass
    return jsonify({'name': ""})
# class MyResponse(app.response_class):
#     default_headers = {
#         'Cache-Control': 'max-age=10',
#     }
 
# app.response_class = MyResponse

if __name__ == '__main__':
    app.run(debug=False,host='0.0.0.0',port=5000)