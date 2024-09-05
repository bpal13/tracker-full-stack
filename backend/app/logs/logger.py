import logging

logger = logging.getLogger(__name__)

logging.basicConfig(filename="app/logs/myapp.log", level=logging.INFO,
                    format="%(asctime)s: %(message)s", datefmt="%Y-%m-%d %I:%M:%S %p" )

