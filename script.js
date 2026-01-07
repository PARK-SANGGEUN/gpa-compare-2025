const dataFiles = [
  './data/gpa_data_경고서서성연중한_web_final.json',
  './data/gpa_data_건국단서세숭이홍_web_final.json',
  './data/gpa_data_가가광명상아인인_web_final.json'
];

let fullData = [];
let universityNames = new Set();
let selectedUniversities = [];

/* ---------------- 데이터 로드 ---------------- */
async function loadAll() {
  const responses = await Promise.all(
    dataFiles.map(f => fetch(f).then(r => r.json()))
  );
  fullData = responses.flat();

  fullData.forEach(row => {
    Object.keys(row).forEach(k => {
      if (k !== "70%컷" && k.trim()) universityNames.add(k);
    });
  });

  populateDropdown();
  renderTable();
}

/* ---------------- 드롭다운 ---------------- */
function populateDropdown() {
  const select = document.getElementById("collegeSelect");
  select.innerHTML = `<option value="">대학 선택</option>`;

  [...universityNames].sort().forEach(name => {
    const op = document.createElement("option");
    op.value = op.textContent = name;
    select.appendChild(op);
  });

  select.onchange = () => {
    const v = select.value;
    if (!v || selectedUniversities.includes(v)) return;
    if (selectedUniversities.length >= 5) {
      alert("최대 5개 대학까지 비교 가능합니다.");
      return;
    }
    selectedUniversities.push(v);
    renderTable();
    select.value = "";
  };
}

/* ---------------- 삭제 ---------------- */
function removeUni(name) {
  selectedUniversities = selectedUniversities.filter(u => u !== name);
  renderTable();
}

/* ---------------- 검색 ---------------- */
function matchesSearch(text) {
  const q = document.getElementById("searchInput").value.trim();
  if (!q) return true;
  return (text || "").toLowerCase().includes(q.toLowerCase());
}

function highlightKeyword(text) {
  const q = document.getElementById("searchInput").value.trim();
  if (!q || !text) return text;
  const regex = new RegExp(`(${q})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

/* ---------------- 테이블 렌더 ---------------- */
function renderTable() {
  const box = document.getElementById("tableContainer");

  if (selectedUniversities.length === 0) {
    selectedUniversities = [...universityNames].slice(0, 3);
  }

  let html = `<table><thead><tr><th>70%컷</th>`;

  selectedUniversities.forEach((u, i) => {
    html += `<th data-color="${i % 5}">${u} <span class="delete-btn" onclick="removeUni('${u}')">✕</span></th>`;
  });
  html += `</tr></thead><tbody>`;

  fullData.forEach(row => {
    if (!matchesSearch(JSON.stringify(row))) return;

    html += `<tr><td>${highlightKeyword(row["70%컷"] || "")}</td>`;
    selectedUniversities.forEach((u, i) => {
      const cell = highlightKeyword(row[u] || "");
      html += `<td data-color="${i % 5}">${cell}</td>`;
    });
    html += `</tr>`;
  });

  html += `</tbody></table>`;
  box.innerHTML = html;
}

/* ---------------- 초기화 ---------------- */
document.getElementById("resetBtn").onclick = () => {
  selectedUniversities = [];
  document.getElementById("searchInput").value = "";
  renderTable();
};

document.getElementById("addCompareBtn").onclick = () => {
  const sel = document.getElementById("collegeSelect");
  if (!sel.value) return;
  if (!selectedUniversities.includes(sel.value)) {
    selectedUniversities.push(sel.value);
  }
  renderTable();
};

document.getElementById("searchInput").oninput = renderTable;

/* ---------------- 상단 스크롤 버튼 ---------------- */
const scrollBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    scrollBtn.classList.remove("hidden");
  } else {
    scrollBtn.classList.add("hidden");
  }
});
scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------------- 로드 ---------------- */
document.addEventListener("DOMContentLoaded", loadAll);
