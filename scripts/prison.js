// ================= AUTH / LOGOUT =================
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// ================= SIDEBAR NAV =================
function showSection(sectionId, el) {
    document.querySelectorAll(".content-section").forEach(s => s.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");

    document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
    el.classList.add("active");
}
const API_ENDPOINT = "https://rvvzhqh500.execute-api.us-east-1.amazonaws.com/prod/official";

async function runOfficialSearch() {
    const query = document.getElementById('inmateSearch').value.trim();
    const output = document.getElementById('resultOutput');

    if (!query) return;

    // Visual feedback that the system is "thinking"
    output.innerHTML = `<div class="glass-card" style="text-align:center">Verifying Registry Credentials...</div>`;

    try {
        const response = await fetch(`${API_ENDPOINT}?case_id=${query}`);

        if (!response.ok) {
            throw new Error("Inmate record not identified in the national database.");
        }

        const data = await response.json();

        // Dynamic result card with Official branding
        output.innerHTML = `
            <div class="result-item anim-fade-in">
                <div style="padding: 20px; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                    <strong>REGISTRY ID: ${data.case_id}</strong>
                    <span style="background:#dcfce7; color: #166534; padding: 5px 12px; border-radius: 20px; font-weight: 800; font-size: 0.75rem;">
                        ● ACTIVE CUSTODY
                    </span>
                </div>
                <div style="padding: 30px;">
                    <h2 style="margin-bottom: 20px;">${data.name}</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div>
                            <span style="color: #94a3b8; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Registry Date</span>
                            <p style="font-weight: 600;">${data.court_date}</p>
                        </div>
                        <div>
                            <span style="color: #94a3b8; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Facility Status</span>
                            <p style="font-weight: 600;">Verified Inmate</p>
                        </div>
                        <div style="grid-column: span 2">
                            <span style="color: #94a3b8; font-size: 0.8rem; text-transform: uppercase; font-weight: 700;">Custody Summary</span>
                            <p style="line-height: 1.6;">${data.desc}</p>
                        </div>
                    </div>

                    <button class="btn-primary" style="width:100%; height:55px; border-radius:12px; font-weight:700; background: #0f172a;" 
                            onclick="window.open('${data.file_url}', '_blank')">
                        Download Official Warrant / PDF
                    </button>
                </div>
            </div>`;

    } catch (err) {
        output.innerHTML = `
            <div class="glass-card" style="color: #ef4444; border-left: 5px solid #ef4444;">
                <strong>Security Alert:</strong> ${err.message}
            </div>`;
    }
}