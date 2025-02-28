from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Contact
from app.forms import ContactForm
from datetime import datetime


contact_routes = Blueprint('contacts', __name__)


# GET all session user's contacts
@contact_routes.route('/', methods=['GET'])
@login_required
def get_contacts():
    """
    Return all contacts in a list
    """
    contacts = Contact.query.filter(Contact.user_id == current_user.id).all()
    return jsonify({'contacts': [contact.to_dict() for contact in contacts]}), 200


# POST a new contact
@contact_routes.route('', methods=['POST'])
@login_required
def create_contact():
    """
    Create a new contact for the current user
    """
    form = ContactForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        contact = Contact(
            user_id=current_user.id,
            first_name=form.data['first_name'],
            last_name=form.data['last_name'],
            relation_type=form.data['relation_type'],
            city=form.data.get('city', ''),
            state=form.data.get('state', ''),
            number=form.data.get('number', ''),
            job_title=form.data.get('job_title', ''),
            company=form.data.get('company', ''),
            init_meeting_note=form.data['init_meeting_note'],
            distinct_memory_note=form.data['distinct_memory_note']
        )
        
        db.session.add(contact)
        db.session.commit()
        
        return jsonify(contact.to_dict()), 200
    
    return jsonify({'errors': form.errors}), 400


# GET a session user's contact by id
@contact_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_connection(id):
    """
    Return a specific contact
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


