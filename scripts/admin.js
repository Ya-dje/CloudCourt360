// =======================
// GLOBAL USER STORAGE (UI STATE ONLY)
// =======================
let users = [];

// =======================
// SECTION NAVIGATION
// =======================
function showSection(sectionId, element) {
    document.querySelectorAll('.content-section').forEach(section =>
        section.classList.remove('active')
    );

    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.sidebar li').forEach(item =>
        item.classList.remove('active')
    );

    element.classList.add('active');
}

// =======================
// LOGOUT
// =======================
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        window.location.href = "index.html";
    }
}

// =======================
// CREATE USER (BACKEND + COGNITO)
// =======================
function createUser(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;

    fetch("http://44.200.31.244:5000/admin/create-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("idToken")
        },
        body: JSON.stringify({
            username,
            email,
            role
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.message) {

                users.push({
                    id: Date.now(),
                    fullName,
                    username,
                    email,
                    role,
                    status: "Pending Activation"
                });

                renderUsers();
                updateDashboardStats();

                alert(
                    "User created successfully.\n\n" +
                    "A password setup email has been sent to:\n" + email
                );

                event.target.reset();

            } else {
                alert(data.error || "User creation failed");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Failed to connect to backend.");
        });
}

// =======================
// RENDER USERS TABLE
// =======================
function renderUsers() {
    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";

    users.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.fullName}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${formatRole(user.role)}</td>
            <td>${user.status}</td>
            <td class="action-cell">
                <button class="icon-btn edit-btn">Edit</button>
<button class="icon-btn delete-btn">Remove</button>

            </td>
        `;

        tbody.appendChild(row);
    });
}

// =======================
// EDIT USER (UI ONLY)
// =======================
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newRole = prompt(
        "Edit role (Judges, Lawyer, PrisonOfficials, Admins):",
        user.role
    );

    if (newRole) {
        user.role = newRole;
        renderUsers();
        updateDashboardStats();
    }
}

// =======================
// REMOVE USER (UI ONLY)
// =======================
function removeUser(userId) {
    if (confirm("Remove this user from UI list?")) {
        users = users.filter(u => u.id !== userId);
        renderUsers();
        updateDashboardStats();
    }
}

// =======================
// DASHBOARD STATISTICS
// =======================
function updateDashboardStats() {
    document.getElementById("totalUsers").textContent = users.length;
    document.getElementById("judgesCount").textContent =
        users.filter(u => u.role === "Judges").length;
    document.getElementById("lawyersCount").textContent =
        users.filter(u => u.role === "Lawyer").length;
    document.getElementById("prisonCount").textContent =
        users.filter(u => u.role === "PrisonOfficials").length;
}

// =======================
// FORMAT ROLE
// =======================
function formatRole(role) {
    switch (role) {
        case "Judges": return "Judge";
        case "Lawyer": return "Lawyer";
        case "PrisonOfficials": return "Prison Official";
        case "Admins": return "Admin";
        default: return role;
    }
}
