
import subprocess
import sys

with open("test_output_db.txt", "w") as f:
    subprocess.run([sys.executable, "tests/verify_real_db.py"], stdout=f, stderr=subprocess.STDOUT)
