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
                request.open("POST", "https://hans-moleman.herokuapp.com/rides", true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.onreadystatechange = function() {
                    if (request.readyState == 4 && request.status == 200) {
                        console.log("Got the data back!");
                        data = request.responseText;
                        console.log(data);
                        vehicles = JSON.parse(data);
                        vehicleMarkers();
                    }
		        };
                request.send("username=Xt7n67RP&lat=" + posLat + "&lng=" + posLng);
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

            function vehicleMarkers() {
                var i;
                var vMarker;
                var vIWindow;
                for (i = 0; i < vehicles.length; i++) {
                    vMarker = new google.maps.Marker({
                        position: new google.maps.LatLng(vehicles[i].lat, vehicles[i].lng),
                        title: "vehicles[i].username",
                        icon: "https://tuftsdev.github.io/WebProgramming/assignments/car.png"
                    });
                    vIWindow = new google.maps.InfoWindow();
                    google.maps.event.addListener(vMarker, 'click', function() {
                        vIWindow.setContent(vMarker.title);
                        vIWindow.open(map, vMarker);
                    });
                }
            }

            

        
                
            
