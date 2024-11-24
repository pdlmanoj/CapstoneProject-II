from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .ml_model import RoadmapGenerator
import logging
import traceback
from googleapiclient.discovery import build
from dotenv import load_dotenv
import json
import os

load_dotenv()

logger = logging.getLogger(__name__)
roadmap_generator = RoadmapGenerator()

def get_youtube_resources(topic):
    """Fetch relevant YouTube videos for a topic."""
    try:
        api_key = os.getenv('YOUTUBE_API_KEY')
        print(f"Using API key: {api_key}")  # Debug log
        
        youtube = build('youtube', 'v3', 
                       developerKey=api_key)
        
        # Simplified search query
        search_query = f"{topic} tutorial"
        print(f"Searching for: {search_query}")  # Debug log
        
        # Search for videos related to the topic
        search_response = youtube.search().list(
            q=search_query,
            part="snippet",
            maxResults=3,
            type="video",
            relevanceLanguage="en",
            order="relevance"
        ).execute()
        
        print(f"Search response: {json.dumps(search_response, indent=2)}")  # Debug log

        videos = []
        for item in search_response.get("items", []):
            video_id = item["id"]["videoId"]
            print(f"Processing video ID: {video_id}")  # Debug log
            
            # Get video statistics
            video_response = youtube.videos().list(
                part="contentDetails,statistics",
                id=video_id
            ).execute()
            
            if video_response["items"]:
                stats = video_response["items"][0]
                videos.append({
                    "type": "Video",
                    "platform": "YouTube",
                    "title": item["snippet"]["title"],
                    "description": item["snippet"]["description"],
                    "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                    "link": f"https://www.youtube.com/watch?v={video_id}",
                    "views": stats["statistics"].get("viewCount", "N/A"),
                    "duration": stats["contentDetails"]["duration"],
                    "channel": item["snippet"]["channelTitle"]
                })
        
        print(f"Found {len(videos)} videos for topic: {topic}")  # Debug log
        return videos
    except Exception as e:
        print(f"Error fetching YouTube resources: {str(e)}")
        print(traceback.format_exc())  # Print full error traceback
        return []

def get_blog_posts(topic):
    """Fetch relevant blog posts and articles."""
    return [
        {
            "type": "Article",
            "platform": "Medium",
            "title": f"Understanding {topic} - A Comprehensive Guide",
            "link": f"https://medium.com/search?q={topic}",
            "duration": "15 mins read"
        },
        {
            "type": "Article",
            "platform": "Dev.to",
            "title": f"Practical {topic} Tutorial",
            "link": f"https://dev.to/search?q={topic}",
            "duration": "10 mins read"
        },
        {
            "type": "Documentation",
            "platform": "Official Docs",
            "title": f"{topic} Documentation",
            "link": f"https://www.google.com/search?q={topic}+official+documentation",
            "duration": "Reference"
        }
    ]

def get_book_recommendations(topic):
    """Get book recommendations for the topic."""
    return [
        {
            "type": "Book",
            "platform": "Amazon",
            "title": f"Learning {topic}: A Comprehensive Guide",
            "link": f"https://www.amazon.com/s?k={topic}+programming+book",
            "duration": "Book"
        },
        {
            "type": "Book",
            "platform": "O'Reilly",
            "title": f"{topic} in Practice",
            "link": f"https://www.oreilly.com/search/?q={topic}",
            "duration": "Book"
        }
    ]

class GenerateRoadmapView(APIView):
    def post(self, request):
        try:
            prompt = request.data.get('prompt')
            if not prompt:
                return Response(
                    {'success': False, 'error': 'No prompt provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Generate roadmap
            result = roadmap_generator.generate_roadmap(prompt)
            
            # Return the result directly since it already has the correct structure
            # {'success': True/False, 'roadmap': roadmap, 'format': 'markdown'} or
            # {'success': False, 'error': error_message, 'format': 'error'}
            return Response(result)
            
        except Exception as e:
            logger.error(f"Error in generate_roadmap view: {str(e)}")
            logger.error(traceback.format_exc())
            return Response(
                {'success': False, 'error': 'Failed to generate roadmap', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GetResourcesView(APIView):
    def post(self, request):
        try:
            data = request.data
            topic = data.get('topic')
            
            if not topic:
                return Response({
                    'success': False,
                    'error': 'Topic is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            resources = {
                'videos': get_youtube_resources(topic),
                'articles': get_blog_posts(topic),
                'books': get_book_recommendations(topic)
            }

            return Response({
                'success': True,
                'resources': resources
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
