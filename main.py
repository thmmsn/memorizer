#!/usr/bin/env python3
from flask import Flask
from flask.ext.assets import Environment, Bundle
from logging.handlers import SMTPHandler
from models import db
from werkzeug.contrib.fixers import ProxyFix
from views.admin import admin
from views.api import api
from views.quiz import quiz
import logging

app = Flask(__name__)
app.config.from_pyfile('config.py')
app.wsgi_app = ProxyFix(app.wsgi_app)
db.init_app(app)

assets = Environment(app)
js = Bundle('js/ajax.js', filters='jsmin', output='js/min.%(version)s.js')
admin_js = Bundle('js/admin.js', filters='jsmin', output='js/admin.min.%(version)s.js')
app_js = Bundle('js/app.js', filters='jsmin', output='js/app.min.%(version)s.js')
css = Bundle('css/font-awesome.min.css', 'css/styles.css', filters='cssmin', output='css/min.%(version)s.css')
assets.register('js', js)
assets.register('admin_js', admin_js)
assets.register('app_js', app_js)
assets.register('css', css)

ADMINS = ['memorizer@cxhristian.com']
if not app.debug:
    mail_handler = SMTPHandler('127.0.0.1',
                               'server-error@cxhristian.com',
                               ADMINS, '[Flask] Memorizer ERROR')
    mail_handler.setLevel(logging.ERROR)
    app.logger.addHandler(mail_handler)

app.register_blueprint(quiz)
app.register_blueprint(admin, url_prefix='/admin')
app.register_blueprint(api, url_prefix='/api')


@app.context_processor
def utility_processor():
    def percentage(num, total):
        if total > 0:
            return round((num * 100) / total, 2)
        return 0

    def grade(num, total):
        p = percentage(num, total)
        if total == 0:
            return '-'
        if p < 41:
            return 'F'
        elif p < 53:
            return 'E'
        elif p < 65:
            return 'D'
        elif p < 77:
            return 'C'
        elif p < 89:
            return 'B'
        else:
            return 'A'

    return dict(percentage=percentage, grade=grade)


if __name__ == '__main__':
    app.run()
