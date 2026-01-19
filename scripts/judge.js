const API_ENDPOINT = https:"//rvvzhqh500.execute-api.us-east-1.amazonaws.com/prod"

// =======================
// UPLOAD CASE (REAL DEMO FILE)
// =======================
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
// UPLOAD CASE
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
function logout() {
    if (confirm("Logout from Judge panel?")) {
        window.location.href = "index.html";
    }
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
