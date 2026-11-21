const doctors = [
  { name: "Dr. Sarah Ahmed", specialty: "Cardiology", experience: 12 },
  { name: "Dr. Imran Malik", specialty: "Neurology", experience: 8 },
  { name: "Dr. Priya Sharma", specialty: "Pediatrics", experience: 10 },
  { name: "Dr. John Miller", specialty: "Orthopedics", experience: 15 },
  { name: "Dr. Fatima Noor", specialty: "Dermatology", experience: 6 }
];

const services = [
  { name: "General Checkup", description: "Complete health screening.", price: 50 },
  { name: "Blood Test", description: "Routine blood analysis.", price: 25 },
  { name: "X-Ray", description: "Digital X-ray imaging.", price: 60 },
  { name: "ECG", description: "Heart activity check.", price: 40 },
  { name: "Vaccination", description: "Child and adult vaccines.", price: 30 },
  { name: "Physiotherapy", description: "Rehabilitation sessions.", price: 70 }
];

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

let appointments = [];

const specialtyFilter = document.getElementById("specialtyFilter");
const doctorList = document.getElementById("doctorList");
const serviceList = document.getElementById("serviceList");
const doctorSelect = document.getElementById("doctorSelect");
const serviceSelect = document.getElementById("serviceSelect");
const timeSelect = document.getElementById("timeSelect");
const dateInput = document.getElementById("appointmentDate");
const bookingForm = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");
const appointmentList = document.getElementById("appointmentList");

function fillSpecialtyFilter() {
  const specialties = [];

  for (let i = 0; i < doctors.length; i++) {
    if (specialties.indexOf(doctors[i].specialty) === -1) {
      specialties.push(doctors[i].specialty);
    }
  }

  for (let i = 0; i < specialties.length; i++) {
    const option = document.createElement("option");
    option.value = specialties[i];
    option.textContent = specialties[i];
    specialtyFilter.appendChild(option);
  }
}

function showDoctors() {
  const chosen = specialtyFilter.value;
  doctorList.innerHTML = "";

  for (let i = 0; i < doctors.length; i++) {
    if (chosen === "All" || chosen === doctors[i].specialty) {
      doctorList.innerHTML +=
        '<div class="card">' +
          "<h3>" + doctors[i].name + "</h3>" +
          '<p class="specialty">' + doctors[i].specialty + "</p>" +
          "<p>" + doctors[i].experience + " years of experience</p>" +
          '<button class="btn small book-btn" data-index="' + i + '">Book with this doctor</button>' +
        "</div>";
    }
  }

  const bookButtons = document.querySelectorAll(".book-btn");
  for (let i = 0; i < bookButtons.length; i++) {
    bookButtons[i].addEventListener("click", chooseDoctor);
  }
}

function chooseDoctor() {
  doctorSelect.value = this.getAttribute("data-index");
  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
}

  serviceList.innerHTML = "";

  for (let i = 0; i < services.length; i++) {
    serviceList.innerHTML +=
      '<div class="card">' +
        "<h3>" + services[i].name + "</h3>" +
        "<p>" + services[i].description + "</p>" +
        '<p class="price">$' + services[i].price + "</p>" +
      "</div>";
  }


function fillBookingForm() {
  doctorSelect.innerHTML = '<option value="">-- Select a doctor --</option>';
  for (let i = 0; i < doctors.length; i++) {
    doctorSelect.innerHTML += '<option value="' + i + '">' + doctors[i].name + "</option>";
  }

  serviceSelect.innerHTML = '<option value="">-- Select a service --</option>';
  for (let i = 0; i < services.length; i++) {
    serviceSelect.innerHTML += '<option value="' + services[i].name + '">' + services[i].name + "</option>";
  }

  timeSelect.innerHTML = '<option value="">-- Select a time --</option>';
  for (let i = 0; i < timeSlots.length; i++) {
    timeSelect.innerHTML += '<option value="' + timeSlots[i] + '">' + timeSlots[i] + "</option>";
  }

  const now = new Date();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  dateInput.min = now.getFullYear() + "-" + month + "-" + day;
}

function showError(fieldId, message) {
  document.getElementById(fieldId + "Error").textContent = message;
}

function validateForm() {
  const errorIds = ["patientName", "patientEmail", "patientPhone", "doctorSelect", "serviceSelect", "appointmentDate", "timeSelect"];
  for (let i = 0; i < errorIds.length; i++) {
    showError(errorIds[i], "");
  }

  let isValid = true;

  const name = document.getElementById("patientName").value.trim();
  const email = document.getElementById("patientEmail").value.trim();
  const phone = document.getElementById("patientPhone").value.trim();

  if (name.length < 3) {
    showError("patientName", "Please enter your full name.");
    isValid = false;
  }

  if (email.indexOf("@") < 1 || email.indexOf(".") === -1) {
    showError("patientEmail", "Please enter a valid email.");
    isValid = false;
  }

  if (phone.length !== 10 || isNaN(phone)) {
    showError("patientPhone", "Phone must be exactly 10 digits.");
    isValid = false;
  }

  if (doctorSelect.value === "") {
    showError("doctorSelect", "Please select a doctor.");
    isValid = false;
  }

  if (serviceSelect.value === "") {
    showError("serviceSelect", "Please select a service.");
    isValid = false;
  }

  if (dateInput.value === "") {
    showError("appointmentDate", "Please choose a date.");
    isValid = false;
  } else if (dateInput.value < dateInput.min) {
    showError("appointmentDate", "You cannot choose a past date.");
    isValid = false;
  }

  if (timeSelect.value === "") {
    showError("timeSelect", "Please select a time.");
    isValid = false;
  }

  return isValid;
}

bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateForm()) {
    formMessage.textContent = "Please fix the highlighted fields.";
    formMessage.className = "message error";
    return;
  }

  const doctorIndex = doctorSelect.value;
  const date = dateInput.value;
  const time = timeSelect.value;

  let isTaken = false;
  for (let i = 0; i < appointments.length; i++) {
    if (appointments[i].doctorIndex === doctorIndex && appointments[i].date === date && appointments[i].time === time) {
      isTaken = true;
    }
  }

  if (isTaken) {
    formMessage.textContent = "Sorry, this time is already booked. Please choose another time.";
    formMessage.className = "message error";
    return;
  }

  const newAppointment = {
    patientName: document.getElementById("patientName").value.trim(),
    doctorIndex: doctorIndex,
    doctorName: doctors[doctorIndex].name,
    service: serviceSelect.value,
    date: date,
    time: time
  };

  appointments.push(newAppointment);
  showAppointments();

  formMessage.textContent = "Appointment confirmed for " + newAppointment.patientName + " on " + date + " at " + time + ".";
  formMessage.className = "message success";

  bookingForm.reset();
});

function showAppointments() {
  appointmentList.innerHTML = "";

  if (appointments.length === 0) {
    appointmentList.innerHTML = "<p>No appointments booked yet.</p>";
    return;
  }

  for (let i = 0; i < appointments.length; i++) {
    const a = appointments[i];
    appointmentList.innerHTML +=
      '<div class="appointment-item">' +
        "<div><strong>" + a.patientName + "</strong> with " + a.doctorName + "<br>" +
        a.service + " | " + a.date + " at " + a.time + "</div>" +
        '<button class="btn cancel-btn" data-index="' + i + '">Cancel</button>' +
      "</div>";
  }

  const cancelButtons = document.querySelectorAll(".cancel-btn");
  for (let i = 0; i < cancelButtons.length; i++) {
    cancelButtons[i].addEventListener("click", cancelAppointment);
  }
}

function cancelAppointment() {
  const index = Number(this.getAttribute("data-index"));
  appointments.splice(index, 1);
  showAppointments();
}

specialtyFilter.addEventListener("change", showDoctors);

fillSpecialtyFilter();
showDoctors();
showServices();
fillBookingForm();
showAppointments();
