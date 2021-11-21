from flask import Flask, jsonify, request
from common.mysql_operate import db
from common.redis_operate import redis_db
from common.md5_operate import get_md5
import re, time

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False  


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route("/users", methods=["GET"])
def get_all_users():
    """Get all user information"""
    sql = "SELECT * FROM user"
    data = db.select_db(sql)
    print("Get all user information == >> {}".format(data))
    return jsonify({"code": 0, "data": data, "msg": "Search successful"})


@app.route("/users/<string:username>", methods=["GET"])
def get_user(username):
    """Get information about a certain user"""
    sql = "SELECT * FROM user WHERE username = '{}'".format(username)
    data = db.select_db(sql)
    print("Get {} User Info == >> {}".format(username, data))
    if data:
        return jsonify({"code": 0, "data": data, "msg": "Search successfu"})
    return jsonify({"code": "1004", "msg": "Can't find relevant user information"})


@app.route("/register", methods=['POST'])
def user_register():
    """Register"""
    username = request.json.get("username", "").strip()  # Username
    password = request.json.get("password", "").strip()  # Password
    sex = request.json.get("sex", "0").strip()  # Gender, default is 0 (male)
    telephone = request.json.get("telephone", "").strip()  # telephone number
    address = request.json.get("address", "").strip()  # Address, the default is an empty string
    if username and password and telephone: # Note that the "" in the if condition is also empty, treat it as False
        sql1 = "SELECT username FROM user WHERE username = '{}'".format(username)
        res1 = db.select_db(sql1)
        print("Query the user name ==>> {}".format(res1))
        sql2 = "SELECT telephone FROM user WHERE telephone = '{}'".format(telephone)
        res2 = db.select_db(sql2)
        print("Find mobile phone number ==>> {}".format(res2))
        if res1:
            return jsonify({"code": 2002, "msg": "Username already exists, registration failed!"})
        # elif not (sex == "0" or sex == "1"):
        #     return jsonify({"code": 2003, "msg": "The entered gender can only be 0 (male) or 1 (female)!"})
        elif not (len(telephone) == 11 and re.match("^1[3,5,7,8]\d{9}$", telephone)):
            return jsonify({"code": 2004, "msg": "Phone number format is incorrect!"})
        elif res2:
            return jsonify({"code": 2005, "msg": "The phone number has been registered!"})
        else:
            password = get_md5(username, password) # Convert the incoming plaintext password into ciphertext through MD5 encryption, and then register
            sql3 = "INSERT INTO user(username, password, role, sex, telephone, address) " \
                  "VALUES('{}', '{}', '1', '{}', '{}', '{}')".format(username, password, sex, telephone, address)
            db.execute_db(sql3)
            print("Add user informationSQL ==>> {}".format(sql3))
            return jsonify({"code": 0, "msg": "Congratulations, the registration is successful!"})
    else:
        return jsonify({"code": 2001, "msg": "Username/password/phone number cannot be empty, please check! ! !"})


@app.route("/login", methods=['POST'])
def user_login():
    """Login"""
    username = request.values.get("username", "").strip()
    password = request.values.get("password", "").strip()
    if username and password: # Note that the empty string "" in the if condition is also empty, which is treated as False
        sql1 = "SELECT username FROM user WHERE username = '{}'".format(username)
        res1 = db.select_db(sql1)
        print("Query the user name ==>> {}".format(res1))
        if not res1:
            return jsonify({"code": 1003, "msg": "Username does not exist!"})
        md5_password = get_md5(username, password) # Convert the incoming plaintext password into ciphertext through MD5 encryption
        sql2 = "SELECT * FROM user WHERE username = '{}' and password = '{}'".format(username, md5_password)
        res2 = db.select_db(sql2)
        print("Get {} User Infor == >> {}".format(username, res2))
        if res2:
            timeStamp = int(time.time()) # Get current timestamp
            # token = "{}{}".format(username, timeStamp)
            token = get_md5(username, str(timeStamp)) # Get token after MD5 encryption
            redis_db.handle_redis_token(username, token) # Put the token in redis for storage
            login_info = { # Construct a field and return id/username/token/login_time
                "id": res2[0]["id"],
                "username": username,
                "token": token,
                "login_time": time.strftime("%Y/%m/%d %H:%M:%S")
            }
            return jsonify({"code": 0, "login_info": login_info, "msg": "The registration is successful!"})
        return jsonify({"code": 1002, "msg": "Wrong user name or password!"})
    else:
        return jsonify({"code": 1001, "msg": "Username or password cannot be empty!"})

@app.route("/update/user/<int:id>", methods=['PUT'])
def user_update(id): # id is the user ID to be modified
    """Modify user information"""
    admin_user = request.json.get("admin_user", "").strip() # The currently logged-in administrator user
    token = request.json.get("token", "").strip()  # token
    new_password = request.json.get("password", "").strip()  # new password
    new_sex = request.json.get("sex", "0").strip()  # The new gender, if the parameter does not pass sex, then the default is 0 (male)
    new_telephone = request.json.get("telephone", "").strip()  # new telephone number
    new_address = request.json.get("address", "").strip()  # New contact address, empty string by default
    if admin_user and token and new_password and new_telephone: # Note that the empty string "" in the if condition is also empty, which is treated as False
        # if not (new_sex == "0" or new_sex == "1"):
        #     return jsonify({"code": 4007, "msg": "Error！"})
        if not (len(new_telephone) == 11 and re.match("^1[3,5,7,8]\d{9}$", new_telephone)):
            return jsonify({"code": 4008, "msg": "Phone number format is incorrect! ! !"})
        else:
            redis_token = redis_db.handle_redis_token(admin_user) # Take token from redis
            if redis_token:
                if redis_token == token: # If the token obtained from redis is not empty and equal to the token in the request body
                    sql1 = "SELECT role FROM user WHERE username = '{}'".format(admin_user)
                    res1 = db.select_db(sql1)
                    print("According to username 【 {} 】 query the user type == >> {}".format(admin_user, res1))
                    user_role = res1[0]["role"]
                    if user_role == 0: # If the currently logged-in user is an administrator user
                        sql2 = "SELECT * FROM user WHERE id = '{}'".format(id)
                        res2 = db.select_db(sql2)
                        print("According to user ID 【 {} 】 query the user info ==>> {}".format(id, res2))
                        sql3 = "SELECT telephone FROM user WHERE telephone = '{}'".format(new_telephone)
                        res3 = db.select_db(sql3)
                        print("Return result：{}".format(res3))
                        print("Query mobile phone number ==>> {}".format(res3))
                        if not res2: # If the user to be modified does not exist in the database, res2 is empty
                            return jsonify({"code": 4005, "msg": "The modified user ID does not exist and cannot be modified, please check!"})
                        elif res3: # If the mobile phone number to be modified already exists in the database, res3 is not empty
                            return jsonify({"code": 4006, "msg": "The phone number has been registered and cannot be modified, please check!"})
                        else:
                            # If the request parameter does not pass address, then the address field will not be modified and will remain the original value
                            if not new_address:
                                new_address = res2[0]["address"]
                            # Convert the incoming plaintext password into ciphertext through MD5 encryption
                            new_password = get_md5(res2[0]["username"], new_password)
                            sql3 = "UPDATE user SET password = '{}', sex = '{}', telephone = '{}', address = '{}' " \
                                   "WHERE id = {}".format(new_password, new_sex, new_telephone, new_address, id)
                            db.execute_db(sql3)
                            print("Modify user informationSQL ==>> {}".format(sql3))
                            return jsonify({"code": 0, "msg": "Modify user information successfully!"})
                    else:
                        return jsonify({"code": 4004, "msg": "The current user is not an administrator user and cannot be operated. Please check!"})
                else:
                    return jsonify({"code": 4003, "msg": "The token password is incorrect, please check!"})
            else:
                return jsonify({"code": 4002, "msg": "The current user is not logged in, please check!"})
    else:
        return jsonify({"code": 4001, "msg": "The administrator user/token password/password/mobile phone number cannot be empty, please check!"})

@app.route("/delete/user/<string:username>", methods=['POST'])
def user_delete(username):
    admin_user = request.json.get("admin_user", "").strip()  # The currently logged-in administrator user
    token = request.json.get("token", "").strip()  # token
    if admin_user and token:
        redis_token = redis_db.handle_redis_token(admin_user)  # Take token from redis
        if redis_token:
            if redis_token == token:  # If the token obtained from redis is not empty and equal to the token in the request body
                sql1 = "SELECT role FROM user WHERE username = '{}'".format(admin_user)
                res1 = db.select_db(sql1)
                print("According to username 【 {} 】 query the user type == >> {}".format(admin_user, res1))
                user_role = res1[0]["role"]
                if user_role == 0:  # If the currently logged-in user is an administrator user
                    sql2 = "SELECT * FROM user WHERE username = '{}'".format(username)
                    res2 = db.select_db(sql2)
                    print(sql2)
                    print("According to username【 {} 】 query the user type ==>> {}".format(username, res2))
                    if not res2:  # If the user to be deleted does not exist in the database, res2 is empty
                        return jsonify({"code": 3005, "msg": "The deleted user name does not exist and cannot be deleted, please check!"})
                    elif res2[0]["role"] == 0: # If the user to be deleted is an administrator user, deletion is not allowed
                        return jsonify({"code": 3006, "msg": "Username：【 {} 】，This user is not allowed to delete! ! !".format(username)})
                    else:
                        sql3 = "DELETE FROM user WHERE username = '{}'".format(username)
                        db.execute_db(sql3)
                        print("Delete user informationSQL ==>> {}".format(sql3))
                        return jsonify({"code": 0, "msg": "Delete user information successfully!"})
                else:
                    return jsonify({"code": 3004, "msg": "The current user is not an administrator user and cannot be operated. Please check!"})
            else:
                return jsonify({"code": 3003, "msg": "The token is incorrect, please check!"})
        else:
            return jsonify({"code": 3002, "msg": "The current user is not logged in, please check!"})
    else:
        return jsonify({"code": 3001, "msg": "The administrator user/token cannot be empty, please check!"})
