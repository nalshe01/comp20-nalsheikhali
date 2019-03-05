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
            var oldInfoWindow = undefined;

            function init() {
                map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                getMyLocation();
                request.open("POST", "https://hans-moleman.herokuapp.com/rides", true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.onreadystatechange = function() {
                    if (request.readyState == 4 && request.status == 200) {
                        data = request.responseText;
                        data = JSON.parse(data);
                        console.log(data);
                        if (data.vehicles){
                            vehicleMarkers();
                        }
                        else {
                            passengerMarkers();
                        }
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
                //disMeToP();
                marker = new google.maps.Marker({
                    position: me,
                    title: "username: Xt7n67RP" //+ distancetoP
                });
                marker.setMap(map);
                google.maps.event.addListener(marker, 'click', function() {
                    infoWindow.setContent(marker.title);
                    infoWindow.open(map, marker);
                });
            }

            function disMeToV() {
                distanceToV = google.maps.geometry.spherical.computeDistanceBetween(marker.position, vMarker.position);
            }

            function disMeToP() {
                distanceToP = google.maps.geometry.spherical.computeDistanceBetween(marker.position, pMarker.position);
            }
            
            function vehicleMarkers() {
                var i;
                var vIWindow;
                for (i = 0; i < data.vehicles.length; i++) {
                    if (data.vehicles[i].username == "WEINERMOBILE") {
                        let vMarker = new google.maps.Marker({
                            position: new google.maps.LatLng(data.vehicles[i].lat, data.vehicles[i].lng),
                            title: data.vehicles[i].username,
                            icon: "weinermobile.png",
                            infowindow: new google.maps.InfoWindow() 
                        });
                        vMarker.setMap(map);
                        google.maps.event.addListener(vMarker, 'click', function() {
                            if (oldInfoWindow) {
                                oldInfoWindow.close();
                            }
                            oldInfoWindow = this.infoWindow;
                            this.infowindow.setContent(vMarker.title);
                            this.infowindow.open(map, vMarker);
                        });
                    }
                    else {
                        let vMarker = new google.maps.Marker({
                            position: new google.maps.LatLng(data.vehicles[i].lat, data.vehicles[i].lng),
                            title: data.vehicles[i].username,
                            icon: "car.png",
                            infowindow: new google.maps.InfoWindow()
                        });
                        vMarker.setMap(map);
                        google.maps.event.addListener(vMarker, 'click', function() {
                            if (oldInfoWindow) {
                                oldInfoWindow.close();
                            }
                            oldInfoWindow = this.infoWindow;
                            this.infowindow.setContent(vMarker.title);
                            this.infowindow.open(map, vMarker);
                        });
                    }
                }
            }

            function passengerMarkers() {
                console.log("function reached");
                var k;
                var pIWindow;
                for (k = 0; k < data.passengers.length; k++) {
                    if (data.passengers[k].username == "WEINERMOBILE"){
                        let pMarker = new google.maps.Marker({
                            position: new google.maps.LatLng(data.passengers[k].lat, data.passengers[k].lng),
                            title: data.passengers[k].username,
                            icon: "weinermobile.png",
                            infowindow: new google.maps.InfoWindow()
                        });
                        pMarker.setMap(map);
                        google.maps.event.addListener(pMarker, 'click', function() {
                            if (oldInfoWindow) {
                                oldInfoWindow.close();
                            }
                            oldInfoWindow = this.infoWindow;
                            this.infowindow.setContent(pMarker.title);
                            this.infowindow.open(map, pMarker);
                        });
                    }
                    else {
                        let pMarker = new google.maps.Marker({
                            position: new google.maps.LatLng(data.passengers[k].lat, data.passengers[k].lng),
                            title: data.passengers[k].username,
                            icon: "passenger.png",
                            infowindow: new google.maps.InfoWindow()
                        });
                        pMarker.setMap(map);
                        google.maps.event.addListener(pMarker, 'click', function() {
                            if (oldInfoWindow) {
                                oldInfoWindow.close();
                            }
                            oldInfoWindow = this.infoWindow;
                            this.infowindow.setContent(pMarker.title);
                            this.infowindow.open(map, pMarker);
                        });
                        distanceToP[k] = google.maps.geometry.spherical.computeDistanceBetween(marker.position, pMarker.position);
                        while (k != 0) {
                            if (distanceToP[k] < distanceToP[k-1]) {
                                minimum = distanceToP[k];
                            }
                        }
                    }

                
                }
            }

            

        
                
            
