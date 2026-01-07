const jsonFiles = [
  './data/gpa_data_경고서서성연중한_web_final.json',
  './data/gpa_data_건국단서세숭이홍_web_final.json',
  './data/gpa_data_가가광명상아인인_web_final.json'
];

let allData = [];
let selectedColumns = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const results = await Promise.all(jsonFiles.map(url => fetch(url).then(res => res.json())));
    allData = results.flat();
    populateDropdown();
    renderTable();
    setupEventListeners();
  } catch (error) {
    console.error("데이터 불러오기 실패:", error);
  }
});

function populateDropdown() {
  const dropdown = document.getElementById("collegeSelect");
  dropdown.innerHTML = `<option value="">대학 선택</option>`;
  const columnNames = Object.keys(allData[0]).filter(key => key !== "70%컷");
  columnNames.forEach(col => {
    const option = document.createElement("option");
    option.value = col;
    option.textContent = col;
    dropdown.appendChild(option);
  });
}

function setupEventListeners() {
  document.getElementById("collegeSelect").addEventListener("change", e => {
    const selected = e.target.value;
    if (selected && !selectedColumns.includes(selected)) {
      if (selectedColumns.length >= 5) {
        alert("최대 5개 대학까지 비교할 수 있습니다.");
        return;
      }
      selectedColumns.push(selected);
      renderTable();
    }
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    selectedColumns = [];
    document.getElementById("collegeSelect").value = "";
    renderTable();
  });

  document.getElementById("searchInput").addEventListener("input", renderTable);

  document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

function renderTable() {
  const container = document.getElementById("tableContainer");
  const search = document.getElementById("searchInput").value.trim();
  let html = `
    <table class="min-w-full text-sm text-center border border-gray-200 shadow rounded overflow-x-auto">
      <thead class="sticky top-0 bg-blue-100 z-10">
        <tr>
          <th class="bg-yellow-100 text-gray-900 font-semibold p-2">70%컷</th>
          ${selectedColumns
            .map(
              col =>
                `<th class="bg-white relative">
                  <div class="flex justify-between items-center px-2">
                    <span class="font-semibold text-gray-800">${col}</span>
                    <button onclick="removeColumn('${col}')" class="text-red-500 hover:text-red-700">✕</button>
                  </div>
                </th>`
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${allData
          .filter(row =>
            !search ||
            selectedColumns.some(col => (row[col] || "").toLowerCase().includes(search.toLowerCase()))
          )
          .map(row => {
            return `
              <tr class="hover:bg-blue-50 transition">
                <td class="bg-yellow-50 font-semibold text-blue-700 p-2">${row["70%컷"] || ""}</td>
                ${selectedColumns
                  .map(col => `<td class="p-2 whitespace-pre-line text-gray-700">${row[col] || ""}</td>`)
                  .join("")}
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
  container.innerHTML = html;
}

function removeColumn(column) {
  selectedColumns = selectedColumns.filter(col => col !== column);
  renderTable();
}
