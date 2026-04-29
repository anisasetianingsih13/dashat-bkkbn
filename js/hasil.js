// Fungsi utama untuk memuat hasil dari localStorage yang sudah difilter di masak.js
function loadResults() {
    // Mengambil data yang sudah diproses oleh fungsi olahBahan() di masak.js
    const storedData = localStorage.getItem('hasilFilterResep');
    const container = document.getElementById('resep-grid'); // Sesuaikan dengan ID di hasilresep.html

    // Validasi jika data tidak ditemukan
    if (!storedData || storedData === '[]') {
        if (container) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                    <p style="color: #1a6da3; font-weight: bold; font-size: 1.2rem;">
                        Oops! Tidak ada resep yang cocok.<br>
                        <span style="font-weight: normal; font-size: 0.9rem;">
                            Coba pilih bahan lain ya 😊
                        </span>
                    </p>
                </div>`;
        }
        return;
    }

    const data = JSON.parse(storedData);
    tampilkan(data);
}

// Fungsi untuk merender kartu resep ke dalam HTML
function tampilkan(data) {
    const container = document.getElementById('resep-grid');
    if (!container) return;

    container.innerHTML = data.map(r => `
        <div class="card-resep-biru">
            <img src="${r.image || 'assets/sayur.png'}" 
                 class="img-resep"
                 onerror="this.src='assets/sayur.png'">

            <div class="card-isi">
                <h3>${r.name}</h3>
                <p style="font-size:12px; opacity:0.9;">
                    Kecocokan: ${Math.round(r.score)}%
                </p>

                ${r.kurang && r.kurang.length > 0 
                    ? `<p style="color:#ffd6d6; font-size:12px;">⚠️ Bahan belum lengkap</p>`
                    : `<p style="color:#c8ffc8; font-size:12px;">✅ Bahan lengkap</p>`
                }

                <button class="btn-lihat-resep" onclick="lihatDetail('${r.id}')">
                    Lihat Resep
                </button>
            </div>
        </div>
    `).join('');
}

// Fungsi untuk berpindah ke halaman detail.html
function lihatDetail(id) {
    // Menyimpan ID spesifik yang dipilih agar bisa dibaca di detail.js
    localStorage.setItem('detailResepId', id);
    window.location.href = 'detail.html';
}

// Jalankan fungsi saat script dimuat
document.addEventListener('DOMContentLoaded', loadResults);