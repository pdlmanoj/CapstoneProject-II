from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import os
import re
import json
import logging
import traceback
from peft import PeftModel
from .gemini_generator import GeminiRoadmapGenerator  # Updated import

logger = logging.getLogger(__name__)

class RoadmapGenerator:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'model')
        self.load_model()

    def load_model(self):
        """Load the fine-tuned model and tokenizer"""
        try:
            logger.info("Loading model and tokenizer...")
            # First load the base model
            base_model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
            base_model = AutoModelForCausalLM.from_pretrained(base_model_name)
            self.tokenizer = AutoTokenizer.from_pretrained(base_model_name)
            
            # Then load the LoRA adapter
            logger.info(f"Loading LoRA adapter from {self.model_path}")
            self.model = PeftModel.from_pretrained(base_model, self.model_path)
            self.model.eval()
            logger.info("Model loaded successfully!")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            logger.error(traceback.format_exc())
            raise

    def clean_roadmap_text(self, text):
        """Remove time durations from text"""
        # Remove patterns like (1 hour), (2 hours), (1hr), etc.
        cleaned_text = re.sub(r'\(\d+\s*(?:hour|hr|hours|hrs)\)', '', text)
        # Remove patterns like "1 hour", "2 hours" without parentheses
        cleaned_text = re.sub(r'\d+\s*(?:hour|hr|hours|hrs)', '', cleaned_text)
        return cleaned_text

    def _generate_prompt(self, topic):
        """Generate the prompt for the model"""
        return f"Create a learning roadmap for the following topic\n{topic}"

    def generate_roadmap(self, prompt):
        """Generate roadmap based on the input prompt"""
        try:
            if self.model is None or self.tokenizer is None:
                raise ValueError("Model or tokenizer not initialized properly")

            formatted_prompt = self._generate_prompt(prompt)
            logger.info(f"Using prompt: {formatted_prompt}")
            
            inputs = self.tokenizer(
                formatted_prompt,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=2048
            )
            
            attention_mask = inputs.get('attention_mask', None)
            if attention_mask is None:
                attention_mask = torch.ones_like(inputs['input_ids'])
                inputs['attention_mask'] = attention_mask

            logger.info("Generating response with local model...")
            with torch.no_grad():
                outputs = self.model.generate(
                    input_ids=inputs['input_ids'],
                    attention_mask=inputs['attention_mask'],
                    max_length=2048,
                    temperature=0.7,
                    num_return_sequences=1,
                    do_sample=True,
                    top_p=0.95,
                    top_k=50,
                    pad_token_id=self.tokenizer.eos_token_id
                )
            
            generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Extract the roadmap part (after the prompt)
            roadmap = generated_text[len(formatted_prompt):].strip()
            logger.debug(f"Local model output: {roadmap}")
            
            try:
                # Try to parse as JSON if the output is in JSON format
                roadmap_json = json.loads(roadmap)
                
                # Validate the structure of the generated roadmap
                if isinstance(roadmap_json, dict) and 'name' in roadmap_json and 'children' in roadmap_json:
                    return {
                        "success": True,
                        "roadmap": roadmap_json,
                        "format": "json",
                        "source": "local_model"
                    }
                else:
                    # If local model output doesn't match expected structure, try Gemini
                    logger.info("Local model output doesn't match expected structure, trying Gemini API...")
                    gemini_generator = GeminiRoadmapGenerator()
                    gemini_roadmap = gemini_generator.generate_roadmap(prompt)
                    
                    if gemini_roadmap and isinstance(gemini_roadmap, dict):
                        if gemini_roadmap.get("success", False):
                            return {
                                "success": True,
                                "roadmap": gemini_roadmap["roadmap"],
                                "format": "json",
                                "source": "gemini"
                            }
                        else:
                            logger.error(f"Gemini API error: {gemini_roadmap.get('error', 'Unknown error')}")
                    
                    return {
                        "success": False,
                        "error": "Both local model and Gemini failed to generate valid roadmap"
                    }
                        
            except json.JSONDecodeError:
                # If local model output is not valid JSON, try Gemini
                logger.info("Local model output is not valid JSON, trying Gemini API...")
                gemini_generator = GeminiRoadmapGenerator()
                gemini_roadmap = gemini_generator.generate_roadmap(prompt)
                
                if gemini_roadmap and isinstance(gemini_roadmap, dict):
                    if gemini_roadmap.get("success", False):
                        return {
                            "success": True,
                            "roadmap": gemini_roadmap["roadmap"],
                            "format": "json",
                            "source": "gemini"
                        }
                    else:
                        logger.error(f"Gemini API error: {gemini_roadmap.get('error', 'Unknown error')}")
                
                return {
                    "success": False,
                    "error": "Failed to generate roadmap with both models"
                }
                    
        except Exception as e:
            logger.error(f"Error generating roadmap: {str(e)}")
            logger.error(traceback.format_exc())
            return {
                "success": False,
                "error": str(e)
            }

    def _convert_json_to_markdown(self, node, level=0):
        """Convert the JSON tree structure to markdown format"""
        markdown = ""
        
        # Add the current node
        if level > 0:  # Skip the root node name
            markdown += "  " * (level - 1) + "- " + node["name"] + "\n"
        
        # Process children if they exist
        if "children" in node:
            for child in node["children"]:
                markdown += self._convert_json_to_markdown(child, level + 1)
        
        return markdown

# Initialize the model
roadmap_generator = RoadmapGenerator()
