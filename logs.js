async function fetchLogs() {
    const droneId = "65011086"; 
    const logsUrl = 'https://server-api-vert.vercel.app/logs';

    // หน้าโหลด
    document.getElementById('loading').style.display = 'flex';

    try {
        // ดึงข้อมูลจาก API
        const response = await fetch(logsUrl);
        if (!response.ok) {
            console.error("Network response was not ok", response.status);
            return;
        }

        const data = await response.json();
        console.log("Raw data from API:", data); // ดูข้อมูลที่ดึงมา

        // ตรวจสอบว่ามี items หรือไม่
        if (!Array.isArray(data)) { // ตรวจสอบว่าเป็นอาร์เรย์หรือไม่
            console.error("No items found or items is not an array", data); // แสดงข้อมูลที่ได้รับ
            document.getElementById('noLogsMessage').style.display = 'block'; // แสดงข้อความเมื่อไม่มีข้อมูล
            return;
        }

        // กรอง logs ตาม drone_id 
        const logs = data.filter(log => log.drone_id && log.drone_id.toString() === droneId);
        const logsBody = document.getElementById('logsBody');
        logsBody.innerHTML = ''; // ล้างข้อมูลในตารางก่อน

        if (logs.length === 0) {
            document.getElementById('noLogsMessage').style.display = 'block'; // แสดงข้อความเมื่อไม่มี logs
        } else {
            // เรียง logs ใหม่ที่สุดอยู่บนสุด
            logs.sort((a, b) => new Date(b.created) - new Date(a.created));
            logs.forEach(log => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${log.created}</td>
                    <td>${log.country || "N/A"}</td>
                    <td>${log.drone_id}</td>
                    <td>${log.drone_name || "N/A"}</td>
                    <td>${log.celsius}</td>
                `;
                logsBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

window.onload = fetchLogs;
