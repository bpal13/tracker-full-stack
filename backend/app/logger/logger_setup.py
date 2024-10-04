import logging
import logging.config
import yaml

# logger = logging.getLogger(__name__)

# logging.basicConfig(filename="app/logs/tracker.log", level=logging.INFO,
#                     format="%(asctime)s: %(message)s", datefmt="%Y-%m-%d %I:%M:%S %p" )



def logger_setup():

    with open("app/logger/logger_conf.yaml", 'rt') as file:
        config = yaml.safe_load(file.read())
        logging.config.dictConfig(config)



