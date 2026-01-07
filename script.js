let jsonData = [];
let selectedUniversities = [];

async function loadData() {
    try {
        const response = await fetch('data/gpa_data_final.json');
        jsonData = await response.json();
        populateUniversityDropdown();
        renderTable();
    } catch (error) {
        console.error("데이터를 불러오는 데 실패했습니다:", error);
    }
}

function populateUniversityDropdown() {
    const dropdown = document.getElementById("universitySelect");
    dropdown.innerHTML = '<option value="">대학 선택</option>';

    const headers = Object.keys(jsonData[0]).filter(h => h !== "70%컷");
    headers.forEach(header => {
        const option = document.createElement("option");
        option.value = header;
        option.textContent = header;
        dropdown.appendChild(option);
    });

    dropdown.addEventListener("change", (e) => {
        const value = e.target.value;
        if (value && !selectedUniversities.includes(value)) {
            selectedUniversities.push(value);
            renderTable();
        }
    });

    document.getElementById("searchInput").addEventListener("input", renderTable);
}

function renderTable() {
    const tableContainer = document.getElementById('table-container');
    const searchKeyword = document.getElementById("searchInput").value.trim();

    if (selectedUniversities.length === 0) {
        tableContainer.innerHTML = '<div class="text-gray-500 text-center mt-4">대학을 선택해주세요.</div>';
        return;
    }

    let tableHTML = '<table class="min-w-full border border-gray-300 shadow-md">';
    tableHTML += '<thead><tr>';
    tableHTML += '<th class="bg-yellow text-center border p-2">70%컷</th>';
    selectedUniversities.forEach((uni, index) => {
        tableHTML += `<th class="bg-color-${index} text-center border p-2">${uni}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';

    jsonData.forEach(row => {
        tableHTML += '<tr>';
        tableHTML += `<td class="border p-2 text-center bg-yellow text-bold">${row["70%컷"] || ''}</td>`;
        selectedUniversities.forEach((uni, index) => {
            const value = row[uni] || '';
            const highlight = searchKeyword && value.includes(searchKeyword) ? 'highlight' : '';
            tableHTML += `<td class="border p-2 ${highlight}">${value}</td>`;
        });
        tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

function resetSelection() {
    selectedUniversities = [];
    document.getElementById("universitySelect").value = "";
    document.getElementById("searchInput").value = "";
    renderTable();
}

document.getElementById("reset").addEventListener("click", resetSelection);

document.getElementById("scrollTopBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("DOMContentLoaded", loadData);
