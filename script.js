let jsonData = [];
let selectedUniversities = [];

async function loadData() {
  try {
    const response = await fetch("./data/gpa_data_final_cleaned_ready.json");
    jsonData = await response.json();
    initDropdowns();
  } catch (err) {
    console.error("JSON 로드 실패:", err);
  }
}

function initDropdowns() {
  const dropdowns = document.querySelectorAll(".university-select");
  const headers = Object.keys(jsonData[0]).filter(h => h !== "70%컷");

  dropdowns.forEach((dropdown, index) => {
    dropdown.innerHTML = `<option value="">대학 선택</option>`;
    headers.forEach(header => {
      const option = document.createElement("option");
      option.value = header;
      option.textContent = header;
      dropdown.appendChild(option);
    });

    dropdown.addEventListener("change", () => {
      const val = dropdown.value;
      selectedUniversities[index] = val;
      renderTable();
    });
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    selectedUniversities = [];
    dropdowns.forEach(d => d.value = "");
    renderTable();
  });

  renderTable();
}

function renderTable() {
  const container = document.getElementById("tableContainer");

  if (!selectedUniversities.some(Boolean)) {
    container.innerHTML = '<p class="text-center text-gray-400">대학을 선택해주세요.</p>';
    return;
  }

  let tableHTML = `<table class="table-auto min-w-full text-sm text-center"><thead><tr>`;
  tableHTML += `<th class="bg-blue-50 font-bold">70%컷</th>`;
  selectedUniversities.forEach(uni => {
    if (uni) tableHTML += `<th class="bg-blue-100 text-gray-900">${uni}</th>`;
  });
  tableHTML += `</tr></thead><tbody>`;

  jsonData.forEach(row => {
    tableHTML += `<tr>`;
    tableHTML += `<td class="text-blue-800 font-medium">${row["70%컷"] || ""}</td>`;
    selectedUniversities.forEach(uni => {
      if (uni) {
        tableHTML += `<td class="whitespace-pre-line">${row[uni] || ""}</td>`;
      }
    });
    tableHTML += `</tr>`;
  });

  tableHTML += `</tbody></table>`;
  container.innerHTML = tableHTML;
}

document.addEventListener("DOMContentLoaded", loadData);
