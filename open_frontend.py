import os
import webbrowser
import pathlib

# Get the absolute path to the frontend/index.html file
frontend_path = pathlib.Path(os.path.abspath("frontend/index.html"))
frontend_url = f"file:///{frontend_path}"

# Open the frontend in the default browser
print(f"Opening frontend at: {frontend_url}")
webbrowser.open(frontend_url) 