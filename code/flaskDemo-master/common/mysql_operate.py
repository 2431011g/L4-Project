import pymysql
from config.setting import MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWD, MYSQL_DB

class MysqlDb():

    def __init__(self, host, port, user, passwd, db):
        # Establish a database connection
        self.conn = pymysql.connect(
            host=host,
            port=port,
            user=user,
            passwd=passwd,
            db=db,
            autocommit=True
        )
        # Create a cursor object through cursor() and output the query result in dictionary format
        self.cur = self.conn.cursor(cursor=pymysql.cursors.DictCursor)

    def __del__(self): # Triggered when the object resource is released, the last operation when the object is about to be deleted
        # Close the cursor
        self.cur.close()
        # Close the database connection
        self.conn.close()

    def select_db(self, sql):
        """Inquire"""
        # Check whether the connection is disconnected, and reconnect if disconnected
        self.conn.ping(reconnect=True)
        # Use execute() to execute sql
        self.cur.execute(sql)
        # Use fetchall() to get query results
        data = self.cur.fetchall()
        return data

    def execute_db(self, sql):
        """Update/Add/Delete"""
        try:
            # Check whether the connection is disconnected, and reconnect if disconnected
            self.conn.ping(reconnect=True)
            # Use execute() to execute sql
            self.cur.execute(sql)
            # Commit transaction
            self.conn.commit()
        except Exception as e:
            print("An error occurred during operation: {}".format(e))
            # Roll back all changes
            self.conn.rollback()

db = MysqlDb(MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWD, MYSQL_DB)
