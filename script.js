const nameInput = document.getElementById('nameInput');
const guestNameSpan = document.getElementById('guestName');
const letterContainer = document.getElementById('letterContainer');
const downloadBtn = document.getElementById('downloadBtn');

function updateName() {
    let name = nameInput.value.trim();
    
    if (name) {
        // เพิ่มเครื่องหมายจุลภาคและวรรค
        guestNameSpan.textContent = name + ','; 
        // ทำให้ข้อความปรากฏ
        guestNameSpan.classList.add('visible'); 
        // เปิดใช้งานปุ่มดาวน์โหลด
        downloadBtn.disabled = false;
    } else {
        guestNameSpan.textContent = '';
        guestNameSpan.classList.remove('visible');
        downloadBtn.disabled = true;
        alert('กรุณากรอกชื่อก่อน');
    }
}

function downloadLetter() {
    // ซ่อนปุ่มและช่องป้อนข้อมูลทั้งหมดก่อนที่จะแปลงเป็นภาพ
    const container = document.querySelector('.container');
    const originalDisplay = [];
    
    // ซ่อนทุกอย่างยกเว้น letterContainer
    Array.from(container.children).forEach(child => {
        if (child.id !== 'letterContainer') {
            originalDisplay.push({element: child, display: child.style.display});
            child.style.display = 'none';
        }
    });

    // ใช้ html2canvas แปลงส่วนของจดหมายเป็น Canvas
    html2canvas(letterContainer, {
        allowTaint: true, // อนุญาตให้ใช้ภาพจากภายนอก (หากใช้ภาพจาก CDN) แต่เนื่องจากภาพอยู่ในโฟลเดอร์เดียวกัน จึงไม่น่ามีปัญหา CORS
        useCORS: true,
        scale: 2 // เพิ่มความละเอียดเป็นสองเท่าเพื่อให้ภาพที่ดาวน์โหลดคมชัด
    }).then(function(canvas) {
        // สร้างลิงก์สำหรับดาวน์โหลด
        const link = document.createElement('a');
        link.download = `Invitation-${nameInput.value || 'Guest'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // คืนค่าการแสดงผลของปุ่มและช่องป้อนข้อมูล
        originalDisplay.forEach(item => {
            item.element.style.display = item.display;
        });
        
    }).catch(error => {
        // คืนค่าการแสดงผลในกรณีเกิดข้อผิดพลาดด้วย
        originalDisplay.forEach(item => {
            item.element.style.display = item.display;
        });
        console.error('Download failed:', error);
        alert('ไม่สามารถดาวน์โหลดภาพได้');
    });
}
