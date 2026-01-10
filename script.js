// =======================
// GLOBAL USER STORAGE
// =======================
let users = [];

// =======================
// SECTION NAVIGATION
// =======================
function showSection(sectionId, element) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update sidebar active state
    document.querySelectorAll('.sidebar li').forEach(item => {
        item.classList.remove('active');
    });

    element.classList.add('active');
}

// =======================
// LOGOUT
// =======================
function logout() {
    if (confirm("Are you sure you want to logout?")) {
        window.location.href = "index.html"; // Home page
    }
}

// =======================
// CREATE USER
// =======================
function createUser(event) {
    event.preventDefault();

    const user = {
        id: Date.now(),
        fullName: document.getElementById("fullName").value,
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        role: document.getElementById("role").value,
        status: "Pending Activation"
    };

    users.push(user);
    renderUsers();
    updateDashboardStats();

    alert(
        `User account created successfully.\n\n` +
        `An email will be sent to ${user.email} with a secure password setup link.`
    );

    event.target.reset();
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
            <td>${user.role}</td>
            <td>${user.status}</td>
            <td class="action-cell">
    <button class="icon-btn edit-btn" title="Edit User"
        onclick="editUser(${user.id})">
        ✏️
    </button>

    <button class="icon-btn delete-btn" title="Remove User"
        onclick="removeUser(${user.id})">
        🗑️
    </button>
</td>

        `;

        tbody.appendChild(row);
    });
}

// =======================
// EDIT USER
// =======================
function editUser(userId) {
    const user = users.find(u => u.id === userId);

    if (!user) return;

    const newRole = prompt(
        `Edit role for ${user.fullName}:`,
        user.role
    );

    if (newRole) {
        user.role = newRole;
        renderUsers();
        updateDashboardStats();
    }
}

// =======================
// REMOVE USER
// =======================
function removeUser(userId) {
    const user = users.find(u => u.id === userId);

    if (!user) return;

    if (confirm(`Are you sure you want to remove ${user.fullName}?`)) {
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
        users.filter(u => u.role === "Judge").length;
    document.getElementById("lawyersCount").textContent =
        users.filter(u => u.role === "Lawyer").length;
    document.getElementById("prisonCount").textContent =
        users.filter(u => u.role === "Prison Official").length;
}
let cases = [];
let selectedCaseId = null;

// =======================
// NAVIGATION
// =======================
function showSection(id, element) {
    document.querySelectorAll(".content-section").forEach(sec =>
        sec.classList.remove("active")
    );
    document.getElementById(id).classList.add("active");

    document.querySelectorAll(".sidebar li").forEach(li =>
        li.classList.remove("active")
    );
    element.classList.add("active");
}

// =======================
// LOGOUT
// =======================
function logout() {
    if (confirm("Logout from Judge panel?")) {
        window.location.href = "index.html";
    }
}

// =======================
// UPLOAD CASE (REAL DEMO FILE)
// =======================
function uploadCase(event) {
    event.preventDefault();

    const fileInput = document.getElementById("caseFile");
    if (!fileInput.files.length) {
        alert("Please select a file.");
        return;
    }

    const newCase = {
        id: Date.now(),
        caseId: document.getElementById("caseId").value,
        title: document.getElementById("caseTitle").value,
        prisoner: document.getElementById("prisonerName").value,
        courtDate: document.getElementById("courtDate").value,
        file: fileInput.files[0] // REAL FILE OBJECT
    };

    cases.push(newCase);
    renderCases();
    updateStats();

    alert("Case file uploaded successfully.");
    event.target.reset();
}

// =======================
// DISPLAY CASES
// =======================
function renderCases() {
    const tbody = document.querySelector("#casesTable tbody");
    tbody.innerHTML = "";

    cases.forEach(c => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${c.caseId}</td>
            <td>${c.title}</td>
            <td>${c.prisoner}</td>
            <td>${c.courtDate}</td>
            <td>${c.file.name}</td>

            <td class="action-cell">
                <button class="icon-btn view-btn"
                    onclick="viewFile(${c.id})">
                    <i class="fa-solid fa-eye"></i>
                </button>

                <button class="icon-btn download-btn"
                    onclick="downloadFile(${c.id})">
                    <i class="fa-solid fa-download"></i>
                </button>

                <button class="icon-btn edit-btn"
                    onclick="openEditModal(${c.id})">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="icon-btn delete-btn"
                    onclick="openDeleteModal(${c.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// =======================
// VIEW FILE (WORKS)
// =======================
function viewFile(caseId) {
    const c = cases.find(cs => cs.id === caseId);
    if (!c) return;

    const fileURL = URL.createObjectURL(c.file);
    window.open(fileURL, "_blank");
}

// =======================
// DOWNLOAD FILE (WORKS)
// =======================
function downloadFile(caseId) {
    const c = cases.find(cs => cs.id === caseId);
    if (!c) return;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(c.file);
    link.download = c.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// =======================
// EDIT CASE
// =======================
function openEditModal(id) {
    selectedCaseId = id;
    document.getElementById("editCourtDate").value = "";
    document.getElementById("editModal").style.display = "flex";
}

function saveEdit() {
    const c = cases.find(cs => cs.id === selectedCaseId);
    const newDate = document.getElementById("editCourtDate").value;

    if (!c || !newDate) {
        alert("Please select a valid date.");
        return;
    }

    c.courtDate = newDate;
    renderCases();
    closeModal();
}

// =======================
// DELETE CASE
// =======================
function openDeleteModal(id) {
    selectedCaseId = id;
    document.getElementById("deleteModal").style.display = "flex";
}

function confirmDelete() {
    cases = cases.filter(cs => cs.id !== selectedCaseId);
    renderCases();
    updateStats();
    closeModal();
}

// =======================
// CLOSE MODALS
// =======================
function closeModal() {
    document.getElementById("editModal").style.display = "none";
    document.getElementById("deleteModal").style.display = "none";
}

// =======================
// STATS
// =======================
function updateStats() {
    document.getElementById("totalCases").textContent = cases.length;
    document.getElementById("activeCases").textContent = cases.length;
}
