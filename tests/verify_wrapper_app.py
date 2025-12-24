
import subprocess
import sys
import os

try:
    # Run verify_app.py which is in app/ folder
    # We run it as a module or script?
    # Since it does 'from app.main', it needs root in path.
    # We can run it by passing the file path.
    # The script adds os.getcwd() to path.
    # So we should run it from ROOT.
    
    with open("test_output_app.txt", "w") as f:
        subprocess.run([sys.executable, "app/verify_app.py"], stdout=f, stderr=subprocess.STDOUT)
    print("Done")
except Exception as e:
    print(e)
