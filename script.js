let jsonData = [];
let selectedUniversities = [];

async function loadData() {
    try {
        const response = await fetch('./data/gpa_data_final_web_ready.json');
        jsonData = await response.json();

        populateDropdowns();
        renderTable();  // 초기에는 전체 대학 보여주기
    } catch (error) {
        console.error("데이터 로딩 실패:", error);
    }
}

function populateDropdowns() {
    const dropdowns = [
        document.getElementById('collegeSelect1'),
        document.getElementById('collegeSelect2'),
        document.getElementById('collegeSelect3')
    ];

    // JSON 데이터에서 열 이름 추출 (첫 행 기준)
    const universityNames = Object.keys(jsonData[0]).filter(col => col !== "70%컷");

    dropdowns.forEach(dropdown => {
        dropdown.innerHTML = '<option value="">대학 선택</option>';
        universityNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            dropdown.appendChild(option);
        });

        dropdown.addEventListener('change', () => {
            selectedUniversities = dropdowns.map(d => d.value).filter(v => v);
            renderTable();
        });
    });

    // 초기화 버튼 처리
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', () => {
        selectedUniversities = [];
        dropdowns.forEach(d => d.value = "");
        renderTable();
    });
}

function renderTable() {
    const table = document.getElementById('comparisonTable');
    table.innerHTML = '';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // 첫 번째 열 (70%컷)
    const thBase = document.createElement('th');
    thBase.textContent = '70%컷';
    thBase.className = 'bg-blue-100 border px-2 py-2 text-sm font-semibold text-center';
    headerRow.appendChild(thBase);

    // 선택된 대학이 없으면 전체 대학 표시
    const columns = selectedUniversities.length === 0
        ? Object.keys(jsonData[0]).filter(key => key !== "70%컷")
        : selectedUniversities;

    columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        th.className = 'bg-blue-100 border px-2 py-2 text-sm font-semibold text-center';
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    jsonData.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50 transition';

        const tdBase = document.createElement('td');
        tdBase.textContent = row["70%컷"] || '';
        tdBase.className = 'border px-2 py-1 text-center text-xs text-blue-700';
        tr.appendChild(tdBase);

        columns.forEach(col => {
            const td = document.createElement('td');
            td.textContent = row[col] || '';
            td.className = 'border px-2 py-1 whitespace-pre-line text-sm text-gray-800';
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
}

document.addEventListener('DOMContentLoaded', loadData);
