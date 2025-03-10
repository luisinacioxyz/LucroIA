import requests

# Upload the test file
url = "http://127.0.0.1:8000/upload-csv/"
files = {"file": open("test_data/test1.csv", "rb")}

print("Uploading test1.csv...")
response = requests.post(url, files=files)
print("Upload Status Code:", response.status_code)
print("Upload Response:", response.json())

# Check the history
history_url = "http://127.0.0.1:8000/history/"
print("\nChecking history...")
history_response = requests.get(history_url)
print("History Status Code:", history_response.status_code)
print("History Data:", history_response.json()) 