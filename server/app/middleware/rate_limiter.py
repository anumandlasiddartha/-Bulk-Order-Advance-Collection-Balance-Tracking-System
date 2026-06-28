"""
Cakes and Crunches — Rate Limiter Configuration

Custom rate limit decorators for specific route groups.
The global limiter is configured in extensions.py.
"""

from app.extensions import limiter


# Auth endpoints — stricter limits to prevent brute-force
auth_limiter = limiter.limit("10/minute")

# Search endpoints — moderate limits
search_limiter = limiter.limit("30/minute")

# Report generation — expensive operations
report_limiter = limiter.limit("5/minute")

# General API — standard limits
api_limiter = limiter.limit("60/minute")
