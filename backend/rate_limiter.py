import time
from config import RATE_LIMIT_PER_MINUTE, RATE_LIMIT_PER_DAY


class RateLimiter:
    """
    In-memory rate limiter. Tracks requests per minute and per day.
    No external dependencies (like Redis) needed for local dev.
    """

    def __init__(self, per_minute: int = RATE_LIMIT_PER_MINUTE, per_day: int = RATE_LIMIT_PER_DAY):
        self.per_minute = per_minute
        self.per_day = per_day
        self.minute_requests: list[float] = []
        self.day_requests: list[float] = []

    def _cleanup(self):
        """Remove expired timestamps."""
        now = time.time()
        one_minute_ago = now - 60
        one_day_ago = now - 86400

        self.minute_requests = [t for t in self.minute_requests if t > one_minute_ago]
        self.day_requests = [t for t in self.day_requests if t > one_day_ago]

    def check(self) -> dict:
        """
        Check if a request is allowed.
        Returns { "allowed": bool, "error": str | None, "remaining": { ... } }
        """
        self._cleanup()

        minute_count = len(self.minute_requests)
        day_count = len(self.day_requests)

        if minute_count >= self.per_minute:
            return {
                "allowed": False,
                "error": f"Rate limit exceeded: {self.per_minute} requests/minute. Please wait a moment.",
                "remaining": {
                    "per_minute": 0,
                    "per_day": max(0, self.per_day - day_count),
                },
            }

        if day_count >= self.per_day:
            return {
                "allowed": False,
                "error": f"Daily limit reached: {self.per_day} requests/day. Try again tomorrow.",
                "remaining": {
                    "per_minute": 0,
                    "per_day": 0,
                },
            }

        return {
            "allowed": True,
            "error": None,
            "remaining": {
                "per_minute": self.per_minute - minute_count - 1,
                "per_day": self.per_day - day_count - 1,
            },
        }

    def record(self):
        """Record a successful request."""
        now = time.time()
        self.minute_requests.append(now)
        self.day_requests.append(now)

    def status(self) -> dict:
        """Get current rate limit status."""
        self._cleanup()
        return {
            "per_minute": {
                "limit": self.per_minute,
                "used": len(self.minute_requests),
                "remaining": max(0, self.per_minute - len(self.minute_requests)),
            },
            "per_day": {
                "limit": self.per_day,
                "used": len(self.day_requests),
                "remaining": max(0, self.per_day - len(self.day_requests)),
            },
        }


# Singleton instance
rate_limiter = RateLimiter()
