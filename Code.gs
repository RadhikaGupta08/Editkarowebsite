/**
 * EDITKARO — Google Apps Script backend
 * Contact form aur newsletter dono yahin save hote hain (Google Sheet me).
 *
 * SETUP (ek baar):
 * 1. Ek nayi Google Sheet banao -> Extensions -> Apps Script
 * 2. Ye poora code wahan paste karo (purana code hata do) -> Save
 * 3. Deploy -> New deployment -> type: Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Authorize karo, phir jo "Web app URL" mile use js/config.js me scriptURL me daalo
 * 5. Code badalne par: Deploy -> Manage deployments -> Edit -> Version: New version
 */

// Optional: is email par har naye contact message ka notification aayega ("" = off)
const NOTIFY_EMAIL = "";

// Optional: agar script Sheet se bound nahi hai to Sheet ID yahan daalo
const SHEET_ID = "";


function doPost(e) {

  const lock = LockService.getScriptLock();

  try {

    lock.waitLock(10000);

    const raw = e && e.postData ? e.postData.contents : "";

    const data = JSON.parse(raw);

    if (data.type === "contact") return handleContact_(data);

    if (data.type === "newsletter") return handleNewsletter_(data);

    return json_({ status: "error", message: "Unknown form type" });

  } catch (error) {

    return json_({ status: "error", message: String(error) });

  } finally {

    lock.releaseLock();

  }

}


// Browser me URL kholne par check karne ke liye
function doGet() {
  return json_({ status: "success", message: "Editkaro form endpoint is running" });
}


function handleContact_(data) {

  const name = clean_(data.name, 100);
  const email = clean_(data.email, 150);
  const phone = clean_(data.phone, 20);
  const message = clean_(data.message, 2000);

  if (!name || !message) {
    return json_({ status: "error", message: "Name and message are required" });
  }

  if (!isEmail_(email)) {
    return json_({ status: "error", message: "Invalid email" });
  }

  const sheet = getSheet_("Contacts", ["Timestamp", "Name", "Email", "Phone", "Message"]);

  sheet.appendRow([new Date(), safe_(name), safe_(email), safe_(phone), safe_(message)]);

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail(
      NOTIFY_EMAIL,
      "New Editkaro enquiry from " + name,
      "Name: " + name + "\nEmail: " + email + "\nPhone: " + phone + "\n\n" + message
    );
  }

  return json_({ status: "success" });

}


function handleNewsletter_(data) {

  const email = clean_(data.email, 150).toLowerCase();

  if (!isEmail_(email)) {
    return json_({ status: "error", message: "Invalid email" });
  }

  const sheet = getSheet_("Newsletter", ["Timestamp", "Email"]);

  const last = sheet.getLastRow();

  // Duplicate email dobara save nahi hoga
  if (last > 1) {
    const existing = sheet.getRange(2, 2, last - 1, 1).getValues().flat();
    if (existing.indexOf(email) !== -1) return json_({ status: "success" });
  }

  sheet.appendRow([new Date(), email]);

  return json_({ status: "success" });

}


/* ---------- helpers ---------- */

function getSheet_(name, headers) {

  const book = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  let sheet = book.getSheetByName(name);

  if (!sheet) {
    sheet = book.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }

  return sheet;

}

function clean_(value, max) {
  return String(value || "").trim().slice(0, max);
}

// Sheet formula injection se bachne ke liye (=, +, -, @ se start hone wali values)
function safe_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function isEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function json_(object) {
  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
