from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.config.db import get_db
from app.models.all_models import Book
from app.schemas.all_schemas import BookCreate, BookUpdate, BookResponse
from app.utils.auth_helper import get_current_admin
from app.utils.s3_helper import STORAGE_DIR, BOOKS_DIR, PREVIEWS_DIR, COVERS_DIR
from typing import List, Optional
import os
import uuid

router = APIRouter(prefix="/api/books", tags=["Books Catalog"])

@router.get("", response_model=List[BookResponse])
def get_books(
    search: Optional[str] = None,
    genre: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    admin_view: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Book)
    
    # Non-admins can only see active books
    if not admin_view:
        query = query.filter(Book.is_active == True)
        
    if search:
        query = query.filter(
            or_(
                Book.title.ilike(f"%{search}%"),
                Book.author.ilike(f"%{search}%"),
                Book.description.ilike(f"%{search}%")
            )
        )
        
    if genre:
        query = query.filter(Book.genre == genre)
        
    if min_price is not None:
        query = query.filter(Book.price >= min_price)
        
    if max_price is not None:
        query = query.filter(Book.price <= max_price)
        
    return query.order_by(Book.id.desc()).all()

@router.get("/{book_id}", response_model=BookResponse)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.post("", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
def create_book(
    book_data: BookCreate,
    admin: Session = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_book = Book(**book_data.dict())
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book

@router.put("/{book_id}", response_model=BookResponse)
def update_book(
    book_id: int,
    book_data: BookUpdate,
    admin: Session = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
        
    for key, value in book_data.dict(exclude_unset=True).items():
        setattr(book, key, value)
        
    db.commit()
    db.refresh(book)
    return book

@router.delete("/{book_id}")
def delete_book(
    book_id: int,
    admin: Session = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
        
    # We can delete it, or soft-delete it by setting is_active=False
    # To keep user purchase history working, we soft-delete
    book.is_active = False
    db.commit()
    return {"message": "Book archived successfully"}

@router.post("/upload-file")
def upload_asset(
    file_type: str,  # "cover", "preview", or "book"
    file: UploadFile = File(...),
    admin: Session = Depends(get_current_admin)
):
    """Utility endpoint to upload assets locally and get a file URL."""
    if file_type == "cover":
        target_dir = COVERS_DIR
    elif file_type == "preview":
        target_dir = PREVIEWS_DIR
    elif file_type == "book":
        target_dir = BOOKS_DIR
    else:
        raise HTTPException(status_code=400, detail="Invalid file type")
        
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(target_dir, unique_filename)
    
    with open(file_path, "wb") as f:
        f.write(file.file.read())
        
    # In production this returns an S3 URL.
    # Locally, it returns a static asset URL relative to our FastAPI server.
    return {"url": f"/static/{file_type}s/{unique_filename}"}
