fetch('./data/gpa_data.json')
  .then(res => res.json())
  .then(data => {
    document.getElementById('app').innerText = '데이터 불러오기 성공!';
    console.log(data); // 확인용
  })
  .catch(err => {
    document.getElementById('app').innerText = '데이터를 불러오지 못했습니다.';
    console.error(err);
  });
