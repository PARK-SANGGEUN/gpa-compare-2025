let jsonData = [];
let selectedUniversities = [];
const maxSelected = 5;

// 기본 JSON 파일 경로
const dataUrl = "./data/gpa_data_경고서서성연중한_web.json";

// JSON 데이터 불러오기
async function loadData() {
  try {
    const response = await fetch(dataUrl);
    jsonData = await response.json();
    populateDropdown();
    renderTable(); // 첫 화면에 전체 출력
  } catch (err) {
    console.error("데이터 로딩 실패:", err);
  }
}

// 드롭다운 옵션 채우기
function populateDropdown() {
  const dropdown = document.getElementById("collegeDropdown");
  const headers = Object.keys(jsonData[0]).filter(h => h !== "70%컷");

  dropdown.innerHTML = '<option value="">대학 선택</option>';
  headers.forEach(header => {
    const option = document.createElement("option");
    option.value = header;
    option.textContent = header;
    dropdown.appendChild(option);
  });
}

// 대학 추가
function addUniversity() {
  const dropdown = document.getElementById("collegeDropdown");
  const selected = dropdown.value;

  if (!selected || selectedUniversities.includes(selected)) return;

  if (selectedUniversities.length >= maxSelected) {
    alert("최대 5개 대학까지만 비교할 수 있습니다.");
    return;
  }

  selectedUniversities.push(selected);
  dropdown.value = "";
  renderSelected();
  renderTable();
}

// 선택된 대학 뱃지 렌더링
function renderSelected() {
  const container = document.getElementById("selectedUniversities");
  container.innerHTML = "";

  selectedUniversities.forEach(uni => {
    const badge = document.createElement("div");
    badge.className = "badge";
    badge.innerHTML = `${uni} <button onclick="removeUniversity('${uni}')">×</button>`;
    container.appendChild(badge);
  });
}

// 대학 제거
function removeUniversity(name) {
  selectedUniversities = selectedUniversities.filter(uni => uni !== name);
  renderSelected();
  renderTable();
}

// 초기화
function resetSelection() {
  selectedUniversities = [];
  document.getElementById("collegeDropdown").value = "";
  renderSelected();
  renderTable();
}

// 테이블 렌더링
function renderTable() {
  const table = document.getElementById("comparisonTable");
  if (!table) return;

  // 헤더
  let tableHTML = `<thead><tr>`;
  tableHTML += `<th class="cut-col sticky-col w-20">70%컷</th>`;

  const headers = Object.keys(jsonData[0]).filter(h => h !== "70%컷");
  const visibleUniversities = selectedUniversities.length > 0 ? selectedUniversities : headers;

  visibleUniversities.forEach(uni => {
    tableHTML += `<th class="uni-col">${uni}</th>`;
  });

  tableHTML += `</tr></thead><tbody>`;

  // 데이터
  jsonData.forEach(row => {
    tableHTML += `<tr>`;
    tableHTML += `<td class="sticky-col cut-col">${row["70%컷"] || ""}</td>`;

    visibleUniversities.forEach(uni => {
      const content = row[uni] || "";
      tableHTML += `<td class="uni-col whitespace-pre-line text-sm">${content}</td>`;
    });

    tableHTML += `</tr>`;
  });

  tableHTML += `</tbody>`;
  table.innerHTML = tableHTML;
}

// 이벤트 연결
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  document.getElementById("addBtn").addEventListener("click", addUniversity);
  document.getElementById("resetBtn").addEventListener("click", resetSelection);
});
