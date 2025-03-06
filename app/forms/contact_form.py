from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, TextAreaField
from wtforms.validators import DataRequired, Length, Optional, ValidationError
import re

# custom validator uses regex to allow numbers and symbols but not letters
# def validate_phone_number(form, field):
#     if field.data and field.data.strip():
#         pattern = r'^[^a-zA-Z]*$'
#         if not re.match(pattern, field.data):
#             raise ValidationError('Phone number cannot contain letters')

class ContactForm(FlaskForm):
    """
    Form for creating and updating contacts
    """
    first_name = StringField('First Name', validators=[
        DataRequired(message="First name is required"),
        Length(min=1, max=30, message="First name must be between 1 and 30 characters")
    ])
    
    last_name = StringField('Last Name', validators=[
        DataRequired(message="Last name is required"),
        Length(min=1, max=30, message="Last name must be between 1 and 30 characters")
    ])
    
    relation_type = SelectField('Relationship Type', validators=[
        DataRequired(message="Relationship type is required")
    ], choices=[
        ('mentor', 'Mentor'),
        ('peer', 'Peer'),
        ('mentee', 'Mentee'),
        ('recruiter', 'Recruiter')
    ])

   # Opotional fields 
    city = StringField('City', validators=[
        Optional(),
        Length(max=35, message="City name must be less than 35 characters")
    ])
    
    state = StringField('State', validators=[
        Optional(),
        Length(max=35, message="State name must be less than 35 characters")
    ])
    
    number = StringField('Phone Number', validators=[
        Optional(),
        Length(max=20, message="Phone number must be less than 20 characters"),
        # validate_phone_number
    ])
    
    job_title = StringField('Job Title', validators=[
        Optional(),
        Length(max=50, message="Job title must be less than 50 characters")
    ])
    
    company = StringField('Company', validators=[
        Optional(),
        Length(max=50, message="Company name must be less than 50 characters")
    ])
    
    init_meeting_note = TextAreaField('Initial Meeting Note', validators=[
        DataRequired(message="Initial meeting note is required"),
        Length(min=1, max=300, message="Initial meeting note must be between 1 and 300 characters")
    ])
    
    distinct_memory_note = TextAreaField('Distinctive Memory Note', validators=[
        DataRequired(message="Distinctive memory note is required"),
        Length(min=1, max=300, message="Distinctive memory note must be between 1 and 300 characters")
    ])