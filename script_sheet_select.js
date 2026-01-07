const jsonFiles = [
  './data/gpa_data_경고서서성연중한_web_final.json',
  './data/gpa_data_건국단서세숭이홍_web_final.json',
  './data/gpa_data_가가광명상아인인_web_final.json'
];

let allSheetData = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const results = await Promise.all(jsonFiles.map(url => fetch(url).then(res => res.json())));
    allSheetData = results;
    setupSheetSelector(results);
    renderSheet(results[0]); // 첫 번째 시트 보여줌
  } catch (error) {
    console.error("시트 데이터를 불러오는 데 실패했습니다:", error);
  }
});

function setupSheetSelector(sheets) {
  const selector = document.getElementById("sheetSelect");
  selector.innerHTML = "";
  sheets.forEach((sheet, idx) => {
    const firstKey = Object.keys(sheet[0]).find(k => k !== "70%컷") || `시트 ${idx + 1}`;
    const option = document.createElement("option");
    option.value = idx;
    option.textContent = firstKey;
    selector.appendChild(option);
  });

  selector.addEventListener("change", e => {
    const idx = parseInt(e.target.value, 10);
    renderSheet(allSheetData[idx]);
  });
}

function renderSheet(data) {
  const container = document.getElementById("tableContainer");
  const columns = Object.keys(data[0]);

  let html = `
    <table class="min-w-full text-sm text-center border border-gray-200 shadow rounded overflow-x-auto">
      <thead class="sticky top-0 bg-blue-100 z-10">
        <tr>
          ${columns.map(col => `<th class="p-2 font-semibold bg-gray-100">${col}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${data
          .map(row => {
            return `<tr class="hover:bg-blue-50 transition">
              ${columns.map(col => `<td class="p-2 whitespace-pre-line">${row[col] || ""}</td>`).join("")}
            </tr>`;
          })
          .join("")}
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}
