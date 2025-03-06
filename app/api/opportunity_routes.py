from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Opportunity, Contact
from datetime import datetime, date, timedelta
from app.forms import OpportunityForm


opportunity_routes = Blueprint('opportunities', __name__)


# 1. GET all session user's opportunities
@opportunity_routes.route('/', methods=['GET'])
@login_required
def get_opportunities():
    """
    Return all opportunities for the current user
    """
    opportunities = Opportunity.query.filter(Opportunity.user_id == current_user.id).all()
    return jsonify({'opportunities': [opportunity.to_dict() for opportunity in opportunities]}), 200


# 2. GET a specific opportunity by ID
@opportunity_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_opportunity(id):
    """
    Return a specific opportunity by ID
    """
    opportunity = Opportunity.query.get(id)

    # Ensure opportunity exists
    if not opportunity:
        return jsonify({'errors': {'message': 'Opportunity not found'}}), 404
        
    # Ensure opportunity belongs to session user
    if opportunity.user_id != current_user.id:
        return jsonify({'errors': {'message': 'Unauthorized'}}), 403
    
    return jsonify(opportunity.to_dict()), 200


# 3. GET all opportunities for a specific contact
@opportunity_routes.route('/contact/<int:contact_id>', methods=['GET'])
@login_required
def get_contact_opportunities(contact_id):
    """
    Return all opportunities for a specific contact
    """
    # Verify the contact exists and belongs to the current user
    contact = Contact.query.get(contact_id)
    if not contact:
        return jsonify({'errors': {'message': 'Contact not found'}}), 404
        
    if contact.user_id != current_user.id:
        return jsonify({'errors': {'message': 'Unauthorized'}}), 403
    
    opportunities = Opportunity.query.filter(
        Opportunity.contact_id == contact_id,
        Opportunity.user_id == current_user.id
    ).all()
    
    return jsonify({'opportunities': [opportunity.to_dict() for opportunity in opportunities]}), 200


# 4. Create a new opportunity
@opportunity_routes.route('/contact/<int:contact_id>', methods=['POST'])
@login_required
def create_opportunity(contact_id):
    """
    Create a new opportunity for a specific contact
    """
    # Verify the contact exists and belongs to the current user
    contact = Contact.query.get(contact_id)
    if not contact:
        return jsonify({'errors': {'message': 'Contact not found'}}), 404
        
    if contact.user_id != current_user.id:
        return jsonify({'errors': {'message': 'Unauthorized'}}), 403
    
    form = OpportunityForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():

        # Automatically set the opportunities 'next_date'
        next_date = date.today()
        occurrence = form.data['occurrence']
        
        if occurrence == 'Once':
            next_date = date.today() + timedelta(days=7)
        elif occurrence == 'Weekly':
            next_date = date.today() + timedelta(days=7)
        elif occurrence == 'Bi-weekly':
            next_date = date.today() + timedelta(days=14)
        elif occurrence == 'Monthly':
            next_date = date.today() + timedelta(days=30)
        elif occurrence == 'Quarterly':
            next_date = date.today() + timedelta(days=90)
        elif occurrence == 'Bi-Annually':
            next_date = date.today() + timedelta(days=180)
        elif occurrence == 'Annually':
            next_date = date.today() + timedelta(days=365)
        
        opportunity = Opportunity(
            opportunity_type='custom',  # User-created opportunities are always custom
            title=form.data['title'],
            description=form.data['description'],
            status=form.data.get('status', 'Active'),
            occurrence=form.data['occurrence'],
            icon=form.data['icon'] if form.data['icon'] else '📅',
            next_date=next_date,
            user_id=current_user.id,
            contact_id=contact_id
        )
        
        db.session.add(opportunity)
        db.session.commit()
        
        return jsonify(opportunity.to_dict()), 201
    
    return jsonify({'errors': form.errors}), 400


# 5. EDIT an opportunity
@opportunity_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_opportunity(id):
    """
    Update an existing opportunity
    """
    opportunity = Opportunity.query.get(id)

    # Ensure opportunity exists
    if not opportunity:
        return jsonify({'errors': {'message': 'Opportunity not found'}}), 404

    # Ensure session user owns the opportunity
    if opportunity.user_id != current_user.id:
        return jsonify({'errors': {'message': 'Unauthorized'}}), 403

    form = OpportunityForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        # Update opportunity data
        opportunity.title = form.data['title']
        opportunity.description = form.data['description']
        opportunity.status = form.data['status']
        opportunity.occurrence = form.data['occurrence']
        opportunity.icon = form.data['icon'] if form.data['icon'] else opportunity.icon
        
        # Recalculate next_date if occurrence has changed
        if form.data['occurrence'] != opportunity.occurrence:
            next_date = date.today()
            occurrence = form.data['occurrence']
            
            if occurrence == 'Once':
                next_date = date.today() + timedelta(days=7)
            elif occurrence == 'Weekly':
                next_date = date.today() + timedelta(days=7)
            elif occurrence == 'Bi-weekly':
                next_date = date.today() + timedelta(days=14)
            elif occurrence == 'Monthly':
                next_date = date.today() + timedelta(days=30)
            elif occurrence == 'Quarterly':
                next_date = date.today() + timedelta(days=90)
            elif occurrence == 'Bi-Annually':
                next_date = date.today() + timedelta(days=180)
            elif occurrence == 'Annually':
                next_date = date.today() + timedelta(days=365)
                
            opportunity.next_date = next_date
        
        opportunity.updated_at = datetime.now()
        db.session.commit()
        
        return jsonify(opportunity.to_dict()), 200
    
    return jsonify({'errors': form.errors}), 400


# 6. DELETE an opportunity
@opportunity_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_opportunity(id):
    """
    Delete an opportunity
    """
    opportunity = Opportunity.query.get(id)

    # Ensure opportunity exists
    if not opportunity:
        return jsonify({'errors': {'message': 'Opportunity not found'}}), 404

    # Ensure opportunity belongs to the current user
    if opportunity.user_id != current_user.id:
        return jsonify({'errors': {'message': 'Unauthorized'}}), 403

    db.session.delete(opportunity)
    db.session.commit()

    return jsonify({'message': 'Opportunity successfully deleted'}), 200