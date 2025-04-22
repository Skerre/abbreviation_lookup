import re
import os
import json
import sys
import pyperclip
import keyboard
from tkinter import Tk, Text, Button, Label, Frame, Scrollbar, messagebox, StringVar, Entry

class AbbreviationTool:
    def __init__(self, root):
        self.root = root
        self.root.title("Abbreviation Extractor")
        self.root.geometry("600x500")
        
        # Path to abbreviations.js file
        self.file_path_var = StringVar()
        self.file_path_var.set("")
        
        # Create main frame
        main_frame = Frame(root)
        main_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Create file path entry
        path_frame = Frame(main_frame)
        path_frame.pack(fill="x", pady=5)
        
        Label(path_frame, text="Path to abbreviations.js:").pack(side="left")
        Entry(path_frame, textvariable=self.file_path_var, width=50).pack(side="left", padx=5, fill="x", expand=True)
        Button(path_frame, text="Save Path", command=self.save_path).pack(side="right")
        
        # Create text input area
        Label(main_frame, text="Paste text with abbreviations:").pack(anchor="w", pady=(10, 5))
        
        input_frame = Frame(main_frame)
        input_frame.pack(fill="both", expand=True, pady=5)
        
        self.text_input = Text(input_frame, height=10, wrap="word")
        self.text_input.pack(side="left", fill="both", expand=True)
        
        scrollbar = Scrollbar(input_frame, command=self.text_input.yview)
        scrollbar.pack(side="right", fill="y")
        self.text_input.config(yscrollcommand=scrollbar.set)
        
        # Create buttons
        button_frame = Frame(main_frame)
        button_frame.pack(fill="x", pady=10)
        
        Button(button_frame, text="Extract from Clipboard", command=self.extract_from_clipboard).pack(side="left", padx=5)
        Button(button_frame, text="Extract & Add", command=self.extract_and_add).pack(side="left", padx=5)
        Button(button_frame, text="Clear", command=self.clear_text).pack(side="left", padx=5)
        
        # Create output area
        Label(main_frame, text="Extracted Abbreviation:").pack(anchor="w", pady=(10, 5))
        
        output_frame = Frame(main_frame)
        output_frame.pack(fill="both", expand=True, pady=5)
        
        self.text_output = Text(output_frame, height=8, wrap="word")
        self.text_output.pack(side="left", fill="both", expand=True)
        
        scrollbar_output = Scrollbar(output_frame, command=self.text_output.yview)
        scrollbar_output.pack(side="right", fill="y")
        self.text_output.config(yscrollcommand=scrollbar_output.set)
        
        # Status label
        self.status_var = StringVar()
        self.status_var.set("Ready")
        Label(main_frame, textvariable=self.status_var, anchor="w").pack(fill="x", pady=5)
        
        # Load saved path
        self.load_path()
        
        # Set up global hotkey
        keyboard.add_hotkey('ctrl+shift+a', self.hotkey_handler)
        
    def load_path(self):
        """Load saved abbreviations.js path if it exists"""
        config_path = os.path.join(os.path.expanduser("~"), ".abbrev_tool_config.json")
        try:
            if os.path.exists(config_path):
                with open(config_path, 'r') as f:
                    config = json.load(f)
                    self.file_path_var.set(config.get("path", ""))
        except Exception as e:
            self.status_var.set(f"Error loading config: {str(e)}")
    
    def save_path(self):
        """Save the current path to configuration file"""
        path = self.file_path_var.get().strip()
        if not path:
            messagebox.showerror("Error", "Please enter a valid path")
            return
            
        config_path = os.path.join(os.path.expanduser("~"), ".abbrev_tool_config.json")
        try:
            with open(config_path, 'w') as f:
                json.dump({"path": path}, f)
            self.status_var.set("Path saved successfully")
        except Exception as e:
            self.status_var.set(f"Error saving config: {str(e)}")
            messagebox.showerror("Error", f"Failed to save configuration: {str(e)}")
    
    def extract_abbreviation(self, text):
        """Extract abbreviation and its full form from text"""
        if not text:
            return None
            
        # Pattern to match "Full Name (ABBR)" format
        pattern = r'([^()]+)\s*\(([^()]+)\)'
        match = re.search(pattern, text)
        
        if match:
            full_form = match.group(1).strip()
            abbreviation = match.group(2).strip()
            return {abbreviation: full_form}
        
        return None
        
    def update_abbreviations_file(self, new_abbreviation):
        """Update the abbreviations.js file with new abbreviation"""
        file_path = self.file_path_var.get().strip()
        
        if not file_path:
            self.status_var.set("Error: No file path specified")
            messagebox.showerror("Error", "Please specify the path to abbreviations.js")
            return False
            
        if not os.path.exists(file_path):
            self.status_var.set(f"Error: File not found at {file_path}")
            messagebox.showerror("Error", f"File not found at {file_path}")
            return False
            
        try:
            # Read current content
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Parse the JavaScript object into a Python dictionary
            # This assumes the file contains a JavaScript object assignment like:
            # const abbreviationsData = { ... };
            
            # Extract just the object part
            match = re.search(r'const\s+abbreviationsData\s*=\s*({[\s\S]*?});', content)
            if not match:
                self.status_var.set("Error: Could not parse abbreviations.js format")
                messagebox.showerror("Error", "Could not parse abbreviations.js format")
                return False
                
            js_object_str = match.group(1)
            
            # Convert JS object to valid JSON
            # Replace single quotes with double quotes for JSON compatibility
            json_str = js_object_str.replace("'", '"')
            
            # Handle trailing commas which are valid in JS but not in JSON
            json_str = re.sub(r',\s*}', '}', json_str)
            
            # Try to parse as JSON
            try:
                abbrevs = json.loads(json_str)
            except json.JSONDecodeError:
                self.status_var.set("Error: Failed to parse abbreviations format")
                messagebox.showerror("Error", "Failed to parse the abbreviations.js file format")
                return False
                
            # Update with new abbreviation
            abbrev_key = list(new_abbreviation.keys())[0]
            abbrev_value = new_abbreviation[abbrev_key]
            
            # Check if abbreviation already exists
            if abbrev_key in abbrevs:
                if abbrevs[abbrev_key] == abbrev_value:
                    self.status_var.set(f"Abbreviation '{abbrev_key}' already exists with the same definition")
                    return True
                else:
                    result = messagebox.askyesno("Abbreviation exists", 
                                               f"Abbreviation '{abbrev_key}' already exists with definition:\n\n" +
                                               f"'{abbrevs[abbrev_key]}'\n\n" +
                                               f"Do you want to replace it with:\n\n" +
                                               f"'{abbrev_value}'?")
                    if not result:
                        self.status_var.set("Update cancelled")
                        return False
            
            # Update dictionary
            abbrevs[abbrev_key] = abbrev_value
            
            # Convert back to JavaScript format
            js_entries = []
            for k, v in sorted(abbrevs.items()):
                if isinstance(v, list):
                    # Handle array values
                    value_items = [f'"{item}"' for item in v]
                    js_entries.append(f'  "{k}": [\n        {",\n        ".join(value_items)}\n    ]')
                else:
                    # Handle string values
                    js_entries.append(f'  "{k}": "{v}"')
            
            new_js_object = "{\n" + ",\n".join(js_entries) + "\n}"
            
            # Replace the object in the original content
            new_content = re.sub(r'const\s+abbreviationsData\s*=\s*{[\s\S]*?};', f'const abbreviationsData = {new_js_object};', content, count=1)
            
            # Write back to file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
            self.status_var.set(f"Added abbreviation '{abbrev_key}' successfully")
            return True
                
        except Exception as e:
            self.status_var.set(f"Error updating file: {str(e)}")
            messagebox.showerror("Error", f"Failed to update abbreviations.js: {str(e)}")
            return False
    
    def clear_text(self):
        """Clear the input and output text areas"""
        self.text_input.delete(1.0, "end")
        self.text_output.delete(1.0, "end")
        self.status_var.set("Ready")
        
    def extract_from_clipboard(self):
        """Extract text from clipboard and display in input area"""
        try:
            clipboard_text = pyperclip.paste()
            self.text_input.delete(1.0, "end")
            self.text_input.insert("end", clipboard_text)
            self.process_input()
        except Exception as e:
            self.status_var.set(f"Error reading clipboard: {str(e)}")
    
    def process_input(self):
        """Process the input text and display extracted abbreviation"""
        input_text = self.text_input.get(1.0, "end").strip()
        
        if not input_text:
            self.status_var.set("No input text provided")
            return
            
        abbreviation = self.extract_abbreviation(input_text)
        
        if not abbreviation:
            self.status_var.set("No abbreviation found in the format 'Full Name (ABBR)'")
            self.text_output.delete(1.0, "end")
            return
            
        # Display in output area
        self.text_output.delete(1.0, "end")
        abbr_key = list(abbreviation.keys())[0]
        abbr_value = abbreviation[abbr_key]
        
        formatted_output = f'"{abbr_key}": "{abbr_value}"'
        self.text_output.insert("end", formatted_output)
        
        self.status_var.set(f"Found: {abbr_key} = {abbr_value}")
    
    def extract_and_add(self):
        """Extract abbreviation and add to the abbreviations.js file"""
        input_text = self.text_input.get(1.0, "end").strip()
        
        if not input_text:
            self.status_var.set("No input text provided")
            return
            
        abbreviation = self.extract_abbreviation(input_text)
        
        if not abbreviation:
            self.status_var.set("No abbreviation found in the format 'Full Name (ABBR)'")
            return
            
        # Update the abbreviations.js file
        if self.update_abbreviations_file(abbreviation):
            abbr_key = list(abbreviation.keys())[0]
            pyperclip.copy(f'"{abbr_key}": "{abbreviation[abbr_key]}"')
            self.status_var.set(f"Added abbreviation '{abbr_key}' and copied to clipboard")
    
    def hotkey_handler(self):
        """Handle global hotkey press (Ctrl+Shift+A)"""
        try:
            # Get text from clipboard
            clipboard_text = pyperclip.paste()
            
            # Try to extract abbreviation
            abbreviation = self.extract_abbreviation(clipboard_text)
            
            if abbreviation:
                # Update abbreviations file
                if self.update_abbreviations_file(abbreviation):
                    abbr_key = list(abbreviation.keys())[0]
                    # Copy the formatted abbreviation back to clipboard
                    pyperclip.copy(f'"{abbr_key}": "{abbreviation[abbr_key]}"')
                    
                    # Bring window to front to show status
                    self.root.deiconify()
                    self.root.lift()
                    self.root.focus_force()
                    
                    # Update GUI
                    self.text_input.delete(1.0, "end")
                    self.text_input.insert("end", clipboard_text)
                    self.text_output.delete(1.0, "end")
                    self.text_output.insert("end", f'"{abbr_key}": "{abbreviation[abbr_key]}"')
            else:
                self.status_var.set("No abbreviation found in clipboard")
                
        except Exception as e:
            self.status_var.set(f"Hotkey error: {str(e)}")

def main():
    root = Tk()
    app = AbbreviationTool(root)
    root.mainloop()

if __name__ == "__main__":
    main()