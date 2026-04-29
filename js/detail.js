document.addEventListener('DOMContentLoaded', async () => {
    // 1. Ambil ID resep yang disimpan dari halaman sebelumnya
    const recipeId = localStorage.getItem('detailResepId');
    const container = document.getElementById('detail-resep-container'); 

    if (!recipeId) {
        window.location.href = 'masak.html';
        return;
    }

    try {
        // 2. Ambil data hasil filter untuk mendeteksi bahan apa saja yang kurang
        const filteredData = JSON.parse(localStorage.getItem('hasilFilterResep')) || [];
        const resepTerfilter = filteredData.find(r => String(r.id) === String(recipeId));

        // 3. Ambil data asli dari file JSON
        const res = await fetch('data/recipes.json');
        const recipes = await res.json();

        // 4. Cari resep yang cocok berdasarkan ID
        const resepAsli = recipes.find(r => String(r.id) === String(recipeId));

        if (resepAsli) {
            // Render halaman dengan data asli dan daftar bahan kurang
            renderDetail(resepAsli, resepTerfilter ? resepTerfilter.kurang : []);
        } else {
            container.innerHTML = "<h2>Resep tidak ditemukan.</h2>";
        }
    } catch (error) {
        console.error("Gagal memuat detail:", error);
    }
});

function renderDetail(resep, bahanKurang = []) {
    const container = document.getElementById('detail-resep-container');
    const n = resep.nutrition;

    // Logika tampilan kotak peringatan bahan yang kurang
    const alertKurang = bahanKurang.length > 0 
        ? `<div style="background: #fff3cd; border-left: 5px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <strong style="color: #856404; font-size: 14px;">⚠️ BAHAN YANG BELUM ADA:</strong><br>
            <span style="color: #856404; font-size: 14px;">${bahanKurang.join(', ')}</span>
           </div>`
        : `<div style="background: #d4edda; border-left: 5px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <strong style="color: #155724; font-size: 14px;">✅ Semua bahan sudah lengkap!</strong>
           </div>`;

    container.innerHTML = `
        <div class="card-detail">
            <img src="${resep.image || 'assets/sayur.png'}" class="img-detail-full" onerror="this.src='assets/sayur.png'">
            
            <div class="content-detail">
                <h1>${resep.name}</h1>
                
                <h3 style="color: #1a6da3; margin-top: 25px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Informasi Nilai Gizi</h3>
                
                <div class="nutrition-table">
                    <div class="nutri-row"><span>Energi Total</span> <strong>${n.energi || '-'}</strong></div>
                    <div class="nutri-row"><span>Lemak Total</span> <strong>${n.lemak || '-'}</strong></div>
                    <div class="nutri-row"><span>Protein</span> <strong>${n.protein || '-'}</strong></div>
                    <div class="nutri-row"><span>Karbohidrat</span> <strong>${n.karbohidrat || '-'}</strong></div>
                    <div class="nutri-row"><span>Serat Pangan</span> <strong>${n.serat || '-'}</strong></div>
                </div>

                <div class="vitamin-grid">
                    <div class="vit-item">Vit A <span>${n.vitA || '-'}</span></div>
                    <div class="vit-item">Vit C <span>${n.vitC || '-'}</span></div>
                    <div class="vit-item">Vit D <span>${n.vitD || '-'}</span></div>
                    <div class="vit-item">Zat Besi <span>${n.zatBesi || '-'}</span></div>
                    <div class="vit-item">Kalsium <span>${n.kalsium || '-'}</span></div>
                    <div class="vit-item">Iodium <span>${n.iodium || '-'}</span></div>
                </div>

                ${alertKurang}

                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">

                <div class="recipe-lists">
                    <h3 style="color: #1a6da3;">Bahan Utama:</h3>
                    <ul class="list-bahan" style="list-style-type: disc; padding-left: 20px; margin-bottom: 20px;">
                        ${resep.ingredients.map(ing => `
                            <li>${typeof ing === 'object' ? ing.tampilan : ing}</li>
                        `).join('')}
                    </ul>

                    ${resep.spices ? `
                        <h3 style="color: #1a6da3;">Bumbu & Pelengkap:</h3>
                        <ul class="list-bahan" style="list-style-type: disc; padding-left: 20px; margin-bottom: 20px;">
                            ${resep.spices.map(spc => `<li>${spc}</li>`).join('')}
                        </ul>
                    ` : ''}

                    <h3 style="color: #1a6da3;">Cara Memasak:</h3>
                    <ol class="list-langkah" style="padding-left: 20px; line-height: 1.6;">
                        ${resep.steps.map(step => `<li style="margin-bottom: 10px;">${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>
    `;
}