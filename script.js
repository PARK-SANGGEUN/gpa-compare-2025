let allData = {};
let selectedUniversities = [];
let currentSheet = '';
let gpaLevels = [];

async function loadData() {
  try {
    const response = await fetch('data/gpa_data_통합_final.json');
    allData = await response.json();
    const sheets = Object.keys(allData);
    currentSheet = sheets[0];
    gpaLevels = Object.keys(allData[currentSheet]);
    populateUniversitySelect();
    renderTable();
  } catch (error) {
    console.error('데이터 불러오기 실패:', error);
  }
}

function populateUniversitySelect() {
  const select = document.getElementById('universitySelect');
  select.innerHTML = '<option value="">대학 선택</option>';
  const universities = new Set();
  Object.values(allData).forEach(sheet =>
    Object.values(sheet).forEach(row =>
      Object.keys(row).forEach(u => universities.add(u))
    )
  );
  [...universities].sort().forEach(uni => {
    const option = document.createElement('option');
    option.value = uni;
    option.textContent = uni;
    select.appendChild(option);
  });
}

function renderTable() {
  const table = document.getElementById('gpaTable');
  table.innerHTML = '';
  const header = document.createElement('tr');
  header.innerHTML = `<th class="fixed-col">70%컷</th>`;
  selectedUniversities.forEach((uni, idx) => {
    header.innerHTML += `<th class="uni-header color-${idx % 5}">
      ${uni} <span class="remove" onclick="removeUniversity('${uni}')">✖</span></th>`;
  });
  table.appendChild(header);

  gpaLevels.forEach(level => {
    const row = document.createElement('tr');
    row.innerHTML = `<td class="fixed-col level">${level}</td>`;
    selectedUniversities.forEach((uni, idx) => {
      const text = allData[currentSheet][level]?.[uni] || '';
      const td = document.createElement('td');
      td.innerHTML = highlightSearch(text);
      td.classList.add(`color-${idx % 5}`);
      row.appendChild(td);
    });
    table.appendChild(row);
  });
}

function highlightSearch(text) {
  const keyword = document.getElementById('searchInput').value.trim();
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, `<span class="highlight">$1</span>`);
}

document.getElementById('universitySelect').addEventListener('change', e => {
  const uni = e.target.value;
  if (uni && !selectedUniversities.includes(uni)) {
    selectedUniversities.push(uni);
    renderTable();
  }
  e.target.value = '';
});

function removeUniversity(uni) {
  selectedUniversities = selectedUniversities.filter(u => u !== uni);
  renderTable();
}

document.getElementById('reset').addEventListener('click', () => {
  selectedUniversities = [];
  document.getElementById('searchInput').value = '';
  renderTable();
});

document.getElementById('addCompare').addEventListener('click', () => {
  const uni = document.getElementById('universitySelect').value;
  if (uni && !selectedUniversities.includes(uni)) {
    selectedUniversities.push(uni);
    renderTable();
  }
});

document.getElementById('searchInput').addEventListener('input', () => {
  renderTable();
});

// 스크롤 상단 버튼
const scrollTopBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
  scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

loadData();
