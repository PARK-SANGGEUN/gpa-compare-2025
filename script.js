from pathlib import Path

# 경로 지정
script_js_code = """
let jsonData = [];
let selectedUniversities = [];

async function loadData() {
    try {
        const response = await fetch('./data/gpa_data_final_web_ready.json');
        jsonData = await response.json();
        populateUniversityDropdown();
        renderTable(); // 최초 전체 테이블
    } catch (error) {
        console.error("데이터를 불러오는 데 실패했습니다:", error);
    }
}

function populateUniversityDropdown() {
    const dropdowns = document.querySelectorAll('.university-select');
    if (!jsonData.length) return;

    const headers = Object.keys(jsonData[0]).filter(h => h !== "70%컷");

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
    const table = document.getElementById('comparisonTable');
    if (!table) return;

    if (selectedUniversities.length === 0) {
        // 전체 테이블 표시
        const headers = Object.keys(jsonData[0]);
        table.innerHTML = '<thead><tr>' +
            headers.map(h => `<th class="bg-blue-100 text-sm p-2">${h}</th>`).join('') +
            '</tr></thead><tbody>' +
            jsonData.map(row => {
                return '<tr class="hover:bg-gray-50">' +
                    headers.map(h => `<td class="border text-xs p-2 whitespace-pre-line">${row[h] || ''}</td>`).join('') +
                    '</tr>';
            }).join('') + '</tbody>';
        return;
    }

    // 선택된 대학 필터 테이블
    table.innerHTML = '<thead><tr>' +
        ['70%컷', ...selectedUniversities].map(h => `<th class="bg-blue-100 text-sm p-2">${h}</th>`).join('') +
        '</tr></thead><tbody>' +
        jsonData.map(row => {
            return '<tr class="hover:bg-gray-50">' +
                ['70%컷', ...selectedUniversities].map(h => `<td class="border text-xs p-2 whitespace-pre-line">${row[h] || ''}</td>`).join('') +
                '</tr>';
        }).join('') + '</tbody>';
}

function resetSelection() {
    selectedUniversities = [];
    const dropdowns = document.querySelectorAll('.university-select');
    dropdowns.forEach(dropdown => dropdown.value = "");
    renderTable();
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    document.getElementById('resetBtn').addEventListener('click', resetSelection);
});
"""

# 저장
script_path = Path("/mnt/data/script.js")
script_path.write_text(script_js_code, encoding='utf-8')

script_path.name  # 파일명 반환
