/* =========================================================
   KONFIGURASI UTAMA BARBERSHOP CILACAP
   Ubah nomor WhatsApp, layanan, dan daftar kapster di sini.
========================================================= */
const CONFIG = {
  shopName: "Barbershop Cilacap",
  whatsappNumber: "62882007884604", // Format internasional tanpa tanda '+'
  address: "Jl. Jend. Sudirman No. 48, Cilacap",
  storageKey: "barbershop_cilacap_bookings_v1"
};

const SERVICES = [
  {
    id: "srv-1",
    name: "Signature Precision Cut",
    category: "haircut",
    price: 45000,
    duration: 45,
    desc: "Konsultasi gaya, potong rambut presisi, keramas, tonic & styling."
  },
  {
    id: "srv-2",
    name: "Skin Fade & Taper",
    category: "haircut",
    price: 55000,
    duration: 50,
    desc: "Gradasi halus nol milimeter dengan detail razor line-up."
  },
  {
    id: "srv-3",
    name: "Junior / Student Cut",
    category: "haircut",
    price: 35000,
    duration: 35,
    desc: "Potongan rapi khusus pelajar & mahasiswa Cilacap."
  },
  {
    id: "srv-4",
    name: "Hot Towel Beard Trim",
    category: "grooming",
    price: 30000,
    duration: 30,
    desc: "Perapian jenggot & kumis dengan kompres handuk hangat dan aftershave."
  },
  {
    id: "srv-5",
    name: "Gentleman Cut + Beard",
    category: "grooming",
    price: 70000,
    duration: 65,
    desc: "Paket lengkap Signature Cut dan perawatan detail jenggot."
  },
  {
    id: "srv-6",
    name: "Scalp Detox & Creambath",
    category: "treatment",
    price: 50000,
    duration: 40,
    desc: "Pijat relaksasi kepala, pembersihan ketombe, dan nutrisi akar rambut."
  },
  {
    id: "srv-7",
    name: "Natural Black / Ash Color",
    category: "treatment",
    price: 120000,
    duration: 90,
    desc: "Pewarnaan rambut natural atau tone modern termasuk vitamin rambut."
  },
  {
    id: "srv-8",
    name: "Korean Down Perm",
    category: "treatment",
    price: 135000,
    duration: 75,
    desc: "Melemaskan rambut samping yang mengembang agar jatuh lebih rapi."
  }
];

const BARBERS = [
  {
    id: "any",
    name: "Bebas / Tercepat",
    role: "First Available Barber",
    initials: "BC",
    bio: "Otomatis dipilihkan kapster senior yang paling siap pada jam pilihan Anda."
  },
  {
    id: "raka",
    name: "Mas Raka",
    role: "Senior Master Barber",
    initials: "RK",
    bio: "Spesialis potongan klasik, side part, dan konsultasi struktur wajah."
  },
  {
    id: "dimas",
    name: "Mas Dimas",
    role: "Fade & Crop Specialist",
    initials: "DM",
    bio: "Ahli skin fade presisi, textured crop, dan styling modern pria."
  },
  {
    id: "bayu",
    name: "Mas Bayu",
    role: "Grooming & Perm Stylist",
    initials: "BY",
    bio: "Fokus pada perawatan beard trim, down perm, dan pewarnaan rambut."
  }
];

const TIME_SLOTS = [
  "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00",
  "18:30", "19:30", "20:15"
];

const QUICK_NOTES = [
  "Mid Fade",
  "Low Taper",
  "Textured Crop",
  "Comma Hair",
  "Rapikan Jenggot",
  "Tipis Samping Saja"
];

const LOOKBOOK_ITEMS = [
  {
    tag: "MOST REQUESTED",
    title: "Textured French Crop",
    desc: "Samping bersih dengan gradasi mid-fade dan tekstur bervolume di bagian atas. Praktis untuk aktivitas harian.",
    noteText: "Model Textured French Crop + Mid Fade"
  },
  {
    tag: "CLASSIC EXECUTIVE",
    title: "Modern Side Part",
    desc: "Belahan samping rapi dengan transisi taper natural. Cocok untuk tampilan formal maupun kasual.",
    noteText: "Model Modern Side Part + Low Taper"
  },
  {
    tag: "ASIAN FIT",
    title: "Two-Block & Comma Hair",
    desc: "Potongan berlapis dengan bagian samping dirapikan agar kepala terlihat proporsional dan ringan.",
    noteText: "Model Two-Block / Comma Hair"
  }
];

/* =========================================================
   STATE APLIKASI
========================================================= */
const state = {
  activeCategory: "all",
  selectedServiceIds: ["srv-1"],
  selectedBarberId: "any",
  selectedDateObj: null,
  selectedTime: null,
  dateOptions: []
};

/* =========================================================
   INISIALISASI
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  generateDateOptions();
  renderCategoryTabs();
  renderServices();
  renderBarbers();
  renderDates();
  renderTimes();
  renderQuickTags();
  renderShowcaseAndLookbook();
  updateSummary();
  updateHistoryBadge();
  bindEvents();
});

function formatRupiah(amount) {
  return "Rp " + amount.toLocaleString("id-ID");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* =========================================================
   RENDER KOMPONEN
========================================================= */
function generateDateOptions() {
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const list = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    list.push({
      iso: d.toISOString().split("T")[0],
      dayName: i === 0 ? "Hari Ini" : days[d.getDay()],
      dateNum: d.getDate(),
      monthName: months[d.getMonth()],
      fullLabel: `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
    });
  }

  state.dateOptions = list;
  state.selectedDateObj = list[0];
}

function renderCategoryTabs() {
  const tabs = document.querySelectorAll("#categoryTabs .tab-btn");
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeCategory = btn.dataset.category;
      renderServices();
    });
  });
}

function renderServices() {
  const grid = document.getElementById("servicesGrid");
  const filtered =
    state.activeCategory === "all"
      ? SERVICES
      : SERVICES.filter((s) => s.category === state.activeCategory);

  grid.innerHTML = filtered
    .map((srv) => {
      const isSelected = state.selectedServiceIds.includes(srv.id);
      return `
        <div class="service-item ${isSelected ? "selected" : ""}" data-id="${srv.id}">
          <div>
            <div class="service-top">
              <span class="service-name">${srv.name}</span>
              <span class="service-check">&#10003;</span>
            </div>
            <p class="service-desc">${srv.desc}</p>
          </div>
          <div class="service-foot">
            <span class="service-price">${formatRupiah(srv.price)}</span>
            <span class="service-dur">${srv.duration} mnt</span>
          </div>
        </div>
      `;
    })
    .join("");

  grid.querySelectorAll(".service-item").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.dataset.id;
      if (state.selectedServiceIds.includes(id)) {
        state.selectedServiceIds = state.selectedServiceIds.filter((item) => item !== id);
      } else {
        state.selectedServiceIds.push(id);
      }
      renderServices();
      updateSummary();
    });
  });
}

function renderBarbers() {
  const grid = document.getElementById("barbersGrid");
  grid.innerHTML = BARBERS.map((barber) => {
    const isSelected = state.selectedBarberId === barber.id;
    return `
      <div class="barber-card ${isSelected ? "selected" : ""}" data-id="${barber.id}">
        <div class="barber-avatar">${barber.initials}</div>
        <div class="barber-info">
          <h4>${barber.name}</h4>
          <span>${barber.role}</span>
        </div>
      </div>
    `;
  }).join("");

  grid.querySelectorAll(".barber-card").forEach((el) => {
    el.addEventListener("click", () => {
      state.selectedBarberId = el.dataset.id;
      renderBarbers();
      renderTimes();
      updateSummary();
    });
  });
}

function renderDates() {
  const strip = document.getElementById("dateStrip");
  strip.innerHTML = state.dateOptions
    .map((d) => {
      const isSelected = state.selectedDateObj && state.selectedDateObj.iso === d.iso;
      return `
        <button type="button" class="date-pill ${isSelected ? "selected" : ""}" data-iso="${d.iso}">
          <span class="date-day">${d.dayName}</span>
          <span class="date-num">${d.dateNum} ${d.monthName}</span>
        </button>
      `;
    })
    .join("");

  strip.querySelectorAll(".date-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedDateObj = state.dateOptions.find((item) => item.iso === btn.dataset.iso);
      state.selectedTime = null;
      renderDates();
      renderTimes();
      updateSummary();
    });
  });
}

function renderTimes() {
  const grid = document.getElementById("timeGrid");
  const dateSeed = state.selectedDateObj ? state.selectedDateObj.dateNum : 1;

  grid.innerHTML = TIME_SLOTS.map((slot, idx) => {
    const isSelected = state.selectedTime === slot;
    // Simulasi realistis beberapa slot penuh berdasarkan tanggal & kapster
    const isBooked =
      state.selectedBarberId !== "any" && (idx + dateSeed) % 5 === 0;

    return `
      <button
        type="button"
        class="time-slot ${isSelected ? "selected" : ""}"
        data-time="${slot}"
        ${isBooked ? "disabled" : ""}
      >
        ${slot}
      </button>
    `;
  }).join("");

  grid.querySelectorAll(".time-slot:not(:disabled)").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedTime = btn.dataset.time;
      renderTimes();
      updateSummary();
    });
  });
}

function renderQuickTags() {
  const container = document.getElementById("quickTags");
  const notesInput = document.getElementById("bookingNotes");

  container.innerHTML = QUICK_NOTES.map(
    (tag) => `<button type="button" class="tag-chip">+ ${tag}</button>`
  ).join("");

  container.querySelectorAll(".tag-chip").forEach((chip, i) => {
    chip.addEventListener("click", () => {
      const text = QUICK_NOTES[i];
      notesInput.value = notesInput.value
        ? `${notesInput.value}, ${text}`
        : text;
    });
  });
}

function renderShowcaseAndLookbook() {
  const showcase = document.getElementById("barberShowcase");
  showcase.innerHTML = BARBERS.filter((b) => b.id !== "any")
    .map(
      (b) => `
      <div class="showcase-card">
        <p class="showcase-role">${b.role}</p>
        <h3>${b.name}</h3>
        <p>${b.bio}</p>
      </div>
    `
    )
    .join("");

  const lookbook = document.getElementById("lookbookGrid");
  lookbook.innerHTML = LOOKBOOK_ITEMS.map(
    (item, index) => `
      <div class="lookbook-card" data-idx="${index}">
        <div>
          <span class="lookbook-tag">${item.tag}</span>
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
        </div>
        <span class="lookbook-action">Pakai Gaya Ini &rarr;</span>
      </div>
    `
  ).join("");

  lookbook.querySelectorAll(".lookbook-card").forEach((card) => {
    card.addEventListener("click", () => {
      const chosen = LOOKBOOK_ITEMS[Number(card.dataset.idx)];
      const notesInput = document.getElementById("bookingNotes");
      notesInput.value = chosen.noteText;
      document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
      showToast(`Gaya "${chosen.title}" ditambahkan ke catatan.`);
    });
  });
}

/* =========================================================
   SUMMARY & VALIDASI BOOKING
========================================================= */
function getSelectedServices() {
  return SERVICES.filter((s) => state.selectedServiceIds.includes(s.id));
}

function updateSummary() {
  const selectedServices = getSelectedServices();
  const barber = BARBERS.find((b) => b.id === state.selectedBarberId);

  document.getElementById("sumBarber").textContent = barber ? barber.name : "Belum dipilih";
  document.getElementById("sumDateTime").textContent =
    state.selectedDateObj && state.selectedTime
      ? `${state.selectedDateObj.fullLabel} • ${state.selectedTime} WIB`
      : state.selectedDateObj
      ? `${state.selectedDateObj.fullLabel} (Pilih Jam)`
      : "Belum dipilih";

  const listEl = document.getElementById("sumServicesList");
  if (selectedServices.length === 0) {
    listEl.innerHTML = `<p class="empty-hint">Belum ada layanan dipilih.</p>`;
  } else {
    listEl.innerHTML = selectedServices
      .map(
        (s) => `
        <div class="sum-service-line">
          <span>${s.name}</span>
          <span>${formatRupiah(s.price)}</span>
        </div>
      `
      )
      .join("");
  }

  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);

  document.getElementById("sumDuration").textContent = `${totalDuration} Menit`;
  document.getElementById("sumTotal").textContent = formatRupiah(totalPrice);
}

function handleConfirmBooking() {
  const selectedServices = getSelectedServices();
  const customerName = document.getElementById("customerName").value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();
  const notes = document.getElementById("bookingNotes").value.trim();

  if (selectedServices.length === 0) {
    showToast("Pilih minimal 1 layanan terlebih dahulu.");
    return;
  }
  if (!state.selectedDateObj || !state.selectedTime) {
    showToast("Silakan pilih tanggal dan jam kedatangan.");
    return;
  }
  if (!customerName || !customerPhone) {
    showToast("Lengkapi Nama Lengkap dan Nomor WhatsApp Anda.");
    return;
  }

  const barber = BARBERS.find((b) => b.id === state.selectedBarberId);
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const randomNum = Math.floor(100 + Math.random() * 900);
  const bookingCode = `BBC-2026-${randomNum}`;

  const bookingRecord = {
    code: bookingCode,
    customerName,
    customerPhone,
    barberName: barber ? barber.name : "Bebas / Tercepat",
    dateLabel: state.selectedDateObj.fullLabel,
    time: state.selectedTime,
    services: selectedServices.map((s) => s.name),
    totalPrice,
    notes: notes || "-",
    createdAt: new Date().toISOString()
  };

  saveBooking(bookingRecord);
  openTicketModal(bookingRecord);
}

/* =========================================================
   E-TICKET, WHATSAPP & LOCALSTORAGE
========================================================= */
function buildWhatsAppUrl(record) {
  const message = [
    `Halo *${CONFIG.shopName}*, saya ingin konfirmasi reservasi:`,
    ``,
    `Kode Booking: *#${record.code}*`,
    `Nama: ${record.customerName}`,
    `No. WA: ${record.customerPhone}`,
    `Kapster: ${record.barberName}`,
    `Jadwal: ${record.dateLabel} pukul ${record.time} WIB`,
    `Layanan: ${record.services.join(", ")}`,
    `Estimasi Total: *${formatRupiah(record.totalPrice)}*`,
    `Catatan: ${record.notes}`
  ].join("\n");

  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function openTicketModal(record) {
  document.getElementById("ticketCode").textContent = `#${record.code}`;
  document.getElementById("ticketDetails").innerHTML = `
    <div class="ticket-row"><span>Nama Pelanggan</span><span>${record.customerName}</span></div>
    <div class="ticket-row"><span>Kapster</span><span>${record.barberName}</span></div>
    <div class="ticket-row"><span>Jadwal</span><span>${record.dateLabel} • ${record.time} WIB</span></div>
    <div class="ticket-row"><span>Layanan</span><span>${record.services.join(", ")}</span></div>
    <div class="ticket-row"><span>Catatan</span><span>${record.notes}</span></div>
    <div class="ticket-row"><span>Total Estimasi</span><span>${formatRupiah(record.totalPrice)}</span></div>
  `;

  const waBtn = document.getElementById("sendWaBtn");
  waBtn.href = buildWhatsAppUrl(record);

  const copyBtn = document.getElementById("copyTicketBtn");
  copyBtn.onclick = () => {
    const plainText = `E-Ticket ${CONFIG.shopName} (#${record.code}) | ${record.customerName} | ${record.dateLabel} ${record.time} WIB | Kapster: ${record.barberName} | Layanan: ${record.services.join(", ")} | Total: ${formatRupiah(record.totalPrice)}`;
    navigator.clipboard.writeText(plainText);
    showToast("Detail E-Ticket berhasil disalin.");
  };

  document.getElementById("ticketModal").classList.add("open");
}

function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || [];
  } catch {
    return [];
  }
}

function saveBooking(record) {
  const existing = getBookings();
  existing.unshift(record);
  localStorage.setItem(CONFIG.storageKey, JSON.stringify(existing));
  updateHistoryBadge();
}

function deleteBooking(code) {
  const filtered = getBookings().filter((b) => b.code !== code);
  localStorage.setItem(CONFIG.storageKey, JSON.stringify(filtered));
  updateHistoryBadge();
  renderHistoryList();
  showToast("Riwayat reservasi dihapus.");
}

function updateHistoryBadge() {
  document.getElementById("historyCount").textContent = getBookings().length;
}

function renderHistoryList() {
  const listEl = document.getElementById("historyList");
  const bookings = getBookings();

  if (bookings.length === 0) {
    listEl.innerHTML = `<p class="empty-hint">Belum ada riwayat reservasi tersimpan di perangkat ini.</p>`;
    return;
  }

  listEl.innerHTML = bookings
    .map(
      (b) => `
      <div class="history-item">
        <div class="history-top">
          <span class="history-code">#${b.code}</span>
          <span>${formatRupiah(b.totalPrice)}</span>
        </div>
        <div class="history-meta">
          <strong>${b.customerName}</strong> • ${b.dateLabel} (${b.time} WIB)<br />
          Kapster: ${b.barberName} | ${b.services.join(", ")}
        </div>
        <div class="history-actions">
          <a href="${buildWhatsAppUrl(b)}" target="_blank" rel="noopener noreferrer" class="btn-outline btn-sm">
            Kirim Ulang WA
          </a>
          <button type="button" class="btn-link-danger" data-del="${b.code}">Hapus</button>
        </div>
      </div>
    `
    )
    .join("");

  listEl.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => deleteBooking(btn.dataset.del));
  });
}

/* =========================================================
   EVENT LISTENERS GLOBAL
========================================================= */
function bindEvents() {
  document.getElementById("confirmBookingBtn").addEventListener("click", handleConfirmBooking);

  document.getElementById("closeTicketModal").addEventListener("click", () => {
    document.getElementById("ticketModal").classList.remove("open");
  });

  document.getElementById("openHistoryBtn").addEventListener("click", () => {
    renderHistoryList();
    document.getElementById("historyModal").classList.add("open");
  });

  document.getElementById("closeHistoryModal").addEventListener("click", () => {
    document.getElementById("historyModal").classList.remove("open");
  });

  document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("open");
  });

  // Tutup modal jika klik area backdrop di luar kotak
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove("open");
      }
    });
  });
}
