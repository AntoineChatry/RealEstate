import json
import aioredis
from time import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS middleware configuration
origins = [
    "http://localhost",
    "http://localhost/",
    "http://localhost:3000/",
    "http://localhost:3000",  # Add the frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)

async def fetch_property_info(property_id: float):
    # Fetch property data from an external API or database
    # In this example, we'll just return a hardcoded property
    return {
        "property_id": property_id,
        "title": "House for sale",
        "description": "A beautiful, recently built house for sale",
        "price": 100000.0,
        "location": "San Francisco"
    }

class Property(BaseModel):
    # property_id: float
    title: str
    description: str
    price: float
    location: str

@app.get("/")
def read_root():
    # Default route to test the API
    return {"message": "Hello, World"}

@app.get("/properties/{property_id}")
async def get_property(property_id: float):
    # Check if property data is cached in Redis
    property_data = await app.state.redis.get(f"property:{property_id}")

    if property_data:
        # Property data is cached, deserialize and return it
        property_info = json.loads(property_data)
        return property_info
    else:
        # Property data is not cached, fetch it from the database or an external API
        property_info = await fetch_property_info(property_id)
        # Cache the property data in Redis for future requests
        await app.state.redis.set(f"property:{property_id}", json.dumps(property_info))

        return property_info

@app.post("/properties")
async def create_property(property: Property):
    property_id = time()
    property_data = property.json()

    # Store the property data in Redis
    await app.state.redis.set(f"property:{property_id}", property_data)

    return {"property_id": property_id}


@app.on_event("startup")
async def startup_event():
    # Initialize Redis connection on startup
    app.state.redis = await aioredis.from_url("redis://127.0.0.1:6379")

@app.on_event("shutdown")
async def shutdown_event():
    # Close Redis connection on shutdown
    await app.state.redis.close()
    await app.state.redis.wait_closed()
