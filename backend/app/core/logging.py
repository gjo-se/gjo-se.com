"""Logging configuration for the application.

Sets up stdlib logging via dictConfig with a consistent format.
"""

import logging
import logging.config


def setup_logging() -> None:
    """Configure application-wide logging.

    Uses logging.config.dictConfig to set up a single console handler
    with a structured format: timestamp, level, logger name, message.
    No print() calls – all output goes through the logging module.
    """
    config: dict[str, object] = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "default",
                "stream": "ext://sys.stdout",
            }
        },
        "root": {
            "level": "INFO",
            "handlers": ["console"],
        },
    }
    logging.config.dictConfig(config)
