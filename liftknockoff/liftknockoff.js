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
            var distancesP = [];
            var minDisPass = 0;
            var distancesV = [];
            var minDisVeh = 0;
            var disToWB;
            var metToMi = 0.00062;

            function init() {
                map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                getMyLocation();
                request.open("POST", "https://secret-peak-95207.herokuapp.com/rides", true);
                request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                request.onreadystatechange = function() {
                    if (request.readyState == 4 && request.status == 200) {
                        data = request.responseText;
                        data = JSON.parse(data);
                        if (data.vehicles) {
                            minDisV();
                            vehicleMarkers();
                        }
                        else if (data.passengers) {
                            minDisP();
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
                    });
                }
                else {
                    alert("Geolocation is not supported by your web browser.");
                }
            }

            function minDisP() {
                var n;
                for (n = 0; n < data.passengers.length; n++) {
                    distancesP[n] = new google.maps.LatLng(data.passengers[n].lat, data.passengers[n].lng);
                    if (n != 0 && distancesP[n] < distancesP[n-1]) {
                        minDisPass = distancesP[n];
                    }
                    if (data.passengers[n].username == "WEINERMOBILE") {
                        disToWB = new google.maps.LatLng(data.passengers[n].lat, data.passengers[n].lng);
                    }
                }
                me = new google.maps.LatLng(posLat, posLng);
                map.panTo(me);
                marker = new google.maps.Marker({
                    position: me,
                    title: "username: Xt7n67RP" + " Distance to nearest passenger: " + disMeToP + " miles. " +
                    " Distance to Weinermobile: " + disMeToWB + " miles. ",
                    icon: "me.jpg"
                });
                var disMeToP = google.maps.geometry.spherical.computeDistanceBetween(marker.position, minDisPass);
                disMeToP *= metToMi;
                var disMeToWB = google.maps.geometry.spherical.computeDistanceBetween(marker.position, disToWB);
                disMeToWB *= metToMi;
                marker.setMap(map);
                google.maps.event.addListener(marker, 'click', function() {
                    infoWindow.setContent(marker.title);
                    infoWindow.open(map, marker);
                });
            }
            
            function minDisV() {
                var j;
                var n;
                for (j = 0; j < data.vehicles.length; j++) {
                    distancesV[j] = new google.maps.LatLng(data.vehicles[j].lat, data.vehicles[j].lng);
                    if (n != 0 && distancesV[j] < distancesV[j-1]) {
                        minDisVeh = distancesV[j];
                    }
                    if (data.vehicles[j].username == "WEINERMOBILE") {
                        disToWB = new google.maps.LatLng(data.vehicles[j].lat, data.vehicles[j].lng);
                    }
                }
                me = new google.maps.LatLng(posLat, posLng);
                map.panTo(me);
                marker = new google.maps.Marker({
                    position: me,
                    title: "username: Xt7n67RP" + " Distance to nearest vehicle: " + disMeToV + " miles. " +
                    " Distance to Weinermobile: " + disMeToWB + " miles. ",
                    icon: "me.jpg"
                });
                console.log("Here" + minDisVeh);
                var disMeToV = google.maps.geometry.spherical.computeDistanceBetween(marker.position, minDisVeh);
                disMeToV *= metToMi;
                var disMeToWB = google.maps.geometry.spherical.computeDistanceBetween(marker.position, disToWB);
                disMeToWB *= metToMi;
                marker.setMap(map);
                google.maps.event.addListener(marker, 'click', function() {
                    infoWindow.setContent(marker.title);
                    infoWindow.open(map, marker);
                });
            }

            function vehicleMarkers() {
                var i;
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
                        vMarkerPos = new google.maps.LatLng(data.vehicles[i].lat, data.vehicles[i].lng);
                        let vMarker = new google.maps.Marker({
                            position: vMarkerPos,
                            title: data.vehicles[i].username + " Miles away from Me: " + distanceV,
                            icon: "car.png",
                            infowindow: new google.maps.InfoWindow()
                        });
                        var distanceV = google.maps.geometry.spherical.computeDistanceBetween(marker.position, vMarkerPos);
                        distanceV *= metToMi;
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
                var k;
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
                        pMarkerPos = new google.maps.LatLng(data.passengers[k].lat, data.passengers[k].lng);
                        let pMarker = new google.maps.Marker({
                            position: pMarkerPos,
                            title: data.passengers[k].username + " Miles away from Me: " + distanceP,
                            icon: "passenger.png",
                            infowindow: new google.maps.InfoWindow()
                        });
                        var distanceP = google.maps.geometry.spherical.computeDistanceBetween(marker.position, pMarkerPos);
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

                
                }
            }

            

        
                
            
