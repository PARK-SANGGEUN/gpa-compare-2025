let jsonData = [];
let selectedUniversities = ["경희대", "고려대", "서강대"];

async function loadData() {
    try {
        const response = await fetch('./data/gpa_data_final.json');
        jsonData = await response.json();
        populateUniversityDropdown();
        renderTable();
    } catch (error) {
        console.error("데이터를 불러오는 데 실패했습니다:", error);
    }
}

function populateUniversityDropdown() {
    const dropdown = document.getElementById('universitySelect');
    const headers = Object.keys(jsonData[0]).filter(h => h !== "70%컷");

    dropdown.innerHTML = '<option value="">대학 선택</option>';
    headers.forEach(header => {
        if (!selectedUniversities.includes(header)) {
            const option = document.createElement('option');
            option.value = header;
            option.textContent = header;
            dropdown.appendChild(option);
        }
    });

    dropdown.addEventListener('change', () => {
        const value = dropdown.value;
        if (value && !selectedUniversities.includes(value)) {
            selectedUniversities.push(value);
            renderTable();
        }
    });

    document.getElementById("searchInput").addEventListener("input", renderTable);
}

function renderTable() {
    const tableContainer = document.getElementById('tableContainer');
    const searchKeyword = document.getElementById("searchInput").value.trim();
    if (selectedUniversities.length === 0) {
        tableContainer.innerHTML = '<div class="text-gray-500 text-center mt-4">대학을 선택해주세요.</div>';
        return;
    }

    let tableHTML = '<div class="table-scroll"><table><thead><tr>';
    tableHTML += '<th class="sticky-col left bg-yellow">70%컷</th>';
    selectedUniversities.forEach((uni, index) => {
        tableHTML += `<th class="bg-selected-${index % 6} sticky-header">${uni} <button onclick="removeUniversity('${uni}')" class="remove-btn">×</button></th>`;
    });
    tableHTML += '</tr></thead><tbody>';

    jsonData.forEach(row => {
        const showRow = selectedUniversities.some(uni => (row[uni] || "").includes(searchKeyword));
        if (searchKeyword && !showRow) return;

        tableHTML += '<tr>';
        tableHTML += `<td class="sticky-col left bg-yellow bold">${row["70%컷"] || ''}</td>`;
        selectedUniversities.forEach((uni, index) => {
            const value = row[uni] || '';
            const highlight = searchKeyword && value.includes(searchKeyword) ? 'highlight' : '';
            tableHTML += `<td class="cell bg-selected-${index % 6} ${highlight}">${value}</td>`;
        });
        tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table></div>';
    tableContainer.innerHTML = tableHTML;
}

function removeUniversity(uni) {
    selectedUniversities = selectedUniversities.filter(item => item !== uni);
    populateUniversityDropdown();
    renderTable();
}

function resetSelection() {
    selectedUniversities = ["경희대", "고려대", "서강대"];
    document.getElementById("searchInput").value = "";
    populateUniversityDropdown();
    renderTable();
}

document.getElementById('reset').addEventListener('click', resetSelection);
document.getElementById("scrollTopBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
document.addEventListener('DOMContentLoaded', loadData);
