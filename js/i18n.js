const LANGUAGE_KEY = 'ruang-rindu-language';
const DEFAULT_LANGUAGE = 'id';
const SUPPORTED_LANGUAGES = ['id', 'en'];

const translations = {
  id: {
    language: { label: 'Bahasa', id: 'Indonesia', en: 'English' },
    common: {
      menuOpen: 'Buka navigasi',
      menuClose: 'Tutup navigasi',
      menu: 'Menu',
      close: 'Tutup',
      skip: 'Langsung ke isi',
      primaryNav: 'Navigasi utama',
      back: 'Kembali',
      backArchive: 'Kembali ke arsip',
      archive: 'Arsip surat',
      write: 'Tulis surat',
      writeArrow: 'Tulis surat ↗',
      home: 'Ruang Rindu, beranda',
      footerLine: 'Untuk setiap kata yang perlu diberi ruang.',
      caredBy: 'Dirawat dengan tenang oleh',
      projectOf: 'A Project of',
      readArchive: 'Baca surat yang sudah sampai',
      enterArchive: 'Masuk ke arsip',
      send: 'Kirim surat',
      continueWriting: 'Lanjut menulis',
      closeDialog: 'Tutup dialog',
      arrowForward: '→',
      arrowBack: '←',
      arrowExternal: '↗',
      themeLabel: 'Tema tampilan',
      themeLight: 'Gunakan mode terang',
      themeDark: 'Gunakan mode gelap',
    },
    pages: {
      home: {
        title: 'Ruang Rindu',
        description: 'Ruang surat anonim untuk hal-hal yang sulit diucapkan.',
        ogTitle: 'Ruang Rindu — surat untuk yang tak selalu bisa dikatakan',
        ogDescription: 'Tulis, titipkan, dan temukan surat dari hati yang lain.',
      },
      archive: {
        title: 'Arsip Surat — Ruang Rindu',
        description: 'Jelajahi surat-surat yang telah dipublikasikan di Ruang Rindu.',
      },
      compose: { title: 'Tulis Surat — Ruang Rindu', description: 'Tulis surat di Ruang Rindu.' },
      letter: { title: 'Surat — Ruang Rindu', description: 'Baca sebuah surat dari Ruang Rindu.' },
    },
    home: {
      indexLabel: 'Ruang untuk merasa',
      eyebrow: 'Untuk hal-hal yang tak selalu bisa dikatakan',
      titleOne: 'Ada kata yang',
      titleTwo: 'lebih berani',
      titleThree: 'ketika dititipkan.',
      intro: 'Ruang Rindu adalah tempat untuk menyusun rasa: cinta, maaf, terima kasih, atau perpisahan—dengan namamu, atau tanpa nama sama sekali.',
      sealLineOne: 'untuk',
      sealLineTwo: 'yang masih',
      sealLineThree: 'diingat',
      sealInstruction: 'buka pelan-pelan',
      noteLabel: 'sebuah pengingat kecil',
      noteBody: 'Beberapa perasaan tidak membutuhkan jawaban untuk tetap layak menemukan tempatnya.',
      noteSignature: '— ruang rindu',
      closeNote: 'Tutup surat',
      sideNote: 'ditulis dengan pelan\ndibaca tanpa buru-buru',
      scrollHint: 'gulir untuk menemukan',
      manifestoEyebrow: 'Sebuah ruang yang tak menuntut penjelasan',
      manifestoTitle: 'Tidak semua yang kita simpan harus terus menjadi beban.',
      manifestoBody: 'Di sini, surat tak perlu rapi untuk menjadi berarti. Kamu boleh datang dengan kalimat yang patah, nama yang ingin disembunyikan, atau perasaan yang belum selesai.',
      manifestoLink: 'Mulai dari satu kalimat',
      howEyebrow: 'Cara kerjanya',
      howTitle: 'Sederhana, seperti menulis di kertas yang bersih.',
      stepOneTitle: 'Tulis tanpa terburu-buru.',
      stepOneBody: 'Pilih kata-kata yang paling jujur; sisanya boleh menunggu.',
      stepTwoTitle: 'Pilih cara hadir.',
      stepTwoBody: 'Gunakan namamu, nama samaran, atau biarkan surat itu anonim.',
      stepThreeTitle: 'Titipkan ketika siap.',
      stepThreeBody: 'Setiap surat akan langsung hadir di arsip setelah berhasil dikirim.',
      archiveEyebrow: 'Dari arsip yang terus bertumbuh',
      archiveTitle: 'Surat-surat yang telah sampai.',
      closingEyebrow: 'Jika ada yang ingin tinggal sebentar',
      closingTitleOne: 'Jangan biarkan',
      closingTitleTwo: 'hanya berputar',
      closingTitleThree: 'di kepala.',
      closingCta: 'Tulis\nsekarang',
      archiveLoading: 'Arsip sedang disiapkan…',
      archiveUnavailable: 'Arsip akan tampil setelah Ruang Rindu terhubung ke Supabase.',
      archiveEmpty: 'Belum ada surat yang tiba di arsip. Mungkin surat pertama bisa datang darimu.',
      archiveError: 'Arsip belum bisa dimuat. Coba lagi sebentar.',
    },
    archive: {
      eyebrow: 'Arsip surat',
      titleOne: 'Yang pernah',
      titleTwo: 'dititipkan.',
      intro: 'Pesan-pesan dari orang yang tak kamu kenal—dan mungkin, sedikit mirip denganmu.',
      searchPlaceholder: 'Cari kata, judul, atau nama…',
      searchLabel: 'Cari dalam arsip',
      controlsLabel: 'Cari dan saring surat',
      listLabel: 'Daftar surat',
      categoriesLabel: 'Kategori surat',
      all: 'Semua',
      sortLabel: 'Urutkan',
      newest: 'Terbaru',
      oldest: 'Terlama',
      preparing: 'Menyiapkan arsip…',
      count: '{{count}} surat ditemukan',
      noMatch: 'Belum ada surat yang cocok',
      noMatchTitle: 'Tak ada surat yang cocok.',
      noMatchDescription: 'Coba kata atau kategori lain.',
      quietTitle: 'Arsip masih hening.',
      quietDescription: 'Surat yang berhasil dikirim akan muncul di sini.',
      unavailableTitle: 'Arsip belum terhubung.',
      unavailableDescription: 'Hubungkan Supabase di konfigurasi proyek untuk menampilkan surat yang sudah diterbitkan.',
      errorTitle: 'Arsip sulit dibuka.',
      errorDescription: 'Coba muat ulang halaman ini. Jika masalah berlanjut, periksa sambungan Supabase dan kebijakan aksesnya.',
      connectionWaiting: 'Menunggu sambungan Supabase',
      connectionError: 'Ada gangguan sambungan',
      writeFirst: 'Tulis surat pertama',
      writeLetter: 'Titipkan surat',
      loadMore: 'Muat lebih banyak',
      nudge: 'Adakah sesuatu yang sedang kamu tahan?',
    },
    compose: {
      asideEyebrow: 'Lembar baru',
      asideTitleOne: 'Tulis seperti',
      asideTitleTwo: 'tak ada yang',
      asideTitleThree: 'mendesak.',
      asideBody: 'Suratmu akan langsung hadir di arsip setelah berhasil dikirim. Ambil jeda kapan pun kamu membutuhkannya.',
      asideFoot: 'Kata-katamu tetap milikmu.',
      letterheadTagline: 'surat yang dititipkan dengan tenang',
      newLetter: 'Surat baru',
      headingOne: 'Kepada seseorang,',
      headingTwo: 'atau sesuatu.',
      draftSaved: 'Draf tersimpan di perangkat ini',
      draftRestored: 'Draf sebelumnya dipulihkan dari perangkat ini',
      draftDeleted: 'Draf dihapus setelah surat berhasil dikirim',
      draftUnavailable: 'Draf tidak dapat disimpan di perangkat ini',
      titleLabel: 'Judul surat',
      optional: 'opsional',
      titlePlaceholder: 'Misalnya: Untuk rumah yang kutinggalkan',
      themeLabel: 'Tema',
      chooseTheme: 'Pilih tema',
      messageLabel: 'Suratmu',
      toLabel: 'untuk',
      characterCount: '{{count}} / 5.000',
      messagePlaceholder: 'Tulis apa yang ingin kamu sampaikan…',
      messageHint: 'Tulis sepanjang atau sesingkat yang kamu mau. Baris dan paragraf tetap tersimpan.',
      signatureLegend: 'Tanda tangan surat',
      anonymous: 'Tanpa nama',
      anonymousHint: 'Biarkan surat ini berdiri sendiri.',
      named: 'Dengan nama',
      namedHint: 'Tampilkan nama pilihanmu.',
      displayNameLabel: 'Nama yang ingin ditampilkan',
      displayNamePlaceholder: 'Nama atau nama samaran',
      preview: 'Lihat pratinjau',
      privacy: 'Surat yang berhasil dikirim akan langsung tampil di arsip publik. Hindari menulis informasi pribadi yang sensitif.',
      previewEyebrow: 'Pratinjau surat',
      previewNoTitle: 'Tanpa judul',
      previewAuthor: 'Tanpa nama',
      previewReminder: 'Periksa sekali lagi sebelum mengirim.',
      successEyebrow: 'Surat diterima',
      successTitle: 'Terima kasih sudah menulis.',
      successBody: 'Suratmu sudah terbit di arsip publik dan bisa dibaca pengunjung. Draf di perangkat ini sudah dihapus.',
      backToSpace: 'Kembali ke ruang',
      sending: 'Mengirim surat…',
      validationMessageRequired: 'Tulis setidaknya satu karakter sebelum mengirim surat.',
      validationMessageLong: 'Isi surat tidak boleh lebih dari 5.000 karakter.',
      validationTitleLong: 'Judul surat terlalu panjang.',
      validationName: 'Masukkan nama atau nama samaran sepanjang 1–60 karakter.',
      notConfigured: 'Pengiriman belum tersedia karena Supabase belum dikonfigurasi. Drafmu tetap tersimpan di perangkat ini.',
      submitError: 'Surat belum dapat dikirim. Drafmu tetap aman di perangkat ini.',
      submittedToast: 'Suratmu sudah terbit di Ruang Rindu.',
    },
    letter: {
      loading: 'Menyiapkan surat…',
      leftInRoom: 'dititipkan di Ruang Rindu',
      actionsLabel: 'Tindakan surat',
      share: 'Bagikan surat ini',
      copy: 'Salin tautan',
      report: 'Laporkan surat',
      notFoundEyebrow: 'Surat tidak ditemukan',
      notFoundTitle: 'Sepertinya surat ini belum sampai di sini.',
      notFoundBody: 'Ia mungkin telah dipindahkan, belum diterbitkan, atau tautannya tidak lengkap.',
      notConfiguredTitle: 'Arsip belum terhubung.',
      notConfiguredBody: 'Supabase belum dikonfigurasi, jadi surat publik belum bisa dimuat.',
      copied: 'Tautan surat telah disalin.',
      copyFailed: 'Tautan tidak dapat disalin otomatis. Salin dari bilah alamat browser.',
      sharedText: 'Sebuah surat dari Ruang Rindu',
      reportEyebrow: 'Laporkan surat',
      reportTitle: 'Apa yang perlu kami periksa?',
      reportIntro: 'Laporan dibaca secara pribadi oleh tim moderasi.',
      reportLabel: 'Alasan laporan',
      reportPlaceholder: 'Jelaskan singkat masalahnya…',
      reportHint: 'Berikan sedikit konteks—setidaknya 8 karakter.',
      reportSuccess: 'Laporanmu sudah kami terima secara pribadi.',
      reportError: 'Laporan belum dapat dikirim. Coba lagi nanti.',
      reportSending: 'Mengirim laporan…',
      reportSubmit: 'Kirim laporan',
      unavailableReport: 'Surat tidak tersedia untuk dilaporkan.',
    },
    states: {
      configuredError: 'Ruang Rindu belum terhubung ke Supabase.',
      requestError: 'Permintaan tidak dapat diproses. Coba lagi sebentar lagi.',
    },
    categories: {
      cinta: 'Cinta',
      rindu: 'Rindu',
      maaf: 'Maaf',
      terimaKasih: 'Terima kasih',
      perpisahan: 'Perpisahan',
      lainnya: 'Lainnya',
      empty: 'Catatan',
    },
  },
  en: {
    language: { label: 'Language', id: 'Indonesian', en: 'English' },
    common: {
      menuOpen: 'Open navigation',
      menuClose: 'Close navigation',
      menu: 'Menu',
      close: 'Close',
      skip: 'Skip to content',
      primaryNav: 'Primary navigation',
      back: 'Back',
      backArchive: 'Back to archive',
      archive: 'Letter archive',
      write: 'Write a letter',
      writeArrow: 'Write a letter ↗',
      home: 'Ruang Rindu, home',
      footerLine: 'For every word that needs a little room.',
      caredBy: 'Quietly cared for by',
      projectOf: 'A Project of',
      readArchive: 'Read letters that have arrived',
      enterArchive: 'Enter the archive',
      send: 'Send letter',
      continueWriting: 'Keep writing',
      closeDialog: 'Close dialog',
      arrowForward: '→',
      arrowBack: '←',
      arrowExternal: '↗',
      themeLabel: 'Appearance theme',
      themeLight: 'Use light mode',
      themeDark: 'Use dark mode',
    },
    pages: {
      home: {
        title: 'Ruang Rindu',
        description: 'An anonymous letter space for the things that are hard to say.',
        ogTitle: 'Ruang Rindu — letters for what cannot always be said',
        ogDescription: 'Write, leave a letter, and discover words from another heart.',
      },
      archive: {
        title: 'Letter Archive — Ruang Rindu',
        description: 'Explore letters published in Ruang Rindu.',
      },
      compose: { title: 'Write a Letter — Ruang Rindu', description: 'Write a letter in Ruang Rindu.' },
      letter: { title: 'Letter — Ruang Rindu', description: 'Read a letter from Ruang Rindu.' },
    },
    home: {
      indexLabel: 'A room for feeling',
      eyebrow: 'For the things that are not always easy to say',
      titleOne: 'Some words become',
      titleTwo: 'braver',
      titleThree: 'when they are left here.',
      intro: 'Ruang Rindu is a place to arrange what you feel: love, apology, gratitude, or goodbye—with your name, or with no name at all.',
      sealLineOne: 'for',
      sealLineTwo: 'the one',
      sealLineThree: 'still remembered',
      sealInstruction: 'open gently',
      noteLabel: 'a small reminder',
      noteBody: 'Some feelings do not need an answer to deserve a place to land.',
      noteSignature: '— ruang rindu',
      closeNote: 'Close letter',
      sideNote: 'written slowly\nread without hurry',
      scrollHint: 'scroll to discover',
      manifestoEyebrow: 'A room that asks for no explanation',
      manifestoTitle: 'Not everything we carry has to remain a burden.',
      manifestoBody: 'Here, a letter does not need to be polished to matter. Come with broken sentences, a name you want to hide, or a feeling still finding its shape.',
      manifestoLink: 'Start with one sentence',
      howEyebrow: 'How it works',
      howTitle: 'Simple, like writing on a clean sheet of paper.',
      stepOneTitle: 'Write without rushing.',
      stepOneBody: 'Choose the words that feel most honest; the rest can wait.',
      stepTwoTitle: 'Choose how to appear.',
      stepTwoBody: 'Use your name, a chosen name, or let the letter stay anonymous.',
      stepThreeTitle: 'Leave it when you are ready.',
      stepThreeBody: 'Your letter will appear in the archive as soon as it is sent.',
      archiveEyebrow: 'From an archive still growing',
      archiveTitle: 'Letters that have arrived.',
      closingEyebrow: 'If something needs to stay for a while',
      closingTitleOne: 'Do not let it',
      closingTitleTwo: 'keep circling',
      closingTitleThree: 'inside your head.',
      closingCta: 'Write\nnow',
      archiveLoading: 'Preparing the archive…',
      archiveUnavailable: 'The archive will appear once Ruang Rindu is connected to Supabase.',
      archiveEmpty: 'No letters have reached the archive yet. Perhaps the first one can come from you.',
      archiveError: 'The archive could not be loaded. Please try again in a moment.',
    },
    archive: {
      eyebrow: 'Letter archive',
      titleOne: 'Letters that were',
      titleTwo: 'left here.',
      intro: 'Messages from people you do not know—and perhaps, in some small way, resemble you.',
      searchPlaceholder: 'Search words, titles, or names…',
      searchLabel: 'Search the archive',
      controlsLabel: 'Search and filter letters',
      listLabel: 'Letter list',
      categoriesLabel: 'Letter categories',
      all: 'All',
      sortLabel: 'Sort',
      newest: 'Newest',
      oldest: 'Oldest',
      preparing: 'Preparing the archive…',
      count: '{{count}} letters found',
      noMatch: 'No matching letters',
      noMatchTitle: 'No letters match that search.',
      noMatchDescription: 'Try another word or category.',
      quietTitle: 'The archive is quiet.',
      quietDescription: 'Letters that are successfully sent will appear here.',
      unavailableTitle: 'The archive is not connected.',
      unavailableDescription: 'Connect Supabase in the project configuration to show published letters.',
      errorTitle: 'The archive is having trouble opening.',
      errorDescription: 'Try reloading this page. If the problem continues, check the Supabase connection and access policies.',
      connectionWaiting: 'Waiting for Supabase',
      connectionError: 'Connection interrupted',
      writeFirst: 'Write the first letter',
      writeLetter: 'Leave a letter',
      loadMore: 'Load more',
      nudge: 'Is there something you have been holding back?',
    },
    compose: {
      asideEyebrow: 'A fresh page',
      asideTitleOne: 'Write as if',
      asideTitleTwo: 'nothing is',
      asideTitleThree: 'urgent.',
      asideBody: 'Your letter will appear in the public archive as soon as it is sent. Take a pause whenever you need one.',
      asideFoot: 'Your words remain yours.',
      letterheadTagline: 'a letter left here with care',
      newLetter: 'New letter',
      headingOne: 'To someone,',
      headingTwo: 'or something.',
      draftSaved: 'Draft saved on this device',
      draftRestored: 'An earlier draft was restored on this device',
      draftDeleted: 'Draft removed after the letter was sent',
      draftUnavailable: 'This device could not save the draft',
      titleLabel: 'Letter title',
      optional: 'optional',
      titlePlaceholder: 'For example: For the home I left behind',
      themeLabel: 'Theme',
      chooseTheme: 'Choose a theme',
      messageLabel: 'Your letter',
      toLabel: 'for',
      characterCount: '{{count}} / 5,000',
      messagePlaceholder: 'Write what you want to say…',
      messageHint: 'Write as much or as little as you like. Line breaks and paragraphs are kept.',
      signatureLegend: 'Sign the letter',
      anonymous: 'Without a name',
      anonymousHint: 'Let the letter stand on its own.',
      named: 'With a name',
      namedHint: 'Show a name of your choosing.',
      displayNameLabel: 'Name to display',
      displayNamePlaceholder: 'Your name or a chosen name',
      preview: 'Preview letter',
      privacy: 'Letters that are successfully sent appear in the public archive. Avoid sharing sensitive personal information.',
      previewEyebrow: 'Letter preview',
      previewNoTitle: 'Untitled',
      previewAuthor: 'Without a name',
      previewReminder: 'Take one last look before sending.',
      successEyebrow: 'Letter received',
      successTitle: 'Thank you for writing.',
      successBody: 'Your letter is now published in the public archive and can be read by visitors. The local draft has been removed.',
      backToSpace: 'Back to the room',
      sending: 'Sending letter…',
      validationMessageRequired: 'Write at least one character before sending your letter.',
      validationMessageLong: 'A letter cannot be longer than 5,000 characters.',
      validationTitleLong: 'That title is too long.',
      validationName: 'Enter a name or chosen name between 1 and 60 characters.',
      notConfigured: 'Sending is unavailable because Supabase is not configured. Your draft is still saved on this device.',
      submitError: 'The letter could not be sent. Your draft is still safe on this device.',
      submittedToast: 'Your letter is now in Ruang Rindu.',
    },
    letter: {
      loading: 'Preparing the letter…',
      leftInRoom: 'left in Ruang Rindu',
      actionsLabel: 'Letter actions',
      share: 'Share this letter',
      copy: 'Copy link',
      report: 'Report letter',
      notFoundEyebrow: 'Letter not found',
      notFoundTitle: 'It seems this letter has not arrived here.',
      notFoundBody: 'It may have been moved, not yet published, or the link may be incomplete.',
      notConfiguredTitle: 'The archive is not connected.',
      notConfiguredBody: 'Supabase is not configured, so public letters cannot be loaded yet.',
      copied: 'The letter link has been copied.',
      copyFailed: 'The link could not be copied automatically. Copy it from your browser address bar.',
      sharedText: 'A letter from Ruang Rindu',
      reportEyebrow: 'Report letter',
      reportTitle: 'What should we look into?',
      reportIntro: 'Reports are reviewed privately by the moderation team.',
      reportLabel: 'Reason for reporting',
      reportPlaceholder: 'Briefly describe the problem…',
      reportHint: 'Please add some context—at least 8 characters.',
      reportSuccess: 'Your report has been received privately.',
      reportError: 'The report could not be sent. Please try again later.',
      reportSending: 'Sending report…',
      reportSubmit: 'Send report',
      unavailableReport: 'This letter is not available to report.',
    },
    states: {
      configuredError: 'Ruang Rindu is not connected to Supabase.',
      requestError: 'The request could not be processed. Please try again in a moment.',
    },
    categories: {
      cinta: 'Love',
      rindu: 'Longing',
      maaf: 'Apology',
      terimaKasih: 'Gratitude',
      perpisahan: 'Goodbye',
      lainnya: 'Other',
      empty: 'Note',
    },
  },
};

let currentLanguage = DEFAULT_LANGUAGE;

function readStoredLanguage() {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function interpolate(value, variables = {}) {
  return value.replace(/\{\{(\w+)\}\}/g, (_, key) => String(variables[key] ?? ''));
}

export function getLanguage() {
  return currentLanguage;
}

export function t(key, variables = {}) {
  const value = key.split('.').reduce((result, part) => result?.[part], translations[currentLanguage])
    ?? key.split('.').reduce((result, part) => result?.[part], translations[DEFAULT_LANGUAGE])
    ?? key;
  return typeof value === 'string' ? interpolate(value, variables) : key;
}

export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
  });
  root.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
  });
  root.querySelectorAll('[data-i18n-title]').forEach((element) => {
    element.setAttribute('title', t(element.dataset.i18nTitle));
  });
  document.documentElement.lang = currentLanguage;
  const page = document.body.dataset.page;
  if (page && translations[currentLanguage].pages[page]) {
    const metadata = translations[currentLanguage].pages[page];
    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', metadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', metadata.ogTitle || metadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', metadata.ogDescription || metadata.description);
  }
  document.querySelectorAll('[data-language]').forEach((button) => {
    const selected = button.dataset.language === currentLanguage;
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

export function setLanguage(language) {
  if (!SUPPORTED_LANGUAGES.includes(language) || language === currentLanguage) return;
  currentLanguage = language;
  document.body.classList.add('is-language-switching');
  window.setTimeout(() => document.body.classList.remove('is-language-switching'), 360);
  try {
    window.localStorage.setItem(LANGUAGE_KEY, language);
  } catch {
    // The interface remains usable when storage is unavailable.
  }
  applyTranslations();
  window.dispatchEvent(new CustomEvent('languagechange', { detail: { language } }));
}

export function initI18n() {
  currentLanguage = readStoredLanguage();
  applyTranslations();
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.language));
  });
}

export const languageKey = LANGUAGE_KEY;
