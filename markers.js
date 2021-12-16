// CCTV api
const serviceKey_CCTV = "Jo1AQOE7RUfRc1B3Fht8golmSCwwMUfudzPV9355fMjSZwkGh0N3AL2IFLM7ER73nlcOID4V%2FxJK3mOmCDv5YA%3D%3D";
const CCTV_Url = "https://cors-jhs.herokuapp.com/http://api.data.go.kr/openapi/tn_pubr_public_cctv_api?serviceKey=" + serviceKey_CCTV + "&numOfRows=100&type=json&institutionNm=";
var insttNm_CCTV1 = "부산광역시%20재난현장관리과"
var insttNm_CCTV2 = "부산광역시%20남구청"

function getCCTV() {
    display_loading()
    //CCTV이미지
    var CCTVImage = new kakao.maps.MarkerImage('assets/cctv.png', new kakao.maps.Size(40, 40));
    //마커를 담을 배열
    var markers = [];
    //클릭됐는지 확인하는 배열
    var check = [];

    //호출
    fetch(CCTV_Url + insttNm_CCTV1)
        .then((res) => res.json())
        .then((resJson) => {
            var items = resJson.response.body.items;

            for (var i = 0; i < items.length; i++) {
                var coordinate = new kakao.maps.LatLng(items[i].latitude, items[i].longitude); // 마커가 표시될 위치
                
                //마커 생성
                var marker = new kakao.maps.Marker({
                    position: coordinate,
                    map: map,
                    image: CCTVImage,
                    clickable: true,
                });

                //인포 윈도우 생성
                var infoWindow = new kakao.maps.InfoWindow({
                    content: '<div class="info-title">CCTV</div>',// 정보창에 이름 표시
                });
                
                //마커에 클릭 이벤트 등록
                //길찾기 모드에서만 클릭되도록
                if(mode == 1)
                    kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, coordinate, marker));


                // 마커 이벤트리스너 등록
				kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
				kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                markers.push(marker);

            }
            clusterer.addMarkers(markers);
        })
        
    fetch(CCTV_Url + insttNm_CCTV2)
        .then((res) => res.json())
        .then((resJson) => {
             
            var items = resJson.response.body.items;

            for (var i = 0; i < items.length; i++) {
                var markerPosition = new kakao.maps.LatLng(items[i].latitude, items[i].longitude); // 마커가 표시될 위치

                //마커 생성
                var marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(items[i].latitude, items[i].longitude),
                    map: map,
                    image: CCTVImage,
                    clickable: true,
                });

                //인포 윈도우 생성
                var infoWindow = new kakao.maps.InfoWindow({
                    content: '<div class="info-title">CCTV</div>',// 정보창에 이름 표시
                });

                //마커에 클릭 이벤트 등록
                //길찾기 모드에서만 클릭되도록
                if(mode == 1)
                    kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, markerPosition, marker));

                // 마커 이벤트리스너 등록
				kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
				kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                markers.push(marker);
            }
            clusterer.addMarkers(markers);  //클러스터에 추가
            CCTV_markers = markers;         //전체 CCTV 마커 배열에 추가
            vanish_loading();               //로딩화면 종료
        })
}

//비상벨 api
function getEmergencyBell(){
    display_loading()
    //서비스 키
    const serviceKey_emergencyBell = 'i0omZLilsWQxFd3kY5EnR0GjiK1v%2BbymoppTqZykRtT9hRyM4QCxVyW4gcV%2BczyPKQSAH17efFCAbzELgv0wDA%3D%3D';
	//비상벨 url
	const emergencyBellUrl = 'https://cors-jhs.herokuapp.com/http://api.data.go.kr/openapi/tn_pubr_public_safety_emergency_bell_position_api?serviceKey=' + serviceKey_emergencyBell+ '&numOfRows=30&type=xml&instt_code='; 

    //부산시 내 비상벨 코드
    var instt_code = [
        '3310000', //남구
        '3320000', //북구
        '3350000',
        '3360000',
        '3370000',
    ];

    //비상벨 이미지
    var BellImage = new kakao.maps.MarkerImage('assets/emergencyBell.png',new kakao.maps.Size(40, 40));
    //마커를 담을 배열
    var markers = [];
    //클릭됐는지 확인하는 배열
    var check = [];

 
    //instt_code 길이만큼 반복하여 구마다 비상벨 정보 불러오기
    for(var i = 0; i < instt_code.length; i++){
        //xml 타입 api 요청하기 
        const xhr = new XMLHttpRequest();
        xhr.open('GET', emergencyBellUrl + instt_code[i]);

        xhr.send();

        xhr.onreadystatechange = function() {
            //문제 없이 잘 불러왔다면
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    
                    var xml = xhr.responseXML;
                    
                    //위도 정보 받기
                    var latitudes = xml.getElementsByTagName("latitude");
                    //경도 정보 받기
                    var longitudes = xml.getElementsByTagName("longitude");
                    
                    for (var i = 0; i < latitudes.length; i++) {
                        //좌표 저장
                        var coordinate = new kakao.maps.LatLng(latitudes[i].childNodes[0].nodeValue, longitudes[i].childNodes[0].nodeValue);

                        //마커 생성
                        var marker = new kakao.maps.Marker({
                            map: map,
                            position: coordinate,
                            image: BellImage,
                            clickable: true,
                        });

                        //마커에 클릭 이벤트 등록
                        //길찾기 모드에서만 클릭되도록
                        if(mode == 1)
                            kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, coordinate, marker));
            
                        //인포윈도우 생성
                        var infoWindow = new kakao.maps.InfoWindow({
                            content: '<div class="info-title">비상벨</div>',// 정보창에 이름 표시
                        });
            
                        // 마커 추가
                        markers.push(marker);

                        // 마커 이벤트리스너 등록
                        kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                        kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                        
                        bell_markers = markers;
                        clusterer.addMarkers(markers);
                        vanish_loading()
                    }

                } else { 
                    alert(request.status);

            }
            }
        }
    }
} 


// 전국 경찰서, 지구대, 파출소 API
const policeApiKey ="DdC8tvJbN2Nkrf6SVd9ET4iq6Jx9wZJl%2Bjkuh5LW1rt3x45SAz1DR3k4Wky0SZEAovsAWIgb%2FWV20TNVs21QQA%3D%3D"
const policeUrl = 'https://api.odcloud.kr/api/15054711/v1/uddi:f038d752-ff35-4a22-a2c2-cf9b90de7a30?page=1&perPage=2264&serviceKey='+policeApiKey;
function getPolice(){
    display_loading()
    //경찰서 이미지
    var imgSrc = 'assets/police.png', 
        //마커 이미지의 크기
        imgSize = new kakao.maps.Size(40, 40);

    // 지도에 경찰서 표시
    fetch(policeUrl)
    .then((res) => res.json())
    .then((resJson) => {
        var markers = [];
        var check = [];
        var centers = resJson.data;
        for (var i = 0; i < centers.length; i++) { // 경찰서 좌표 가져오기
            //부산 정보만 가져옴
            if(centers[i]["청"] != "부산청") continue;
            var lat = centers[i]["Y좌표"];
            var lng = centers[i]["X좌표"];
            
            //마커의 이미지 정보
            var markerImage = new kakao.maps.MarkerImage(imgSrc, imgSize, imgOption),
                   markerPosition = new kakao.maps.LatLng(lat, lng); // 마커가 표시될 위치입니다

            var marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(lat, lng),
                map: map,
                image: markerImage,
                clickable: true,
            });


            //길찾기 중일 때만 마커에 클릭 이벤트 등록
            if(mode == 1)
                kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, markerPosition, marker));

            var infoWindow = new kakao.maps.InfoWindow({
                content: '<div class="info-title">'+centers[i]["지구대파출소"]+'</div>', // 정보창에 경찰서 이름 표시
            });

            // 마커 추가
            markers.push(marker);
            
            
            // 마커 이벤트리스너 등록
            kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
            kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
        }
        police_markers = markers;
        clusterer.addMarkers(markers);
        vanish_loading();
    });
}


// 소방서 API
function getfireStation(){
    display_loading()
    //소방관 이미지
    var FireImage = new kakao.maps.MarkerImage('assets/firefighter.png', new kakao.maps.Size(40, 40));
    //클릭됐는지 확인하는 배열
    var check = [];

        // [소방청] 시,도 소방서 현황 API
		const FSurl = "https://api.odcloud.kr/api/15048243/v1/uddi:818f12a7-70c1-4aff-81a0-80d5db5be9fb?page=1&perPage=224&serviceKey=Jo1AQOE7RUfRc1B3Fht8golmSCwwMUfudzPV9355fMjSZwkGh0N3AL2IFLM7ER73nlcOID4V%2FxJK3mOmCDv5YA%3D%3D"
		
        // 지도에 소방서 표시
		fetch(FSurl)
			.then((res) => res.json())
			.then((resJson) => {
				// 마커표시에 사용할 변수 선언, api로 부터 받아온 Json은 Firestations 함수로 선언한다.
				var Firestations = resJson.data;
                var list = [];

				// json으로부터 각 소방서의 data를 가져온다.
				for (var i = 0; i < Firestations.length; i++) {
					if(Firestations[i]["주소"].includes("부산") == false) continue;
					list[i] = Firestations[i]["주소"].substring(0, Firestations[i]["주소"].indexOf("("));;
				}
                
                // promise 객체로 geocoder.addressSearch 함수를 호출
                const addressSearch = address => {
                    return new Promise((resolve, reject) => {
                            geocoder.addressSearch(address, function(result, status) {
                                if (status === kakao.maps.services.Status.OK) {
                                    resolve({"lat": result[0].y, "lng": result[0].x});
                                } else {
                                    reject(status);
                                }
                            });
                    });
                };
                
                // async-await
                (async () => {
                        var markers = [];
                        for(const address of list) {
                            if(address == ""||address == null) continue;
                            const result = await addressSearch(address); // 비동기 함수를 동기 함수처럼 사용하기 위해 await 사용
                            var coordinate = new kakao.maps.LatLng(result.lat, result.lng);
                            var marker = new kakao.maps.Marker({
								map: map,
								position: coordinate,
                                image: FireImage,
                                clickable: true,
							});
                            // 마커에 클릭 이벤트 등록
                            //길찾기 모드에서만 클릭되도록
                            if(mode == 1)
                                kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, coordinate, marker));

							// 마커 추가
							markers.push(marker);
							
                        }
                        fireStation_markers = markers;
                        clusterer.addMarkers(markers);
                        vanish_loading();
                })();
                
			});
            
}

//보안등 api
const servKey = "Jo1AQOE7RUfRc1B3Fht8golmSCwwMUfudzPV9355fMjSZwkGh0N3AL2IFLM7ER73nlcOID4V%2FxJK3mOmCDv5YA%3D%3D"
const instNm1 = "부산광역시%20남구청"
const instNm2 = "부산광역시%20수영구청"
const serchnumb = 1000
const SecureUrl = "https://cors-jhs.herokuapp.com/http://api.data.go.kr/openapi/tn_pubr_public_scrty_lmp_api?serviceKey=" + servKey + "&pageNo=1&numOfRows=" + serchnumb + "&type=json&institutionNm="
 
function getLamp(){
    display_loading()
    //가로등 이미지
    var LampImage = new kakao.maps.MarkerImage('assets/street-lamp.png',new kakao.maps.Size(30, 30));
    //마커를 담을 배열
    var markers = [];
    //클릭됐는지 확인하는 배열
    var check = [];
     
		// 보안등 api의 url으로 호출
		fetch(SecureUrl + instNm1)
			.then((res) => res.json())
			.then((resJson) => {
				var items = resJson.response.body.items;
				for (var i = 0; i < items.length; i++) {
					var coordinate = new kakao.maps.LatLng(items[i].latitude, items[i].longitude);
                    
					var marker = new kakao.maps.Marker({
						map: map,
						position: coordinate,
                        image: LampImage,
                        clickable: true,
                    });

                    var infoWindow = new kakao.maps.InfoWindow({
                        content: '<div class="info-title">보안등</div>',// 정보창에 이름 표시
                    });

                    //길찾기 중일 때만 마커에 클릭 이벤트 등록
                    if(mode == 1)
                        kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, coordinate, marker));

                    // 마커 이벤트리스너 등록
                    kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                    kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                    markers.push(marker);
                }
                clusterer.addMarkers(markers);
            })


            fetch(SecureUrl + instNm2)
			.then((res) => res.json())
			.then((resJson) => {
                var check = [];
				var items = resJson.response.body.items;
				for (var i = 0; i < items.length; i++) {
					var coordinate = new kakao.maps.LatLng(items[i].latitude, items[i].longitude);

					var marker = new kakao.maps.Marker({
						map: map,
						position: coordinate,
                        image: LampImage,
                        clickable: true,
                    });

                    var infoWindow = new kakao.maps.InfoWindow({
                        content: '<div class="info-title">보안등</div>',// 정보창에 이름 표시
                    });

                    //길찾기 중일 때만 마커에 클릭 이벤트 등록
                    if(mode == 1)
                        kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, coordinate, marker));

                    // 마커 이벤트리스너 등록
                    kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                    kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                    markers.push(marker);
                }
            clusterer.addMarkers(markers);
            lamp_markers = markers; 
            vanish_loading();


            })
            
            
}

//편의점 api
function getConvenience(){
    //요청 변수로 넣을 검색 키워드
    const queryValue = 
        ["부산%20기장군%20편의점", 
        "부산%20금정구%20편의점",
        "부산%20해운대구%20편의점",
        "부산%20동래구%20편의점",
        "부산%20연제구%20편의점",
        "부산%20북구%20편의점",
        "부산%20수영구%20편의점",
        "부산%20부산진구%20편의점",
        "부산%20동구%20편의점",
        "부산%20서구%20편의점",
        "부산%20중구%20편의점",
        "부산%20영도구%20편의점",
        "부산%20사상구%20편의점",
        "부산%20사하구%20편의점",
        "부산%20강서구%20편의점",
        "부산%20남구%20편의점",];

    display_loading()
    //가게 이미지
    var ConvImage = new kakao.maps.MarkerImage('assets/shop.png', new kakao.maps.Size(30, 30));
    //마커를 담을 배열
    var markers = [];
    //클릭됐는지 확인하는 배열
    var check = [];

    //구 마다 24시간 영업 가게 받아오기
    for (var j = 0; j < queryValue.length - 1; j++){

        //네이버 지역 검색 api
        var Url = 'https://cors-jhs.herokuapp.com/https://openapi.naver.com/v1/search/local?query=' + queryValue[j] + '&display=5';
        //인증 키 옵션
        var option = {
            headers: {
                'X-Naver-Client-Id': 'j0kd93tIdsYa1f7hPr2_',
                'X-Naver-Client-Secret': 'XKCwNmbKPv',
            },
        };

        //호출
        fetch(Url, option)
            .then((res) => res.json())
            .then((resJson) => {
                var items = resJson.items;

                //주소를 저장할 배열
                var addressList = [];
                //가게명을 저장할 배열
                var titleList = [];

                //주소와 가게명 받기
                for (var i = 0; i < items.length; i++) {
                    addressList[i]=items[i].address;
                    titleList[i]=items[i].title;
                }

                const addressSearch = address => {
                return new Promise((resolve, reject) => {
                        //주소를 경도와 위도로 반환하는 함수 호출
                        geocoder.addressSearch(address, function(result, status) {
                            if (status === kakao.maps.services.Status.OK) {
                                resolve({"lat": result[0].y, "lng": result[0].x});
                            } else {
                                reject(status);
                            }
                        });
                });
            };
            
            // async-await
            (async () => {
                    
                    for(var i = 0; i < addressList.length; i++) {
                        if(addressList[i] == ""||addressList[i] == null) continue;
                        const result = await addressSearch(addressList[i]); // 비동기 함수를 동기 함수처럼 사용하기 위해 await 사용
                        
                        var coordinate = new kakao.maps.LatLng(result.lat, result.lng);
                        //마커 생성
                        var marker = new kakao.maps.Marker({
                            map: map,
                            position: coordinate,
                            clickable: true,
                            image: ConvImage,
                        });

                        var infoWindow = new kakao.maps.InfoWindow({
                            content: '<div class="info-title">'+titleList[i]+'</div>',// 정보창에 이름 표시
                        });


                        // 마커 이벤트리스너 등록
                        kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                        kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
            
                        //마커에 클릭 이벤트 등록
                        if(mode == 1)
                            kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, coordinate, marker));

                        // 마커 추가
                        markers.push(marker);
                        
                    }
                    
                clusterer.addMarkers(markers); //클러스터 추가
            })();
        })
    }

    //비동기 호출의 문제로 클러스터 적용을 위해 마지막 배열값은 따로 호출
    //네이버 지역 검색 api
    var Url = 'https://cors-jhs.herokuapp.com/https://openapi.naver.com/v1/search/local?query=' + queryValue[15] + '&display=5';
    //인증 키 옵션
    var option = {
        headers: {
            'X-Naver-Client-Id': 'j0kd93tIdsYa1f7hPr2_',
            'X-Naver-Client-Secret': 'XKCwNmbKPv',
        },
    };

    //호출
    fetch(Url, option)
        .then((res) => res.json())
        .then((resJson) => {
            var items = resJson.items;

            //주소를 저장할 배열
            var addressList = [];
            //가게명을 저장할 배열
            var titleList = [];

            //주소와 가게명 받기
            for (var i = 0; i < items.length; i++) {
                addressList[i]=items[i].address;
                titleList[i]=items[i].title;
            }

            const addressSearch = address => {
            return new Promise((resolve, reject) => {
                    //주소를 경도와 위도로 반환하는 함수 호출
                    geocoder.addressSearch(address, function(result, status) {
                        if (status === kakao.maps.services.Status.OK) {
                            resolve({"lat": result[0].y, "lng": result[0].x});
                        } else {
                            reject(status);
                        }
                    });
            });
        };
        
        // async-await
        (async () => {
                
                for(var i = 0; i < addressList.length; i++) {
                    if(addressList[i] == ""||addressList[i] == null) continue;
                    const result = await addressSearch(addressList[i]); // 비동기 함수를 동기 함수처럼 사용하기 위해 await 사용
                    
                    var coordinate = new kakao.maps.LatLng(result.lat, result.lng);
                    //마커 생성
                    var marker = new kakao.maps.Marker({
                        map: map,
                        position: coordinate,
                        clickable: true,
                        image: ConvImage,
                    });

                    var infoWindow = new kakao.maps.InfoWindow({
                        content: '<div class="info-title">'+titleList[i]+'</div>',// 정보창에 이름 표시
                    });


                    // 마커 이벤트리스너 등록
                    kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                    kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
        
                    //마커에 클릭 이벤트 등록
                    if(mode == 1)
                        kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, coordinate, marker));

                    // 마커 추가
                    markers.push(marker);
                    
                }
            convenience_markers = markers; //전체 마커에 추가
            clusterer.addMarkers(markers); //클러스터 추가
            vanish_loading();  //로딩 화면 닫기
        })();
    })
    
}


//24시간 영업 가게 api
function getShop24hr(){
    //요청 변수로 넣을 검색 키워드
    const queryValue = 
        ["부산%20기장군%2024시", 
        "부산%20금정구%2024시",
        "부산%20해운대구%2024시",
        "부산%20동래구%2024시",
        "부산%20연제구%2024시",
        "부산%20북구%2024시",
        "부산%20수영구%2024시",
        "부산%20부산진구%2024시",
        "부산%20동구%2024시",
        "부산%20서구%2024시",
        "부산%20중구%2024시",
        "부산%20영도구%2024시",
        "부산%20사상구%2024시",
        "부산%20사하구%2024시",
        "부산%20강서구%2024시",
        "부산%20남구%2024시",];

    display_loading()
    //가게 이미지
    var ShopImage = new kakao.maps.MarkerImage('assets/24-hours.png', new kakao.maps.Size(30, 30));
    //마커를 담을 배열
    var markers = [];
    //클릭됐는지 확인하는 배열
    var check = [];

    //검색 키워드를 반복하여 구 마다 24시간 영업 가게 받아오기
    for (var j = 0; j < queryValue.length - 1; j++){

        //네이버 지역 검색 api
        const Url = 'https://cors-jhs.herokuapp.com/https://openapi.naver.com/v1/search/local?query=' + queryValue[j] + '&display=5';
        //인증 키 옵션
        const option = {
            headers: {
                'X-Naver-Client-Id': 'j0kd93tIdsYa1f7hPr2_',
                'X-Naver-Client-Secret': 'XKCwNmbKPv',
            },
        };

        //호출
        fetch(Url, option)
            .then((res) => res.json())
            .then((resJson) => {
                var items = resJson.items;
                
                //주소를 저장할 배열
                var addressList = [];
                //가게명을 저장할 배열
                var titleList = [];

                //주소와 가게명 받기
                for (var i = 0; i < items.length; i++) {
                    addressList[i]=items[i].address;
                    titleList[i]=items[i].title;
                }

                const addressSearch = address => {
                return new Promise((resolve, reject) => {
                        //주소를 경도와 위도로 반환하는 함수 호출
                        geocoder.addressSearch(address, function(result, status) {
                            if (status === kakao.maps.services.Status.OK) {
                                resolve({"lat": result[0].y, "lng": result[0].x});
                            } else {
                                reject(status);
                            }
                        });
                });
            };
            
            // async-await
            (async () => {
                    
                    for(var i = 0; i < addressList.length; i++) {
                        if(addressList[i] == ""||addressList[i] == null) continue;
                        const result = await addressSearch(addressList[i]); // 비동기 함수를 동기 함수처럼 사용하기 위해 await 사용
                        
                        var coordinate = new kakao.maps.LatLng(result.lat, result.lng);
                        //마커 생성
                        var marker = new kakao.maps.Marker({
                            map: map,
                            position: coordinate,
                            clickable: true,
                            image: ShopImage,
                        });

                        var infoWindow = new kakao.maps.InfoWindow({
                            content: '<div class="info-title">'+titleList[i]+'</div>',// 정보창에 이름 표시
                        });


                        // 마커 이벤트리스너 등록
                        kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                        kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
            
                        // 마커에 클릭 이벤트 등록
                        if(mode == 1)
                            kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, coordinate, marker));

                        // 마커 추가
                        markers.push(marker);
                    }
                    
                clusterer.addMarkers(markers); //클러스터 추가
            })();

                shop24hr_markers = markers; //전체 마커에 추가
                clusterer.addMarkers(markers); //클러스터 추가
                vanish_loading();  
            
        })
    }
    //비동기 호출의 문제로 클러스터 적용을 위해 마지막 배열값은 따로 호출
    //네이버 지역 검색 api
    const Url = 'https://cors-jhs.herokuapp.com/https://openapi.naver.com/v1/search/local?query=' + queryValue[15] + '&display=5';
    //인증 키 옵션
    const option = {
        headers: {
            'X-Naver-Client-Id': 'j0kd93tIdsYa1f7hPr2_',
            'X-Naver-Client-Secret': 'XKCwNmbKPv',
        },
    };

    //호출
    fetch(Url, option)
        .then((res) => res.json())
        .then((resJson) => {
            var items = resJson.items;
            
            //주소를 저장할 배열
            var addressList = [];
            //가게명을 저장할 배열
            var titleList = [];

            //주소와 가게명 받기
            for (var i = 0; i < items.length; i++) {
                addressList[i]=items[i].address;
                titleList[i]=items[i].title;
            }

            const addressSearch = address => {
            return new Promise((resolve, reject) => {
                    //주소를 경도와 위도로 반환하는 함수 호출
                    geocoder.addressSearch(address, function(result, status) {
                        if (status === kakao.maps.services.Status.OK) {
                            resolve({"lat": result[0].y, "lng": result[0].x});
                        } else {
                            reject(status);
                        }
                    });
            });
        };
        
        // async-await
        (async () => {
                
                for(var i = 0; i < addressList.length; i++) {
                    if(addressList[i] == ""||addressList[i] == null) continue;
                    const result = await addressSearch(addressList[i]); // 비동기 함수를 동기 함수처럼 사용하기 위해 await 사용
                    
                    var coordinate = new kakao.maps.LatLng(result.lat, result.lng);
                    //마커 생성
                    var marker = new kakao.maps.Marker({
                        map: map,
                        position: coordinate,
                        clickable: true,
                        image: ShopImage,
                    });

                    var infoWindow = new kakao.maps.InfoWindow({
                        content: '<div class="info-title">'+titleList[i]+'</div>',// 정보창에 이름 표시
                    });


                    // 마커 이벤트리스너 등록
                    kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                    kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
        
                    // 마커에 클릭 이벤트 등록
                    if(mode == 1)
                        kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, coordinate, marker));

                    // 마커 추가
                    markers.push(marker);
                }
                shop24hr_markers = markers; //전체 마커에 추가
                clusterer.addMarkers(markers); //클러스터 추가
                vanish_loading();  
        })();        
    })
    
}

//응급실 api
const serviceKey_emergencyRoom = 'i0omZLilsWQxFd3kY5EnR0GjiK1v%2BbymoppTqZykRtT9hRyM4QCxVyW4gcV%2BczyPKQSAH17efFCAbzELgv0wDA%3D%3D';
const emergencyRoomUrl = 'https://cors-jhs.herokuapp.com/http://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytBassInfoInqire?serviceKey=' + serviceKey_emergencyRoom + '&pageNo=15&numOfRows=1000'; 
		
function getEmergencyRoom(){
    display_loading()
    // 이미지
    var ERImage = new kakao.maps.MarkerImage('assets/ambulance.png', new kakao.maps.Size(30, 30));
    //마커를 담을 배열
    var markers = [];
    //클릭됐는지 확인하는 배열
    var check = [];

    

    //xml 타입 api 요청하기 
    const xhr = new XMLHttpRequest();
    xhr.open('GET', emergencyRoomUrl);

    xhr.send();

    xhr.onreadystatechange = function() {
            //문제가 없으면
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    
                    var xml = xhr.responseXML;
                    
                    //위도
					var latitudes = xml.getElementsByTagName("wgs84Lat");
					//경도
					var longitudes = xml.getElementsByTagName("wgs84Lon");
                    //기관명
                    var dutyNames = xml.getElementsByTagName("dutyName");
                    //응급실 운영 여부
                    var dutyEryns = xml.getElementsByTagName("dutyEryn");

                    
                    for (var i = 0; i < latitudes.length; i++) {
                        var coordinate = new kakao.maps.LatLng(latitudes[i].childNodes[0].nodeValue, longitudes[i].childNodes[0].nodeValue);

                        var name = dutyNames[i].childNodes[0].nodeValue;

                        //응급실을 운영하지 않으면 continue
                        if (dutyEryns[i].childNodes[0].nodeValue != 1) continue;
                        
                        var marker = new kakao.maps.Marker({
                            map: map,
                            position: coordinate,
                            image: ERImage,
                            clickable: true,
                        });

                        //마커에 클릭 이벤트 등록
                        kakao.maps.event.addListener(marker, 'click', mouseClickListener(check, i, coordinate, marker));
            
                        var infoWindow = new kakao.maps.InfoWindow({
                            content: '<div class="info-title">'+ name +'</div>',// 정보창에 이름 표시
                        });
            
                        // 마커 추가
                        markers.push(marker);
                        // 마커 이벤트리스너 등록
                        kakao.maps.event.addListener(marker, "mouseover", mouseOverListener(map, marker, infoWindow));
                        kakao.maps.event.addListener(marker, "mouseout", mouseOutListener(infoWindow));
                        
                        ER_markers = markers;
                        clusterer.addMarkers(markers);
                        vanish_loading()
                    }

                } else { //문제가 발생했다면
                    alert(request.status);

            }
            }
        }
} 
