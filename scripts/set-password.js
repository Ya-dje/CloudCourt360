const poolData = {
    UserPoolId: "us-east-1_2eKzDLmOD",
    ClientId: "3n3i67rdufiaumjokuc7812ll7"
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

document.getElementById("setPasswordForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    const username = localStorage.getItem("cognitoUsername");
    const session = localStorage.getItem("cognitoSession");

    if (!username || !session) {
        alert("Session expired. Please login again.");
        window.location.href = "index.html";
        return;
    }

    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.Session = session;

    cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
        onSuccess: function (result) {
            // Cleanup
            localStorage.removeItem("cognitoSession");
            localStorage.removeItem("cognitoUsername");

            alert("Password updated successfully!");

            // 🔁 REDIRECT AFTER SUCCESS
            window.location.href = "index.html";
        },

        onFailure: function (err) {
            alert(err.message || JSON.stringify(err));
        }
    });
});
