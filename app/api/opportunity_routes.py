from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Opportunity, Contact
from datetime import datetime, date, timedelta


opportunity_routes = Blueprint('opportunities', __name__)


# 1 GET all session user's opportunities
@opportunity_routes.route('/', methods=['GET'])
@login_required
def get_opportunities():
    """
    Return all opportunities for the current user
    """
    opportunities = Opportunity.query.filter(Opportunity.user_id == current_user.id).all()
    return jsonify({'opportunities': [opportunity.to_dict() for opportunity in opportunities]}), 200
