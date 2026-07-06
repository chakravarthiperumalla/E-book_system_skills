from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.all_models import CartItem, Book
from app.schemas.all_schemas import CartItemCreate, CartItemUpdate, CartItemResponse
from app.utils.auth_helper import get_current_user
from typing import List

router = APIRouter(prefix="/api/cart", tags=["Shopping Cart"])

@router.get("", response_model=List[CartItemResponse])
def get_cart_items(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(CartItem).filter(CartItem.user_id == current_user.id).all()

@router.post("", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    item_data: CartItemCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify book exists and is active
    book = db.query(Book).filter(Book.id == item_data.book_id, Book.is_active == True).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
        
    # Check if item is already in cart
    existing_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.book_id == item_data.book_id
    ).first()
    
    if existing_item:
        existing_item.quantity += item_data.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
        
    new_item = CartItem(
        user_id=current_user.id,
        book_id=item_data.book_id,
        quantity=item_data.quantity
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/{item_id}", response_model=CartItemResponse)
def update_cart_item(
    item_id: int,
    update_data: CartItemUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
        
    if item.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access")
        
    if update_data.quantity <= 0:
        db.delete(item)
        db.commit()
        raise HTTPException(status_code=200, detail="Item removed since quantity was <= 0")
        
    item.quantity = update_data.quantity
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def remove_from_cart(
    item_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
        
    if item.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized access")
        
    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart successfully"}
