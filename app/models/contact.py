from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from zoneinfo import ZoneInfo

class Contact(db.Model):
    __tablename__ = "contacts"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)
    relation_type = db.Column(db.String(10), nullable=False) # 'mentor', 'peer', 'mentee', 'recruiter'
    city = db.Column(db.String(35))
    state = db.Column(db.String(35))
    number = db.Column(db.String(20)) # supports international numbers
    job_title = db.Column(db.String(50))
    company = db.Column(db.String(50))
    last_contacted = db.Column(db.DateTime)
    init_meeting_note = db.Column(db.String(300), nullable=False)      # how the user met contact
    distinct_memory_note = db.Column(db.String(300), nullable=False)   # memory triggers: distinct features, qualitites, or ridiclous associations 
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

    # Timestamps track creation and updates
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    user = db.relationship('User', back_populates='connections')
    opportunities = db.relationship('Opportunity', back_populates='contact', cascade="all, delete-orphan")

    def update_last_contact(self):
        """Updates last_contacted timestamp in EST time."""
        self.last_contacted = datetime.now(ZoneInfo("America/New_York"))
        db.session.commit()

    def to_dict(self):
        """Returns a dictionary representation of a contact, easily interpreted by the front end."""
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "relation_type": self.relation_type,
            "city": self.city or "-",
            "state": self.state or "-",
            "number": self.number or "-",
            "job_title": self.job_title or "-",
            "company": self.company or "-",
            "last_contacted": self.last_contacted.isoformat() if self.last_contacted else "Never Contacted",
            "init_meeting_note": self.init_meeting_note,
            "distinct_memory_note": self.distinct_memory_note,
            "user_id": self.user_id,
        }