from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# ----------------- Token & Auth Schemas -----------------
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

# ----------------- User Schemas -----------------
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Book Schemas -----------------
class BookBase(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    genre: Optional[str] = None
    isbn: Optional[str] = None
    price: float
    cover_image_url: Optional[str] = None
    preview_file_url: Optional[str] = None
    source_file_url: Optional[str] = None
    is_active: Optional[bool] = True

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    description: Optional[str] = None
    genre: Optional[str] = None
    isbn: Optional[str] = None
    price: Optional[float] = None
    cover_image_url: Optional[str] = None
    preview_file_url: Optional[str] = None
    source_file_url: Optional[str] = None
    is_active: Optional[bool] = None

class BookResponse(BookBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Cart Schemas -----------------
class CartItemBase(BaseModel):
    book_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: int
    user_id: int
    book_id: int
    quantity: int
    book: BookResponse

    class Config:
        from_attributes = True

# ----------------- Order Schemas -----------------
class OrderItemResponse(BaseModel):
    id: int
    book_id: int
    price_at_purchase: float
    book: BookResponse

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    stripe_session_id: Optional[str] = None
    total_amount: float
    payment_status: str
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class CheckoutItem(BaseModel):
    book_id: int
    quantity: int = 1

class CheckoutRequest(BaseModel):
    items: List[CheckoutItem]
    coupon_code: Optional[str] = None

class CheckoutResponse(BaseModel):
    checkout_url: str
    order_id: int

# ----------------- Download Schemas -----------------
class DownloadLogResponse(BaseModel):
    id: int
    user_id: int
    book_id: int
    ip_address: Optional[str] = None
    downloaded_at: datetime

    class Config:
        from_attributes = True
