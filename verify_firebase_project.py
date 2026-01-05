giimport firebase_admin
from firebase_admin import credentials
import json

try:
    cred = credentials.Certificate("serviceAccountKey.json")
    print(f"Project ID from Credential: {cred.project_id}")
    
    with open("serviceAccountKey.json", "r") as f:
        data = json.load(f)
        print(f"Project ID from JSON: {data.get('project_id')}")
        
except Exception as e:
    print(f"Error: {e}")
