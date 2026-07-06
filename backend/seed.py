import sys
import os

# Append current directory to path so imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.config.db import SessionLocal, Base, engine
from app.models.all_models import User, Book, CartItem, Order, OrderItem, DownloadLog
from app.utils.auth_helper import get_password_hash
import decimal

def seed_database():
    print("Initializing database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        print("Seeding Users...")
        # Create Admin
        admin_user = User(
            name="Admin Account",
            email="admin@ebook.com",
            password_hash=get_password_hash("admin123"),
            role="admin"
        )
        # Create regular User
        regular_user = User(
            name="Sarah Reader",
            email="user@ebook.com",
            password_hash=get_password_hash("user123"),
            role="user"
        )
        db.add(admin_user)
        db.add(regular_user)
        db.commit()
        
        print("Seeding E-Books...")
        books = [
            Book(
                title="Python Pro: Advanced Techniques",
                author="John Smith",
                description="Master asynchronous patterns, descriptors, metaclasses, and high-performance engineering in Python 3.11. Ideal for professional developers.",
                genre="Technology",
                isbn="978-3-16-148410-0",
                price=decimal.Decimal("19.99"),
                cover_image_url="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60",
                preview_file_url="",
                source_file_url="",
                is_active=True
            ),
            Book(
                title="UI/UX Design Secrets",
                author="Avery Visual",
                description="Uncover the principles of conversion optimization, visual hierarchies, and modern user research workflows. Packed with visual mockups.",
                genre="Design",
                isbn="978-0-13-148906-8",
                price=decimal.Decimal("24.99"),
                cover_image_url="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&auto=format&fit=crop&q=60",
                preview_file_url="",
                source_file_url="",
                is_active=True
            ),
            Book(
                title="Startup Life: Zero to Launch",
                author="Elon Founder",
                description="A comprehensive roadmap for raising capital, finding product-market fit, and scaling tech teams from scratch without burning out.",
                genre="Business",
                isbn="978-1-86197-876-9",
                price=decimal.Decimal("14.95"),
                cover_image_url="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=60",
                preview_file_url="",
                source_file_url="",
                is_active=True
            ),
            Book(
                title="Algorithms Unlocked",
                author="Thomas Cormen",
                description="Understand the mathematical models behind computer networking, routing, search engines, and artificial intelligence in simple terms.",
                genre="Technology",
                isbn="978-0-262-51880-2",
                price=decimal.Decimal("29.99"),
                cover_image_url="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60",
                preview_file_url="",
                source_file_url="",
                is_active=True
            ),
            Book(
                title="The Art of Minimalist Living",
                author="Clara Zen",
                description="Declutter your workspace, clear your mental RAM, and achieve mindfulness through daily minimalism habits tailored for creators.",
                genre="Lifestyle",
                isbn="978-3-16-148450-4",
                price=decimal.Decimal("9.99"),
                cover_image_url="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60",
                preview_file_url="",
                source_file_url="",
                is_active=True
            ),
            Book(
                title="Cybersecurity Handbook",
                author="Nate Hacker",
                description="Identify network vulnerabilities, configure secure firewalls, encrypt customer payloads, and audit authorization structures safely.",
                genre="Technology",
                isbn="978-1-59327-888-5",
                price=decimal.Decimal("34.50"),
                cover_image_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
                preview_file_url="",
                source_file_url="",
                is_active=True
            )
        ]
        
        db.add_all(books)
        db.commit()
        print("Database seeded successfully with Users and Books!")
        
    except Exception as e:
        print(f"An error occurred while seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
