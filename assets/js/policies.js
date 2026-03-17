/**
 * Policy acceptance modal (PayHere requirement helper)
 * - Shows once per browser (persisted in localStorage)
 * - Forces explicit acceptance (no backdrop click / ESC)
 * - Provides links to Refund / Privacy / Terms pages
 */
(function () {
  "use strict";

  var POLICY_VERSION = "2026-03-17";
  var STORAGE_KEY = "policyAcceptance.v" + POLICY_VERSION;

  function isPolicyPage() {
    var p = (window.location.pathname || "").toLowerCase();
    return (
      p.endsWith("/refund-policy.html") ||
      p.endsWith("/privacy-policy.html") ||
      p.endsWith("/terms-and-conditions.html")
    );
  }

  function hasAccepted() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "accepted";
    } catch (e) {
      return false;
    }
  }

  function setAccepted() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch (e) {
      // If storage is blocked, we still allow session continuation.
    }
  }

  function ensureModalMarkup() {
    if (document.getElementById("policyAcceptModal")) return;

    var wrap = document.createElement("div");
    wrap.innerHTML =
      '' +
      '<div class="modal fade" id="policyAcceptModal" tabindex="-1" aria-labelledby="policyAcceptModalLabel" aria-hidden="true">' +
      '  <div class="modal-dialog modal-dialog-centered">' +
      '    <div class="modal-content">' +
      '      <div class="modal-header">' +
      '        <h5 class="modal-title" id="policyAcceptModalLabel">Policies &amp; Terms</h5>' +
      "      </div>" +
      '      <div class="modal-body">' +
      '        <p class="mb-2">Before continuing, please review and accept our policies:</p>' +
      '        <ul class="mb-3">' +
      '          <li><a href="refund-policy.html" target="_blank" rel="noopener">Refund Policy</a></li>' +
      '          <li><a href="privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a></li>' +
      '          <li><a href="terms-and-conditions.html" target="_blank" rel="noopener">Terms &amp; Conditions</a></li>' +
      "        </ul>" +
      '        <div class="form-check">' +
      '          <input class="form-check-input" type="checkbox" value="" id="policyAcceptCheck">' +
      '          <label class="form-check-label" for="policyAcceptCheck">' +
      "            I have read and accept the Refund Policy, Privacy Policy and Terms &amp; Conditions." +
      "          </label>" +
      "        </div>" +
      "      </div>" +
      '      <div class="modal-footer">' +
      '        <button type="button" class="btn btn-primary" id="policyAcceptBtn" disabled>Accept</button>' +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "</div>";

    // Append actual modal element
    document.body.appendChild(wrap.firstChild);
  }

  function wireModal() {
    var checkbox = document.getElementById("policyAcceptCheck");
    var btn = document.getElementById("policyAcceptBtn");

    if (!checkbox || !btn) return;

    checkbox.addEventListener("change", function () {
      btn.disabled = !checkbox.checked;
    });

    btn.addEventListener("click", function () {
      if (!checkbox.checked) return;
      setAccepted();
      var el = document.getElementById("policyAcceptModal");
      var instance = window.bootstrap && window.bootstrap.Modal ? window.bootstrap.Modal.getInstance(el) : null;
      if (instance) instance.hide();
    });
  }

  function showModal() {
    var el = document.getElementById("policyAcceptModal");
    if (!el || !(window.bootstrap && window.bootstrap.Modal)) return;

    var modal = new window.bootstrap.Modal(el, {
      backdrop: "static",
      keyboard: false,
      focus: true,
    });
    modal.show();
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (isPolicyPage()) return;
    if (hasAccepted()) return;
    ensureModalMarkup();
    wireModal();
    showModal();
  });
})();

