/* ==========================================================================
   Baguio Getaway Checklist — Vanilla JavaScript Interactive Controller
   Zero external libraries • Persistent localStorage • Accessible interactions
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "baguio_nailong_checklist_v1";

  const NAILONG_POKE_QUOTES = [
    "Duang-duang~! My belly is ready for Baguio strawberry taho & night market skewers! 🍓💛",
    "Rawr~! Don't forget a cozy lavender hoodie—Baguio evenings get super chilly! 🧣💜",
    "Hehe~ Let's hunt for cute vintage jackets at Ukay-ukay! 🧥🩷",
    "Wheee~! Ferris wheel photos at Sky Ranch are gonna look magical! 🎡✨",
    "Ube jam, lengua de gato, strawberry crinkles... save space for pasalubong! 🛍️🍓",
    "Take lots of cute photos at Burnham Park, Botanical Garden & Mansion House! 📸🌸"
  ];

  let pokeIndex = 0;
  let currentFilter = "all";

  // Default state
  let state = {
    checked: {},
    customStops: {
      "rides-tour": [],
      "downtown-tour": [],
      "homebound-tour": []
    },
    revertedSwap: false, // false = Day 1 & Day 2 swapped as requested; true = toggled back
    notes: ""
  };

  // DOM References
  const daysStack = document.getElementById("days-stack");
  const overallText = document.getElementById("overall-progress-text");
  const overallFill = document.getElementById("overall-progress-fill");
  const overallBar = document.getElementById("overall-progressbar");
  const nailongQuote = document.getElementById("nailong-quote");
  const pokeBtn = document.getElementById("poke-nailong-btn");
  const burstLayer = document.getElementById("burst-layer");
  const swapBtn = document.getElementById("swap-days-btn");
  const expandCollapseBtn = document.getElementById("expand-collapse-btn");
  const resetBtn = document.getElementById("reset-all-btn");
  const notesInput = document.getElementById("trip-notes");
  const notesStatus = document.getElementById("notes-status");

  // Load persisted state safely
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        state.checked = parsed.checked && typeof parsed.checked === "object" ? parsed.checked : {};
        if (parsed.customStops && typeof parsed.customStops === "object") {
          state.customStops["rides-tour"] = Array.isArray(parsed.customStops["rides-tour"])
            ? parsed.customStops["rides-tour"]
            : [];
          state.customStops["downtown-tour"] = Array.isArray(parsed.customStops["downtown-tour"])
            ? parsed.customStops["downtown-tour"]
            : [];
          state.customStops["homebound-tour"] = Array.isArray(parsed.customStops["homebound-tour"])
            ? parsed.customStops["homebound-tour"]
            : [];
        }
        state.revertedSwap = Boolean(parsed.revertedSwap);
        state.notes = typeof parsed.notes === "string" ? parsed.notes : "";
      }
    } catch {
      // Ignore storage read errors in private/restricted contexts
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota or restricted storage errors
    }
  }

  // Progressive View Transition wrapper with accessible focus routing
  function runWithTransition(mutateDomFn, focusElement) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || prefersReduced) {
      mutateDomFn();
      if (focusElement) {
        focusElement.focus({ preventScroll: true });
      }
      return;
    }

    const transition = document.startViewTransition(() => {
      mutateDomFn();
    });

    transition.finished.finally(() => {
      if (focusElement) {
        focusElement.focus({ preventScroll: true });
      }
    });
  }

  // Cute Pastel Heart & Sparkle Burst
  function spawnBurst(originEl, count = 14) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !burstLayer) return;

    const rect = originEl
      ? originEl.getBoundingClientRect()
      : { left: window.innerWidth / 2, top: window.innerHeight / 3, width: 0, height: 0 };

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const symbols = ["🩷", "💜", "💛", "✨", "🌸", "🍓", "⭐"];

    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.className = "burst-particle";
      span.textContent = symbols[i % symbols.length];

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = 55 + Math.random() * 95;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 25;
      const rot = (Math.random() - 0.5) * 90;

      span.style.left = `${cx}px`;
      span.style.top = `${cy}px`;
      span.style.setProperty("--dx", `${dx.toFixed(1)}px`);
      span.style.setProperty("--dy", `${dy.toFixed(1)}px`);
      span.style.setProperty("--rot", `${rot.toFixed(0)}deg`);

      burstLayer.appendChild(span);
      setTimeout(() => span.remove(), 1150);
    }
  }

  // Create DOM element for a custom user-added stop safely (no innerHTML injection)
  function createCustomStopElement(stop, groupKey) {
    const li = document.createElement("li");
    li.className = "timeline-item custom-timeline-item";
    li.dataset.itemId = stop.id;

    const rowWrap = document.createElement("div");
    rowWrap.className = "custom-item-row";

    const label = document.createElement("label");
    label.className = "check-row";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "checkbox-custom main-check";
    input.dataset.id = stop.id;
    input.checked = Boolean(state.checked[stop.id]);

    const content = document.createElement("span");
    content.className = "item-content";

    const top = document.createElement("span");
    top.className = "item-top";

    const timeBadge = document.createElement("span");
    timeBadge.className = "time-badge";
    timeBadge.textContent = `✨ ${stop.time || "Extra Stop"}`;

    const titleSpan = document.createElement("span");
    titleSpan.className = "item-title";
    titleSpan.textContent = stop.title;

    top.appendChild(timeBadge);
    top.appendChild(titleSpan);
    content.appendChild(top);

    label.appendChild(input);
    label.appendChild(content);

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "delete-custom-btn";
    delBtn.setAttribute("aria-label", `Remove ${stop.title}`);
    delBtn.textContent = "✕";

    delBtn.addEventListener("click", () => {
      state.customStops[groupKey] = (state.customStops[groupKey] || []).filter(
        (item) => item.id !== stop.id
      );
      delete state.checked[stop.id];
      li.remove();
      saveState();
      updateAllProgress(false);
    });

    rowWrap.appendChild(label);
    rowWrap.appendChild(delBtn);
    li.appendChild(rowWrap);

    if (input.checked) {
      li.classList.add("is-completed");
    }

    return li;
  }

  // Render saved custom stops into their respective schedule lists
  function renderCustomStops() {
    document.querySelectorAll(".custom-timeline-item").forEach((el) => el.remove());

    Object.keys(state.customStops).forEach((groupKey) => {
      const listEl = document.querySelector(`.timeline-list[data-schedule-group="${groupKey}"]`);
      if (!listEl) return;

      (state.customStops[groupKey] || []).forEach((stop) => {
        listEl.appendChild(createCustomStopElement(stop, groupKey));
      });
    });
  }

  // Synchronize parent checkbox indeterminate & checked states from sub-stops
  function syncParentFromSubstops(parentId) {
    const parentInput = document.querySelector(`.main-check[data-id="${parentId}"]`);
    const subInputs = Array.from(
      document.querySelectorAll(`.sub-check[data-parent="${parentId}"]`)
    );
    if (!parentInput || subInputs.length === 0) return;

    const checkedCount = subInputs.filter((sub) => sub.checked).length;

    subInputs.forEach((sub) => {
      const lbl = sub.closest(".substop-label");
      if (lbl) lbl.classList.toggle("is-sub-checked", sub.checked);
    });

    if (checkedCount === 0) {
      parentInput.checked = false;
      parentInput.indeterminate = false;
      state.checked[parentId] = false;
    } else if (checkedCount === subInputs.length) {
      parentInput.checked = true;
      parentInput.indeterminate = false;
      state.checked[parentId] = true;
    } else {
      parentInput.checked = false;
      parentInput.indeterminate = true;
      state.checked[parentId] = false;
    }

    const itemCard = parentInput.closest(".timeline-item");
    if (itemCard) {
      itemCard.classList.toggle("is-completed", parentInput.checked);
    }
  }

  // Apply saved checkbox states to DOM
  function applySavedChecks() {
    document.querySelectorAll("input.checkbox-custom[data-id]").forEach((input) => {
      const id = input.dataset.id;
      input.checked = Boolean(state.checked[id]);

      const subLabel = input.closest(".substop-label");
      if (subLabel) {
        subLabel.classList.toggle("is-sub-checked", input.checked);
      }

      const itemCard = input.closest(".timeline-item");
      if (itemCard && input.classList.contains("main-check")) {
        itemCard.classList.toggle("is-completed", input.checked);
      }
    });

    // Recompute indeterminate states for multi-stop tours
    document.querySelectorAll(".main-check.has-substops").forEach((parentInput) => {
      syncParentFromSubstops(parentInput.dataset.id);
    });
  }

  // Swap Day 1 & Day 2 contents cleanly (keeping dates Dec 21 = Day 1, Dec 22 = Day 2)
  function swapDayOneAndTwoDom() {
    const day1StickerWrap = document.getElementById("day-1-sticker");
    const day2StickerWrap = document.getElementById("day-2-sticker");
    const day1Subtitle = document.getElementById("day-1-subtitle");
    const day2Subtitle = document.getElementById("day-2-subtitle");
    const day1Body = document.getElementById("day-1-body");
    const day2Body = document.getElementById("day-2-body");

    if (!day1Body || !day2Body) return;

    const list1 = day1Body.querySelector(".timeline-list");
    const list2 = day2Body.querySelector(".timeline-list");
    const form1 = day1Body.querySelector(".add-stop-form");
    const form2 = day2Body.querySelector(".add-stop-form");

    if (list1 && list2 && form1 && form2) {
      day1Body.insertBefore(list2, form1);
      day2Body.insertBefore(list1, form2);
    }

    if (day1StickerWrap && day2StickerWrap) {
      const img1 = day1StickerWrap.querySelector("img");
      const img2 = day2StickerWrap.querySelector("img");
      if (img1 && img2) {
        day1StickerWrap.appendChild(img2);
        day2StickerWrap.appendChild(img1);
      }
    }

    if (day1Subtitle && day2Subtitle) {
      const tmpText = day1Subtitle.textContent;
      day1Subtitle.textContent = day2Subtitle.textContent;
      day2Subtitle.textContent = tmpText;
    }
  }

  // Update progress bar, day badges, filter visibility, and Nailong speech
  function updateAllProgress(allowCelebrate, triggerEl) {
    let totalMain = 0;
    let totalDone = 0;

    [1, 2, 3].forEach((dayNum) => {
      const card = document.getElementById(`day-card-${dayNum}`);
      if (!card) return;

      const checks = Array.from(card.querySelectorAll(".main-check"));
      const done = checks.filter((c) => c.checked).length;
      const count = checks.length;

      totalMain += count;
      totalDone += done;

      const badge = document.getElementById(`day-${dayNum}-badge`);
      if (badge) {
        badge.textContent = `${done} / ${count} done`;
      }

      const pill = document.getElementById(`pill-day-${dayNum}`);
      if (pill) {
        pill.textContent = `Day ${dayNum}: ${done}/${count}`;
        pill.classList.toggle("is-done", count > 0 && done === count);
      }
    });

    const pct = totalMain > 0 ? Math.round((totalDone / totalMain) * 100) : 0;

    if (overallText) {
      overallText.textContent = `${totalDone} / ${totalMain} completed (${pct}%)`;
    }
    if (overallFill) {
      overallFill.style.width = `${pct}%`;
    }
    if (overallBar) {
      overallBar.setAttribute("aria-valuenow", String(pct));
    }

    // Update Nailong's progress status quote
    if (nailongQuote) {
      if (pct === 0) {
        nailongQuote.textContent =
          "Rawr~! Ready for chilly Baguio vibes & strawberry taho? Tap checkboxes as we go! 🍓💜";
      } else if (pct < 40) {
        nailongQuote.textContent =
          "Yay, our Baguio adventure has started! Enjoy the pine breeze & cute photo spots! ✨🩷";
      } else if (pct < 80) {
        nailongQuote.textContent =
          "Over halfway through the trip~! Ukay-ukay finds & night market treats await! 🧥🍢";
      } else if (pct < 100) {
        nailongQuote.textContent =
          "Almost done! Don't forget pasalubong snacks before heading to the bus terminal! 🛍️💛";
      } else {
        nailongQuote.textContent =
          "DUANG-DUANG!! 100% Baguio Trip Complete!! Best pink & purple memories ever!! 🎉💛💜";
      }
    }

    if (allowCelebrate && pct === 100) {
      spawnBurst(triggerEl || pokeBtn, 22);
    }

    applyFilterVisibility();
  }

  // Apply Day / Remaining filter visibility
  function applyFilterVisibility() {
    const cards = document.querySelectorAll(".day-card");
    cards.forEach((card) => {
      const day = card.dataset.day;
      const items = Array.from(card.querySelectorAll(".timeline-item"));

      items.forEach((item) => {
        const isDone = item.classList.contains("is-completed");
        item.classList.toggle("is-hidden-remaining", currentFilter === "remaining" && isDone);
      });

      if (currentFilter === "all") {
        card.classList.remove("is-hidden-by-filter");
      } else if (currentFilter === "remaining") {
        const hasRemaining = items.some((item) => !item.classList.contains("is-completed"));
        card.classList.toggle("is-hidden-by-filter", !hasRemaining);
      } else {
        card.classList.toggle("is-hidden-by-filter", day !== currentFilter);
      }
    });
  }

  // Event Delegation for Checkboxes
  document.addEventListener("change", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement) || !target.classList.contains("checkbox-custom")) {
      return;
    }

    const id = target.dataset.id;
    if (!id) return;

    state.checked[id] = target.checked;

    // Case 1: Parent tour item with sub-stops toggled directly
    if (target.classList.contains("has-substops")) {
      target.indeterminate = false;
      const subs = document.querySelectorAll(`.sub-check[data-parent="${id}"]`);
      subs.forEach((sub) => {
        sub.checked = target.checked;
        state.checked[sub.dataset.id] = target.checked;
        const lbl = sub.closest(".substop-label");
        if (lbl) lbl.classList.toggle("is-sub-checked", target.checked);
      });
    }

    // Case 2: Sub-stop checkbox toggled
    if (target.classList.contains("sub-check") && target.dataset.parent) {
      syncParentFromSubstops(target.dataset.parent);
    }

    // Case 3: Standard main timeline checkbox or packing item
    if (target.classList.contains("main-check")) {
      const itemCard = target.closest(".timeline-item");
      if (itemCard) {
        itemCard.classList.toggle("is-completed", target.checked);
      }

      // Check if this completed its Day card
      const dayCard = target.closest(".day-card");
      if (dayCard && target.checked) {
        const dayChecks = Array.from(dayCard.querySelectorAll(".main-check"));
        if (dayChecks.every((c) => c.checked)) {
          spawnBurst(target, 16);
        }
      }
    } else if (target.classList.contains("pack-check")) {
      const lbl = target.closest(".substop-label");
      if (lbl) lbl.classList.toggle("is-sub-checked", target.checked);
    }

    saveState();
    updateAllProgress(target.checked, target);
  });

  // Add Custom Stop Forms
  document.querySelectorAll(".add-stop-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const timeInput = form.elements.namedItem("time");
      const titleInput = form.elements.namedItem("title");
      const title = titleInput ? titleInput.value.trim() : "";
      const time = timeInput ? timeInput.value.trim() : "";

      if (!title) return;

      const dayBody = form.closest(".day-body");
      const listEl = dayBody ? dayBody.querySelector(".timeline-list") : null;
      if (!listEl) return;

      const groupKey = listEl.dataset.scheduleGroup;
      const newStop = {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        time: time || "Anytime",
        title
      };

      if (!state.customStops[groupKey]) {
        state.customStops[groupKey] = [];
      }
      state.customStops[groupKey].push(newStop);

      const newEl = createCustomStopElement(newStop, groupKey);
      listEl.appendChild(newEl);

      form.reset();
      saveState();
      updateAllProgress(false);
      spawnBurst(newEl, 8);
    });
  });

  // Filter Tabs
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextFilter = btn.dataset.filter || "all";
      if (nextFilter === currentFilter) return;

      runWithTransition(() => {
        currentFilter = nextFilter;
        document.querySelectorAll(".tab-btn").forEach((b) => {
          b.classList.toggle("is-active", b === btn);
        });
        applyFilterVisibility();
      }, daysStack);
    });
  });

  // Swap Day 1 & Day 2 Button
  if (swapBtn) {
    swapBtn.addEventListener("click", () => {
      runWithTransition(() => {
        state.revertedSwap = !state.revertedSwap;
        swapDayOneAndTwoDom();
        saveState();
        updateAllProgress(false);
      }, daysStack);
      spawnBurst(swapBtn, 10);
    });
  }

  // Collapse / Expand All Days Button
  if (expandCollapseBtn) {
    expandCollapseBtn.addEventListener("click", () => {
      const disclosures = Array.from(document.querySelectorAll(".day-disclosure"));
      const anyOpen = disclosures.some((d) => d.open);
      disclosures.forEach((d) => {
        d.open = !anyOpen;
      });
      expandCollapseBtn.textContent = anyOpen ? "▸ Expand All" : "▾ Collapse All";
    });
  }

  // Reset All Progress Button
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const confirmed = window.confirm(
        "Reset all checked activities and packing checkboxes? (Your trip notes & custom stops will stay safe!)"
      );
      if (!confirmed) return;

      state.checked = {};
      saveState();
      applySavedChecks();
      updateAllProgress(false);
    });
  }

  // Interactive Poke Nailong Mascot
  if (pokeBtn) {
    pokeBtn.addEventListener("click", () => {
      pokeBtn.classList.remove("is-jiggling");
      void pokeBtn.offsetWidth; // trigger reflow for repeat squish
      pokeBtn.classList.add("is-jiggling");

      if (nailongQuote) {
        nailongQuote.textContent = NAILONG_POKE_QUOTES[pokeIndex % NAILONG_POKE_QUOTES.length];
        pokeIndex += 1;
      }

      spawnBurst(pokeBtn, 12);
    });
  }

  // Auto-save Trip Notes
  if (notesInput) {
    let saveTimer = null;
    notesInput.addEventListener("input", () => {
      state.notes = notesInput.value;
      if (notesStatus) notesStatus.textContent = "🌸 Saving...";
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        saveState();
        if (notesStatus) notesStatus.textContent = "✨ Auto-saved in your browser";
      }, 300);
    });
  }

  // Initialize on Page Load
  loadState();
  if (state.revertedSwap) {
    swapDayOneAndTwoDom();
  }
  renderCustomStops();
  applySavedChecks();
  if (notesInput) {
    notesInput.value = state.notes;
  }
  updateAllProgress(false);
})();
