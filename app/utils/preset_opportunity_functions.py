from datetime import date, timedelta
from app.models import db, Opportunity
from app.utils.preset_opportunity_data import FOUNDATIONAL_OPPORTUNITIES, RELATION_OPPORTUNITIES

def create_preset_opportunities(contact_id, relation_type, user_id):
    """
    Create preset opportunities for a newly created contact based on their relationship type.
    
    Args:
        contact_id (int): The ID of the newly created contact
        relation_type (str): The type of relationship (mentor, mentee, peer, recruiter)
        user_id (int): The ID of the current user
    """
    # Initialize empty list to store all opportunity objects
    opportunities_to_create = []
    
    # First, create Opportunity objects for foundational opportunities
    for opp_data in FOUNDATIONAL_OPPORTUNITIES:
        opportunity = Opportunity(
            opportunity_type='recommended',
            title=opp_data['title'],
            description=opp_data['description'],
            status='Active',
            occurrence=opp_data['occurrence'],
            icon=opp_data['icon'],
            next_date=calculate_next_date(opp_data['occurrence']),
            user_id=user_id,
            contact_id=contact_id
        )
        opportunities_to_create.append(opportunity)
    
    # Relation-specific opportunities
    # Convert relation_type to lowercase for case-insensitive comparison
    relation_type = relation_type.lower()
    
    # Add relation-specific opportunities if they exist
    if relation_type in RELATION_OPPORTUNITIES:
        for opp_data in RELATION_OPPORTUNITIES[relation_type]:
            opportunity = Opportunity(
                opportunity_type='recommended',
                title=opp_data['title'],
                description=opp_data['description'],
                status='Active',
                occurrence=opp_data['occurrence'],
                icon=opp_data['icon'],
                next_date=calculate_next_date(opp_data['occurrence']),
                user_id=user_id,
                contact_id=contact_id
            )
            opportunities_to_create.append(opportunity)
    
    # Add all opportunities to the database in a batch
    db.session.add_all(opportunities_to_create)
    db.session.commit()
    
    return opportunities_to_create


def calculate_next_date(occurrence):
    """
    Calculate the next date based on the occurrence frequency.
    
    Args:
        occurrence (str): The frequency of the opportunity occurrence
        
    Returns:
        date: The calculated next date
    """
    today = date.today()
    
    if occurrence == 'Once':
        return today + timedelta(days=7)
    elif occurrence == 'Weekly':
        return today + timedelta(days=7)
    elif occurrence == 'Bi-weekly':
        return today + timedelta(days=14)
    elif occurrence == 'Monthly':
        return today + timedelta(days=30)
    elif occurrence == 'Quarterly':
        return today + timedelta(days=90)
    elif occurrence == 'Bi-Annually':
        return today + timedelta(days=180)
    elif occurrence == 'Annually':
        return today + timedelta(days=365)
    else:
        return today + timedelta(days=30)