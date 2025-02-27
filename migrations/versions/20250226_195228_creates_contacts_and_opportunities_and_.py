"""creates contacts and opportunities, and updates users tables

Revision ID: 6e771447e28b
Revises: ffdc0a98111c
Create Date: 2025-02-26 19:52:28.280025

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

# revision identifiers, used by Alembic.
revision = '6e771447e28b'
down_revision = 'ffdc0a98111c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=False))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=False))

    # Create contacts table
    op.create_table('contacts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('first_name', sa.String(length=30), nullable=False),
        sa.Column('last_name', sa.String(length=30), nullable=False),
        sa.Column('relation_type', sa.String(length=10), nullable=False),
        sa.Column('city', sa.String(length=35), nullable=True),
        sa.Column('state', sa.String(length=35), nullable=True),
        sa.Column('number', sa.String(length=20), nullable=True),
        sa.Column('job_title', sa.String(length=50), nullable=True),
        sa.Column('company', sa.String(length=50), nullable=True),
        sa.Column('last_contacted', sa.DateTime(), nullable=True),
        sa.Column('init_meeting_note', sa.String(length=300), nullable=False),
        sa.Column('distinct_memory_note', sa.String(length=300), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')

    # ### end Alembic commands ###
