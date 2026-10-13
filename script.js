// ============ Ambil elemen ============
const form = document.getElementById("formPinjam");
const inputNama = document.getElementById("nama");
const inputJudul = document.getElementById("judul");
const inputLama = document.getElementById("lama");

const errNama = document.getElementById("errNama");
const errJudul = document.getElementById("errJudul");
const errLama = document.getElementById("errLama");

const BATAS_HARI = 14;

// ============ Fungsi bantu ============
function tampilkanError(input, pesanEl, pesan) {
  input.classList.add("input-error");
  pesanEl.textContent = pesan;
}

function bersihkanError(input, pesanEl) {
  input.classList.remove("input-error");
  pesanEl.textContent = "";
}

// Hapus pesan error saat pengguna mulai mengubah isian
inputNama.addEventListener("input", () => bersihkanError(inputNama, errNama));
inputJudul.addEventListener("change", () => bersihkanError(inputJudul, errJudul));

// Peringatan langsung saat angka melebihi batas
inputLama.addEventListener("input", () => {
  if (Number(inputLama.value) > BATAS_HARI) {
    tampilkanError(inputLama, errLama, "Melebihi batas " + BATAS_HARI + " hari");
  } else {
    bersihkanError(inputLama, errLama);
  }
});

// ============ Validasi saat form dikirim ============
form.addEventListener("submit", function (e) {
  // Selalu cegah submit bawaan browser; keputusan diambil di bawah
  e.preventDefault();

  const nama = inputNama.value.trim();
  const judul = inputJudul.value;
  const lama = Number(inputLama.value);

  // JIKA LAMA PINJAM > 14 -> cegah submit + alert
  if (lama > BATAS_HARI) {
    tampilkanError(inputLama, errLama, "Melebihi batas " + BATAS_HARI + " hari");
    alert("Maksimal peminjaman 14 hari!");
    return;
  }

  // Cek isian kosong
  let valid = true;

  if (nama === "") {
    tampilkanError(inputNama, errNama, "Nama wajib diisi");
    valid = false;
  }
  if (judul === "") {
    tampilkanError(inputJudul, errJudul, "Pilih judul buku");
    valid = false;
  }
  if (inputLama.value === "" || lama < 1) {
    tampilkanError(inputLama, errLama, "Isi lama pinjam minimal 1 hari");
    valid = false;
  }

  if (!valid) return;

  // JIKA DATA VALID -> confirm
  if (confirm("Proses peminjaman?")) {
    // Di sini data bisa dikirim ke server (fetch/AJAX) bila sudah ada backend.
    form.reset();
  }
});