"""
Cakes and Crunches — Base Repository

Generic repository providing standard CRUD operations.
All entity-specific repositories inherit from this class,
getting pagination, filtering, and sorting out of the box.
"""

from typing import Any, Optional

from flask import current_app
from sqlalchemy import desc, asc

from app.extensions import db


class BaseRepository:
    """
    Abstract base repository with common data access methods.

    Attributes:
        model: The SQLAlchemy model class this repository manages.
    """

    model = None

    @classmethod
    def get_by_id(cls, entity_id: int) -> Optional[Any]:
        """Fetch a single record by primary key."""
        return cls.model.query.get(entity_id)

    @classmethod
    def get_all(cls) -> list:
        """Fetch all records (use with caution on large tables)."""
        return cls.model.query.all()

    @classmethod
    def get_paginated(
        cls,
        page: int = 1,
        per_page: int = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
        filters: dict = None,
    ) -> dict:
        """
        Fetch records with pagination, sorting, and optional filtering.

        Args:
            page: Page number (1-indexed).
            per_page: Items per page (defaults to app config).
            sort_by: Column name to sort by.
            sort_order: 'asc' or 'desc'.
            filters: Dict of {column_name: value} for exact-match filtering.

        Returns:
            Dict with 'items', 'total', 'page', 'per_page', 'pages'.
        """
        if per_page is None:
            per_page = current_app.config.get("DEFAULT_PAGE_SIZE", 20)

        per_page = min(per_page, current_app.config.get("MAX_PAGE_SIZE", 100))

        query = cls.model.query

        # Apply filters
        if filters:
            for column, value in filters.items():
                if hasattr(cls.model, column) and value is not None:
                    query = query.filter(getattr(cls.model, column) == value)

        # Apply sorting
        if hasattr(cls.model, sort_by):
            order_func = desc if sort_order == "desc" else asc
            query = query.order_by(order_func(getattr(cls.model, sort_by)))

        # Paginate
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        return {
            "items": pagination.items,
            "total": pagination.total,
            "page": pagination.page,
            "per_page": pagination.per_page,
            "pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev,
        }

    @classmethod
    def create(cls, data: dict) -> Any:
        """Create a new record and persist it."""
        instance = cls.model(**data)
        db.session.add(instance)
        db.session.commit()
        return instance

    @classmethod
    def update(cls, entity_id: int, data: dict) -> Optional[Any]:
        """Update an existing record by ID."""
        instance = cls.get_by_id(entity_id)
        if not instance:
            return None

        for key, value in data.items():
            if hasattr(instance, key):
                setattr(instance, key, value)

        db.session.commit()
        return instance

    @classmethod
    def delete(cls, entity_id: int) -> bool:
        """Delete a record by ID. Returns True if deleted, False if not found."""
        instance = cls.get_by_id(entity_id)
        if not instance:
            return False

        db.session.delete(instance)
        db.session.commit()
        return True

    @classmethod
    def count(cls, filters: dict = None) -> int:
        """Count records with optional filtering."""
        query = cls.model.query
        if filters:
            for column, value in filters.items():
                if hasattr(cls.model, column) and value is not None:
                    query = query.filter(getattr(cls.model, column) == value)
        return query.count()

    @classmethod
    def exists(cls, entity_id: int) -> bool:
        """Check if a record with the given ID exists."""
        return cls.model.query.get(entity_id) is not None

    @classmethod
    def search(cls, column: str, term: str, page: int = 1, per_page: int = 20) -> dict:
        """
        Perform a LIKE search on a specific column.

        Args:
            column: Column name to search in.
            term: Search term (automatically wrapped in % wildcards).
            page: Page number.
            per_page: Items per page.
        """
        query = cls.model.query

        if hasattr(cls.model, column):
            query = query.filter(
                getattr(cls.model, column).ilike(f"%{term}%")
            )

        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        return {
            "items": pagination.items,
            "total": pagination.total,
            "page": pagination.page,
            "per_page": pagination.per_page,
            "pages": pagination.pages,
        }
