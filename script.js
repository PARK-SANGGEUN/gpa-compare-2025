let jsonData = [];
let selected = [];
const COLORS = ["col-0","col-1","col-2","col-3","col-4"];

async function loadData() {
    const res = await fetch("data/gpa_data_통합_final.json");
    jsonData = await res.json();

    populateUniversityDropdown();
    renderTable();
}

function populateUniversityDropdown() {
    const uniSet = new Set();
    jsonData.forEach(row => {
        Object.keys(row).forEach(key => {
            if (key !== "70%컷") uniSet.add(key);
        });
    });

    const select = document.getElementById("universitySelect");
    select.innerHTML = "<option value=''>대학 선택</option>";

    [...uniSet].sort().forEach(u=>{
        const op = document.createElement("option");
        op.value = u;
        op.textContent = u;
        select.appendChild(op);
    });
}

document.getElementById("addCompare").onclick = ()=>{
    const sel = document.getElementById("universitySelect").value;
    if(!sel) return;
    if(selected.includes(sel)) return;
    if(selected.length>=5) return alert("최대 5개까지 비교 가능");

    selected.push(sel);
    renderTable();
};

document.getElementById("reset").onclick=()=>{
    selected = [];
    document.getElementById("searchInput").value="";
    renderTable();
};

document.getElementById("searchInput").addEventListener("input", renderTable);

function highlight(text, keyword){
    if(!keyword) return text;
    const regex = new RegExp(`(${keyword})`,"gi");
    return text.replace(regex,"<mark>$1</mark>");
}

function renderTable(){
    const tbl = document.getElementById("gpaTable");
    tbl.innerHTML="";

    if(selected.length===0){
        selected = ["경희대"];
    }

    const keyword = document.getElementById("searchInput").value.trim();

    // header
    let thead = "<thead><tr><th>70%컷</th>";
    selected.forEach((u,i)=>{
        thead += `<th class="${COLORS[i]}">${u} ✖</th>`;
    });
    thead+="</tr></thead>";

    let tbody="<tbody>";

    jsonData.forEach(row=>{
        tbody+="<tr>";
        tbody+=`<td>${row["70%컷"]||""}</td>`;

        selected.forEach((u,i)=>{
            const val = row[u] || "";
            tbody+=`<td class="${COLORS[i]}">${highlight(val,keyword)}</td>`;
        });

        tbody+="</tr>";
    });

    tbody+="</tbody>";

    tbl.innerHTML = thead + tbody;
}

/* 스크롤 탑 버튼 */
const scrollBtn=document.getElementById("scrollTopBtn");
window.onscroll=()=>{
    scrollBtn.style.display = window.scrollY>400 ? "block":"none";
};
scrollBtn.onclick=()=>window.scrollTo({top:0,behavior:"smooth"});

loadData();
