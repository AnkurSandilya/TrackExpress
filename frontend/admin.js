// ================= ADD PARCEL =================
async function addParcel() {
  const btn = event.target;

  const parcel = {
    trackingId: document.getElementById("trackingId").value.trim(),
    senderName: document.getElementById("sender").value.trim(),
    receiverName: document.getElementById("receiver").value.trim(),
    originCity: document.getElementById("origin").value.trim(),
    destinationCity: document.getElementById("destination").value.trim(),
    transitHubs: document.getElementById("transit").value
      .split(",")
      .map(s => s.trim()),
    currentLocation: document.getElementById("origin").value.trim(),
    status: "Booked",
    expectedDeliveryDate: document.getElementById("expectedDate").value.trim(),
    history: [
      {
        location: document.getElementById("origin").value.trim(),
        status: "Booked",
        time: new Date().toISOString().split("T")[0]
      }
    ]
  };

  try {
    const res = await fetch("http://localhost:5000/admin/add-parcel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(parcel)
    });

    const data = await res.json();

    if (data.success) {
      btn.style.background = "green";
      btn.innerText = "Parcel Added ✔";
      document.getElementById("msg").innerText = data.message;

      loadParcels(); // refresh dashboard
    } else {
      btn.style.background = "red";
      btn.innerText = "Failed ✖";
      document.getElementById("msg").innerText = data.message;
    }

  } catch (err) {
    console.error(err);
    btn.style.background = "red";
    btn.innerText = "Server Error ✖";
  }
}


// ================= UPDATE STATUS =================
async function updateStatus() {
  const btn = event.target;

  const payload = {
    trackingId: document.getElementById("updateId").value.trim(),
    location: document.getElementById("newLocation").value.trim(),
    status: document.getElementById("newStatus").value.trim(),
    time: document.getElementById("updateTime").value.trim()
  };

  try {
    const res = await fetch("http://localhost:5000/admin/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      btn.style.background = "green";
      btn.innerText = "Updated ✔";
      document.getElementById("msg").innerText = data.message;

      loadParcels(); // refresh dashboard
    } else {
      btn.style.background = "red";
      btn.innerText = "Failed ✖";
      document.getElementById("msg").innerText = data.message;
    }

  } catch (err) {
    console.error(err);
    btn.style.background = "red";
    btn.innerText = "Server Error ✖";
  }
}


// ================= LOAD ALL PARCELS (TABLE) =================
async function loadParcels() {
  try {
    const res = await fetch("http://localhost:5000/admin/parcels");
    const data = await res.json();

    if (!data.success) return;

    const tbody = document.querySelector("#parcelTable tbody");
    tbody.innerHTML = "";

    data.parcels.forEach(p => {
      // Convert status to CSS-friendly class
      const statusClass = p.status.toLowerCase().replace(/\s+/g, "-");

      const row = `
        <tr>
          <td>${p.trackingId}</td>
          <td>${p.originCity} → ${p.destinationCity}</td>
          <td>
            <span class="badge ${statusClass}">
              ${p.status}
            </span>
          </td>
          <td>${p.currentLocation}</td>
          <td>
            <button onclick="fillUpdate('${p.trackingId}')">
              Update
            </button>
          </td>
        </tr>
      `;

      tbody.innerHTML += row;
    });

  } catch (err) {
    console.error(err);
  }
}


// ================= FILL UPDATE FORM =================
function fillUpdate(id) {
  document.getElementById("updateId").value = id;
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}


// ================= LOAD DASHBOARD ON PAGE OPEN =================
window.onload = loadParcels;
