# 생성할 script.js 코드를 준비합니다. 이 스크립트는 다음을 처리합니다:
# - JSON 데이터 로드
# - 대학 선택 드롭다운 구현
# - 선택한 대학 누적 저장 및 테이블 필터링
# - 초기화 기능

script_js_code = """
let jsonData = [];
let selectedUniversities = [];

async function loadData() {
    try {
        const response = await fetch('./data/gpa_data_final_cleaned_ready.json');
        jsonData = await response.json();
        populateUniversityDropdown();
        renderTable();
    } catch (error) {
        console.error("데이터를 불러오는 데 실패했습니다:", error);
    }
}

function populateUniversityDropdown() {
    const dropdowns = document.querySelectorAll('.university-select');
    const headers = Object.keys(jsonData[0]).filter(h => h !== "70%컷" && h !== "Unnamed: 0");

    dropdowns.forEach(dropdown => {
        dropdown.innerHTML = '<option value="">대학 선택</option>';
        headers.forEach(header => {
            const option = document.createElement('option');
            option.value = header;
            option.textContent = header;
            dropdown.appendChild(option);
        });

        dropdown.addEventListener('change', (e) => {
            const value = e.target.value;
            if (value && !selectedUniversities.includes(value)) {
                selectedUniversities.push(value);
                renderTable();
            }
        });
    });
}

function renderTable() {
    const tableContainer = document.getElementById('table-container');
    if (!tableContainer) return;

    if (selectedUniversities.length === 0) {
        tableContainer.innerHTML = '<div class="text-gray-500 text-center mt-4">대학을 선택해주세요.</div>';
        return;
    }

    let tableHTML = '<table class="min-w-full border border-gray-300 shadow-md"><thead><tr>';
    tableHTML += '<th class="bg-blue-100 text-center border p-2 text-sm font-semibold">70%컷</th>';
    selectedUniversities.forEach(uni => {
        tableHTML += `<th class="bg-blue-100 text-center border p-2 text-sm font-semibold">${uni}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';

    jsonData.forEach(row => {
        tableHTML += '<tr class="hover:bg-gray-50">';
        tableHTML += `<td class="border p-2 text-center text-xs text-blue-800">${row["70%컷"] || ''}</td>`;
        selectedUniversities.forEach(uni => {
            tableHTML += `<td class="border p-2 text-sm whitespace-pre-line">${row[uni] || ''}</td>`;
        });
        tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

function resetSelection() {
    selectedUniversities = [];
    const dropdowns = document.querySelectorAll('.university-select');
    dropdowns.forEach(dropdown => dropdown.value = "");
    renderTable();
}

document.addEventListener('DOMContentLoaded', loadData);
"""

# 저장
script_path = "/mnt/data/script.js"
with open(script_path, "w", encoding="utf-8") as f:
    f.write(script_js_code)

script_path
