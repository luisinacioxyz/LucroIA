import requests

url = "http://127.0.0.1:8000/upload-csv/"
files = {"file": open("test.csv", "rb")}

response = requests.post(url, files=files)
print("Status Code:", response.status_code)
print("Response JSON:", response.json()) 