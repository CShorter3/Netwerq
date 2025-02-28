from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Contact
from app.forms import ContactForm

contact_routes = Blueprint('contacts', __name__)

# GET all session user's contacts
@contact_routes.route('/', methods=['GET'])
@login_required
def get_contacts():
    """
    Returns all contacts in a list
    """
    contacts = Contact.query.filter(Contact.user_id == current_user.id).all()
    return jsonify({'contacts': [contact.to_dict() for contact in contacts]}), 200

# GET a session user's contact by id
@contact_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_connection(id):
    """
    Returns a specific contact
    """
    #print(f"Fetching contact with ID: {id}")

    contact = Contact.query.get(id)
    #print("Contact:", contact)

    # Ensure contact exists
    if not contact:
        return jsonify({'errors': {'message': 'Contact not found'}}), 404
        
    # Ensure contact belongs to session user
    if contact.user_id != current_user.id:
        return jsonify({'errors': {'message': 'Unauthorized'}}), 403
        
    return jsonify(contact.to_dict()), 200