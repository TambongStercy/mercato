var inputLong = document.getElementById("auto-form").addEventListener('submit', sendCurrentLocation);



function sendCurrentLocation(event) {
  event.preventDefault(); // Prevent default form submission
  // Your custom logic here
  console.log("Before submitting form...");

  // Implement code to send current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Function to submit the form
function submitForm() {
  // Here you can perform any additional tasks or make your POST request
  console.log("Submitting form...");
  document.getElementById("auto-form").submit(); // Actual form submission
}

function showPosition(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  console.log("Latitude: " + latitude + "<br>Longitude: " + longitude);

  var inputLat = document.getElementById("lat");
  var inputLong = document.getElementById("long");

  inputLat.value = latitude;
  inputLong.value = longitude;

  if(latitude && longitude){
    submitForm();
  }
  
}

function showManualForm() {
  document.getElementById("form-container").style.display = "block";
}

function submitManualForm() {
  // Implement code to handle form submission
  // const quarter = document.getElementById("quarter").value;
  // const name = document.getElementById("name").value;
  // const phone = document.getElementById("phone").value;

  // alert(
  //   `Location added manually:\nQuarter: ${quarter}\nName: ${name}\nPhone: ${phone}`
  // );
}
