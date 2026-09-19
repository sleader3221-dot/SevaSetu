import json
import os
import shutil
import subprocess
import time
import urllib.request

APP_ID = "d29f8mjvik7gji"
BRANCH_NAME = "main"
S3_BUCKET = "sevasetu-frontend-991752"
OUT_DIR = os.path.join(os.getcwd(), "frontend", "out")
ZIP_BASE = os.path.join(os.getcwd(), "frontend", "build")
ZIP_FILE = f"{ZIP_BASE}.zip"

def run_cmd(cmd):
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Command failed: {cmd}\nStderr: {res.stderr}")
        raise RuntimeError(res.stderr)
    return res.stdout.strip()

def deploy():
    print("[1/5] Creating zip archive of frontend/out...")
    if os.path.exists(ZIP_FILE):
        os.remove(ZIP_FILE)
    shutil.make_archive(ZIP_BASE, 'zip', OUT_DIR)
    zip_size = os.path.getsize(ZIP_FILE)
    print(f"Created {ZIP_FILE} ({zip_size / 1024 / 1024:.2f} MB)")

    print("[2/5] Syncing to S3 mirror...")
    s3_out = run_cmd(f"aws s3 sync \"{OUT_DIR}\" s3://{S3_BUCKET}/ --delete")
    print("S3 sync completed.")

    print("[3/5] Creating AWS Amplify deployment...")
    create_res_json = run_cmd(f"aws amplify create-deployment --app-id {APP_ID} --branch-name {BRANCH_NAME} --output json")
    create_data = json.loads(create_res_json)
    job_id = create_data["jobId"]
    upload_url = create_data["zipUploadUrl"]
    print(f"Amplify Job ID: {job_id}")

    print("[4/5] Uploading build.zip to Amplify S3...")
    with open(ZIP_FILE, "rb") as f:
        data = f.read()
    req = urllib.request.Request(upload_url, data=data, method="PUT")
    req.add_header("Content-Type", "application/zip")
    with urllib.request.urlopen(req) as resp:
        print(f"Upload response status: {resp.status}")

    print("[5/5] Starting Amplify deployment...")
    start_res = run_cmd(f"aws amplify start-deployment --app-id {APP_ID} --branch-name {BRANCH_NAME} --job-id {job_id}")
    print(f"Deployment started. Monitoring job {job_id}...")

    for attempt in range(30):
        time.sleep(6)
        status_res = run_cmd(f"aws amplify get-job --app-id {APP_ID} --branch-name {BRANCH_NAME} --job-id {job_id} --output json")
        job_data = json.loads(status_res)
        status = job_data["job"]["summary"]["status"]
        print(f"  Attempt {attempt+1}: Status = {status}")
        if status == "SUCCEED":
            print(f"\n[SUCCESS] Amplify Deployment {job_id} SUCCEED!")
            break
        elif status in ["FAILED", "CANCELLED"]:
            raise RuntimeError(f"Amplify deployment failed with status {status}")
    else:
        print("Timeout waiting for Amplify deployment")

if __name__ == "__main__":
    deploy()
