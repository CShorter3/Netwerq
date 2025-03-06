from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Contact
from app.forms import ContactForm
from app.utils import apply_preset_opportunities
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
        
        # Saving the contact will return a contact.id
        db.session.add(contact)
        db.session.commit()

        apply_preset_opportunities(
            contact_id=contact.id,
            relation_type=contact.relation_type,
            user_id=current_user.id
        )
        
        return jsonify(contact.to_dict()), 200
    else:
        print("Contact form validation errors:", form.errors)
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


# EDIT a contact
@contact_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_contact(id):
    """
    Update an existing contact
    """
    contact = Contact.query.get(id)

    # Ensure contact exists
    if not contact:
        return jsonify({'errors': {'message': 'Contact not found'}}), 404

    # Ensure session user owns the contact
    if contact.user_id != current_user.id:
        return jsonify({'errors': {'message': 'Unauthorized'}}), 403

    data = request.get_json()

    # Update fields with new data
    contact.first_name = data.get('first_name', contact.first_name)
    contact.last_name = data.get('last_name', contact.last_name)
    contact.relation_type = data.get('relation_type', contact.relation_type)
    contact.city = data.get('city', contact.city)
    contact.state = data.get('state', contact.state)
    contact.number = data.get('number', contact.number)
    contact.job_title = data.get('job_title', contact.job_title)
    contact.company = data.get('company', contact.company)
    contact.last_contacted = data.get('last_contacted', contact.last_contacted)
    contact.init_meeting_note = data.get('init_meeting_note', contact.init_meeting_note)
    contact.distinct_memory_note = data.get('distinct_memory_note', contact.distinct_memory_note)
    contact.updated_at = datetime.now()

    db.session.commit()

    return jsonify(contact.to_dict()), 200


# DELETE a contact
@contact_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_contact(id):
    """
    Delete a contact
    """
    contact = Contact.query.get(id)

    # Ensure contact exists
    if not contact:
        return {'errors': {'message': 'Contact not found'}}, 404

    # Ensure contact belongs to the current user
    if contact.user_id != current_user.id:
        return {'errors': {'message': 'Unauthorized'}}, 403

    db.session.delete(contact)
    db.session.commit()

    return {'message': 'Contact successfully deleted'}, 200