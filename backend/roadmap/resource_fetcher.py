import os
import requests
from typing import List, Dict
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

class ResourceFetcher:
    def __init__(self):
        self.youtube = build('youtube', 'v3', 
                           developerKey=os.getenv('YOUTUBE_API_KEY'))
        self.medium_api_url = "https://api.medium.com/v1"
        self.goodreads_api_url = "https://www.goodreads.com/search.xml"
        self.goodreads_key = os.getenv('GOODREADS_KEY')

    def get_youtube_resources(self, topic: str) -> List[Dict]:
        """Fetch relevant YouTube videos for a topic."""
        try:
            # Search for videos related to the topic
            search_response = self.youtube.search().list(
                q=f"learn {topic} tutorial",
                part="snippet",
                maxResults=3,
                type="video",
                relevanceLanguage="en",
                order="relevance"
            ).execute()

            videos = []
            for item in search_response.get("items", []):
                video_id = item["id"]["videoId"]
                # Get video statistics
                video_response = self.youtube.videos().list(
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
            return videos
        except Exception as e:
            print(f"Error fetching YouTube resources: {str(e)}")
            return []

    def get_blog_posts(self, topic: str) -> List[Dict]:
        """Fetch relevant blog posts and articles."""
        # For now, we'll use a curated list of technical blogs and articles
        # In a production environment, you might want to use proper APIs
        curated_resources = [
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
        return curated_resources

    def get_book_recommendations(self, topic: str) -> List[Dict]:
        """Get book recommendations for the topic."""
        # Curated list of popular technical books
        # In production, you might want to use Goodreads or Amazon API
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

    def fetch_all_resources(self, topic: str) -> Dict:
        """Fetch all types of resources for a given topic."""
        return {
            "videos": self.get_youtube_resources(topic),
            "articles": self.get_blog_posts(topic),
            "books": self.get_book_recommendations(topic)
        }
