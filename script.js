const nameInput = document.getElementById('nameInput');
const guestNameSpan = document.getElementById('guestName');
const letterContainer = document.getElementById('letterContainer');
const downloadBtn = document.getElementById('downloadBtn');
const colorPicker = document.getElementById('colorPicker');
const sizeSlider = document.getElementById('sizeSlider');
const posXSlider = document.getElementById('posXSlider');
const posYSlider = document.getElementById('posYSlider');

const currentSizeSpan = document.getElementById('currentSize');
const currentXSpan = document.getElementById('currentX');
const currentYSpan = document.getElementById('currentY');


// ฟังก์ชันอัปเดตชื่อเมื่อมีการพิมพ์
function updateName() {
    let name = nameInput.value.trim();
    
    if (name) {
        // เพิ่มเครื่องหมายจุลภาคและวรรค
        guestNameSpan.textContent = name + ','; 
        guestNameSpan.classList.add('visible'); 
        downloadBtn.disabled = false;
        // บังคับให้แสดงสไตล์ด้วยทันที
        updateStyle(); 
    } else {
        guestNameSpan.textContent = '[ชื่อ],';
        guestNameSpan.classList.remove('visible');
        downloadBtn.disabled = true;
    }
}


// ฟังก์ชันอัปเดตสไตล์ทั้งหมด (สี, ขนาด, ตำแหน่ง X และ Y)
function updateStyle() {
    // 1. อัปเดตสีและขนาด
    const newColor = colorPicker.value;
    const newSize = sizeSlider.value + 'px';
    
    guestNameSpan.style.color = newColor;
    guestNameSpan.style.fontSize = newSize;
    currentSizeSpan.textContent = newSize;

    // 2. อัปเดตตำแหน่ง X และ Y (ใช้ค่า % จาก Slider)
    const newPosX = posXSlider.value + '%';
    const newPosY = posYSlider.value + '%';
    
    guestNameSpan.style.left = newPosX;
    guestNameSpan.style.top = newPosY;
    currentXSpan.textContent = newPosX;
    currentYSpan.textContent = newPosY;
}


// ฟังก์ชันดาวน์โหลด (ใช้ html2canvas)
function downloadLetter() {
    // ซ่อน Control Panel, ปุ่มดาวน์โหลด, และ h1 ก่อนแปลงเป็นภาพ
    const containerChildren = document.querySelector('.container').children;
    const elementsToHide = [];
    
    // ซ่อนทุกอย่างยกเว้น letterContainer
    Array.from(containerChildren).forEach(child => {
        if (child.id !== 'letterContainer') {
            elementsToHide.push({element: child, display: child.style.display});
            child.style.display = 'none';
        }
    });

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
        elementsToHide.forEach(item => {
            item.element.style.display = item.display;
        });

    }).catch(error => {
        console.error('Download failed:', error);
        alert('ไม่สามารถดาวน์โหลดภาพได้');

        // คืนค่าการแสดงผลในกรณีเกิดข้อผิดพลาด
        elementsToHide.forEach(item => {
            item.element.style.display = item.display;
        });
    });
}

// เรียกใช้ฟังก์ชันสไตล์เริ่มต้นเมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', () => {
    // กำหนดค่าเริ่มต้นให้กับ element และเรียกใช้ updateStyle ทันที
    updateStyle();
    updateName();
});
