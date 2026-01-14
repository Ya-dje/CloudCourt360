// ===== AWS COGNITO CONFIG =====
const poolData = {
    UserPoolId: "us-east-1_2eKzDLmOD",
    ClientId: "3n3i67rdufiaumjokuc7812ll7"
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// ===== LOGIN HANDLER =====
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    const authenticationDetails =
        new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password
        });

    const cognitoUser =
        new AmazonCognitoIdentity.CognitoUser({
            Username: username,
            Pool: userPool
        });

    cognitoUser.authenticateUser(authenticationDetails, {

        // ===== SUCCESS =====
        onSuccess: function (result) {
            const idToken = result.getIdToken().getJwtToken();
            const payload = result.getIdToken().payload;
            const groups = payload["cognito:groups"] || [];

            console.log("ID TOKEN GROUPS:", groups);

            localStorage.setItem("idToken", idToken);

            if (groups.includes("Admin")) {
                window.location.href = "admin.html";
            } else if (groups.includes("Judges")) {
                window.location.href = "judge.html";
            } else if (groups.includes("Lawyers")) {
                window.location.href = "lawyer.html";
            } else if (groups.includes("PrisonOfficials")) {
                window.location.href = "prison.html";
            } else {
                alert("No role assigned. Contact administrator.");
            }
        },

        // ===== NEW PASSWORD REQUIRED =====
        newPasswordRequired: function (userAttributes, requiredAttributes) {
            // Save session & username
            localStorage.setItem("cognitoSession", cognitoUser.Session);
            localStorage.setItem("cognitoUsername", username);

            // Redirect to password page
            window.location.href = "set-password.html";
        },

        // ===== FAILURE =====
        onFailure: function (err) {
            alert(err.message || JSON.stringify(err));
        }
    });
});
