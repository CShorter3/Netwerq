from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Contact
from app.forms import ContactForm

contact_routes = Blueprint('contacts', __name__)

# GET all of the current user's contacts
@contact_routes.route('/', methods=['GET'])
@login_required
def get_contacts():
    """
    returns all of the user's contacts a list
    """
    print(f"User {current_user.id} is requesting contacts", file=sys.stderr, flush=True)
    contacts = Contact.query.filter(Contact.user_id == current_user.id).all()

    return {'contacts': [contact.to_dict() for contact in contacts]}, 200
