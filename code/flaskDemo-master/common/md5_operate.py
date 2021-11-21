import hashlib
from config.setting import MD5_SALT


def get_md5(username, str):
    """MD5 encryption processing"""
    str = username + str + MD5_SALT  # The user name is also used as part of str encryption
    md5 = hashlib.md5()  # Create md5 object
    md5.update(str.encode("utf-8"))  # In Python3, it needs to be converted to bytes type before encryption
    return md5.hexdigest()  # Return ciphertext
