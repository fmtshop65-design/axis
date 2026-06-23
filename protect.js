/* ============================================================
   AXIS — basic inspect deterrent
   Disables the right-click context menu and the common developer-tools
   keyboard shortcuts (F12, Ctrl/Cmd+Shift+I / J / C, Ctrl/Cmd+U).
   Note: this is only a deterrent for casual users — it cannot truly
   prevent a determined visitor from viewing the source, since all
   client-side code is delivered to the browser. It is intentionally
   lightweight and does not freeze or break the page.
   ============================================================ */
(function () {
  // Block the right-click context menu.
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  }, { capture: true });

  // Block dev-tools / view-source keyboard shortcuts.
  document.addEventListener('keydown', function (e) {
    var key = (e.key || '').toLowerCase();
    var ctrlOrCmd = e.ctrlKey || e.metaKey;

    // F12 — open dev tools
    if (key === 'f12') { e.preventDefault(); return false; }

    // Ctrl/Cmd + Shift + I / J / C — dev tools, console, inspect element
    if (ctrlOrCmd && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
      e.preventDefault();
      return false;
    }

    // Ctrl/Cmd + U — view page source
    if (ctrlOrCmd && key === 'u') { e.preventDefault(); return false; }

    // Ctrl/Cmd + S — save page (commonly bundled with the request above)
    if (ctrlOrCmd && key === 's') { e.preventDefault(); return false; }
  }, { capture: true });
})();
