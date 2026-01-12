// =====================
// COGNITO CONFIG
// =====================
const poolData = {
    UserPoolId: "us-east-1_2eKzDLmOD",   
    ClientId: "3n3i67rdufiaumjokuc7812ll7"    
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// =====================
// LOGIN FUNCTION
// =====================
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please enter username and password");
        return;
    }

    const authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password
    });

    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authDetails, {

        // FIRST LOGIN — PASSWORD CHANGE
        newPasswordRequired: function () {
            const newPassword = prompt("Enter a new password:");
            cognitoUser.completeNewPasswordChallenge(newPassword, {}, this);
        },

        // SUCCESS
        onSuccess: function (result) {
            const payload = result.getIdToken().payload;
            console.log("Login success:", payload);

            const groups = payload["cognito:groups"];
            if (!groups) {
                alert("No role assigned to this user");
                return;
            }

            redirectByRole(groups[0]);
        },

        // FAILURE
        onFailure: function (err) {
            alert("Login failed: " + err.message);
        }
    });
}
function redirectByRole(role) {
    switch (role) {
        case "Judges":
            window.location.href = "judge.html";
            break;
        case "Lawyers":
            window.location.href = "lawyer.html";
            break;
        case "PrisonOfficials":
            window.location.href = "prison.html";
            break;
        case "Admins":
            window.location.href = "admin.html";
            break;
        default:
            alert("Unauthorized role");
    }
}
