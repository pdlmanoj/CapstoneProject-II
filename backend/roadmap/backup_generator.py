import os
import json
import google.generativeai as ai_service
from dotenv import load_dotenv

load_dotenv()

class BackupModelGenerator:
    def __init__(self):
        api_key = os.getenv('MODEL_API_KEY')
        if not api_key:
            raise ValueError("API key not found in environment variables")
        ai_service.configure(api_key=api_key)
        self.model = ai_service.GenerativeModel('gemini-1.5-flash')
        
        # Define allowed tech fields
        self.tech_fields = {
    # Programming Languages
    'programming', 'python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'rust', 'go','mongoDB',
    
    # Web Development
    'web development', 'frontend', 'backend', 'fullstack', 'html', 'css', 'react', 'angular', 'vue', 'node.js',
    'django', 'flask', 'spring boot', 'asp.net', 'web design', 'responsive design','full stack development',
    
    # Data Related
    'data', 'data science', 'data engineering', 'data analyst', 'data analytics', 'business analyst', 'business intelligence',
    'bi', 'power bi', 'tableau', 'data visualization', 'etl', 'sql', 'mysql', 'postgresql', 'mongodb', 'database',
    'big data', 'hadoop', 'spark', 'data warehouse', 'data modeling',
    
    # AI/ML
    'machine learning', 'artificial intelligence', 'ai', 'deep learning', 'nlp', 'computer vision',
    'neural networks', 'tensorflow', 'pytorch', 'scikit-learn', 'ml ops',''
    
    # Cloud & DevOps
    'devops', 'cloud computing', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'ci/cd',
    'terraform', 'ansible', 'cloud architect', 'site reliability', 'sre', 'system admin',
    
    # Security
    'cybersecurity', 'security', 'ethical hacking', 'penetration testing', 'pen testing', 'network security',
    'security analyst', 'security engineer', 'information security', 'infosec',
    
    # Mobile Development
    'mobile development', 'android', 'ios', 'flutter', 'react native', 'mobile app', 'app development',
    
    # Other Tech Roles & Skills
    'software engineer', 'software developer', 'software architect', 'solution architect',
    'quality assurance', 'qa engineer', 'test automation', 'automation engineer',
    'technical project manager', 'scrum master', 'agile', 'product owner',
    'ui/ux', 'user interface', 'user experience', 'product design', 'system design',
    'blockchain', 'web3', 'defi', 'smart contracts', 'cryptocurrency',
    'game development', 'unity', 'unreal engine',
    'embedded systems', 'iot', 'internet of things', 'robotics',
    'technical lead', 'tech lead', 'engineering manager',
    'networking', 'network engineer', 'system administrator',
    'linux', 'unix', 'windows server', 'shell scripting',
    'api', 'rest api', 'graphql', 'microservices', 'distributed systems',
    'security', 'cybersecurity', 'ethical hacking', 'penetration testing', 'pen testing', 'network security',
 }
 
    def is_tech_related(self, prompt):
        """Check if the prompt is related to technology field"""
        # First check with our predefined tech fields
        prompt_lower = prompt.lower()
        
        # Split the prompt into words and check each word/phrase
        words = prompt_lower.split()
        # Check single words
        for word in words:
            if word in self.tech_fields:
                return True
                
        # Check consecutive pairs of words (for phrases like "machine learning")
        for i in range(len(words) - 1):
            phrase = words[i] + " " + words[i + 1]
            if phrase in self.tech_fields:
                return True
                
        # Check if any tech field is a substring of the prompt
        for tech in self.tech_fields:
            if tech in prompt_lower:
                return True
                
        return False  # If no tech-related terms found, return False

    def clean_json_response(self, response_text):
        """Clean and parse JSON response from the model"""
        response_text = response_text.strip()
        
        # Handle markdown code blocks if present
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            json_str = response_text.split("```")[1].strip()
        else:
            json_str = response_text.strip()
            
        return json_str

    def limit_node_count(self, roadmap_json):
        """Limit the number of nodes at each level"""
        if not isinstance(roadmap_json, dict):
            return roadmap_json
            
        # Limit main topics to 6
        if 'children' in roadmap_json:
            roadmap_json['children'] = roadmap_json['children'][:6]
            
            # Limit subtopics for each main topic to 4
            for main_topic in roadmap_json['children']:
                if 'children' in main_topic:
                    main_topic['children'] = main_topic['children'][:4]
                    
                    # Limit points for each subtopic to 3
                    for subtopic in main_topic['children']:
                        if 'children' in subtopic:
                            subtopic['children'] = subtopic['children'][:3]
        
        return roadmap_json

    def transform_roadmap_format(self, roadmap_data):
        """Transform the roadmap output into the format expected by the visualization"""
        try:
            title = roadmap_data.get('name', '')
            subtopics = []
            for main_topic in roadmap_data.get('children', []):
                subtopic = {
                    'title': main_topic.get('name', ''),
                    'children': []
                }
                
                for sub in main_topic.get('children', []):
                    for child in sub.get('children', []):
                        subtopic['children'].append({
                            'title': child.get('name', '')
                        })
                
                subtopics.append(subtopic)
            
            return {
                'title': title,
                'subtopics': subtopics
            }
        except Exception:
            return None

    def generate_roadmap(self, prompt):
        """Generate roadmap based on the input prompt"""
        if not self.is_tech_related(prompt):
            return {
                "success": False,
                "error": "Currently, we only support technology-related learning roadmaps."
            }
            
        try:
            structured_prompt = f"""Create a concise learning roadmap for {prompt}.
    
Return ONLY a valid JSON object with the following rules:
1. Maximum 5-6 main topics in the "children" array
2. Each main topic should have 3-4 subtopics maximum
3. Each subtopic should have 2-3 points maximum

Use this exact format:
{{
    "name": "{prompt}",
    "children": [
        {{
            "name": "Main Topic 1",
            "children": [
                {{
                    "name": "Subtopic 1.1",
                    "children": [
                        {{
                            "name": "Point 1.1.1"
                        }},
                        {{
                            "name": "Point 1.1.2"
                        }}
                    ]
                }}
            ]
        }}
    ]
}}"""

            response = self.model.generate_content(structured_prompt)
            
            if not response or not response.text:
                return None
                
            try:
                # Clean and parse the JSON response
                json_str = self.clean_json_response(response.text)
                roadmap_json = json.loads(json_str)
                
                # Limit the number of nodes
                roadmap_json = self.limit_node_count(roadmap_json)
                
                # Transform to the expected format
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
                    
            except json.JSONDecodeError:
                return {
                    "success": False,
                    "error": "Failed to generate valid roadmap structure"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
