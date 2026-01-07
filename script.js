let jsonData = [];
let selectedUniversities = ["경희대", "고려대", "서강대"];

async function loadData() {
  try {
    const response = await fetch('./data/gpa_data_final_single_sheet.json');
    jsonData = await response.json();
    populateUniversityDropdown();
    renderTable();
    initAutocomplete();
  } catch (error) {
    console.error("데이터 불러오기 실패:", error);
  }
}

function populateUniversityDropdown() {
  const dropdown = document.getElementById('universitySelect');
  dropdown.innerHTML = `<option value="">대학 선택</option>`;
  const headers = Object.keys(jsonData[0]).filter(key => key !== "70%컷" && key !== "Unnamed: 0");
  headers.forEach(uni => {
    const option = document.createElement("option");
    option.value = uni;
    option.textContent = uni;
    dropdown.appendChild(option);
  });
}

document.getElementById('addCompare').addEventListener('click', () => {
  const selected = document.getElementById('universitySelect').value;
  if (selected && !selectedUniversities.includes(selected)) {
    selectedUniversities.push(selected);
    renderTable();
  }
});

document.getElementById('reset').addEventListener('click', () => {
  selectedUniversities = [];
  document.getElementById('searchInput').value = "";
  renderTable();
});

function renderTable() {
  const container = document.getElementById('tableContainer');
  const keyword = document.getElementById('searchInput').value.toLowerCase();

  if (selectedUniversities.length === 0) {
    container.innerHTML = `<div class="no-selection">대학을 선택해주세요.</div>`;
    return;
  }

  let html = '<table><thead><tr>';
  html += `<th class="sticky-col header-cell">70%컷</th>`;
  selectedUniversities.forEach((uni, idx) => {
    html += `<th class="header-cell color-${idx % 5}">${uni} <span class="remove-btn" onclick="removeUniversity('${uni}')">×</span></th>`;
  });
  html += '</tr></thead><tbody>';

  jsonData.forEach(row => {
    const showRow = Object.values(row).some(val => val?.toLowerCase().includes(keyword));
    if (!showRow) return;

    html += `<tr><td class="sticky-col">${row["70%컷"] || ""}</td>`;
    selectedUniversities.forEach((uni, idx) => {
      const val = row[uni] || "";
      const highlight = val.toLowerCase().includes(keyword) ? "highlight" : "";
      html += `<td class="color-${idx % 5} ${highlight}">${val}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

function removeUniversity(uni) {
  selectedUniversities = selectedUniversities.filter(u => u !== uni);
  renderTable();
}

document.getElementById("searchInput").addEventListener("input", renderTable);

function initAutocomplete() {
  const input = document.getElementById("searchInput");
  const list = document.getElementById("autocomplete-list");
  const keywords = [...new Set(jsonData.flatMap(row => Object.values(row).filter(v => typeof v === "string")))];

  input.addEventListener("input", function () {
    const val = this.value;
    list.innerHTML = "";
    if (!val) return;

    const filtered = keywords.filter(k => k.toLowerCase().includes(val.toLowerCase())).slice(0, 10);
    filtered.forEach(match => {
      const item = document.createElement("div");
      item.classList.add("autocomplete-item");
      item.textContent = match;
      item.addEventListener("click", () => {
        input.value = match;
        list.innerHTML = "";
        renderTable();
      });
      list.appendChild(item);
    });
  });
}

document.getElementById("scrollTopBtn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("DOMContentLoaded", loadData);
