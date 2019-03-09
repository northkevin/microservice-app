# services/users/manage.py
import sys
print("ehhhh?",file=sys.stderr)

from flask.cli import FlaskGroup

from project import app

cli = FlaskGroup(app)

if __name__ == '__main__':
    cli()