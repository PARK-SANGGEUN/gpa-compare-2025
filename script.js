let jsonData = [];
let selectedUniversities = [];

async function loadData() {
  try {
    const response = await fetch('./data/gpa_data_final_single_sheet.json');
    jsonData = await response.json();

    populateUniversityDropdown();
    selectedUniversities = ["경희대", "고려대", "서강대"]; // 기본 표시 대학
    renderTable();
  } catch (error) {
    console.error("데이터를 불러오는 데 실패했습니다:", error);
  }
}

function populateUniversityDropdown() {
  const dropdown = document.getElementById('universitySelect');
  dropdown.innerHTML = '<option value="">대학 선택</option>';

  const headers = Object.keys(jsonData[0]).filter(h => h !== "70%컷");
  const uniqueUniversities = new Set(headers);

  uniqueUniversities.forEach(univ => {
    const option = document.createElement('option');
    option.value = univ;
    option.textContent = univ;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener('change', (e) => {
    const value = e.target.value;
    if (value && !selectedUniversities.includes(value)) {
      selectedUniversities.push(value);
      renderTable();
    }
  });

  document.getElementById("searchInput").addEventListener("input", renderTable);
}

function renderTable() {
  const container = document.getElementById("scrollableTable");
  const keyword = document.getElementById("searchInput").value.trim();

  let filteredData = [...jsonData];

  if (keyword) {
    filteredData = jsonData.filter(row =>
      selectedUniversities.some(univ => row[univ]?.includes(keyword))
    );
  }

  if (selectedUniversities.length === 0) {
    container.innerHTML = '<div class="text-gray-500 text-center mt-4">대학을 선택해주세요.</div>';
    return;
  }

  let tableHTML = `<table><thead><tr>`;
  tableHTML += `<th class="sticky sticky-top">70%컷</th>`;

  selectedUniversities.forEach((univ, idx) => {
    tableHTML += `<th class="sticky-top">${univ} <button onclick="removeUniversity('${univ}')">❌</button></th>`;
  });

  tableHTML += `</tr></thead><tbody>`;

  filteredData.forEach(row => {
    tableHTML += `<tr>`;
    tableHTML += `<td class="sticky">${row["70%컷"] || ""}</td>`;

    selectedUniversities.forEach((univ, i) => {
      const val = row[univ] || "";
      const highlight = keyword && val.includes(keyword) ? 'highlight' : '';
      tableHTML += `<td class="color-${i % 4} ${highlight}">${val}</td>`;
    });

    tableHTML += `</tr>`;
  });

  tableHTML += `</tbody></table>`;
  container.innerHTML = tableHTML;

  updateSelectedDisplay();
}

function updateSelectedDisplay() {
  const div = document.getElementById("selectedUniversities");
  div.innerHTML = `선택한 대학: ${selectedUniversities.join(", ")}`;
}

function resetSelection() {
  selectedUniversities = [];
  document.getElementById("universitySelect").value = "";
  document.getElementById("searchInput").value = "";
  renderTable();
}

function removeUniversity(univ) {
  selectedUniversities = selectedUniversities.filter(u => u !== univ);
  renderTable();
}

document.getElementById("reset").addEventListener("click", resetSelection);

document.getElementById("scrollTopBtn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.onscroll = function () {
  const btn = document.getElementById("scrollTopBtn");
  btn.style.display = document.documentElement.scrollTop > 200 ? "block" : "none";
};

document.addEventListener("DOMContentLoaded", loadData);
