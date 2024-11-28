from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .ml_model import RoadmapGenerator
import logging
import traceback
from dotenv import load_dotenv
import json
import os
import requests
import re

load_dotenv()

logger = logging.getLogger(__name__)
roadmap_generator = RoadmapGenerator()

def get_topic_content(topic):
    """Generate topic introduction, why to learn, and Q&A content."""
    try:
        # Create a structured prompt for the model
        prompt = f"""Create a comprehensive explanation for {topic} in the following format:

Introduction:
[Write 2-3 sentences introducing {topic}]

Why Learn:
[Explain in 2-3 points why someone should learn {topic}]

Q&A:
1. What is {topic}?
[Answer]
2. How can I start learning {topic}?
[Answer]
3. What are the prerequisites for learning {topic}?
[Answer]"""

        # Generate content using the roadmap generator
        result = roadmap_generator.generate_roadmap(prompt)
        
        if not result.get('success'):
            logger.error(f"Failed to generate content: {result.get('error')}")
            return None

        # Parse the generated text into structured content
        generated_text = result.get('roadmap', '')
        
        # Split the content into sections
        sections = generated_text.split('\n\n')
        
        # Create structured response
        content = {
            "introduction": "",
            "whyLearn": "",
            "qa": []
        }
        
        current_section = None
        qa_question = None
        
        for section in sections:
            section = section.strip()
            if not section:
                continue
                
            if section.startswith('Introduction:'):
                current_section = 'introduction'
                content['introduction'] = section.replace('Introduction:', '').strip()
            elif section.startswith('Why Learn:'):
                current_section = 'whyLearn'
                content['whyLearn'] = section.replace('Why Learn:', '').strip()
            elif section.startswith('Q&A:'):
                current_section = 'qa'
            elif current_section == 'qa':
                if section[0].isdigit():  # This is a question
                    if qa_question:  # Store previous Q&A pair if exists
                        content['qa'].append({
                            "question": qa_question,
                            "answer": qa_answer
                        })
                    qa_question = section[2:].strip()  # Remove number and dot
                    qa_answer = ""
                else:  # This is an answer
                    qa_answer = section.strip()
        
        # Add the last Q&A pair if exists
        if qa_question:
            content['qa'].append({
                "question": qa_question,
                "answer": qa_answer
            })
        
        # If any section is empty, provide fallback content
        if not content['introduction']:
            content['introduction'] = f"{topic} is a fundamental concept in modern development that plays a crucial role in building robust applications."
        
        if not content['whyLearn']:
            content['whyLearn'] = f"Learning {topic} is essential for understanding modern development practices and advancing your career in technology."
        
        if not content['qa']:
            content['qa'] = [
                {
                    "question": f"What is {topic}?",
                    "answer": f"{topic} is a fundamental concept in development."
                },
                {
                    "question": f"How can I start learning {topic}?",
                    "answer": "Start with basic tutorials and gradually move to more complex projects."
                },
                {
                    "question": f"What are the prerequisites for learning {topic}?",
                    "answer": "Basic programming knowledge and understanding of development concepts."
                }
            ]
        
        return content
    except Exception as e:
        logger.error(f"Error generating topic content: {str(e)}")
        logger.error(traceback.format_exc())
        return None

def get_backup_topic_info(topic):
    """Provide backup information for common programming topics."""
    topic_lower = topic.lower()
    
    # Dictionary of common programming topics and their brief explanations
    common_topics = {
        'data visualization': "Data visualization is the graphical representation of data using charts, graphs, and maps. It helps make complex data more understandable and helps identify patterns and trends.",
        
        'http': "HTTP (Hypertext Transfer Protocol) is the foundation of data communication on the web. It defines how messages are formatted and transmitted between web browsers and servers.",
        
        'api': "An API (Application Programming Interface) is a set of rules that allows different software applications to communicate with each other. It enables integration between different services and systems.",
        
        'rest': "REST (Representational State Transfer) is an architectural style for web services. It uses HTTP methods to interact with resources, making it the standard for building web APIs.",
        
        'javascript': "JavaScript is a versatile programming language that makes web pages interactive and dynamic. It runs in the browser and allows you to create responsive user interfaces and handle complex client-side operations. It's essential for modern web development and can also be used for server-side programming.",
        
        'python': "Python is a high-level programming language known for its simplicity and readability. It's widely used in web development, data science, and automation tasks. Its extensive library ecosystem makes it powerful for various applications.",
        
        'react': "React is a popular JavaScript library for building user interfaces, developed by Facebook. It uses a component-based architecture that makes it easy to create reusable UI elements. React's virtual DOM ensures efficient rendering and optimal performance.",
        
        'database': "A database is an organized collection of structured data designed for efficient access and management. It provides mechanisms for storing, retrieving, and updating information while maintaining data integrity and security.",
        
        'git': "Git is a distributed version control system that tracks changes in source code during software development. It enables multiple developers to work together on projects and maintain different versions of code. Git's branching and merging capabilities make it essential for modern software development.",
        
        'html': "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It provides the basic structure of web pages using a system of tags and attributes. HTML works with CSS for styling and JavaScript for functionality.",
        
        'css': "CSS (Cascading Style Sheets) is a style sheet language that controls the visual presentation of web pages. It handles layout, colors, fonts, spacing, and responsive design. CSS makes websites visually appealing and ensures consistent styling across different devices.",
        
        'algorithms': "Algorithms are systematic procedures or rules for solving computational problems. They form the foundation of computer programming and determine how programs process data. Good algorithms are essential for writing efficient and scalable software.",
        
        'data structures': "Data structures are specialized formats for organizing and storing data in computer memory. They provide efficient ways to access, insert, and delete data based on specific use cases. The right data structure can significantly impact a program's performance.",
        
        'machine learning': "Machine learning is a branch of artificial intelligence that enables systems to learn from data and improve without explicit programming. It uses statistical techniques to allow computers to find patterns and make predictions. ML is crucial for applications like recommendation systems, image recognition, and natural language processing.",
        
        'testing': "Software testing is the process of evaluating software to identify and fix defects or bugs. It ensures that code works as expected and meets requirements through various testing methods. Testing is crucial for maintaining software quality and preventing issues in production.",
        
        'frontend': "Frontend development focuses on creating the user interface and user experience of web applications. It involves using HTML, CSS, and JavaScript to build responsive and interactive web pages. Frontend developers ensure that users can effectively interact with the application.",
        
        'backend': "Backend development deals with server-side logic and database interactions in web applications. It handles data processing, authentication, and business logic that powers the frontend. Backend systems ensure data security and efficient application performance.",
        
        'api testing': "API testing verifies the functionality, reliability, and security of application programming interfaces. It ensures that APIs correctly handle requests, responses, and edge cases. API testing is crucial for maintaining the quality of web services and integrations.",
        
        'devops': "DevOps is a set of practices that combines software development (Dev) with IT operations (Ops). It emphasizes automation, continuous integration, and deployment to improve software delivery speed and quality. DevOps culture promotes collaboration between development and operations teams.",
        
        'cloud computing': "Cloud computing provides on-demand access to computing resources over the internet. It enables scalable, flexible, and cost-effective hosting of applications and services. Cloud platforms like AWS, Azure, and Google Cloud have revolutionized modern software deployment.",
        
        'security': "Security in software development focuses on protecting applications and data from unauthorized access and attacks. It involves implementing authentication, encryption, and secure coding practices. Security is crucial for maintaining user trust and protecting sensitive information."
    }
    
    # Try to find a match in common topics
    for key, value in common_topics.items():
        if key in topic_lower or topic_lower in key:
            return value
            
    # If no match found, generate a more specific generic response
    return f"{topic} is a concept in software development that helps developers build better applications. It contributes to code quality and efficiency. Understanding {topic} is valuable for writing more effective software."

def clean_topic_name(topic):
    """Clean the topic name by removing numbering and special characters."""
    # Remove numbers and dots from the start (e.g., "1.2 ")
    cleaned = re.sub(r'^\d+(\.\d+)*\s*', '', topic)
    # Remove colon and any following whitespace
    cleaned = re.sub(r':\s*', '', cleaned)
    # Remove any extra whitespace
    cleaned = cleaned.strip()
    return cleaned

def get_wiki_description(topic):
    """Fetch a short description of the topic from Wikipedia."""
    try:
        # Clean the topic name
        search_term = clean_topic_name(topic)
        if 'programming' not in search_term.lower() and search_term.lower() not in ['html', 'css', 'php']:
            search_term += ' programming'  # Add context for programming-related results
            
        # Wikipedia API endpoint
        url = 'https://en.wikipedia.org/w/api.php'
        
        # First, search for the most relevant page
        search_params = {
            'action': 'query',
            'format': 'json',
            'list': 'search',
            'srsearch': search_term,
            'srlimit': 1
        }
        
        search_response = requests.get(url, params=search_params)
        search_data = search_response.json()
        
        if not search_data.get('query', {}).get('search'):
            return get_backup_topic_info(topic)
            
        page_id = search_data['query']['search'][0]['pageid']
        
        # Then, get the extract for that page
        extract_params = {
            'action': 'query',
            'format': 'json',
            'prop': 'extracts',
            'exintro': True,
            'explaintext': True,
            'pageids': page_id
        }
        
        extract_response = requests.get(url, params=extract_params)
        extract_data = extract_response.json()
        
        # Get the extract text
        extract = extract_data['query']['pages'][str(page_id)]['extract']
        
        # Clean and limit the extract to 4 sentences max
        sentences = [s.strip() + '.' for s in extract.split('.') if s.strip()]
        short_description = ' '.join(sentences[:4])  # Take first 4 sentences
        
        # Clean up any remaining newlines or excessive spaces
        short_description = ' '.join(short_description.split())
        
        # If the description is too long, try to shorten it while keeping complete sentences
        if len(short_description.split()) > 60:  # Approximately 4 lines
            sentences = short_description.split('.')
            short_description = ''
            for sentence in sentences:
                if len((short_description + sentence).split()) <= 60:
                    short_description += sentence + '.'
                else:
                    break
        
        return short_description if short_description else get_backup_topic_info(topic)
        
    except Exception as e:
        logger.error(f"Error fetching Wikipedia description: {str(e)}")
        return get_backup_topic_info(topic)

def get_topic_info(topic):
    """Get a concise explanation of the topic."""
    try:
        # First try to get description from Wikipedia
        description = get_wiki_description(topic)
        
        # If description is too short or not found, use backup
        if len(description.split()) < 10:  # Less than 10 words
            return get_backup_topic_info(topic)
            
        return description
        
    except Exception as e:
        logger.error(f"Error in get_topic_info: {str(e)}")
        return get_backup_topic_info(topic)

def get_courses(topic):
    """Fetch relevant courses for the given topic."""
    try:
        # For now, using a static mapping of courses
        # In production, this should be connected to real course APIs
        courses_db = {
            "python": [
                {
                    "title": "Python for Everybody Specialization",
                    "platform": "Coursera",
                    "instructor": "Dr. Charles Severance",
                    "link": "https://www.coursera.org/specializations/python",
                    "description": "Learn to Program and Analyze Data with Python"
                },
                {
                    "title": "Complete Python Bootcamp",
                    "platform": "Udemy",
                    "instructor": "Jose Portilla",
                    "link": "https://www.udemy.com/course/complete-python-bootcamp/",
                    "description": "Learn Python like a Professional"
                }
            ],
            "javascript": [
                {
                    "title": "JavaScript: From Fundamentals to Functional JS",
                    "platform": "Frontend Masters",
                    "instructor": "Bianca Gandolfo",
                    "link": "https://frontendmasters.com/courses/js-fundamentals-functional-v2/",
                    "description": "Learn JavaScript fundamentals and functional programming concepts"
                },
                {
                    "title": "Modern JavaScript From The Beginning",
                    "platform": "Udemy",
                    "instructor": "Brad Traversy",
                    "link": "https://www.udemy.com/course/modern-javascript-from-the-beginning/",
                    "description": "Learn modern JavaScript from the basics to advanced topics"
                }
            ]
        }
        
        # Convert topic to lowercase and remove special characters
        clean_topic = ''.join(e.lower() for e in topic if e.isalnum())
        
        # Return courses if available, otherwise return default courses
        return courses_db.get(clean_topic, [
            {
                "title": f"Introduction to {topic}",
                "platform": "edX",
                "instructor": "Various Experts",
                "link": f"https://www.edx.org/search?q={topic}",
                "description": f"Learn {topic} from scratch"
            },
            {
                "title": f"{topic} Fundamentals",
                "platform": "Coursera",
                "instructor": "Industry Experts",
                "link": f"https://www.coursera.org/search?query={topic}",
                "description": f"Master the basics of {topic}"
            }
        ])
    except Exception as e:
        print(f"Error fetching courses: {str(e)}")
        return []

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
            topic = request.data.get('topic', '')
            if not topic:
                return Response({'error': 'Topic is required'}, status=400)

            topic_info = get_topic_info(topic)
            courses = get_courses(topic)

            return Response({
                'success': True,
                'resources': {
                    'topicInfo': topic_info,
                    'courses': courses
                }
            })
        except Exception as e:
            logger.error(f"Error in GetResourcesView: {str(e)}\n{traceback.format_exc()}")
            return Response({
                'success': False,
                'error': str(e)
            }, status=500)
