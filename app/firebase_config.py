import firebase_admin
from firebase_admin import credentials, auth

try:
    cred = credentials.Certificate("serviceAccountKey.json")
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Warning: Firebase initialization failed: {e}")
    # Mock auth for development/testing if key is missing
    # ensuring the app can still start up.
    pass
