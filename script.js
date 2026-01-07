let jsonData = [];
let selectedUniversities = [];

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
  const dropdown = document.getElementById("universitySelect");
  const headers = Object.keys(jsonData[0]).filter(h => h !== "70%컷" && h !== "Unnamed: 0");

  dropdown.innerHTML = '<option value="">대학 선택</option>';
  headers.forEach(header => {
    const option = document.createElement('option');
    option.value = header;
    option.textContent = header;
    dropdown.appendChild(option);
  });

  document.getElementById("addCompare").addEventListener("click", () => {
    const value = dropdown.value;
    if (value && !selectedUniversities.includes(value)) {
      selectedUniversities.push(value);
      renderTable();
    }
  });

  document.getElementById("searchInput").addEventListener("input", renderTable);
}

function renderTable() {
  const container = document.getElementById("table-container");
  const keyword = document.getElementById("searchInput").value.trim();

  if (selectedUniversities.length === 0) {
    container.innerHTML = '<div class="text-gray-500 mt-4">대학을 선택해주세요.</div>';
    return;
  }

  let tableHTML = '<table><thead><tr>';
  tableHTML += `<th>70%컷</th>`;
  selectedUniversities.forEach(uni => {
    tableHTML += `<th>${uni}</th>`;
  });
  tableHTML += '</tr></thead><tbody>';

  jsonData.forEach(row => {
    tableHTML += '<tr>';
    tableHTML += `<td class="bg-yellow">${row["70%컷"] || ''}</td>`;
    selectedUniversities.forEach(uni => {
      const value = row[uni] || '';
      const highlight = keyword && value.includes(keyword) ? 'highlight' : '';
      tableHTML += `<td class="${highlight}">${value}</td>`;
    });
    tableHTML += '</tr>';
  });

  tableHTML += '</tbody></table>';
  container.innerHTML = tableHTML;
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

window.addEventListener("scroll", () => {
  document.getElementById("scrollTopBtn").style.display =
    window.scrollY > 100 ? "block" : "none";
});

document.addEventListener("DOMContentLoaded", loadData);
