const nameInput = document.getElementById('nameInput');
const guestNameSpan = document.getElementById('guestName');
const letterContainer = document.getElementById('letterContainer');
const downloadBtn = document.getElementById('downloadBtn');
const colorPicker = document.getElementById('colorPicker');
const sizeSlider = document.getElementById('sizeSlider');
const currentSizeSpan = document.getElementById('currentSize');

// ฟังก์ชันอัปเดตชื่อเมื่อมีการพิมพ์
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
        guestNameSpan.textContent = '[ชื่อของคุณ],';
        guestNameSpan.classList.remove('visible');
        downloadBtn.disabled = true;
    }
}

// ฟังก์ชันอัปเดตสไตล์ (สีและขนาด)
function updateStyle() {
    const newColor = colorPicker.value;
    const newSize = sizeSlider.value + 'px';
    
    guestNameSpan.style.color = newColor;
    guestNameSpan.style.fontSize = newSize;
    currentSizeSpan.textContent = newSize;
}


// ********* ฟังก์ชัน Drag and Drop (ลากและวาง) *********
let isDragging = false;
let startX, startY, initialX, initialY;

guestNameSpan.addEventListener('mousedown', (e) => {
    isDragging = true;
    // ป้องกันการลากภาพเดิม
    e.preventDefault(); 
    
    // ตำแหน่งเริ่มต้นของการคลิกเมาส์
    startX = e.clientX;
    startY = e.clientY;

    // ตำแหน่งเริ่มต้นของ element (ใช้ค่า pixel จาก style)
    initialX = parseFloat(guestNameSpan.style.left) * letterContainer.offsetWidth / 100;
    initialY = parseFloat(guestNameSpan.style.top) * letterContainer.offsetHeight / 100;

    guestNameSpan.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    // คำนวณระยะการเคลื่อนที่
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // คำนวณตำแหน่งใหม่ (เป็นเปอร์เซ็นต์เพื่อความยืดหยุ่น)
    const newX = (initialX + dx) / letterContainer.offsetWidth * 100;
    const newY = (initialY + dy) / letterContainer.offsetHeight * 100;
    
    // จำกัดไม่ให้ข้อความออกนอกขอบของ letterContainer (อย่างง่าย)
    if (newX >= 0 && newX <= 100) {
        guestNameSpan.style.left = newX + '%';
    }
    if (newY >= 0 && newY <= 100) {
        guestNameSpan.style.top = newY + '%';
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        guestNameSpan.style.cursor = 'move';
    }
});
// *************************************************

// ฟังก์ชันดาวน์โหลด (ใช้ html2canvas เหมือนเดิม)
function downloadLetter() {
    // ซ่อน Control Panel และปุ่มดาวน์โหลดก่อนแปลงเป็นภาพ
    const controlPanel = document.querySelector('.control-panel');
    const h1 = document.querySelector('h1');
    
    controlPanel.style.display = 'none';
    downloadBtn.style.display = 'none';
    h1.style.display = 'none';
    
    // ปิด cursor: move และ user-select: none ชั่วคราวเพื่อให้ภาพไม่ติดสไตล์นี้
    guestNameSpan.style.cursor = 'default';
    guestNameSpan.style.userSelect = 'auto';


    // ใช้ html2canvas แปลงส่วนของจดหมายเป็น Canvas
    html2canvas(letterContainer, {
        allowTaint: true, 
        useCORS: true,
        scale: 3 // เพิ่ม Scale ให้ภาพคมชัดยิ่งขึ้น
    }).then(function(canvas) {
        // สร้างลิงก์สำหรับดาวน์โหลด
        const link = document.createElement('a');
        link.download = `Invitation-${nameInput.value || 'Guest'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // คืนค่าการแสดงผล
        controlPanel.style.display = 'block';
        downloadBtn.style.display = 'block';
        h1.style.display = 'block';
        
        // คืนค่า cursor และ user-select
        guestNameSpan.style.cursor = 'move';
        guestNameSpan.style.userSelect = 'none';

    }).catch(error => {
        console.error('Download failed:', error);
        alert('ไม่สามารถดาวน์โหลดภาพได้');

        // คืนค่าการแสดงผลในกรณีเกิดข้อผิดพลาด
        controlPanel.style.display = 'block';
        downloadBtn.style.display = 'block';
        h1.style.display = 'block';
        guestNameSpan.style.cursor = 'move';
        guestNameSpan.style.userSelect = 'none';
    });
}

// เรียกใช้ฟังก์ชันสไตล์เริ่มต้นเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
    updateStyle();
    updateName();
});
