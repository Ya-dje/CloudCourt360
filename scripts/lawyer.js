// ================= AUTH =================
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// ================= UI SECTION SWITCH =================
function showSection(sectionId, element) {
    document.querySelectorAll(".content-section").forEach(sec =>
        sec.classList.remove("active")
    );
    document.getElementById(sectionId).classList.add("active");

    document.querySelectorAll(".sidebar li").forEach(li =>
        li.classList.remove("active")
    );
    element.classList.add("active");
}
const API_ENDPOINT = "https://rvvzhqh500.execute-api.us-east-1.amazonaws.com/prod";

async function runSearch() {
    const query = document.getElementById('caseSearch').value.trim();
    const output = document.getElementById('resultOutput');

    if (!query) return;
    output.innerHTML = `<div class="glass-card" style="text-align:center">Processing Request...</div>`;

    try {
        const response = await fetch(`${API_ENDPOINT}?case_id=${query}`);
        if (!response.ok) throw new Error("Record not located in secure cloud storage.");
        const data = await response.json();

        output.innerHTML = `
            <div class="result-item anim-fade-in">
                <div style="padding: 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display:flex; justify-content:space-between">
                    <strong>CASE REFERENCE: ${data.case_id}</strong>
                    <span style="color: #10b981; font-weight: bold;">● ENCRYPTED ACCESS</span>
                </div>
                <div style="padding: 30px;">
                    <h2 style="margin-bottom: 20px;">${data.name}</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div><strong>Title:</strong> ${data.title}</div>
                        <div><strong>Court Date:</strong> ${data.court_date}</div>
                        <div style="grid-column: span 2"><strong>Summary:</strong> ${data.desc}</div>
                    </div>
                    <button class="btn-primary" style="width:100%; height:55px; border-radius:12px; font-weight:700;" 
                            onclick="window.open('${data.file_url}', '_blank')">
                        Download Case File
                    </button>
                </div>
            </div>`;
    } catch (error) {
        output.innerHTML = `<div class="glass-card" style="text-align:center; color: red;">${error.message}</div>`;
    }
}
