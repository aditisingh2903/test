// Sample data for dustbins (this should be dynamic if fetching from Firebase)
const dustbins = [
    { id: 1, location: "City Park", status: "Full", fillLevel: 95, lat: 51.505, lng: -0.09 },
    { id: 2, location: "Main Street", status: "Near Full", fillLevel: 80, lat: 51.51, lng: -0.1 },
    { id: 3, location: "Shopping Mall", status: "Normal", fillLevel: 30, lat: 51.515, lng: -0.09 },
  ]
  
  // Function to populate the alert list
  function populateAlertList() {
    const alertList = document.getElementById("alertList")
  
    if (!alertList) {
      console.error("Error: alertList element not found!")
      return
    }
  
    // Clear existing alerts (if any)
    alertList.innerHTML = ""
  
    dustbins.forEach((dustbin) => {
      const listItem = document.createElement("li")
      listItem.className = "alert-item"
      listItem.innerHTML = `
          <h3>Dustbin ${dustbin.id}</h3>
          <p><strong>Location:</strong> ${dustbin.location}</p>
          <p><strong>Status:</strong> <span class="status ${dustbin.status.toLowerCase().replace(" ", "-")}">${dustbin.status}</span></p>
          <p><strong>Fill Level:</strong> ${dustbin.fillLevel}%</p>
      `
      alertList.appendChild(listItem)
    })
  }
  
  // Run the function automatically when the page loads
  document.addEventListener("DOMContentLoaded", populateAlertList)
  