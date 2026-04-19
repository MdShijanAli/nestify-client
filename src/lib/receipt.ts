import type { Booking } from "@/context/AppContext";

export function downloadReceipt(b: Booking) {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>Receipt ${b.txnId}</title>
<style>
  *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
  body{margin:0;padding:40px;background:#f4f6f8;color:#1a202c}
  .card{max-width:680px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,.08)}
  .hdr{background:linear-gradient(135deg,#1e3a8a,#0ea5e9);color:#fff;padding:28px 32px;display:flex;justify-content:space-between;align-items:center}
  .hdr h1{margin:0;font-size:22px;letter-spacing:.5px}
  .hdr .badge{background:rgba(255,255,255,.2);padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600}
  .body{padding:32px}
  h2{font-size:16px;margin:24px 0 10px;color:#1e3a8a}
  table{width:100%;border-collapse:collapse;font-size:14px}
  td{padding:10px 0;border-bottom:1px solid #edf2f7}
  td.label{color:#64748b;width:42%}
  td.val{font-weight:600;text-align:right}
  .total{background:#f0fdf4;border-radius:10px;padding:18px 22px;margin-top:24px;display:flex;justify-content:space-between;align-items:center}
  .total .amt{font-size:24px;font-weight:700;color:#16a34a}
  .ftr{padding:20px 32px;text-align:center;font-size:12px;color:#64748b;border-top:1px solid #edf2f7}
  .stamp{display:inline-block;border:2px solid #16a34a;color:#16a34a;padding:6px 14px;border-radius:6px;font-weight:700;letter-spacing:1px;transform:rotate(-4deg);margin-top:12px}
  @media print {body{background:#fff;padding:0}.card{box-shadow:none}}
</style></head>
<body>
  <div class="card">
    <div class="hdr">
      <div>
        <div style="font-size:11px;opacity:.85">Powered by SSLCOMMERZ</div>
        <h1>Payment Receipt</h1>
      </div>
      <div class="badge">SANDBOX</div>
    </div>
    <div class="body">
      <h2>Transaction</h2>
      <table>
        <tr><td class="label">Transaction ID</td><td class="val">${b.txnId}</td></tr>
        <tr><td class="label">Booking ID</td><td class="val">${b.id}</td></tr>
        <tr><td class="label">Date</td><td class="val">${new Date(b.date).toLocaleString()}</td></tr>
        <tr><td class="label">Method</td><td class="val">${b.method.toUpperCase()}</td></tr>
        <tr><td class="label">Status</td><td class="val" style="color:#16a34a">${b.status.toUpperCase()}</td></tr>
      </table>

      <h2>Property</h2>
      <table>
        <tr><td class="label">Title</td><td class="val">${b.propertyTitle}</td></tr>
        <tr><td class="label">Property ID</td><td class="val">${b.propertyId}</td></tr>
        <tr><td class="label">Address</td><td class="val">${b.propertyAddress}</td></tr>
      </table>

      <h2>Customer</h2>
      <table>
        <tr><td class="label">Name</td><td class="val">${b.customerName}</td></tr>
        <tr><td class="label">Email</td><td class="val">${b.customerEmail}</td></tr>
      </table>

      <div class="total">
        <span style="font-weight:600">Total Paid</span>
        <span class="amt">$${b.amount.toLocaleString()}</span>
      </div>

      <div style="text-align:center"><div class="stamp">PAID</div></div>
    </div>
    <div class="ftr">
      Thank you for your booking. This is a system-generated receipt.<br/>
      EstateHub • Sandbox transaction (no real funds were charged)
    </div>
  </div>
  <script>window.onload=()=>setTimeout(()=>window.print(),300)</script>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank");
  if (!w) {
    // Fallback: download as file
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${b.txnId}.html`;
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
