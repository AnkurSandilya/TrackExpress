const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

const regId = document.getElementById("regId");
const regPass = document.getElementById("regPass");
const regMsg = document.getElementById("regMsg");

const loginId = document.getElementById("loginId");
const loginPass = document.getElementById("loginPass");
const loginMsg = document.getElementById("loginMsg");

function showRegister() {
  loginSection.style.display = "none";
  registerSection.style.display = "block";
}

function showLogin() {
  registerSection.style.display = "none";
  loginSection.style.display = "block";
}


// ================= REGISTER =================
async function register() {

  const id = regId.value.trim();
  const pass = regPass.value.trim();

  if (!id || !pass) {
    regMsg.style.color = "red";
    regMsg.innerText = "Please fill all fields";
    return;
  }

  try {

    const res = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: id,
        password: pass
      })
    });

    const data = await res.json();

    if (data.success) {

      regMsg.style.color = "green";
      regMsg.innerText = "Account created! Redirecting to login...";

      regId.value = "";
      regPass.value = "";

      setTimeout(() => {
        showLogin();
        regMsg.innerText = "";
      }, 1500);

    } else {

      regMsg.style.color = "red";
      regMsg.innerText = data.message || "Registration failed";

    }

  } catch (error) {

    regMsg.style.color = "red";
    regMsg.innerText = "Server not connected";

  }
}


// ================= LOGIN =================
async function login() {

  const id = loginId.value.trim();
  const pass = loginPass.value.trim();

  if (!id || !pass) {
    loginMsg.style.color = "red";
    loginMsg.innerText = "Please fill all fields";
    return;
  }

  try {

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: id,
        password: pass
      })
    });

    const data = await res.json();

    if (data.success) {

      loginMsg.style.color = "green";
      loginMsg.innerText = "Login successful!";

      localStorage.setItem("user", id);

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);

    } else {

      loginMsg.style.color = "red";
      loginMsg.innerText = data.message || "Invalid login";

    }

  } catch (error) {

    loginMsg.style.color = "red";
    loginMsg.innerText = "Server not connected";

  }
}


// ================= TRACK PARCEL (for index.html UI) =================
async function trackParcel() {
  const id = document.getElementById("tracking").value.trim();

  if (!id) {
    alert("Please enter Tracking ID");
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/track/${id}`);
    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    const parcel = data.parcel;

    document.getElementById("status").innerText = parcel.status;
    document.getElementById("date").innerText =
      "Expected Delivery: " + parcel.expectedDeliveryDate;
    document.getElementById("location").innerText =
      "Current Location: " + parcel.currentLocation;

    document.getElementById("result").style.display = "block";

  } catch (err) {
    console.error(err);
    alert("Server not connected");
  }
}
