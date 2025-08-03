"""1.0 wip

Revision ID: c9d090d2b045
Revises: 5df660bae290
Create Date: 2025-07-31 16:23:25.014331

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c9d090d2b045'
down_revision: Union[str, None] = '5df660bae290'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
