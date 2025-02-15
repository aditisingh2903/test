document.addEventListener("DOMContentLoaded", function () {
    // Initialize Map
    var map = L.map('map').setView([21.2514, 81.6296], 14);

    // Add OpenStreetMap Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Force Map to Render Properly
    setTimeout(() => { map.invalidateSize(); }, 1000);

    // Icons for different fill levels (Ensure correct paths)
    var greenBinIcon = L.icon({ iconUrl: 'green.png', iconSize: [32, 32] });
    var yellowBinIcon = L.icon({ iconUrl: 'yello.png', iconSize: [32, 32] });
    var redBinIcon = L.icon({ iconUrl: 'red.png', iconSize: [32, 32] });

    // Placeholder for marker
    var binMarker = null;

    // Function to Fetch Data from ThingSpeak
    function fetchThingSpeakData() {
        console.log("Fetching ThingSpeak data...");
        fetch('https://api.thingspeak.com/channels/2832905/fields/1.json?results=1')
            .then(response => response.json())
            .then(data => {
                console.log("Received Data:", data);

                if (!data.feeds || data.feeds.length === 0) {
                    console.error("No data received from ThingSpeak!");
                    document.getElementById("error").style.display = "block";
                    return;
                }

                let latestData = data.feeds[0];
                let fillLevel = parseFloat(latestData.field1);  // Bin Fill Percentage

                // Check if the fill level is valid
                if (isNaN(fillLevel)) {
                    console.error("Received invalid data:", latestData);
                    document.getElementById("error").style.display = "block";
                    return;
                } else {
                    document.getElementById("error").style.display = "none";
                }

                // Bin Coordinates (Replace with actual bin coordinates)
                let binLat = 21.2514;
                let binLng = 81.6296;

                // Determine Icon Based on Fill Level
                let selectedIcon;
                if (fillLevel >= 75) {
                    selectedIcon = redBinIcon;  // Red (Full)
                } else if (fillLevel >= 45) {
                    selectedIcon = yellowBinIcon;  // Yellow (Half-Full)
                } else {
                    selectedIcon = greenBinIcon;  // Green (Low)
                }

                // Create or Update Marker
                if (!binMarker) {
                    // If marker doesn't exist, create one
                    binMarker = L.marker([binLat, binLng], { icon: selectedIcon })
                        .addTo(map)
                        .bindPopup(🚮 <b>Bin Fill Level:</b> ${fillLevel.toFixed(2)}%)
                        .openPopup();
                } else {
                    // If marker exists, update position, icon, and popup content
                    binMarker.setLatLng([binLat, binLng])
                        .setIcon(selectedIcon)
                        .bindPopup(🚮 <b>Bin Fill Level:</b> ${fillLevel.toFixed(2)}%)
                        .openPopup();
                }

                // Update Status Display
                document.getElementById("status").innerText = 📊 Latest Bin Level: ${fillLevel.toFixed(2)}%;

                // Update Notification List
                updateNotificationList(fillLevel);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                document.getElementById("error").style.display = "block";
            });
    }

    // Function to update notifications
    function updateNotificationList(fillLevel) {
        const notificationList = document.getElementById("notificationList");

        if (!notificationList) {
            console.error("Error: Notification list element not found!");
            return;
        }

        // Clear previous notifications
        notificationList.innerHTML = "";

        // Add notification if bin is full
        if (fillLevel >= 75) {
            const listItem = document.createElement("li");
            listItem.className = "notification-item";
            listItem.innerHTML = <strong>🚨 Alert:</strong> City Bin is Full! (Fill Level: ${fillLevel}%);
            notificationList.appendChild(listItem);
        }
    }

    // Fetch Data Every 15 Seconds
    fetchThingSpeakData();
    setInterval(fetchThingSpeakData, 15000);
}); 
