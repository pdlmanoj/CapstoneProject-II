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
    'programming', 'python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'rust', 'go',
    
    # Web Development
    'web development', 'frontend', 'backend', 'fullstack', 'html', 'css', 'react', 'angular', 'vue', 'node.js',
    'django', 'flask', 'spring boot', 'asp.net', 'web design', 'responsive design',
    
    # Data Related
    'data', 'data science', 'data engineering', 'data analyst', 'data analytics', 'business analyst', 'business intelligence',
    'bi', 'power bi', 'tableau', 'data visualization', 'etl', 'sql', 'mysql', 'postgresql', 'mongodb', 'database',
    'big data', 'hadoop', 'spark', 'data warehouse', 'data modeling',
    
    # AI/ML
    'machine learning', 'artificial intelligence', 'ai', 'deep learning', 'nlp', 'computer vision',
    'neural networks', 'tensorflow', 'pytorch', 'scikit-learn', 'ml ops',
    
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
    'api', 'rest api', 'graphql', 'microservices', 'distributed systems'
}

    def is_tech_related(self, prompt):
        """Check if the prompt is related to technology field using AI verification"""
        try:
            # First check with our predefined tech fields
            prompt_lower = prompt.lower()
            if any(tech in prompt_lower for tech in self.tech_fields):
                return True
                
            # If not found in predefined list, verify using AI
            verification_prompt = f"""
            Is '{prompt}' related to technology, computer science, software, IT, or digital skills?
            Answer ONLY 'yes' or 'no'. Consider all technical roles, tools, and skills.
            """
            
            response = self.model.generate_content(verification_prompt)
            if response and response.text:
                answer = response.text.strip().lower()
                return answer == 'yes'
                
            return False
            
        except Exception:
            # If verification fails, fall back to basic keyword matching
            return any(tech in prompt_lower for tech in self.tech_fields)

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
        # First verify if the topic is tech-related
        if not self.is_tech_related(prompt):
            return {
                "success": False,
                "error": "This model is trained only for technology-related learning roadmaps. Please enter a tech-related topic, role, or skill."
            }
            
        try:
            structured_prompt = f"""Create a comprehensive learning roadmap for {prompt}.
    
Return ONLY a valid JSON object in the following format, with no additional text or markdown formatting:
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
}}

IMPORTANT: Return ONLY the JSON object, no additional text or explanation."""

            response = self.model.generate_content(structured_prompt)
            
            if not response or not response.text:
                return None
                
            response_text = response.text.strip()
            
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                json_str = response_text.split("```")[1].strip()
            else:
                json_str = response_text.strip()
            
            roadmap_json = json.loads(json_str)
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
            return {
                "success": False,
                "error": str(e)
            }
