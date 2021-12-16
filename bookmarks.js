// sessionStorage에 경로 정보 저장 (출발지, 도착지, 경유지)
function save_path() {
    sessionStorage.setItem("start", start);
    sessionStorage.setItem("end", end);
    sessionStorage.setItem("passList", passListString);
    sessionStorage.setItem("strnm", strnm.innerText);
    sessionStorage.setItem("dstnm", dstnm.innerText);
    var startname = document.getElementById('Session_str');
        startname.innerText = sessionStorage.getItem("strnm");
        console.log(sessionStorage.getItem("strnm"))
    var endname = document.getElementById('Session_dst');
        endname.innerText = sessionStorage.getItem("dstnm");
        console.log(sessionStorage.getItem("dstnm"))
    alert('경로가 저장되었습니다.');

};

// sessionStorage에서 경로 정보 불러오기
function get_path() {
    start_lat = sessionStorage.getItem("start").split(",")[0].split("(")[1];
    start_lng = sessionStorage.getItem("start").split(", ")[1].split(")")[0];
    end_lat = sessionStorage.getItem("end").split(",")[0].split("(")[1];
    end_lng = sessionStorage.getItem("end").split(", ")[1].split(")")[0];
    start = new kakao.maps.LatLng(start_lat, start_lng);
    end = new kakao.maps.LatLng(end_lat, end_lng);
    strnm.innerText = sessionStorage.getItem("strnm");
    dstnm.innerText = sessionStorage.getItem("dstnm");
    passListString = sessionStorage.getItem("passList");
    passList = passListString.split(",");

    alert('경로를 불러옵니다.');

    // 경로 안내 적용
    pedestrian_route(start, end, map);
};
