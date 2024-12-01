import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

load_dotenv()

class GeminiRoadmapGenerator:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def transform_roadmap_format(self, roadmap_data):
        """Transform the Gemini output into the format expected by the visualization"""
        try:
            # Extract main topic name
            title = roadmap_data.get('name', '')
            
            # Transform children into subtopics with their own children
            subtopics = []
            for main_topic in roadmap_data.get('children', []):
                subtopic = {
                    'title': main_topic.get('name', ''),
                    'children': []
                }
                
                # Process each subtopic's children
                for sub in main_topic.get('children', []):
                    # For each subtopic, get its children as individual items
                    for child in sub.get('children', []):
                        subtopic['children'].append({
                            'title': child.get('name', '')
                        })
                
                subtopics.append(subtopic)
            
            # Return in the format expected by RoadmapFlow
            return {
                'title': title,
                'subtopics': subtopics
            }
        except Exception as e:
            logger.error(f"Error transforming roadmap format: {str(e)}")
            return None

    def generate_roadmap(self, prompt):
        """Generate roadmap using Gemini API"""
        try:
            structured_prompt = f"""Create a comprehensive learning roadmap for {prompt}.
    
Return ONLY a valid JSON object in the following format, with no additional text or markdown formatting:
{{
    "name": "{prompt}",
    "children": [
        {{
            "name": "1. Major Topic",
            "children": [
                {{
                    "name": "1.1 Subtopic",
                    "children": [
                        {{"name": "1.1.1 Specific Topic"}},
                        {{"name": "1.1.2 Specific Topic"}},
                        {{"name": "1.1.3 Specific Topic"}}
                    ]
                }}
            ]
        }}
    ]
}}

Guidelines:
1. Include 4-5 main sections
2. Each main section should have 2-3 subsections
3. Each subsection should have 2-3 specific topics
4. Use proper numbering (1., 1.1, 1.1.1)
5. Be specific and practical
6. Include hands-on projects where relevant

IMPORTANT: Return ONLY the JSON object, no additional text or explanation."""

            logger.info(f"Sending prompt to Gemini API: {prompt}")
            response = self.model.generate_content(structured_prompt)
            
            if not response or not response.text:
                logger.error("Empty response from Gemini API")
                return None
                
            # Extract JSON from the response
            response_text = response.text.strip()
            logger.debug(f"Raw Gemini response: {response_text}")
            
            # Try to find JSON in the response
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                json_str = response_text.split("```")[1].strip()
            else:
                json_str = response_text.strip()
            
            logger.debug(f"Extracted JSON string: {json_str}")
            
            # Parse the JSON
            roadmap_json = json.loads(json_str)
            
            # Transform the format to match the visualization requirements
            transformed_roadmap = self.transform_roadmap_format(roadmap_json)
            
            if transformed_roadmap:
                return {
                    "success": True,
                    "roadmap": transformed_roadmap,
                    "format": "json"
                }
            else:
                return {
                    "success": False,
                    "error": "Failed to transform roadmap format"
                }
                
        except Exception as e:
            logger.error(f"Error generating roadmap with Gemini: {str(e)}")
            logger.exception("Full traceback:")
            return {
                "success": False,
                "error": str(e)
            }
