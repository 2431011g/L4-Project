import os, sys
from config.setting import SERVER_PORT
from api.user import app

# Project root path
BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_PATH)  # Add the project root path to the environment variable temporarily, and it will become invalid after the program exits

if __name__ == '__main__':
    # host is the host ip address, port specifies the access port number, debug=True sets the debug mode to open
    app.run(host="0.0.0.0", port=SERVER_PORT, debug=True)
