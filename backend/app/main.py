from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config.db import Base, engine
from app.routers.auth import router as auth_router
from app.routers.books import router as books_router
from app.routers.orders import router as orders_router
from app.routers.cart import router as cart_router
from app.routers.library import router as library_router
from app.utils.s3_helper import STORAGE_DIR
import os

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Digital E-Book System API",
    description="Backend services for E-Book Hub storefront and administration.",
    version="1.0.0"
)

# Configure CORS
# In production, specify exact frontend domains. In development, allow wildcard.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local storage folder to serve cover images and previews statically
if os.path.exists(STORAGE_DIR):
    app.mount("/static", StaticFiles(directory=STORAGE_DIR), name="static")

# Include routers
app.include_router(auth_router)
app.include_router(books_router)
app.include_router(orders_router)
app.include_router(cart_router)
app.include_router(library_router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Digital E-Book System API!",
        "docs_url": "/docs",
        "status": "healthy"
    }
