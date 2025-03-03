from app.models import db, User, Contact, Opportunity, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta, date

def seed_opportunities():
    # Get all users and their contacts
    users = User.query.all()
    contacts = Contact.query.all()
    
    # Calculate dates for different occurrence patterns
    today = date.today()
    next_month = today + timedelta(days=30)
    next_quarter = today + timedelta(days=90)
    next_half_year = today + timedelta(days=180)
    
    # List of common opportunities for all contacts
    common_opportunities = [
        {
            'title': 'Endorse a skill or service',
            'description': 'Take a moment to endorse a skill or service this contact provides.',
            'occurrence': 'Once',
            'next_date': today + timedelta(days=7),
            'icon': '👍'
        },
        {
            'title': 'Networking Introduction',
            'description': 'Connect this contact with someone in your network who might be beneficial.',
            'occurrence': 'Bi-Annually',
            'next_date': next_half_year,
            'icon': '🤝'
        },
        {
            'title': 'Followup Message / Checkin',
            'description': 'Send a short message to check in and maintain the relationship.',
            'occurrence': 'Bi-weekly',
            'next_date': today + timedelta(days=14),
            'icon': '💬'
        },
        {
            'title': 'Share Project Updates',
            'description': 'Share recent project updates or achievements with this contact.',
            'occurrence': 'Quarterly',
            'next_date': next_quarter,
            'icon': '📊'
        }
    ]
    
    # Relation-specific opportunities
    relation_opportunities = {
        'Recruiter': [
            {
                'title': 'Express Interest in Future Work',
                'description': 'Check in about potential future opportunities and keep your name top of mind.',
                'occurrence': 'Bi-Annually',
                'next_date': next_half_year,
                'icon': '💼'
            }
        ],
        'Mentor': [
            {
                'title': 'Career Guidance Checkin',
                'description': 'Schedule time to discuss career goals and seek guidance.',
                'occurrence': 'Quarterly',
                'next_date': next_quarter,
                'icon': '🧭'
            }
        ],
        'Mentee': [
            {
                'title': 'Resource/Tool Recommendation',
                'description': 'Share a useful resource or tool that could help their development.',
                'occurrence': 'Bi-monthly',
                'next_date': next_month,
                'icon': '📚'
            }
        ],
        'Peer': [
            {
                'title': 'Quick Coffee/Virtual Chat',
                'description': 'Schedule a casual catch-up over coffee or a virtual meeting.',
                'occurrence': 'Bi-Annually',
                'next_date': next_half_year,
                'icon': '☕'
            }
        ]
    }
    
    # Create opportunities for each contact
    opportunities_to_add = []
    
    for contact in contacts:
        # Add common opportunities for all contacts
        for opp_data in common_opportunities:
            opportunity = Opportunity(
                opportunity_type='recommended',  # preset opportunities are 'recommended'
                title=opp_data['title'],
                description=opp_data['description'],
                status='Active',
                occurrence=opp_data['occurrence'],
                icon=opp_data['icon'],
                next_date=opp_data['next_date'],
                user_id=contact.user_id,
                contact_id=contact.id
            )
            opportunities_to_add.append(opportunity)
        
        # Add relation-specific opportunities
        if contact.relation_type in relation_opportunities:
            for opp_data in relation_opportunities[contact.relation_type]:
                opportunity = Opportunity(
                    opportunity_type='recommended', 
                    title=opp_data['title'],
                    description=opp_data['description'],
                    status='Active',
                    occurrence=opp_data['occurrence'],
                    icon=opp_data['icon'],
                    next_date=opp_data['next_date'],
                    user_id=contact.user_id,
                    contact_id=contact.id
                )
                opportunities_to_add.append(opportunity)
    
    # Demo_user is the demo user
    demo_user = User.query.filter(User.username == 'Demo').first()

    # Demo met Sarah at a conference and she is invested in his career
    if demo_user:
        sarah = Contact.query.filter(Contact.first_name == 'Sarah', Contact.user_id == demo_user.id).first()
        if sarah:
            custom_opp = Opportunity(
                opportunity_type='custom',  # User-created opportunities are 'custom'
                title='Annual Career Strategy Session',
                description='Schedule an in-depth career planning session to review goals and progress.',
                status='Pending',
                occurrence='Annually',
                icon='🎯',
                next_date=today + timedelta(days=45),
                user_id=demo_user.id,
                contact_id=sarah.id
            )
            opportunities_to_add.append(custom_opp)
        
        # Michael is a close friend and potential business partner of demo
        michael = Contact.query.filter(Contact.first_name == 'Michael', Contact.user_id == demo_user.id).first()
        if michael:
            custom_opp = Opportunity(
                opportunity_type='custom',  
                title='Start Up Brainstorming Session',
                description='Talk about random project ideas and business insights',
                status='Active',
                occurrence='Monthly',
                icon='💻',
                next_date=today + timedelta(days=15),
                user_id=demo_user.id,
                contact_id=michael.id
            )
            opportunities_to_add.append(custom_opp)
    
    # Add all opportunities to the session and commit
    for opportunity in opportunities_to_add:
        db.session.add(opportunity)
    
    db.session.commit()

def undo_opportunities():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.opportunities RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM opportunities"))
        
    db.session.commit()