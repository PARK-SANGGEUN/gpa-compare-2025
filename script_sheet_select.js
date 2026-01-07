let jsonData = [];
let selectedUniversities = [];
let currentSheet = "경고서서성연중한";  // 기본 시트명

// 시트명과 JSON 파일 경로 매핑
const sheetFileMap = {
    "경고서서성연중한": "./data/gpa_data_경고서서성연중한_web.json",
    "건국단서세숭이홍": "./data/gpa_data_건국단서세숭이홍_web.json",
    "가가광명상아인인": "./data/gpa_data_가가광명상아인인_web.json",
};

// JSON 로드
async function loadData(sheetName) {
    const url = sheetFileMap[sheetName];
    try {
        const response = await fetch(url);
        jsonData = await response.json();
        populateUniversityDropdown();
        renderTable();
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }
}

// 대학 선택 드롭다운 채우기
function populateUniversityDropdown() {
    const dropdowns = document.querySelectorAll(".university-select");

    if (!jsonData || jsonData.length === 0) return;

    const headers = Object.keys(jsonData[0]).filter(h => h !== "70%컷");

    dropdowns.forEach(dropdown => {
        dropdown.innerHTML = '<option value="">대학 선택</option>';

        headers.forEach(header => {
            const option = document.createElement("option");
            option.value = header;
            option.textContent = header;
            dropdown.appendChild(option);
        });

        // 선택 이벤트
        dropdown.onchange = function (e) {
            const selected = e.target.value;
            if (selected && !selectedUniversities.includes(selected)) {
                selectedUniversities.push(selected);
                renderTable();
            }
        };
    });
}

// 표 출력
function renderTable() {
    const table = document.getElementById("comparisonTable");
    if (!table) return;

    // 아무것도 선택 안 했을 때 안내문 표시
    if (selectedUniversities.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="100%" style="padding:20px; text-align:center; color:#888;">
                    🔍 상단에서 대학을 선택하세요
                </td>
            </tr>
        `;
        return;
    }

    // 헤더
    let tableHTML = `<thead><tr>`;
    tableHTML += `<th class="bg-blue-100">70%컷</th>`;
    selectedUniversities.forEach(uni => {
        tableHTML += `<th class="bg-blue-100">${uni}</th>`;
    });
    tableHTML += `</tr></thead><tbody>`;

    // 데이터
    jsonData.forEach(row => {
        tableHTML += `<tr>`;
        tableHTML += `<td style="color:#1d4ed8; font-weight:bold;">${row["70%컷"] || ""}</td>`;

        selectedUniversities.forEach(uni => {
            tableHTML += `<td>${row[uni] || ""}</td>`;
        });

        tableHTML += `</tr>`;
    });

    tableHTML += `</tbody>`;
    table.innerHTML = tableHTML;
}

// 초기화 버튼
function resetSelection() {
    selectedUniversities = [];
    const dropdowns = document.querySelectorAll(".university-select");
    dropdowns.forEach(d => d.value = "");
    renderTable();
}

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {

    // 기본 시트 설정
    const sheetSelect = document.getElementById("sheetSelect");
    if (sheetSelect) {
        sheetSelect.value = currentSheet;
    }

    // 데이터 최초 로드
    loadData(currentSheet);

    // 시트 변경 이벤트
    sheetSelect.addEventListener("change", (e) => {
        currentSheet = e.target.value;
        selectedUniversities = [];
        loadData(currentSheet);
    });

    // 초기화 버튼 이벤트
    document.getElementById("resetBtn").addEventListener("click", resetSelection);
});
