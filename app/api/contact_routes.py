from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Contact
from app.forms import ContactForm

contact_routes = Blueprint('contacts', __name__)

