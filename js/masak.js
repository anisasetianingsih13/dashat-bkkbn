// ================= AMBIL DATA RESEP =================
async function getRecipes() {
  try {
    const res = await fetch('./data/recipes.json'); // ✅ FIX PATH

    console.log("Status fetch:", res.status);

    if (!res.ok) {
      throw new Error("File recipes.json tidak ditemukan (404)");
    }

    const data = await res.json();
    console.log("Isi recipes:", data);

    return data;

  } catch (error) {
    console.error("ERROR FETCH:", error);
    alert("Gagal mengambil data resep! Pastikan pakai Live Server & path benar.");
    return [];
  }
}

// ================= AMBIL BAHAN YANG DICENTANG =================
function getSelectedIngredients() {
  return Array.from(document.querySelectorAll('.ingredient-cb:checked'))
    .map(cb => cb.value.toLowerCase()); // ✅ pakai value
}

// ================= PROSES OLAH BAHAN =================
async function olahBahan() {
  try {
    const dipilih = getSelectedIngredients();
    console.log("Bahan dipilih:", dipilih);

    // 🔔 validasi
    if (dipilih.length === 0) {
      alert("Pilih minimal 1 bahan dulu!");
      return;
    }

    const recipes = await getRecipes();

    if (recipes.length === 0) {
      alert("Data resep kosong atau gagal dibaca!");
      return;
    }

    const hasil = recipes.map(resep => {
      // ✅ PERBAIKAN: Menangani data bahan yang kini berbentuk Objek
      const cocok = resep.ingredients.filter(ing => {
        // Ambil properti .nama jika ing adalah objek, jika string ambil langsung
        const namaBahan = typeof ing === 'object' ? ing.nama : ing;
        return dipilih.includes(namaBahan.toLowerCase());
      });

      const kurang = resep.ingredients
        .filter(ing => {
          const namaBahan = typeof ing === 'object' ? ing.nama : ing;
          return !dipilih.includes(namaBahan.toLowerCase());
        })
        .map(ing => typeof ing === 'object' ? ing.nama : ing); // Ambil nama string-nya saja

      const score = (cocok.length / resep.ingredients.length) * 100;

      return {
        ...resep,
        cocok,
        kurang,
        score
      };
    })
    // 🔔 Hanya tampilkan resep dengan kecocokan 50% ke atas
.filter(r => r.cocok.length > 0)
.sort((a, b) => b.score - a.score);

    console.log("HASIL FILTER:", hasil);
    
    // cek apakah ada resep 100%
const adaSeratus = hasil.some(r => r.score === 100);

// simpan status ke localStorage
localStorage.setItem(
  'adaResep100',
  JSON.stringify(adaSeratus)
);

    // jika tidak ada resep ≥50%
if (hasil.length === 0) {

  localStorage.setItem(
    'hasilFilterResep',
    JSON.stringify([])
  );

  window.location.href = 'hasilresep.html';
  return;
}

    // simpan ke localStorage
    localStorage.setItem('hasilFilterResep', JSON.stringify(hasil));

    // pindah halaman
    window.location.href = 'hasilresep.html';

  } catch (error) {
    console.error("ERROR OLAH:", error);
    alert("Terjadi error, cek console!");
  }
}

// ================= TOMBOL MUNCUL =================
document.addEventListener('DOMContentLoaded', function () {
  const tombol = document.getElementById('btn-olah');
  const checkboxes = document.querySelectorAll('.ingredient-cb');

  if (checkboxes.length > 0 && tombol) {
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const ada = Array.from(checkboxes).some(c => c.checked);
        tombol.style.display = ada ? 'inline-block' : 'none';
      });
    });
  }
});
