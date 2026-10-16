window.App = window.App || {};

(function (App) {
  App.documentPage = {
    // Longer company or cargo descriptions may increase actual table row heights.
    // Preserve the reference coordinates for normal entries; only move lower blocks
    // when otherwise they would physically overlap the table.
    preventContentOverlap() {
      const page = App.dom.byId("documentPage");
      const table = page?.querySelector(".info-table");
      const qr = App.dom.byId("qrArea");
      const notes = page?.querySelector(".notes");
      if (!page || !table || !qr || !notes) return;

      const pixelsPerMm = 96 / 25.4;
      const referenceTableBottom = 154.7534 * pixelsPerMm;
      const extraTableHeight = Math.max(0, table.offsetTop + table.offsetHeight - referenceTableBottom);
      const offset = extraTableHeight > 1 ? extraTableHeight : 0;

      // The QR image must always stay at the exact reference PDF coordinates.
      // Only the following notes can move when exceptionally long table content overflows.
      qr.style.removeProperty("top");
      notes.style.top = offset ? `calc(190.636mm + ${offset}px)` : "";
    },

    // Maintain the same A4 composition in portrait and landscape.
    fitToViewport() {
      const viewport = App.dom.byId("documentViewport");
      const page = App.dom.byId("documentPage");
      if (!viewport || !page || window.matchMedia("print").matches) return;

      this.preventContentOverlap();

      // offsetWidth and scrollHeight are the original untransformed page dimensions.
      const originalWidth = page.offsetWidth;
      const availableWidth = viewport.clientWidth;
      if (!originalWidth || !availableWidth) return;
      const scale = Math.min(1, availableWidth / originalWidth);

      viewport.classList.add("is-fitted");
      page.style.transform = `scale(${scale})`;
      viewport.style.height = `${Math.ceil(page.scrollHeight * scale)}px`;
    },

    scheduleViewportFit() {
      if (this._fitFrame != null) cancelAnimationFrame(this._fitFrame);
      this._fitFrame = requestAnimationFrame(() => {
        this._fitFrame = null;
        this.fitToViewport();
      });
    },

    setupViewportFit() {
      const viewport = App.dom.byId("documentViewport");
      const page = App.dom.byId("documentPage");
      if (!viewport || !page) return;

      this.scheduleViewportFit();
      window.addEventListener("resize", () => this.scheduleViewportFit(), { passive: true });
      window.addEventListener("orientationchange", () => this.scheduleViewportFit(), { passive: true });
      window.visualViewport?.addEventListener("resize", () => this.scheduleViewportFit(), { passive: true });
      document.fonts?.ready.then(() => this.scheduleViewportFit());
      page.querySelectorAll("img").forEach((image) => {
        if (!image.complete) {
          image.addEventListener("load", () => this.scheduleViewportFit(), { once: true });
          image.addEventListener("error", () => this.scheduleViewportFit(), { once: true });
        }
      });
      if (typeof MutationObserver !== "undefined") {
        const observer = new MutationObserver(() => this.scheduleViewportFit());
        observer.observe(page, { childList: true, subtree: true, characterData: true });
      }
    },

    printRequiredFields: [
      { key: "doc_id", label: "رقم الوثيقة" },
      { key: "date_str", label: "تاريخ الوثيقة" },
      { key: "time_str", label: "التوقيت" },
      { key: "company_name_project", label: "اسم الشركة / المشروع" },
      { key: "license_approval_number", label: "رقم الإجازة / الموافقة" },
      { key: "driver_name", label: "اسم السائق" },
      { key: "vehicle_number", label: "رقم العجلة" },
      { key: "destination_governorate", label: "الوجهة النهائية / المحافظة" }
    ],

    printWarningFields: [
      { key: "checkpoint_name_control", label: "اسم سيطرة الدخول" },
      { key: "registration_governorate", label: "محافظة تسجيل العجلة" },
      { key: "cargo_typedetails", label: "نوع / تفاصيل الحمولة" },
      { key: "weight_quantity", label: "الوزن / الكمية" }
    ],

    fill() {
      const page = App.dom.byId("documentPage");
      if (!page) return;

      const doc = App.storage.getDoc();
      const required = this.getMissingDocFields(this.printRequiredFields, doc);

      if (required.length && !App.storage.hasDoc()) {
        page.innerHTML = `
          <div style="max-width:720px;margin:40px auto;padding:24px;border-radius:16px;background:#fff;box-shadow:0 8px 30px rgba(0,0,0,.08);text-align:center">
            <h2 style="margin:0 0 12px;color:#a40000">لا توجد وثيقة محفوظة لعرضها</h2>
            <p style="margin:0 0 18px;line-height:1.9">ارجع إلى صفحة التعبئة وأنشئ الوثيقة أولًا، ثم ستظهر هنا بشكل صحيح.</p>
            <a href="form.html" style="display:inline-block;padding:10px 18px;border-radius:10px;background:#a40000;color:#fff;text-decoration:none;font-weight:700">العودة إلى صفحة التعبئة</a>
          </div>
        `;
        return;
      }

      document.querySelectorAll("[data-out]").forEach(function (element) {
        const key = element.getAttribute("data-out");
        let value = doc[key] || "";
        if (key === "date_str" || key === "license_approval_date" || key === "current_date") {
          value = App.utils.formatDateForDisplay(value);
        }
        element.textContent = value;
      });

      const tbody = App.dom.byId("itemsBody");
      const itemsHeader = App.dom.byId("itemsHeader");
      const items = App.utils.normalizeItems(doc);

      if (tbody && itemsHeader) {
        if (items.length) {
          itemsHeader.style.display = "";
          tbody.innerHTML = items.map(function (item) {
            return `
              <tr>
                <td>${App.utils.safeText(item.item_name)}</td>
                <td class="ltr-right">${App.utils.safeText(item.production_capacity)} ${App.utils.safeText(item.unit)}</td>
              </tr>
            `;
          }).join("");
        } else {
          itemsHeader.style.display = "none";
          tbody.innerHTML = "";
        }
      }

      const qrArea = App.dom.byId("qrArea");
      if (qrArea) {
        const src = App.utils.getQrSrc(doc);
        if (src) {
          qrArea.innerHTML = `<img src="${App.utils.safeText(src)}" alt="QR" class="barcode-img qr-code" crossorigin="anonymous">`;
        } else {
          qrArea.innerHTML = '<div class="qr-empty"></div>';
        }
      }
    },

    getMissingDocFields(fields, doc) {
      return fields.filter((field) => !String(doc?.[field.key] ?? "").trim());
    },

    validateBeforePrint() {
      const doc = App.storage.getDoc();
      const missingRequired = this.getMissingDocFields(this.printRequiredFields, doc);

      if (missingRequired.length) {
        window.alert(`ما أگدر أكمل العملية لأن بعض الحقول المطلوبة ناقصة:\n- ${missingRequired.map((field) => field.label).join("\n- ")}\n\nارجع إلى صفحة التعبئة وكملها أولًا.`);
        return false;
      }

      const missingWarnings = this.getMissingDocFields(this.printWarningFields, doc);
      if (missingWarnings.length) {
        return window.confirm(
          `ملاحظة: توجد حقول مهمة لكنها غير إلزامية وما زالت فارغة:\n- ${missingWarnings.map((field) => field.label).join("\n- ")}\n\nهل تريد المتابعة؟`
        );
      }

      return true;
    },

    async waitForImages(container) {
      const images = Array.from(container.querySelectorAll("img"));
      await Promise.all(images.map((image) => new Promise((resolve) => {
        if (image.complete) {
          resolve();
          return;
        }
        const done = () => resolve();
        image.addEventListener("load", done, { once: true });
        image.addEventListener("error", done, { once: true });
      })));
    },

    /*
     * html2canvas on iOS can split Arabic shaping.
     * Keep visual decoration in the first pass; draw each complete text line
     * using native Canvas text shaping, at its CSS-computed A4 position.
     */
    exportTextSelector() {
      return ".header-right > div, .meta-label, .meta-value, .doc-title, " +
        ".subject-row > strong, .subject-box, .info-table th, .info-table td, " +
        ".notes p, .notes a, .footer-center > div, .footer-right > div";
    },

    getExportTextLines(el, previewScale) {
      const str = el.textContent.replace(/\s+/g, " ").trim();
      if (!str) return [];
      if (getComputedStyle(el).whiteSpace.includes("nowrap")) return [str];
      const node = Array.from(el.childNodes).find(n => n.nodeType === 3 && n.textContent.trim())
        || el.firstElementChild?.firstChild;
      if (!node || node.nodeType !== 3) return [str];
      const source = node.textContent;
      const range = document.createRange();
      const groups = [];
      // Read actual browser line breaks one Unicode code point at a time.
      // Each line is rendered in one fillText call to preserve Arabic ligatures.
      for (let offset = 0; offset < source.length;) {
        const char = String.fromCodePoint(source.codePointAt(offset));
        const size = char.length;
        range.setStart(node, offset);
        range.setEnd(node, offset + size);
        const rect = range.getBoundingClientRect();
        if (rect.height) {
          const top = rect.top / previewScale;
          let group = groups[groups.length - 1];
          if (!group || Math.abs(group.top - top) > 2) {
            group = {top, characters: []};
            groups.push(group);
          }
          group.characters.push(char);
        } else if (groups.length) {
          groups[groups.length - 1].characters.push(char);
        }
        offset += size;
      }
      range.detach?.();
      const lines = groups.map(g => g.characters.join("").replace(/\s+/g, " ").trim()).filter(Boolean);
      return lines.length ? lines : [str];
    },

    paintExportText(canvas, page) {
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("تعذر إنشاء صورة الوثيقة");
      const pageRect = page.getBoundingClientRect();
      const previewScale = pageRect.width / page.offsetWidth || 1;
      const rasterScale = canvas.width / page.offsetWidth;
      ctx.save();
      // html2canvas leaves its scale transform on the returned 2D context.
      // Reset it first: otherwise scaling again multiplies the text size and
      // position by devicePixelRatio (3x on many iPhones).
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(rasterScale, rasterScale);

      for (const el of page.querySelectorAll(this.exportTextSelector())) {
        const value = el.textContent.trim();
        if (!value) continue;
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        const rect = el.getBoundingClientRect();
        const x = (rect.left - pageRect.left) / previewScale;
        const y = (rect.top - pageRect.top) / previewScale;
        const w = rect.width / previewScale;
        const height = rect.height / previewScale;
        if (w < 1 || height < 1) continue;

        const lines = this.getExportTextLines(el, previewScale);
        const fontSize = parseFloat(style.fontSize) || 11;
        const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.2;
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        ctx.fillStyle = style.color;
        ctx.textBaseline = "middle";
        ctx.direction = style.direction === "rtl" ? "rtl" : "ltr";
        const padL = parseFloat(style.paddingLeft) || 0;
        const padR = parseFloat(style.paddingRight) || 0;
        const usableWidth = Math.max(1, w - padL - padR);
        const align = style.textAlign;
        let textX;
        if (align === "center") {
          ctx.textAlign = "center";
          textX = x + w / 2;
        } else if (align === "left" || (align === "start" && ctx.direction === "ltr")
            || (align === "end" && ctx.direction === "rtl")) {
          ctx.textAlign = "left";
          textX = x + padL;
        } else {
          ctx.textAlign = "right";
          textX = x + w - padR;
        }
        const firstLine = y + height / 2 - (lines.length - 1) * lineHeight / 2;
        lines.forEach((line, k) => {
          // Measured notes must not be compressed with canvas maxWidth.
          if (el.closest(".notes")) {
            ctx.fillText(line, textX, firstLine + k * lineHeight);
          } else {
            ctx.fillText(line, textX, firstLine + k * lineHeight, usableWidth);
          }
        });
      }
      ctx.restore();
    },

    async renderDocumentCanvas() {
      const docElement = App.dom.byId("documentPage");
      if (!docElement) throw new Error("تعذر العثور على الوثيقة");

      if (!window.html2canvas) {
        throw new Error("مكتبة تحويل الصفحة إلى صورة غير محمّلة");
      }

      await this.waitForImages(docElement);
      // Make the captured document use the final Cairo fonts, not a fallback font.
      if (document.fonts?.ready) await document.fonts.ready;

      const canvas = await window.html2canvas(docElement, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        scale: Math.max(window.devicePixelRatio || 1, 2),
        scrollX: 0,
        scrollY: 0,
        // The A4 page has a fixed width even when the phone preview is scaled.
        // Do not include the scaled viewport in the exported pixel dimensions.
        width: docElement.offsetWidth,
        height: docElement.scrollHeight,
        windowWidth: Math.max(1024, docElement.offsetWidth),
        windowHeight: docElement.scrollHeight,
        onclone(clonedDocument) {
          // Export the unscaled A4 page, not the reduced phone preview.
          const clonedViewport = clonedDocument.getElementById("documentViewport");
          const clonedPage = clonedDocument.getElementById("documentPage");
          if (clonedViewport) {
            clonedViewport.classList.remove("is-fitted");
            clonedViewport.style.height = "auto";
            clonedViewport.style.width = "210mm";
            clonedViewport.style.maxWidth = "none";
            clonedViewport.style.overflow = "visible";
          }
          if (clonedPage) {
            clonedPage.style.transform = "none";
            clonedPage.style.position = "relative";
            clonedPage.style.top = "auto";
            clonedPage.style.left = "auto";
            clonedPage.style.right = "auto";
            const textSelectors = App.documentPage.exportTextSelector() + ", .notes a b";
            clonedPage.querySelectorAll(textSelectors).forEach(el =>
              el.style.setProperty("color", "transparent", "important"));
          }
        }
      });
      this.paintExportText(canvas, docElement);
      return canvas;
    },

    triggerBlobDownload(blob, fileName) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    },

    buildExportFileBaseName() {
      const doc = App.storage.getDoc();
      const company = String(doc.company_name_project || "document").trim().replace(/[^\p{L}\p{N}\-_ ]/gu, "").replace(/\s+/g, "_");
      const id = String(doc.doc_id || "000000").trim();
      return `shipment_document_${id}_${company || "company"}`;
    },

    async downloadImage() {
      if (!this.validateBeforePrint()) return;

      try {
        const canvas = await this.renderDocumentCanvas();
        const fileName = `${this.buildExportFileBaseName()}.png`;

        if (canvas.toBlob) {
          canvas.toBlob((blob) => {
            if (!blob) {
              window.alert("تعذر إنشاء ملف الصورة");
              return;
            }
            this.triggerBlobDownload(blob, fileName);
          }, "image/png");
          return;
        }

        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = fileName;
        link.click();
      } catch (error) {
        console.error(error);
        window.alert("تعذر تنزيل صورة الوثيقة. تأكد من تحميل الصفحة والاتصال بالإنترنت إن كان QR خارجيًا.");
      }
    },

    // Recover if Safari's installed web app blocks scripts from an external CDN.
    // All retries use files hosted on the same Cloudflare Pages origin.
    loadLocalExportLibrary(globalReady, path) {
      if (globalReady()) return Promise.resolve();
      this._libraryLoads = this._libraryLoads || {};
      if (this._libraryLoads[path]) return this._libraryLoads[path];
      this._libraryLoads[path] = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = path;
        script.async = true;
        script.onload = () => globalReady()
          ? resolve()
          : reject(new Error("ملف مكتبة PDF غير صالح: " + path));
        script.onerror = () => reject(new Error(
          "تعذّر تحميل ملفات PDF من الموقع. أغلق التطبيق وافتح رابط الوثيقة الجديد."
        ));
        document.head.appendChild(script);
      }).catch(error => {
        delete this._libraryLoads[path];
        throw error;
      });
      return this._libraryLoads[path];
    },

    async ensureExportLibraries() {
      await this.loadLocalExportLibrary(
        () => typeof window.html2canvas === "function",
        "/vendor/html2canvas.min.js?v=1.4.1"
      );
      await this.loadLocalExportLibrary(
        () => !!window.jspdf?.jsPDF,
        "/vendor/jspdf.umd.min.js?v=2.5.2"
      );
    },

    /*
     * Create a proper application/pdf file at the original 210 × 297 mm size.
     * iOS Home Screen web apps don't always support FileSaver/jsPDF.save().
     * Prepare the PDF in advance: navigator.share() needs a fresh user gesture.
     */
    isIOSDevice() {
      return /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    },

    pdfName() {
      return `${this.buildExportFileBaseName()}.pdf`;
    },

    async createPdfFile() {
      await this.ensureExportLibraries();
      const canvas = await this.renderDocumentCanvas();
      if (!canvas.width || !canvas.height) {
        throw new Error("لم تكتمل صورة الوثيقة. انتظر تحميلها ثم حاول مجدداً.");
      }

      const PAGE_WIDTH_MM = 210;
      const PAGE_HEIGHT_MM = 297;
      const renderedHeightMm = canvas.height / canvas.width * PAGE_WIDTH_MM;
      const pageCount = Math.max(1, Math.ceil((renderedHeightMm - 0.5) / PAGE_HEIGHT_MM));
      const imageData = canvas.toDataURL("image/png");
      const pdf = new window.jspdf.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
        precision: 16
      });

      for (let i = 0; i < pageCount; i++) {
        if (i > 0) pdf.addPage("a4", "portrait");
        pdf.addImage(imageData, "PNG", 0, -i * PAGE_HEIGHT_MM,
          PAGE_WIDTH_MM, renderedHeightMm, "a4-document", "FAST");
      }

      const blob = pdf.output("blob");
      if (!blob || blob.size < 100 || !blob.type.includes("pdf")) {
        throw new Error("تعذر إنشاء ملف PDF صالح.");
      }
      return new File([blob], this.pdfName(), { type: "application/pdf" });
    },

    preparePdfFile() {
      if (this._preparedPdfFile) return Promise.resolve(this._preparedPdfFile);
      if (this._pdfPromise) return this._pdfPromise;
      this._pdfPromise = this.createPdfFile()
        .then((file) => {
          this._preparedPdfFile = file;
          this._pdfPromise = null;
          const button = App.dom.byId("downloadPdfBtn");
          if (button && button.textContent.includes("جار")) {
            button.textContent = "⬇ تنزيل PDF";
          }
          return file;
        })
        .catch((error) => {
          this._pdfPromise = null;
          this._pdfPreparationError = error;
          throw error;
        });
      return this._pdfPromise;
    },

    showPdfOpenLink(file) {
      // The link needs its OWN tap on iOS if native file sharing is unavailable.
      // Opening a blob URL automatically after an await can produce "not supported".
      const toolbar = document.querySelector(".toolbar");
      const button = App.dom.byId("downloadPdfBtn");
      if (!toolbar || !button) return;
      if (this._pdfObjectUrl) URL.revokeObjectURL(this._pdfObjectUrl);
      this._pdfObjectUrl = URL.createObjectURL(file);
      let link = App.dom.byId("openGeneratedPdfBtn");
      if (!link) {
        link = document.createElement("a");
        link.id = "openGeneratedPdfBtn";
        link.className = "secondary";
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "📄 فتح PDF في Safari";
        button.insertAdjacentElement("afterend", link);
      }
      link.href = this._pdfObjectUrl;
      // Do not set download here: iOS should preview the PDF, not reject a download.
    },

    savePdfOnDesktop(file) {
      this.triggerBlobDownload(file, file.name);
    },

    async downloadPdf() {
      if (!this.validateBeforePrint()) return;
      const button = App.dom.byId("downloadPdfBtn");
      const file = this._preparedPdfFile;

      if (file) {
        if (this.isIOSDevice()) {
          // This is executed synchronously inside the button click, before any await.
          // Web Share presents "Save to Files" in the native iPhone share sheet.
          const shareData = { files: [file], title: "وثيقة الكمارك" };
          if (typeof navigator.share === "function" &&
              (typeof navigator.canShare !== "function" || navigator.canShare(shareData))) {
            try {
              await navigator.share(shareData);
              return;
            } catch (error) {
              if (error?.name === "AbortError") return; // User cancelled.
              console.warn("Native iOS PDF share unavailable:", error);
            }
          }
          this.showPdfOpenLink(file);
          window.alert("اضغط على «فتح PDF في Safari» ثم استخدم مشاركة ← حفظ في الملفات.");
          return;
        }
        this.savePdfOnDesktop(file);
        return;
      }

      if (button) {
        button.disabled = true;
        button.textContent = "جارٍ تجهيز PDF…";
      }
      try {
        const prepared = await this.preparePdfFile();
        if (this.isIOSDevice()) {
          // iOS requires a separate user tap for navigator.share after async work.
          if (button) button.textContent = "✅ PDF جاهز — اضغط للحفظ";
        } else {
          this.savePdfOnDesktop(prepared);
          if (button) button.textContent = "⬇ تنزيل PDF";
        }
      } catch (error) {
        console.error("PDF export failed", error);
        window.alert(error?.message || "تعذر إنشاء PDF. تحقق من اتصال الإنترنت وأعد المحاولة.");
        if (button) button.textContent = "⬇ إعادة محاولة PDF";
      } finally {
        if (button) button.disabled = false;
      }
    },

    startPdfPreparation() {
      // Don't create a PDF containing the demo/empty document.
      if (!App.storage.hasDoc()) return;
      const doc = App.storage.getDoc();
      if (this.getMissingDocFields(this.printRequiredFields, doc).length) return;
      requestAnimationFrame(() => {
        void this.preparePdfFile().catch((error) => {
          console.warn("PDF pre-generation deferred until user requests it:", error);
        });
      });
    },

    printLikeOriginal() {
      if (!this.validateBeforePrint()) return;

      const docElement = App.dom.byId("documentPage");
      if (!docElement) {
        window.print();
        return;
      }

      const html = docElement.outerHTML;
      const win = window.open("", "_blank", "width=900,height=1000");
      if (!win) {
        window.print();
        return;
      }

      const headParts = [];
      headParts.push('<meta charset="utf-8" />');
      // about:blank needs the original site URL to load fonts and logos.
      const baseTag = win.document.createElement("base");
      baseTag.href = document.baseURI;
      headParts.push(baseTag.outerHTML);
      headParts.push("<title>طباعة الوثيقة</title>");

      document.querySelectorAll('link[rel="stylesheet"], link[rel="preconnect"]').forEach(function (link) {
        const clone = link.cloneNode(true);
        if (clone.getAttribute("rel") === "stylesheet") {
          const href = clone.getAttribute("href");
          if (href) {
            const separator = href.includes("?") ? "&" : "?";
            clone.setAttribute("href", `${href}${separator}print_copy=${Date.now()}`);
          }
        }
        headParts.push(clone.outerHTML);
      });

      document.querySelectorAll("style").forEach(function (styleTag) {
        headParts.push(styleTag.outerHTML);
      });

      headParts.push(`
        <style>
          @page { size: A4; margin: 0; }
          html, body { margin: 0; padding: 0; background: #fff; }
          .a4-page {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 297mm !important;
            box-sizing: border-box;
            display: block !important;
            position: relative !important;
            overflow: hidden !important;
            transform: none !important;
            box-shadow: none !important;
          }
          .toolbar { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        </style>
      `);

      win.document.open();
      win.document.write(`
        <!doctype html>
        <html dir="rtl" lang="ar">
          <head>${headParts.join("\n")}</head>
          <body>${html}</body>
        </html>
      `);
      win.document.close();

      const triggerPrint = function () {
        win.focus();
        win.print();
        win.close();
      };

      if (win.document.readyState === "complete") {
        window.setTimeout(triggerPrint, 300);
      } else {
        win.onload = function () {
          window.setTimeout(triggerPrint, 300);
        };
      }
    },

    bindActions() {
      this.setupViewportFit();
      this.startPdfPreparation();
      const imageBtn = App.dom.byId("downloadImageBtn");
      if (imageBtn) {
        imageBtn.addEventListener("click", () => void this.downloadImage());
      }

      const pdfBtn = App.dom.byId("downloadPdfBtn");
      if (pdfBtn) pdfBtn.addEventListener("click", () => void this.downloadPdf());

      const refreshBtn = App.dom.byId("refreshBtn");
      if (refreshBtn) {
        refreshBtn.addEventListener("click", () => location.reload());
      }
    }
  };

  window.printDocumentLikeOriginal = function () {
    App.documentPage.printLikeOriginal();
  };
})(window.App);
