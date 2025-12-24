
import subprocess
import sys

try:
    with open("test_output_dep.txt", "w") as f:
        subprocess.run([sys.executable, "tests/verify_auth_dep.py"], stdout=f, stderr=subprocess.STDOUT)
    print("Done")
except Exception as e:
    print(e)
