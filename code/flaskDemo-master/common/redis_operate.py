import redis
from config.setting import REDIS_HOST, REDIS_PORT, REDIS_PASSWD, EXPIRE_TIME


class RedisDb():

    def __init__(self, host, port, passwd):
        # Establish a database connection
        self.r = redis.Redis(
            host=host,
            port=port,
            password=passwd,
            decode_responses=True # get() Get string type data
        )

    def handle_redis_token(self, key, value=None):
        if value:# If the value is not empty, then set the key and value, EXPIRE_TIME is the expiration time
            self.r.set(key, value, ex=EXPIRE_TIME)
        else: # If the value is empty, then directly get the value from redis through the key
            redis_token = self.r.get(key)
            return redis_token


redis_db = RedisDb(REDIS_HOST, REDIS_PORT, REDIS_PASSWD)
