from app.models import db, User, Contact, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timezone

# Adds demo contacts, you can add other contacts here if you want
def seed_contacts():
    # Get the demo user to associate contacts with
    demo = User.query.filter(User.username == 'Demo').first()
    marnie = User.query.filter(User.username == 'marnie').first()
    bobbie = User.query.filter(User.username == 'bobbie').first()
    
    sarah = Contact(
        first_name='Sarah',
        last_name='Johnson',
        relation_type='Mentor',
        city='San Francisco',
        state='CA',
        number='555-123-4567',
        job_title='Senior Product Manager',
        company='TechInnovate Inc.',
        init_meeting_note='Met at TechCrunch Disrupt 2023. Had an engaging discussion about AI implications in product management. She shared valuable insights about scaling product teams.',
        distinct_memory_note='Loves rock climbing and has a golden retriever named Max',
        user_id=demo.id
    )
    
    michael = Contact(
        first_name='Michael',
        last_name='Brown',
        relation_type='Peer',
        city='Seattle',
        state='WA',
        number='555-987-6543',
        job_title='Software Engineer',
        company='Cloudflare',
        init_meeting_note='Connected at a Python developer meetup. We discussed microservices architecture and modern deployment patterns.',
        distinct_memory_note='Plays jazz piano and collects vintage vinyl records',
        user_id=demo.id
    )
    
    corey = Contact(
        first_name='Corey',
        last_name='Twitty',
        relation_type='Mentee',
        city='Chicago',
        state='IL',
        number='555-456-7890',
        job_title='Junior Developer',
        company='New Relic',
        init_meeting_note='He reached out after a tech talk I gave at a local bootcamp. Eager to learn about backend technologies.',
        distinct_memory_note='Former professional soccer player who made a career switch to tech',
        user_id=demo.id
    )
    
    alex = Contact(
        first_name='Alex',
        last_name='Wong',
        relation_type='Recruiter',
        city='New York',
        state='NY',
        number='555-789-0123',
        job_title='Technical Recruiter',
        company='TalentSphere',
        init_meeting_note='Connected on LinkedIn after she reached out about a senior developer position at a fintech startup.',
        distinct_memory_note='Always sends thoughtful follow-up emails with interesting industry articles',
        user_id=marnie.id
    )

    db.session.add(sarah)
    db.session.add(michael)
    db.session.add(corey)
    db.session.add(alex)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the contacts table
def undo_contacts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.contacts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM contacts"))
        
    db.session.commit()