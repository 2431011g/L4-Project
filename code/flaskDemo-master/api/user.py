from flask import Flask, jsonify, request
from common.mysql_operate import db
from common.redis_operate import redis_db
from common.md5_operate import get_md5
import random
import re, time

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False  # jsonify返回的中文正常显示


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route("/user", methods=["GET"])
def get_all_users():
    """获取所有用户信息"""
    sql = "SELECT * FROM user"
    data = db.select_db(sql)
    print("获取所有用户信息 == >> {}".format(data))
    return jsonify({"code": 0, "data": data, "msg": "查询成功"})


@app.route("/users/<string:username>", methods=["GET"])
def get_user(username):
    """获取某个用户信息"""
    sql = "SELECT * FROM user WHERE user_name = '{}'".format(username)
    data = db.select_db(sql)
    print("获取 {} 用户信息 == >> {}".format(username, data))
    if data:
        return jsonify({"code": 0, "data": data, "msg": "查询成功"})
    return jsonify({"code": "1004", "msg": "查不到相关用户的信息"})


@app.route("/user/register", methods=['POST'])
def user_register():
    """注册用户"""
    username = request.json.get("user_name", "").strip()  # 用户名
    password = request.json.get("password", "").strip()  # 密码
    confirm_password = request.json.get("confirm_password", "").strip()  # 密码
    email = request.json.get("email", "").strip()  # 地址，默认为空串
    if username and password and confirm_password: # 注意if条件中 "" 也是空, 按False处理
        sql1 = "SELECT user_name FROM user WHERE user_name = '{}'".format(username)
        res1 = db.select_db(sql1)
        print("user name already exist ==>> {}".format(res1))
        sql2 = "SELECT email FROM user WHERE email = '{}'".format(email)
        res2 = db.select_db(sql2)
        print("email already exist ==>> {}".format(res2))
        if res1:
            return jsonify({"status": "fail", "error_message": "register fialed, user name already exist!"})
        elif res2:
            return jsonify({"status": "fail", "error_message": "register failed, email already exist!"})
        else:
            sql3 = "INSERT INTO user(user_name, password, email) " \
                  "VALUES('{}', '{}', '{}')".format(username, password, email)
            db.execute_db(sql3)
            print("insert user SQL ==>> {}".format(sql3))
            return jsonify({"status": "success", "error_message": "register success!"})
    else:
        return jsonify({"status": "fail", "error_message": "please check your params！"})


@app.route("/user/login", methods=['POST'])
def user_login():
    username = request.json.get("user_name", "").strip()
    password = request.json.get("password", "").strip()
    if username and password: # 注意if条件中空串 "" 也是空, 按False处理
        sql1 = "SELECT user_name FROM user WHERE user_name = '{}'".format(username)
        res1 = db.select_db(sql1)
        print("find user ==>> {}".format(res1))
        if not res1:
            return jsonify({"status": "fail", "error_message": "user not exist!"})
        sql2 = "SELECT * FROM user WHERE user_name = '{}' and password = '{}'".format(username, password)
        res2 = db.select_db(sql2)
        print("get user info {} == >> {}".format(username, res2))
        if res2:
            sql3 = "INSERT INTO session(user_id) " \
                   "VALUES('{}')".format(res2[0]["id"])
            db.execute_db(sql3)
            sql4 = "SELECT * FROM session WHERE user_id = '{}' order by id desc limit 1".format(res2[0]["id"])
            res4 = db.select_db(sql4)
            if res4:
                return jsonify({"status": "success", "session_id": res4[0]["id"], "error_message": "login success！"})
            else:
                return jsonify({"status": "fail", "error_message": "login failed！"})
        return jsonify({"status": "fail", "error_message": "user name or password incorrect！"})
    else:
        return jsonify({"status": "fail", "error_message": "user name or password incorrect！"})

@app.route("/update/user/<int:id>", methods=['PUT'])
def user_update(id): # id为准备修改的用户ID
    """修改用户信息"""
    admin_user = request.json.get("admin_user", "").strip() # 当前登录的管理员用户
    token = request.json.get("token", "").strip()  # token口令
    new_password = request.json.get("password", "").strip()  # 新的密码
    new_sex = request.json.get("sex", "0").strip()  # 新的性别，如果参数不传sex，那么默认为0(男性)
    new_telephone = request.json.get("telephone", "").strip()  # 新的手机号
    new_address = request.json.get("address", "").strip()  # 新的联系地址，默认为空串
    if admin_user and token and new_password and new_telephone: # 注意if条件中空串 "" 也是空, 按False处理
        if not (new_sex == "0" or new_sex == "1"):
            return jsonify({"code": 4007, "msg": "输入的性别只能是 0(男) 或 1(女)！！！"})
        elif not (len(new_telephone) == 11 and re.match("^1[3,5,7,8]\d{9}$", new_telephone)):
            return jsonify({"code": 4008, "msg": "手机号格式不正确！！！"})
        else:
            redis_token = redis_db.handle_redis_token(admin_user) # 从redis中取token
            if redis_token:
                if redis_token == token: # 如果从redis中取到的token不为空，且等于请求body中的token
                    sql1 = "SELECT role FROM user WHERE username = '{}'".format(admin_user)
                    res1 = db.select_db(sql1)
                    print("根据用户名 【 {} 】 查询到用户类型 == >> {}".format(admin_user, res1))
                    user_role = res1[0]["role"]
                    if user_role == 0: # 如果当前登录用户是管理员用户
                        sql2 = "SELECT * FROM user WHERE id = '{}'".format(id)
                        res2 = db.select_db(sql2)
                        print("根据用户ID 【 {} 】 查询到用户信息 ==>> {}".format(id, res2))
                        sql3 = "SELECT telephone FROM user WHERE telephone = '{}'".format(new_telephone)
                        res3 = db.select_db(sql3)
                        print("返回结果：{}".format(res3))
                        print("查询到手机号 ==>> {}".format(res3))
                        if not res2: # 如果要修改的用户不存在于数据库中，res2为空
                            return jsonify({"code": 4005, "msg": "修改的用户ID不存在，无法进行修改，请检查！！！"})
                        elif res3: # 如果要修改的手机号已经存在于数据库中，res3非空
                            return jsonify({"code": 4006, "msg": "手机号已被注册，无法进行修改，请检查！！！"})
                        else:
                            # 如果请求参数不传address，那么address字段不会被修改，仍为原值
                            if not new_address:
                                new_address = res2[0]["address"]
                            # 把传入的明文密码通过MD5加密变为密文
                            new_password = get_md5(res2[0]["username"], new_password)
                            sql3 = "UPDATE user SET password = '{}', sex = '{}', telephone = '{}', address = '{}' " \
                                   "WHERE id = {}".format(new_password, new_sex, new_telephone, new_address, id)
                            db.execute_db(sql3)
                            print("修改用户信息SQL ==>> {}".format(sql3))
                            return jsonify({"code": 0, "msg": "恭喜，修改用户信息成功！"})
                    else:
                        return jsonify({"code": 4004, "msg": "当前用户不是管理员用户，无法进行操作，请检查！！！"})
                else:
                    return jsonify({"code": 4003, "msg": "token口令不正确，请检查！！！"})
            else:
                return jsonify({"code": 4002, "msg": "当前用户未登录，请检查！！！"})
    else:
        return jsonify({"code": 4001, "msg": "管理员用户/token口令/密码/手机号不能为空，请检查！！！"})


@app.route("/task/list", methods=["POST"])
def get_all_tasks():
    #get user id from session first
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        res1 = db.select_db(sql1)
        tag = request.json.get("tag", "").strip()
        if res1:
            sql2 = "SELECT * FROM tasks WHERE user_id = '{}' and tag = '{}' and task_name != '' ".format(res1[0]['user_id'], tag)
            res2 = db.select_db(sql2)
            print("get tasks for user: {} == >> {}".format(res1[0], res2))
            if res2:
                for item in res2:
                    item['create_time'] = str(item['create_time'])
                    item['update_time'] = str(item['update_time'])
                return jsonify({"status": "success", "error_message": "retrieve success!", "data": res2})
            else:
                return jsonify({"status": "success", "error_message": "there's no task for the user!"})
        else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})



@app.route("/task/category/list", methods=["POST"])
def get_all_categorys():
    #get user id from session first
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        res1 = db.select_db(sql1)
        if res1:
            sql2 = "SELECT distinct tag FROM tasks"
            res2 = db.select_db(sql2)
            print("get tasks tags for user: {} == >> {}".format(res1[0], res2))
            if res2:
                res = []
                i = 1
                for item in res2:
                    d = {'category_id':i,'tag':item}
                    res.append(d)
                    i = i + 1
                return jsonify({"status": "success", "error_message": "retrieve success!", "data": res})
            else:
                return jsonify({"status": "success", "error_message": "there's no tags for the user!"})
        else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})



@app.route("/task/category/delete", methods=["POST"])
def delete_category():
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            task_id = request.json.get("tag")
            sql3 = "DELETE FROM tasks WHERE tag = '{}'".format(task_id)
            db.execute_db(sql3)
            print("insert task SQL ==>> {}".format(sql3))
            return jsonify({"status": "success"})
        else:
            return jsonify({"status": "fail", "error_message": "please check your params"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})


@app.route("/task/category/update", methods=["POST"])
def modify_category():
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            old_tag = request.json.get("old_tag")
            new_tag = request.json.get("new_tag")
            sql3 = "UPDATE tasks SET tag = '{}' WHERE tag = '{}'".format(new_tag, old_tag)
            db.execute_db(sql3)
            print("insert task SQL ==>> {}".format(sql3))
            return jsonify({"status": "success"})
        else:
            return jsonify({"status": "fail", "error_message": "please check your params"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})


@app.route("/task/category/add", methods=["POST"])
def add_category():
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            tag = request.json.get("tag_name")
            sql3 = "INSERT INTO tasks(tag) " \
                   "VALUES('{}')".format(tag)
            db.execute_db(sql3)
            print("insert task SQL ==>> {}".format(sql3))
            return jsonify({"status": "success"})
        else:
            return jsonify({"status": "fail", "error_message": "please check your params"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})


@app.route("/task/add", methods=["POST"])
def add_task():
    # get user id from session first
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            task_name = request.json.get("task_name", "").strip()
            tag = request.json.get("tag", "").strip()
            task_date = request.json.get("task_date", "").strip()
            if task_name and task_date:
                sql3 = "INSERT INTO tasks(task_name, tag, task_date, user_id) " \
                       "VALUES('{}','{}', '{}', '{}')".format(task_name,tag, task_date, userId[0]["user_id"])
                db.execute_db(sql3)
                print("insert task SQL ==>> {}".format(sql3))
                return jsonify({"status": "success"})
            else:
                return jsonify({"status": "fail", "error_message": "please check your params"})
        else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})


@app.route("/feedback/submit", methods=["POST"])
def feedback_submit():
    # get user id from session first
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            content = request.json.get("content", "").strip()
            if content:
                sql3 = "INSERT INTO feedback(user_id, content) " \
                       "VALUES('{}','{}')".format(userId[0]["user_id"], content)
                db.execute_db(sql3)
                print("insert task SQL ==>> {}".format(sql3))
                return jsonify({"status": "success"})
            else:
                return jsonify({"status": "fail", "error_message": "please check your params"})
        else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})


@app.route("/collected_data/submit", methods=["POST"])
def collected_data_submit():
    # get user id from session first
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            type = request.json.get("type", "").strip()
            num = request.json.get("num", "").strip()
            if type and num:
                sql3 = "INSERT INTO collected_data(user_id, type, num) " \
                       "VALUES('{}','{}','{}')".format(userId[0]["user_id"], type, num)
                db.execute_db(sql3)
                print("insert task SQL ==>> {}".format(sql3))
                return jsonify({"status": "success"})
            else:
                return jsonify({"status": "fail", "error_message": "please check your params"})
        else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})


@app.route("/collected_data/list", methods=["POST"])
def collected_data_list():
    # get user id from session first
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            data = []
            data.append("you have 5 contacts in your phone")
            return jsonify({"status": "success", "data": data})
        else:
            return jsonify({"status": "fail", "error_message": "please check your params"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})


@app.route("/task/delete", methods=["POST"])
def delete_task():
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            task_id = request.json.get("task_id")
            if task_id:
                sql2 = "SELECT * FROM tasks WHERE task_id = '{}'".format(task_id)
                res2 = db.select_db(sql2)
                if res2 and res2[0]['user_id'] == userId[0]["user_id"]:
                    sql3 = "DELETE FROM tasks WHERE task_id = '{}'".format(task_id)
                    db.execute_db(sql3)
                    print("insert task SQL ==>> {}".format(sql3))
                    return jsonify({"status": "success"})
                else:
                    return jsonify({"status": "fail", "error_message": "task owner is not user: " + userId[0]["user_id"]})
            else:
                return jsonify({"status": "fail", "error_message": "please check your params"})
        else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})


@app.route("/task/complete", methods=["POST"])
def complete_task():
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            task_id = request.json.get("task_id")
            if task_id:
                sql2 = "SELECT * FROM tasks WHERE task_id = '{}'".format(task_id)
                res2 = db.select_db(sql2)
                if res2 and res2[0]['user_id'] == userId[0]["user_id"]:
                    task_status = "completed"
                    if res2[0]['task_status'] == 'completed':
                        task_status = "in_progress"
                    sql3 = "UPDATE tasks SET task_status = '{}' WHERE task_id = '{}'".format(task_status, task_id)
                    db.execute_db(sql3)
                    print("insert task SQL ==>> {}".format(sql3))
                    return jsonify({"status": "success"})
                else:
                    return jsonify(
                        {"status": "fail", "error_message": "task owner is not user: " + userId[0]["user_id"]})
            else:
                return jsonify({"status": "fail", "error_message": "please check your params"})
        else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})
    else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})


@app.route("/page/log", methods=["POST"])
def page_log():
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            page_id = request.json.get('page_id')
            if page_id:
                sql3 = "INSERT INTO page_log(user_id, page_id) " \
                       "VALUES('{}', '{}')".format(userId[0]["user_id"], page_id)
                db.execute_db(sql3)
                print("insert page log SQL ==>> {}".format(sql3))
                return jsonify({"status": "success", "error_message": "page log success!"})
            else:
                return jsonify({"status": "fail", "error_message": "fail to get param page id!"})
        else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})


@app.route("/page/need_window", methods=["POST"])
def need_window():
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            need = random.randint(0, 9)
            if need % 2 == 1:
                content = "this is a window"
                window_id = get_window_id(userId[0]["user_id"])
                sql3 = "INSERT INTO window_log(id, user_id, content) " \
                       "VALUES('{}','{}', '{}')".format(window_id, userId[0]["user_id"], content)
                db.execute_db(sql3)
                print("insert window log SQL ==>> {}".format(sql3))
                return jsonify({"status": "success", "need": "true", "window_id": int(window_id), "content": content})
            else:
                return jsonify({"status": "success", "need": "false"})
        else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})


@app.route("/page/close_window", methods=["POST"])
def close_window():
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            window_id = request.json.get('window_id')
            rate = request.json.get("rate", "").strip()
            comment = request.json.get("comment", "").strip()
            if window_id:
                sql2 = "SELECT * FROM window_log WHERE id = '{}'".format(window_id)
                res2 = db.select_db(sql2)
                if res2:
                    timeArray = time.strptime(str(res2[0]['create_time']), "%Y-%m-%d %H:%M:%S")
                    timeStamp = int(time.mktime(timeArray))
                    sql3 = "UPDATE window_log SET rate = '{}',comment = '{}', read_time = '{}' WHERE id = '{}' ".format(rate, comment, str(int(time.time()) - timeStamp), window_id)
                    db.execute_db(sql3)
                    print("update window log SQL ==>> {}".format(sql3))
                    return jsonify({"status": "success"})
                else:
                    return jsonify({"status": "fail", "error_message": "window id not correct!"})
            else:
                return jsonify({"status": "fail", "error_message": "window id not correct!"})
        else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})


@app.route("/location/record", methods=["POST"])
def record_location():
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            longtitude = request.json.get("longitude", "").strip()
            latitude = request.json.get("latitude", "").strip()
            place = request.json.get("place", "").strip()
            sql3 = "INSERT INTO location_log(longitude, latitude, user_id, place) " \
                   "VALUES('{}','{}', '{}', '{}')".format(longtitude, latitude, userId[0]["user_id"], place)
            db.execute_db(sql3)
            print("insert window log SQL ==>> {}".format(sql3))
            return jsonify({"status": "success"})
        else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})


@app.route("/location/logs", methods=["POST"])
def location_logs():
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            sql2 = "SELECT * FROM location_log WHERE user_id = '{}' order by id desc".format(userId[0]["user_id"])
            res2 = db.select_db(sql2)
            if res2:
                for item in res2:
                    item['create_time'] = str(item['create_time'])
                    item['update_time'] = str(item['update_time'])
                return jsonify({"status": "success", "data": res2})
            else:
                return jsonify({"status": "success", "error_message": "no location record found"})
        else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})


def get_window_id(user_id):
    today = time.strftime("%m%d", time.localtime(time.time()))
    return str(user_id) + today + str(random.randint(0, 999))


@app.route("/data/collect", methods=["POST"])
def data_collect():
    # get user id from session first
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            type = request.json.get("type", "").strip()
            if type:
                sql3 = "INSERT INTO collect_data_log(user_id, type) " \
                       "VALUES('{}','{}')".format(userId[0]["user_id"], type)
                db.execute_db(sql3)
                print("insert task SQL ==>> {}".format(sql3))
                return jsonify({"status": "success"})
            else:
                return jsonify({"status": "fail", "error_message": "please check your params"})
        else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})


@app.route("/data/collect/summary", methods=["POST"])
def collected_data_summary():
    # get user id from session first
    session_id = request.headers.get('session_id').strip()
    if session_id:
        sql1 = "SELECT user_id FROM session WHERE id = '{}'".format(session_id)
        userId = db.select_db(sql1)
        if userId and userId[0] and userId[0]["user_id"]:
            sql2 = "SELECT count(1) as num FROM collect_data_log where user_id= '{}'".format(userId[0]["user_id"])
            res2 = db.select_db(sql2)
            print("get tasks tags for user: {} == >> {}".format(userId[0], res2))
            if res2:
                d = {'total': res2[0]['num']}
                return jsonify({"status": "success", "error_message": "retrieve success!", "data": d})
            else:
                return jsonify({"status": "success", "error_message": "there's no tags for the user!"})
        else:
            return jsonify({"status": "fail", "error_message": "user not log in!"})
    else:
        return jsonify({"status": "fail", "error_message": "user not log in!"})

