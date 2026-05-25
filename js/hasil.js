// Fungsi utama untuk memuat hasil dari localStorage yang sudah difilter di masak.js
function loadResults() {

    const storedData = localStorage.getItem('hasilFilterResep');
    const container = document.getElementById('resep-grid');

    // jika tidak ada data sama sekali
    if (!storedData || storedData === '[]') {
        if (container) {
            container.innerHTML = `
                <div class="card-kosong">

                    <div class="icon-kosong">🍲</div>

                    <h2>Menu Belum Tersedia</h2>

                    <p>
                        Maaf, belum ada resep yang cocok
                        dengan bahan yang kamu pilih.
                    </p>

                    <p class="subtext">
                        Coba pilih bahan lain ya 😊
                    </p>

                </div>
            `;
        }
        return;
    }

    const data = JSON.parse(storedData);

    // ambil status apakah ada resep 100%
    const ada100 = JSON.parse(
        localStorage.getItem('adaResep100')
    );

    tampilkan(data, ada100);
}

// Fungsi untuk merender kartu resep ke dalam HTML
function tampilkan(data, ada100) {

    const container = document.getElementById('resep-grid');
    if (!container) return;

    container.innerHTML = `

    ${!ada100 ? `
        <div class="card-info-kecocokan">

            <h3>🍲 Menu 100% Belum Tersedia</h3>

            <p>
                Kami belum bisa menyediakan menu makanan
                yang <strong>100% cocok</strong> dengan
                bahan yang kamu miliki.
            </p>

            <p>
                Tetapi kamu bisa mencoba menu-menu
                di bawah ini 😊
            </p>

        </div>
    ` : ''}

    ` + data.map(r => `
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

                <button
                    class="btn-lihat-resep"
                    onclick="lihatDetail('${r.id}')">
                    Lihat Resep
                </button>

            </div>
        </div>
    `).join('');
}

// Fungsi untuk berpindah ke halaman detail.html
function lihatDetail(id) {

    localStorage.setItem('detailResepId', id);
    window.location.href = 'detail.html';
}

// Jalankan fungsi saat script dimuat
document.addEventListener(
    'DOMContentLoaded',
    loadResults
);
