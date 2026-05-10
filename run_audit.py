import subprocess
import sys
import os

os.chdir(r"C:\Users\e_ibe\OneDrive\Documents\WEH\CLAUDE CODE\Claude site test")

print("=" * 60)
print("MELVILLE CEILINGS SPACING AUDIT - FULL")
print("=" * 60)
print(f"\nStarting audit of 36 pages...")
print("Expected time: 15-20 minutes\n")

try:
    result = subprocess.run(
        [r"C:\nodejs\node.exe", "spacing-audit.mjs"],
        capture_output=False,
        text=True,
        timeout=1800
    )
    sys.exit(result.returncode)
except subprocess.TimeoutExpired:
    print("\n⚠ Audit timeout after 30 minutes")
    sys.exit(1)
except Exception as e:
    print(f"\n✗ Error: {e}")
    sys.exit(1)
