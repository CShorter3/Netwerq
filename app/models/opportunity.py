from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Opportunity(db.Model):
    __tablename__ = "opportunities"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    
    id = db.Column(db.Integer, primary_key=True)
    opportunity_type = db.Column(db.String(12), default='custom') # 'Recommended', 'Custom'
    title = db.Column(db.String(50), nullable=False)             # 'Quarterly Coffee Chat', 'MVP Brainstorming Session', 'Annual Easter Party Invite' 
    description = db.Column(db.String(80), nullable=False)
    status = db.Column(db.String(10), nullable=False, default='Active')  # 'Active', 'Pending', 'Completed' || 'Active', 'Paused', 'Completed'
    occurrence = db.Column(db.String(15), nullable=False)           # 'Once', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Bi-Annually', 'Anually' 
    icon = db.Column(db.String(10), default='📅')  #  '<any emoji>'
    next_date = db.Column(db.Date)                # set on init depending on occurence, updated when current completed, used to calculate overdue
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False) 
    contact_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('contacts.id')), nullable=False )

    # access the user who created opportunity with opportunity.user
    # access the contact associated with the opportunity using opportunity.contact
    user = db.relationship('User', back_populates='opportunities')
    contact = db.relationship('Contact', back_populates='opportunities')

    # Timestamps track creation and updates
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        """Returns a dictionary representation of opportunity, easily interpreted by the front end."""
        return {
            'id': self.id,
            'opportunity_type': self.opportunity_type,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'occurrence': self.occurrence,
            'icon': self.icon,
            'next_date': self.next_date.isoformat() if self.next_date else None,
            'user_id': self.user_id,
            'contact_id': self.contact_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        } 