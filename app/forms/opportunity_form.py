from flask_wtf import FlaskForm
from wtforms import StringField, SelectField
from wtforms.validators import DataRequired, Optional, Length

class OpportunityForm(FlaskForm):
    """
    Form for creating and updating opportunities
    """
    title = StringField('Title', validators=[
        DataRequired(message="Title is required"),
        Length(min=1, max=50, message="Title must be between 1 and 50 characters")
    ])

    description = StringField('Description', validators=[
        DataRequired(message="Title is required"), 
        Length(min=1, max=80, message="Title must be between 1 and 50 characters")
    ])

    opportunity_type = SelectField(
        'Type',
        validators=[Optional()],
        choices=[
            ('recommended', 'Recommended'),
            ('custom', 'Custom')
        ],
        default='custom'
    )

    occurrence = SelectField(
        'Occurrence',
        validators=[DataRequired(message="Frequency is required")],
        choices=[
            ('Once', 'Once'),
            ('Weekly', 'Weekly'),
            ('Bi-weekly', 'Bi-weekly'),
            ('Monthly', 'Monthly'),
            ('Quarterly', 'Quarterly'),
            ('Bi-Annually', 'Bi-Annually'),
            ('Annually', 'Annually')
        ]
    )
    status = SelectField(
        'Status',
        validators=[Optional()],
        choices=[
            ('Active', 'Active'),
            ('Pending', 'Pending'),
            ('Completed', 'Completed')
        ],
        default='Active'
    )
    icon = StringField('Icon', validators=[Optional(), Length(max=10)], default='📅')
    # auto set next_date based on Occurence
    # get contact_id from params
    # get user_id from current user's session
    # auto set opportunity_type on creation
