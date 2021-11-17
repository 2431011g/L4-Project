# flaskDemo

The technical selection of this interface project: Python+Flask+MySQL+Redis, the interface is developed through Python+Falsk, MySQL is used to store user information, and Redis is used to store tokens. It is currently a pure back-end interface, and there is no front-end interface. The request interface can be accessed through tools such as Postman, Jmeter, and Fiddler.


## Project deployment

First, after downloading the project source code, find the requirements.txt file in the root directory, then install the requirements.txt dependency through the pip tool, and execute the command:

```
pip3 install -r requirements.txt
```

Next, deploy the project. In this project, Python is actually used to execute the app.py file. The following is my deployment command on Linux.

```
# /root/flaskDemo/app.py Indicates the path of the app.py startup entry file under the project root path
# /root/flaskDemo/flaskDemo.log Indicates the output log file path
nohup python3 /root/flaskDemo/app.py >/root/flaskDemo/flaskDemo.log 2>&1 &
```

## Database Design

The database table statement is as follows:

```
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` tinyint(1) NOT NULL,
  `sex` tinyint(1) DEFAULT NULL,
  `telephone` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `telephone` (`telephone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

The corresponding meanings of the fields in the user table are as follows:

```
id: user id number, self-increasing
username: username
password: password
role: user role, 0 means administrator user, 1 means normal user
sex: sex, 0 means male, 1 means female, it is allowed to be empty
telephone: mobile phone number
address: contact address, it is allowed to be empty
```

## Interface request example

-Get all user interface request examples (you can request directly in the browser input field):

```
Request method: GET
Request address: http://127.0.0.1:9999/users
```

- Get an example of wintest user interface request (you can request it directly in the browser input field):

```
Request method: GET
Request address: http://127.0.0.1:9999/users/wintest
```

- Example of user registration interface request:

```
Request method: POST
Request address: http://127.0.0.1:9999/register
Request header:
Content-Type: application/json

Body：{"username": "wintest5", "password": "123456", "sex": "1", "telephone":"13500010005", "address": "上海市黄浦区"}
```

- Example of user login interface request:

```
Request method: POST
Request address: http://127.0.0.1:9999/login
Request header:
Content-Type: application/x-www-form-urlencoded

Body：username=wintest&password=123456
```

- Example of a request to modify the user interface (the token can be obtained from the interface return data after the user logs in successfully):

```
Request method: PUT
Request address: http://127.0.0.1:9999/update/user/3
Request header:
Content-Type: application/json

Body：{"admin_user": "wintest", "token": "f54f9d6ebba2c75d45ba00a8832cb593", "sex": "1", "address": "广州市天河区", "password": "12345678", "telephone": "13500010003"}
```

-Example of a request to delete a user interface (the token can be obtained from the interface return data after the user logs in successfully):

```
Request method: POST
Request address: http://127.0.0.1:9999/delete/user/test
Request header:
Content-Type: application/json

Body：{"admin_user": "wintest", "token": "wintest1587830406"}
```
