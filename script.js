// ============ Ambil elemen ============
const form = document.getElementById("formPinjam");
const inputNama = document.getElementById("nama");
const inputJudul = document.getElementById("judul");
const inputLama = document.getElementById("lama");

const errNama = document.getElementById("errNama");
const errJudul = document.getElementById("errJudul");
const errLama = document.getElementById("errLama");

// Elemen pop notifikasi
const dialog = document.getElementById("dialogNotif");
const notifIkon = document.getElementById("notifIkon");
const notifJudul = document.getElementById("notifJudul");
const notifPesan = document.getElementById("notifPesan");
const notifDetail = document.getElementById("notifDetail");
const notifBatal = document.getElementById("notifBatal");
const notifOk = document.getElementById("notifOk");

const BATAS_HARI = 14;

// ============ Ikon pop notifikasi ============
const SVG_AWAL =
  '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';

const IKON = {
  peringatan:
    SVG_AWAL +
    '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>' +
    '<line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  konfirmasi:
    SVG_AWAL +
    '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/>' +
    '<line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  sukses:
    SVG_AWAL +
    '<path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
};

// ============ Fungsi bantu: error di bawah kolom ============
function tampilkanError(input, pesanEl, pesan) {
  input.classList.add("input-error");
  pesanEl.textContent = pesan;
}

function bersihkanError(input, pesanEl) {
  input.classList.remove("input-error");
  pesanEl.textContent = "";
}

// ============ Fungsi bantu: pop notifikasi ============
// Mengembalikan Promise: true jika menekan OK, false jika Batal / Esc / klik luar.
function tampilkanNotif({ jenis, judul, pesan, detail = "", tampilBatal = false }) {
  return new Promise((selesai) => {
    dialog.dataset.jenis = jenis;
    notifIkon.innerHTML = IKON[jenis];
    notifJudul.textContent = judul;
    notifPesan.textContent = pesan;
    notifDetail.textContent = detail;
    notifBatal.hidden = !tampilBatal;

    function tutup(hasil) {
      dialog.close();
      selesai(hasil);
    }

    notifOk.onclick = () => tutup(true);
    notifBatal.onclick = () => tutup(false);
    dialog.oncancel = (e) => { e.preventDefault(); tutup(false); };   // tombol Esc
    dialog.onclick = (e) => { if (e.target === dialog) tutup(false); }; // klik area gelap

    dialog.showModal();
    notifOk.focus();
  });
}

// ============ Hapus error saat pengguna mengubah isian ============
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
form.addEventListener("submit", async function (e) {
  // Selalu cegah submit bawaan browser; keputusan diambil di bawah
  e.preventDefault();

  const nama = inputNama.value.trim();
  const judul = inputJudul.value;
  const lama = Number(inputLama.value);

  // JIKA LAMA PINJAM > 14 -> cegah submit + pop notifikasi peringatan
  if (lama > BATAS_HARI) {
    tampilkanError(inputLama, errLama, "Melebihi batas " + BATAS_HARI + " hari");
    await tampilkanNotif({
      jenis: "peringatan",
      judul: "Lama pinjam melebihi batas",
      pesan: "Maksimal peminjaman 14 hari!",
    });
    inputLama.focus();
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

  // JIKA DATA VALID -> pop notifikasi konfirmasi (Batal kiri, OK kanan)
  const setuju = await tampilkanNotif({
    jenis: "konfirmasi",
    judul: "Konfirmasi Peminjaman",
    pesan: "Proses peminjaman?",
    detail: nama + " · " + judul + " · " + lama + " hari",
    tampilBatal: true,
  });

  if (setuju) {
    // Di sini data bisa dikirim ke server (fetch/AJAX) bila sudah ada backend.
    form.reset();
    await tampilkanNotif({
      jenis: "sukses",
      judul: "Berhasil",
      pesan: "Peminjaman berhasil diproses.",
    });
  }
});
