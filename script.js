
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('nav-active');
}


async function fetchDroneData() {
    // แสดงหน้าโหลด
    document.getElementById('loading').style.display = 'flex';

    try {
        const response = await fetch('https://server-api-vert.vercel.app/configs/65011086');

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        console.log('Received data:', data); // แสดงข้อมูลที่ได้รับทั้งหมด

        // ตรวจสอบว่า data เป็น array
        if (Array.isArray(data)) {
            if (data.length === 0) {
                console.error('Received an empty array');
                displayNoDataMessage(); // แสดงข้อความหากไม่มีข้อมูล
            } else {
                displayDroneData(data); // แสดงข้อมูลทั้งหมด
            }
        } else {
            console.error('Data is not an array:', data);
            displayNoDataMessage(); // แสดงข้อความหากไม่มีข้อมูล
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        displayNoDataMessage(); // แสดงข้อความหากเกิดข้อผิดพลาด
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}


function displayDroneData(droneItems) {
    const tableBody = document.getElementById('drone-table').querySelector('tbody');
    tableBody.innerHTML = ''; // เคลียร์ข้อมูลที่มีอยู่

    droneItems.forEach(drone => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${drone.drone_id || 'N/A'}</td>
            <td>${drone.drone_name || 'N/A'}</td>
            <td>${drone.light || 'N/A'}</td> 
            <td>${drone.max_speed || 'N/A'}</td> <!-- แสดงค่า max_speed ตามที่ได้รับจากเซิร์ฟเวอร์ -->
            <td>${drone.country || 'N/A'}</td>
            <td>${drone.population || 'N/A'}</td>
        `;
        tableBody.appendChild(row);
    });
}

function displayNoDataMessage() {
    const tableBody = document.getElementById('drone-table').querySelector('tbody');
    tableBody.innerHTML = '<tr><td colspan="6">No data available for this drone ID.</td></tr>';
}

// เรียกใช้ฟังก์ชันเมื่อโหลดหน้า
window.onload = fetchDroneData;
var modal = document.getElementById("myModal");
var modal2 = document.getElementById("myModal2");
// Get the button that opens the modal
var btn = document.getElementById("droneconfig");
var btn2 = document.getElementById("temlog");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close2")[0];
// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}
btn2.onclick = function() {
    modal2.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
    modal2.style.display = "none";
}
span2.onclick = function() {
    modal.style.display = "none";
    modal2.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal || event.target == modal2) {
        modal.style.display = "none";
        modal2.style.display = "none";
    }
}
// Tem logs //
document.getElementById('temperatureForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const droneId = document.getElementById('droneId').value;
    const temperature = document.getElementById('temperature').value;

    // ข้อมูลที่จะส่ง
    const data = {
        drone_id: droneId,
        celsius: temperature,
        country: "Thailand",
        drone_name: "Jerine S."
    };

    // แสดงหน้าโหลด
    showLoading(true);

    // ส่งข้อมูลไปยัง API ที่เซิร์ฟเวอร์ของคุณ
    fetch('https://server-api-vert.vercel.app/log', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // แปลงข้อมูลเป็น JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // ตอบกลับเป็น JSON
    })
    .then(data => {
        displaySuccessMessage('Temperature updated successfully!');
        setTimeout(() => {
            location.reload();
        }, 2000);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        alert(`Error: ${error.message}`);
    })
    .finally(() => {
        showLoading(false);
    });
});

// ฟังก์ชันสำหรับแสดง/ซ่อนหน้าโหลด
function showLoading(isLoading) {
    document.getElementById('loading').style.display = isLoading ? 'flex' : 'none';
}

// ฟังก์ชันแสดงข้อความสำเร็จ
function displaySuccessMessage(message) {
    const messageContainer = document.getElementById('messageContainer');
    const messageBox = document.createElement('div');
    messageBox.innerText = message;
    messageBox.className = 'success-message';
    messageContainer.appendChild(messageBox);

    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}
