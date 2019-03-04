            var posLat = 0;
            var posLng = 0;
            var me = new google.maps.LatLng(posLat, posLng);
            var myOptions = {
                zoom: 13,
                center: me,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map;
            var marker;
            var infoWindow = new google.maps.InfoWindow();
            var request = new XMLHttpRequest();

            function init() {
                map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                getMyLocation();
                google.maps.event.addListener(marker, 'click', function() {
                    var site = "https://hans-moleman.herokuapp.com/rides";
                    request.open("POST", site, true);
                    console.log("request opened");
                    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    console.log("set request header");
                    request.onreadystatechange = function() {
                    if (request.readyState == 4 && request.status == 200) {
                        data = request.responseText;
                        location = JSON.parse(data);
                    }
                    };
                    request.send("username=Xt7n67RP&lat=" + posLat + "&lng=" + posLng);
                });
            }

            function getMyLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        posLat = position.coords.latitude;
                        posLng = position.coords.longitude;
                        renderMap();
                    });
                }
                else {
                    alert("Geolocation is not supported by your web browser.");
                }
            }

            function renderMap() {
                me = new google.maps.LatLng(posLat, posLng);
                map.panTo(me);
                marker = new google.maps.Marker({
                    position: me,
                    title: "username: Xt7n67RP"
                });
                marker.setMap(map);
                google.maps.event.addListener(marker, 'click', function() {
                    infoWindow.setContent(marker.title);
                    infoWindow.open(map, marker);
                });
            }

            

        
                
            
