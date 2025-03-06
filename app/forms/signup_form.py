from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Email, ValidationError, Length, EqualTo
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):

    username = StringField(
        'username', validators=[
            DataRequired(message="Username is required"),
            Length(min=3, max=40, message="Username must be between 3 and 40 characters"),
            username_exists
    ])

    email = StringField(
        'email', validators=[
            DataRequired(message="Email is required"),
            Email(message="Please provide a valid email"),
            user_exists
    ])
    password = StringField(
        'password', validators=[
            DataRequired(message="Password is required"),
            Length(min=6, message="Password must be at least 6 characters long")
    ])

    confirm_password = PasswordField(
        'confirm_password', validators=[
            DataRequired(message="Please confirm your password"),
            EqualTo('password', message="Passwords must match")
    ])

    # Optional fields
    first_name = StringField(
        'first_name', validators=[
            Length(max=30, message="First name must be less than 30 characters")
    ])
    
    last_name = StringField(
        'last_name', validators=[
            Length(max=30, message="Last name must be less than 30 characters")
    ])
    
    city = StringField(
        'city', validators=[
            Length(max=35, message="City must be less than 35 characters")
    ])
    
    state = StringField(
        'state', validators=[
            Length(max=35, message="State must be less than 35 characters")
    ])
