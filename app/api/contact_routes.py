from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Contact
from app.forms import ContactForm

contact_routes = Blueprint('contacts', __name__)

# GET users' contacts
@contact_routes.route('/', methods=['GET'])
@login_required
def get_contacts():
    """
    Returns all of the user's contacts a list
    """
    contacts = Contact.query.filter(Contact.user_id == current_user.id).all()
    return {'contacts': [contact.to_dict() for contact in contacts]}, 200

# GET a user's contact
@contact_routes('/<int:id>', methods=['GET'])
@login_required
def get_connection(id):
    """
    Returns a specific user's contact by id
    """
    contact = Contact.query.get(id)
    
    # Ensure contact exists
    if not contact:
        return {'errors': {'message': 'Contact not found'}}, 404
        
    # Ensure contact belongs to session user
    if contact.user_id != current_user.id:
        return {'errors': {'message': 'Unauthorized'}}, 403
        
    return contact.to_dict(), 200