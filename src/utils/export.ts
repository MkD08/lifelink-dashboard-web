import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ExportColumn<T> = {
  header: string;
  accessor: (row: T) => string | number | boolean | null | undefined;
};

/* ==============================
   CSV CLEAN ✅
============================== */
export function exportToCsv<T>(
  filename: string,
  rows: T[],
  columns: ExportColumn<T>[]
) {
  if (!rows.length) {
    alert("Aucune donnée à exporter");
    return;
  }

  const headers = columns.map((col) => col.header);

  const csvRows = rows.map((row) =>
    columns.map((col) => {
      const value = col.accessor(row);
      return `"${String(value ?? "").replace(/"/g, '""')}"`;
    })
  );

  const csvContent =
    "\uFEFF" +
    [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ==============================
   PDF PRO FINAL 🔥🔥🔥
============================== */
export function exportToPdf<T>(
  filename: string,
  title: string,
  rows: T[],
  columns: ExportColumn<T>[]
) {
  if (!rows.length) {
    alert("Aucune donnée à exporter");
    return;
  }

  // 🔥 AUTO LANDSCAPE SI BEAUCOUP DE COLONNES
  const isWide = columns.length > 6;
  const doc = new jsPDF(isWide ? "landscape" : "portrait");

  /* =============================
     HEADER
  ============================== */
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, pageWidth, 22, "F");

  doc.setTextColor(255);
  doc.setFontSize(14);
  doc.text("LifeLink", 14, 14);

/* =============================
   LOGO CERCLE PRO 🔥
============================= */
const img = new Image();
img.crossOrigin = "anonymous"; // important si besoin
img.src = window.location.origin + "/logo.png";

img.onload = () => {
  const size = 30;

  // 🎯 canvas pour cercle
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (ctx) {
    // cercle
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // image
    ctx.drawImage(img, 0, 0, size, size);
  }

  const circularImg = canvas.toDataURL("image/png");

  try {
    doc.addImage(
      circularImg,
      "PNG",
      pageWidth - 40,
      4,
      14,
      14
    );
  } catch {}

  generatePdf(doc);
};

img.onerror = () => {
  generatePdf(doc);
};

  function generatePdf(doc: jsPDF) {
    /* TITLE */
    doc.setTextColor(0);
    doc.setFontSize(18);
    doc.text(title, 14, 32);

    /* DATE */
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Exporté le : ${new Date().toLocaleDateString("fr-FR")}`,
      14,
      38
    );

    /* =============================
       TABLE 🔥 FIX PRINCIPAL
    ============================== */
    autoTable(doc, {
      startY: 45,

      head: [columns.map((c) => c.header)],

      body: rows.map((row) =>
        columns.map((col) => String(col.accessor(row) ?? ""))
      ),

      styles: {
        fontSize: 9,
        cellPadding: 4,
        overflow: "linebreak", // 🔥 FIX TEXTE COUPÉ
        cellWidth: "wrap",     // 🔥 ADAPTATION AUTO
        valign: "middle",
      },

      headStyles: {
        fillColor: [220, 38, 38],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },

      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },

      margin: { left: 14, right: 14 },

      didDrawPage: () => {
        const pageHeight = doc.internal.pageSize.height;

        doc.setFontSize(9);
        doc.setTextColor(120);

        doc.text(
          "LifeLink - Plateforme de gestion de don de sang",
          14,
          pageHeight - 10
        );

        doc.text(
          `Page ${doc.getNumberOfPages()}`,
          pageWidth - 30,
          pageHeight - 10
        );
      },
    });

    doc.save(`${filename}.pdf`);
  }
}