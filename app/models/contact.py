from .db import db, environment, SCHEMA, add_prefix_for_prod

class Contact(db.Model):
    __tablename__ = "contacts"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    relation_type = db.Column(db.String(10), nullable=False) # mentor, peer, mentee, or recruiter
    city = db.Column(db.String(35))
    state = db.Column(db.String(35))
    number = db.Column(db.String(20))
    title = db.Column(db.String(35))
    company = db.Column(db.String(35), primary_key=True)
    last_contacted = db.Column(db.DateTime)
    init_meeting_note = db.Column(db.String(300))      # how user met contact
    distinct_memory_note = db.Column(db.String(300))   # memory triggers for recall - distinct features, qualites, or ridiclous associations 
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    