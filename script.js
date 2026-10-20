/**
 * Yassen Mahmoud - Digital Identity & Business Card
 * Interactive Behaviors & Ergonomic Enhancements
 */

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light Comfort)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const htmlRoot = document.documentElement;
  const themeMetaTag = document.querySelector('meta[name="theme-color"]');

  // Detect saved preference; default to dark for luxurious comfort
  const savedTheme = localStorage.getItem("user-theme");

  function applyTheme(theme) {
    htmlRoot.setAttribute("data-theme", theme);
    localStorage.setItem("user-theme", theme);
    if (themeMetaTag) {
      themeMetaTag.setAttribute("content", theme === "dark" ? "#0b0f17" : "#f1f5f9");
    }
  }

  if (savedTheme === "light") {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = htmlRoot.getAttribute("data-theme") || "dark";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      showToast(nextTheme === "dark" ? "🌙 Dark Comfort Mode" : "☀️ Light Comfort Mode");
    });
  }

  // -------------------------------------------------------------------------
  // 2. Toast Notification Helper
  // -------------------------------------------------------------------------
  const toastContainer = document.getElementById("toastNotification");
  const toastMessage = document.getElementById("toastMessage");
  let toastTimer = null;

  function showToast(message, duration = 2400) {
    if (!toastContainer || !toastMessage) return;
    toastMessage.textContent = message;
    toastContainer.classList.add("active");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastContainer.classList.remove("active");
    }, duration);
  }

  // -------------------------------------------------------------------------
  // 3. Copy Phone / WhatsApp Number
  // -------------------------------------------------------------------------
  const copyPhoneBtn = document.getElementById("copyPhoneBtn");
  const phoneNumber = "+201507291572";

  async function copyToClipboard(text, successMessage) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      showToast(successMessage);
    } catch (err) {
      console.error("Clipboard copy error:", err);
      showToast("Could not copy automatically");
    }
  }

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener("click", () => {
      copyToClipboard(phoneNumber, "📋 Phone copied (+20 150 729 1572)");
    });
  }

  // -------------------------------------------------------------------------
  // 4. Save Contact (vCard / .vcf Generator)
  // -------------------------------------------------------------------------
  const saveContactBtn = document.getElementById("saveContactBtn");

  if (saveContactBtn) {
    saveContactBtn.addEventListener("click", () => {
      const vCardData = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "N:Mahmoud;Yassen;;;",
        "FN:Yassen Mahmoud",
        "TITLE:Front-End Developer",
        "TEL;TYPE=CELL,VOICE,PREF:+201507291572",
        "URL:https://www.linkedin.com/in/yassen-mahmoud-4287653ba",
        "NOTE:Front-End Developer",
        "END:VCARD",
      ].join("\r\n");

      const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.setAttribute("download", "Yassen-Mahmoud.vcf");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);

      showToast("📇 Contact card saved (.vcf)");
    });
  }

  // -------------------------------------------------------------------------
  // 5. Share Profile (Web Share API with Clipboard Fallback)
  // -------------------------------------------------------------------------
  const shareBtn = document.getElementById("shareBtn");

  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const shareData = {
        title: "Yassen Mahmoud | Front-End Developer",
        text: "Connect with Yassen Mahmoud — Front-End Developer.",
        url: window.location.href,
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          if (err.name !== "AbortError") {
            copyToClipboard(window.location.href, "🔗 Profile link copied!");
          }
        }
      } else {
        copyToClipboard(window.location.href, "🔗 Profile link copied!");
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6. Telda QR Modal Management
  // -------------------------------------------------------------------------
  const openTeldaModalBtn = document.getElementById("openTeldaModalBtn");
  const teldaModal = document.getElementById("teldaModal");
  const closeModalBtn = document.getElementById("closeModalBtn");

  function openModal() {
    if (!teldaModal) return;
    teldaModal.classList.add("is-open");
    teldaModal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    closeModalBtn?.focus();
  }

  function closeModal() {
    if (!teldaModal) return;
    teldaModal.classList.remove("is-open");
    teldaModal.setAttribute("hidden", "");
    document.body.style.overflow = "";
    openTeldaModalBtn?.focus();
  }

  if (openTeldaModalBtn) {
    openTeldaModalBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openModal();
    });
    openTeldaModalBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal();
      }
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  if (teldaModal) {
    teldaModal.addEventListener("click", (e) => {
      if (!e.target.closest(".modal-window")) {
        closeModal();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && teldaModal.classList.contains("is-open")) {
        closeModal();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 7. Subtle Ergonomic 3D Parallax Tilt (Desktop only)
  // -------------------------------------------------------------------------
  const card = document.getElementById("idCard");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (card && !prefersReducedMotion && window.matchMedia("(min-width: 768px)").matches) {
    let bounds = null;

    function handleMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const xPct = mouseX / bounds.width - 0.5;
      const yPct = mouseY / bounds.height - 0.5;

      const rotX = -yPct * 5;
      const rotY = xPct * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
    }

    function handleMouseLeave() {
      bounds = null;
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
  }
});
