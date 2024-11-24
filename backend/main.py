from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict
from roadmap.resource_fetcher import ResourceFetcher

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize resource fetcher
resource_fetcher = ResourceFetcher()

class ResourceRequest(BaseModel):
    topic: str

@app.post("/api/resources/")
async def get_resources(request: ResourceRequest):
    try:
        resources = resource_fetcher.fetch_all_resources(request.topic)
        return {
            "success": True,
            "resources": resources
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
