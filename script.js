# Prepare the updated script.js with search, mobile responsiveness, and theme selection
script_code = """
let jsonData = [];
let selectedUniversities = [];
const maxSelected = 5;

// 기본 JSON 파일 경로
const dataUrl = "./data/gpa_data_경고서서성연중한_web.json";

// 테마 색상
const themes = {
  light: {
    body: "bg-gradient-to-br from-slate-50 via-blue-50 to-white text-gray-800",
    cutCol: "bg-yellow-100 text-yellow-900",
    uniCol: "bg-blue-50 text-blue-900",
    badge: "bg-blue-100 text-blue-800",
    badgeClose: "text-blue-600",
  },
  dark: {
    body: "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white",
    cutCol: "bg-yellow-700 text-yellow-100",
    uniCol: "bg-gray-700 text-white",
    badge: "bg-gray-600 text-white",
    badgeClose: "text-red-300",
  },
};

let currentTheme = "light";

// JSON 데이터 불러오기
async function loadData() {
  try {
    const response = await fetch(dataUrl);
    jsonData = await response.json();
    populateDropdown();
    renderTable();
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

// 선택된 대학 뱃지
function renderSelected() {
  const container = document.getElementById("selectedUniversities");
  container.innerHTML = "";
  selectedUniversities.forEach(uni => {
    const badge = document.createElement("div");
    badge.className = `badge px-3 py-1 rounded-full shadow text-sm flex items-center gap-2 ${themes[currentTheme].badge}`;
    badge.innerHTML = \`\${uni} <button onclick="removeUniversity('\${uni}')" class="\${themes[currentTheme].badgeClose}">×</button>\`;
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
  document.getElementById("searchInput").value = "";
  renderSelected();
  renderTable();
}

// 테이블 렌더링
function renderTable() {
  const table = document.getElementById("comparisonTable");
  const search = document.getElementById("searchInput").value.toLowerCase();
  if (!table) return;

  const headers = Object.keys(jsonData[0]).filter(h => h !== "70%컷");
  const visibleUniversities = selectedUniversities.length > 0 ? selectedUniversities : headers;

  let tableHTML = "<thead><tr>";
  tableHTML += \`<th class="cut-col sticky-col w-24 \${themes[currentTheme].cutCol}">70%컷</th>\`;
  visibleUniversities.forEach(uni => {
    tableHTML += \`<th class="uni-col \${themes[currentTheme].uniCol}">\${uni}</th>\`;
  });
  tableHTML += "</tr></thead><tbody>";

  jsonData.forEach(row => {
    const rowStr = visibleUniversities.map(u => row[u] || "").join(" ").toLowerCase();
    if (search && !rowStr.includes(search)) return;

    tableHTML += "<tr>";
    tableHTML += \`<td class="sticky-col cut-col \${themes[currentTheme].cutCol}">\${row["70%컷"] || ""}</td>\`;
    visibleUniversities.forEach(uni => {
      const content = row[uni] || "";
      tableHTML += \`<td class="uni-col whitespace-pre-line text-sm \${themes[currentTheme].uniCol}">\${content}</td>\`;
    });
    tableHTML += "</tr>";
  });

  tableHTML += "</tbody>";
  table.innerHTML = tableHTML;
}

// 테마 토글
function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  document.body.className = themes[currentTheme].body;
  renderSelected();
  renderTable();
}

// 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  document.getElementById("addBtn").addEventListener("click", addUniversity);
  document.getElementById("resetBtn").addEventListener("click", resetSelection);
  document.getElementById("searchInput").addEventListener("input", renderTable);
  document.getElementById("themeToggleBtn").addEventListener("click", toggleTheme);
});
"""

# Save to file
with open("/mnt/data/script_theme_search_mobile.js", "w", encoding="utf-8") as f:
    f.write(script_code)

"/mnt/data/script_theme_search_mobile.js"
