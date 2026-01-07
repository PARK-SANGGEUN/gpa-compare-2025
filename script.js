let gpaData = {};
let selectedUniversities = [];
let currentFilter = "";
const colors = ['#dbeafe', '#fce7f3', '#ede9fe', '#dcfce7', '#fef9c3']; // 대학별 배경색

fetch('data/gpa_data_통합_final.json')
  .then(response => response.json())
  .then(data => {
    gpaData = data;
    populateUniversityOptions();
    renderTable();
  });

function populateUniversityOptions() {
  const select = document.getElementById('universitySelect');
  const universities = Object.keys(gpaData).sort();
  universities.forEach(univ => {
    const option = document.createElement('option');
    option.value = univ;
    option.textContent = univ;
    select.appendChild(option);
  });
}

document.getElementById('addCompare').addEventListener('click', () => {
  const univ = document.getElementById('universitySelect').value;
  if (univ && !selectedUniversities.includes(univ) && selectedUniversities.length < 5) {
    selectedUniversities.push(univ);
    renderTable();
  }
});

document.getElementById('reset').addEventListener('click', () => {
  selectedUniversities = [];
  currentFilter = "";
  document.getElementById('searchInput').value = '';
  renderTable();
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  currentFilter = e.target.value.toLowerCase();
  renderTable();
});

document.getElementById('scrollTopBtn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function renderTable() {
  const table = document.getElementById('gpaTable');
  table.innerHTML = '';

  const headerRow = table.insertRow();
  const gradeHeader = document.createElement('th');
  gradeHeader.textContent = '70%컷';
  gradeHeader.className = 'fixed-col';
  headerRow.appendChild(gradeHeader);

  selectedUniversities.forEach((univ, index) => {
    const th = document.createElement('th');
    th.style.backgroundColor = colors[index % colors.length];
    th.innerHTML = `<span>${univ}</span> <span class="remove" onclick="removeUniversity('${univ}')">✖</span>`;
    headerRow.appendChild(th);
  });

  const allGrades = new Set();
  selectedUniversities.forEach(univ => {
    if (gpaData[univ]) {
      Object.keys(gpaData[univ]).forEach(grade => allGrades.add(grade));
    }
  });

  const sortedGrades = Array.from(allGrades).sort((a, b) => parseFloat(a) - parseFloat(b));

  sortedGrades.forEach(grade => {
    const row = table.insertRow();
    const gradeCell = row.insertCell();
    gradeCell.textContent = grade;
    gradeCell.className = 'fixed-col';

    selectedUniversities.forEach(univ => {
      const cell = row.insertCell();
      const text = gpaData[univ]?.[grade] || '';
      cell.innerHTML = highlight(text);
      cell.style.backgroundColor = colors[selectedUniversities.indexOf(univ) % colors.length];
    });
  });
}

function removeUniversity(univ) {
  selectedUniversities = selectedUniversities.filter(u => u !== univ);
  renderTable();
}

function highlight(text) {
  if (!currentFilter) return text;
  const regex = new RegExp(`(${currentFilter})`, 'gi');
  return text.replace(regex, `<span class="highlight">$1</span>`);
}
