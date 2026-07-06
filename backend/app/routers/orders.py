from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.all_models import Order, OrderItem, Book, CartItem
from app.schemas.all_schemas import CheckoutRequest, CheckoutResponse, OrderResponse
from app.utils.auth_helper import get_current_user, get_current_admin
from typing import List, Dict, Any
import uuid

router = APIRouter(prefix="/api/orders", tags=["Orders & Payments"])

@router.post("/checkout", response_model=CheckoutResponse)
def checkout(
    checkout_data: CheckoutRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not checkout_data.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
        
    total_amount = 0.0
    items_to_save = []
    
    for item in checkout_data.items:
        book = db.query(Book).filter(Book.id == item.book_id, Book.is_active == True).first()
        if not book:
            raise HTTPException(status_code=404, detail=f"Book with id {item.book_id} not found")
        
        price = float(book.price)
        total_amount += price * item.quantity
        items_to_save.append((book.id, price))
        
    # Apply mock discount coupon code
    if checkout_data.coupon_code:
        code = checkout_data.coupon_code.strip().upper()
        if code == "TECH30":
            total_amount = total_amount * 0.70  # 30% Off
        elif code == "EBOOK10":
            total_amount = total_amount * 0.90  # 10% Off
            
    # Generate mock Stripe session ID
    stripe_session_id = f"cs_test_{uuid.uuid4().hex}"
    
    # Create the pending order
    new_order = Order(
        user_id=current_user.id,
        stripe_session_id=stripe_session_id,
        total_amount=total_amount,
        payment_status="pending"
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    # Create the order items
    for book_id, price in items_to_save:
        order_item = OrderItem(
            order_id=new_order.id,
            book_id=book_id,
            price_at_purchase=price
        )
        db.add(order_item)
        
    db.commit()
    
    # Clear user's shopping cart after initiating checkout
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    
    # Simulate the redirect checkout URL.
    # In production, this would redirect to Stripe checkout portal.
    # Locally, we redirect to our frontend's simulated checkout page.
    simulated_checkout_url = f"/payment-gateway?session_id={stripe_session_id}&order_id={new_order.id}"
    
    return CheckoutResponse(
        checkout_url=simulated_checkout_url,
        order_id=new_order.id
    )

@router.post("/confirm-payment")
def confirm_payment(
    payload: Dict[str, Any],
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Simulates Stripe payment webhook/callback. Updates order status to PAID."""
    order_id = payload.get("order_id")
    session_id = payload.get("session_id")
    
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    order.payment_status = "paid"
    db.commit()
    
    return {"status": "success", "message": "Payment confirmed successfully"}

@router.get("/my-orders", response_model=List[OrderResponse])
def get_my_orders(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.id.desc()).all()

@router.get("/all", response_model=List[OrderResponse])
def get_all_orders(
    admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(Order).order_by(Order.id.desc()).all()

@router.post("/refund/{order_id}")
def refund_order(
    order_id: int,
    admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    order.payment_status = "refunded"
    db.commit()
    return {"message": "Order refunded successfully"}
