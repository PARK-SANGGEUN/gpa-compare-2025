const dataFiles = [
  './data/gpa_data_경고서서성연중한_web_final.json',
  './data/gpa_data_건국단서세숭이홍_web_final.json',
  './data/gpa_data_가가광명상아인인_web_final.json'
];

let fullData = [];
let universityNames = new Set();
let selectedUniversities = [];

async function loadAllData() {
  try {
    const filePromises = dataFiles.map(file => fetch(file).then(res => res.json()));
    const allData = await Promise.all(filePromises);
    fullData = allData.flat();

    // 시트별 대학명 추출
    fullData.forEach(row => {
      Object.keys(row).forEach(key => {
        if (key !== "70%컷" && key !== "Unnamed: 0" && row[key]) {
          universityNames.add(key);
        }
      });
    });

    populateDropdown();
    selectedUniversities.push([...universityNames][0]); // 첫 번째 대학 기본 선택
    renderTable();
  } catch (error) {
    console.error("데이터 로딩 실패:", error);
  }
}

function populateDropdown() {
  const select = document.getElementById('collegeSelect');
  select.innerHTML = '<option value="">대학 선택</option>';
  [...universityNames].sort().forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    const selected = select.value;
    if (selected && !selectedUniversities.includes(selected) && selectedUniversities.length < 5) {
      selectedUniversities.push(selected);
      renderTable();
    }
    select.value = '';
  });
}

function renderTable() {
  const container = document.getElementById('tableContainer');
  if (!container) return;

  if (selectedUniversities.length === 0) {
    container.innerHTML = `<div class="text-center text-gray-500 py-6">비교할 대학을 선택해주세요.</div>`;
    return;
  }

  let table = `<table class="min-w-full table-fixed text-sm"><thead><tr>`;
  table += `<th class="cut-column w-24">70%컷</th>`;
  selectedUniversities.forEach((uni, index) => {
    table += `<th class="relative font-bold bg-white text-blue-900">${uni}
      <span class="absolute top-0 right-1 text-red-500 cursor-pointer font-bold delete-btn" onclick="removeColumn(${index})">✕</span>
    </th>`;
  });
  table += `</tr></thead><tbody>`;

  fullData.forEach(row => {
    table += `<tr>`;
    table += `<td class="cut-column text-blue-800 font-bold">${row["70%컷"] ?? ''}</td>`;
    selectedUniversities.forEach(uni => {
      const content = row[uni] || '';
      table += `<td class="highlighted divider">${content}</td>`;
    });
    table += `</tr>`;
  });

  table += `</tbody></table>`;
  container.innerHTML = table;
}

function removeColumn(index) {
  selectedUniversities.splice(index, 1);
  renderTable();
}

function resetAll() {
  selectedUniversities = [];
  document.getElementById('searchInput').value = '';
  renderTable();
}

function searchFilter() {
  const keyword = document.getElementById('searchInput').value.trim();
  const rows = document.querySelectorAll('#tableContainer tbody tr');

  rows.forEach(row => {
    const text = row.innerText;
    row.style.display = text.includes(keyword) ? '' : 'none';
  });
}

document.getElementById('addCompareBtn').addEventListener('click', () => {
  const select = document.getElementById('collegeSelect');
  const selected = select.value;
  if (selected && !selectedUniversities.includes(selected) && selectedUniversities.length < 5) {
    selectedUniversities.push(selected);
    renderTable();
  }
});

document.getElementById('resetBtn').addEventListener('click', resetAll);
document.getElementById('searchInput').addEventListener('input', searchFilter);
document.addEventListener('DOMContentLoaded', loadAllData);
