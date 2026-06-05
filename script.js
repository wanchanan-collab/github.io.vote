// จัดการเมื่อผู้ใช้กดปุ่ม "เริ่มลงคะแนนเสียง"
document.getElementById('startVotingBtn').addEventListener('click', function() {
    document.getElementById('preElectionModal').style.display = 'none'; // ซ่อนหน้าโปสเตอร์
    document.getElementById('votingPage').style.display = 'flex'; // แสดงหน้าต่างโหวต
});

// จัดการเมื่อผู้ใช้กดปุ่ม "เริ่มการโหวต" (ในหน้าสำเร็จ)
document.getElementById('restartBtn').addEventListener('click', function() {
    location.reload(); // รีเฟรชหน้าจอใหม่ทั้งหมดเพื่อเริ่มโหวตคนถัดไป
});

// URL ของ Google Apps Script ที่ได้จากการ Deploy
const scriptURL = 'https://script.google.com/macros/s/AKfycbysq9NrukcjXY4PSxaTg8LGq_SjMinG7JAaoXu7Zrljkd5OQlemKX_0XGs-osOgbPj6/exec';

// ฟังก์ชันส่งข้อมูลการโหวตเป็นคะแนน
function vote(choice) {
    // ป้องกันการกดซ้ำและแสดงสถานะกำลังประมวลผล
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.classList.contains('vote-button') || btn.id === 'abstainVoteBtn') {
            btn.innerText = "กำลังบันทึกคะแนน...";
        }
    });

    fetch(scriptURL, {
        method: 'POST',
        mode: 'cors', 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ 'choice': choice })
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        // ซ่อนหน้าโหวต และแสดงหน้าโหวตสำเร็จ
        document.getElementById('votingPage').style.display = 'none';
        document.getElementById('successModal').style.display = 'flex';
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    })
    .finally(() => {
        // คืนค่าสถานะปุ่ม (เฉพาะกรณีที่เกิดข้อผิดพลาดและต้องกดใหม่)
        buttons.forEach(btn => {
            btn.disabled = false;
            if (btn.classList.contains('vote-button')) {
                // คืนค่าข้อความตามลำดับเบอร์ที่ถูกต้อง
                if (btn.closest('.candidate-1')) {
                    btn.innerText = "ลงคะแนน เบอร์ 1";
                } else if (btn.closest('.candidate-2')) {
                    btn.innerText = "ลงคะแนน เบอร์ 2";
                }
            } else if (btn.id === 'abstainVoteBtn') {
                btn.innerText = "ไม่ประสงค์ลงคะแนน";
            }
        });

        // ล้างสถานะการเลือก (Focus) ของปุ่ม
        if (document.activeElement) {
            document.activeElement.blur();
        }
    });
}