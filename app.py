from jose import jwt
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3

app = Flask(__name__)
CORS(app)

# ===== CONFIG =====
COGNITO_REGION = "us-east-1"
USER_POOL_ID = "us-east-1_2eKzDLmOD"
APP_CLIENT_ID = "3n3i67rdufiaumjokuc7812ll7"

COGNITO_ISSUER = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}"
JWKS_URL = f"{COGNITO_ISSUER}/.well-known/jwks.json"

jwks = requests.get(JWKS_URL).json()

# ===== COGNITO CLIENT =====
cognito = boto3.client(
    "cognito-idp",
    region_name=COGNITO_REGION,
 
)

# ===== TOKEN VERIFICATION =====
def verify_token(auth_header):
    if not auth_header:
        return None

    token = auth_header.replace("Bearer ", "")

    try:
        payload = jwt.decode(
            token,
            jwks,
            audience=APP_CLIENT_ID,
            issuer=COGNITO_ISSUER,
            algorithms=["RS256"]
        )
        return payload
    except Exception:
        return None

# ===== HEALTH CHECK =====
@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "CloudCourt backend running"}), 200

# ===== CREATE USER (SITE ADMIN) =====
@app.route("/admin/create-user", methods=["POST"])
def create_user():
    auth_header = request.headers.get("Authorization")
    payload = verify_token(auth_header)

    if not payload:
        return jsonify({"error": "Unauthorized"}), 401

    if "Admin" not in payload.get("cognito:groups", []):
        return jsonify({"error": "Forbidden"}), 403

    data = request.json
    username = data.get("username")
    email = data.get("email")
    role = data.get("role")

    if not username or not email or not role:
        return jsonify({"error": "Missing fields"}), 400

    try:
        # 1️⃣ Create user in Cognito (EMAIL SENT AUTOMATICALLY)
        cognito.admin_create_user(
            UserPoolId=USER_POOL_ID,
            Username=username,
            UserAttributes=[
                {"Name": "email", "Value": email},
                {"Name": "email_verified", "Value": "true"}
            ],
            DesiredDeliveryMediums=["EMAIL"]
        )

        # 2️⃣ Assign role (Cognito Group)
        cognito.admin_add_user_to_group(
            UserPoolId=USER_POOL_ID,
            Username=username,
            GroupName=role
        )

        return jsonify({
            "message": "User created successfully. Email sent by Cognito."
        }), 200

    except cognito.exceptions.UsernameExistsException:
        return jsonify({"error": "User already exists"}), 409

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
