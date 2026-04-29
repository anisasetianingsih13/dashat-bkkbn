function showInfo(type) {
  const info = {
    hamil: {
      title: "Ibu Hamil",
      text: "Ibu hamil membutuhkan makanan tinggi protein, zat besi, dan asam folat."
    },
    balita: {
      title: "Balita",
      text: "Balita membutuhkan makanan bergizi untuk mencegah stunting."
    },
    menyusui: {
      title: "Ibu Menyusui",
      text: "Ibu menyusui membutuhkan kalori dan protein lebih."
    },
    caten: {
      title: "Calon Pengantin",
      text: "Calon pengantin harus mempersiapkan gizi sebelum menikah."
    }
  };

  document.getElementById("infoBox").innerHTML = `
    <h3>${info[type].title}</h3>
    <p>${info[type].text}</p>
  `;
}