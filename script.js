// Function to Fetch Data from ThingSpeak
function fetchThingSpeakData() {
    console.log("Fetching ThingSpeak data...");
    fetch('https://api.thingspeak.com/channels/2832905/fields/1.json?results=1')
        .then(response => response.json())
        .then(data => {
            console.log("Received Data:", data);

            if (data.feeds.length > 0) {
                let latestData = data.feeds[0];
                let fillLevel = parseFloat(latestData.field1); // Bin Fill Percentage

                if (isNaN(fillLevel)) {
                    console.error("Received invalid data:", latestData);
                    document.getElementById("error").style.display = "block";
                    return;
                } else {
                    document.getElementById("error").style.display = "none";
                }

                // Example Coordinates (Replace with actual bin coordinates)
                let binLat = 21.2514;
                let binLng = 81.6296;

                // Determine Icon Based on Fill Level
                let selectedIcon;
                if (fillLevel >= 75) {
                    selectedIcon = redBinIcon; // Red (Full)
                } else if (fillLevel >= 45 && fillLevel < 75) {
                    selectedIcon = yellowBinIcon; // Yellow (Half-Full)
                } else {
                    selectedIcon = greenBinIcon; // Green (Low)
                }

                // **FIXED: Correctly initializing or updating the marker**
                if (!binMarker) {
                    // Create a new marker for the first time
                    binMarker = L.marker([binLat, binLng], { icon: selectedIcon })
                        .addTo(map)
                        .bindPopup(`🚮 <b>Bin Fill Level:</b> ${fillLevel.toFixed(2)}%`)
                        .openPopup();
                } else {
                    // Update existing marker
                    binMarker.setLatLng([binLat, binLng])
                        .setIcon(selectedIcon)
                        .setPopupContent(`🚮 <b>Bin Fill Level:</b> ${fillLevel.toFixed(2)}%`)
                        .openPopup();
                }

                // Update Status Display
                document.getElementById("status").innerText = `📊 Latest Bin Level: ${fillLevel.toFixed(2)}%`;

                // Update Notification List
                updateNotificationList(fillLevel);
            } else {
                console.error("No data received from ThingSpeak!");
                document.getElementById("error").style.display = "block";
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById("error").style.display = "block";
        });
}
