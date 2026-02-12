#!/usr/bin/env python3

import os
from dotenv import load_dotenv

load_dotenv()

def create_database():
    """Create the SQLite database and tables.
    SQLite creates the database file automatically - no server needed!"""
    try:
        from app.database import engine
        from app.models import Base
        Base.metadata.create_all(bind=engine)
        return True
    except Exception as e:
        print(f"Error creating database: {e}")
        return False

if __name__ == "__main__":
    print("Setting up SQLite database...")
    if create_database():
        print("Database setup completed! Tables created successfully!")
    else:
        print("Database setup failed!")