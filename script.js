/* ==========================================================================
   Baguio Getaway Checklist — Editable & Auto-Saving Vanilla JS Controller
   Zero external libraries • Instant localStorage auto-save • Accessible UI
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEY_V3 = "baguio_nailong_checklist_v3";
  const STORAGE_KEY_V2 = "baguio_nailong_checklist_v2";
  const STORAGE_KEY_V1 = "baguio_nailong_checklist_v1";

  const NAILONG_POKE_QUOTES = [
    "Duang-duang~! My belly is ready for Baguio strawberry taho & night market skewers! 🍓💛",
    "Rawr~! Don't forget a cozy lavender hoodie—Baguio evenings get super chilly! 🧣💜",
    "Hehe~ Tip: Click ✏️ Edit Checklist (or ✎ on any item) to customize & auto-save! ✨🩷",
    "Wheee~! Ferris wheel photos at Sky Ranch are gonna look magical! 🎡✨",
    "Ube jam, lengua de gato, strawberry crinkles... save space for pasalubong! 🛍️🍓",
    "Take lots of cute photos at Burnham Park, Botanical Garden & Mansion House! 📸🌸"
  ];

  // Canonical Default Data (Original Day 1, Day 2, Day 3 Baguio Itinerary)
  function createDefaultData() {
    return {
      checked: {},
      notes: "",
      days: [
        {
          dayNumber: 1,
          date: "December 21, 2026",
          subtitle: "Arrival • Downtown Baguio • Night Market",
          stickerSrc: "assets/nailong-downtown.jpg",
          stickerAlt:
            "Nailong wearing a pink and purple beanie with a pink travel suitcase and Baguio snacks",
          items: [
            {
              id: "d1-meetup",
              time: "🚌 8:00–9:00 AM",
              title: "Meet-up and arrival",
              desc: "Meet at the bus stop/terminal for Abra and Ilocos.",
              substops: []
            },
            {
              id: "d2-checkin",
              time: "🏨 9:00 AM–12:00 PM",
              title: "Check-in and rest",
              desc: "Proceed to the apartment or hotel, settle in, and freshen up.",
              substops: []
            },
            {
              id: "d3-downtown",
              time: "⛪ 12:00–5:00 PM",
              title: "Downtown Baguio tour",
              desc: "Explore classic Baguio downtown favorites:",
              substops: [
                { id: "d3-sub-sm", title: "SM City Baguio" },
                { id: "d3-sub-burnham", title: "Burnham Park" },
                { id: "d3-sub-cathedral", title: "Baguio Cathedral" }
              ]
            },
            {
              id: "d4-rest",
              time: "🛋️ 5:00–7:00 PM",
              title: "Rest and freshen up",
              desc: "Return to the apartment or hotel.",
              substops: []
            },
            {
              id: "d5-dinner",
              time: "🍽️ 7:00–8:00 PM",
              title: "Dinner / free time",
              desc: "Have dinner before heading out.",
              substops: []
            },
            {
              id: "d6-night-market",
              time: "🍢 8:00–9:00 PM",
              title: "Baguio Night Market",
              desc: "Browse ukay-ukay stalls and try street food.",
              substops: []
            },
            {
              id: "d7-sleep",
              time: "💤 9:00 PM onwards",
              title: "Return to accommodation and rest",
              desc: "",
              substops: []
            }
          ]
        },
        {
          dayNumber: 2,
          date: "December 22, 2026",
          subtitle: "Rides • Botanical Garden • Mansion House • Ukay-ukay",
          stickerSrc: "assets/nailong-rides.jpg",
          stickerAlt:
            "Nailong wearing purple heart sunglasses holding pink cotton candy by a pastel Ferris wheel",
          items: [
            {
              id: "r1-skyranch",
              time: "🎡 8:00–9:00 AM",
              title: "Sky Ranch Baguio",
              desc: "Enjoy the rides and Ferris wheel beside SM City Baguio.",
              substops: []
            },
            {
              id: "r2-arcade",
              time: "🕹️ 9:00–11:00 AM",
              title: "Arcade and Fantasy World",
              desc: "Enjoy arcade games and explore Fantasy World, subject to opening hours and availability.",
              substops: []
            },
            {
              id: "r3-lunch",
              time: "🍱 11:00 AM–12:00 PM",
              title: "Lunch and rest",
              desc: "Eat and recharge before the afternoon tour.",
              substops: []
            },
            {
              id: "r4-nature-tour",
              time: "🌸 12:00–3:00 PM",
              title: "Nature and landmark tour",
              desc: "Visit Baguio's scenic gardens, heritage mansion, and pine park:",
              substops: [
                { id: "r4-sub-botanical", title: "Baguio Botanical Garden" },
                { id: "r4-sub-mansion", title: "The Mansion House" },
                { id: "r4-sub-wright", title: "Wright Park" }
              ]
            },
            {
              id: "r5-ukay",
              time: "🧥 3:00–4:00 PM",
              title: "Ukay-ukay shopping",
              desc: "Browse thrift shops and look for affordable clothes.",
              substops: []
            },
            {
              id: "r6-return-dinner",
              time: "🍲 4:00–7:00 PM",
              title: "Return, rest, and dinner",
              desc: "Go back to your accommodation and take a break.",
              substops: []
            },
            {
              id: "r7-night-market",
              time: "🌙 8:00–9:00 PM",
              title: "Baguio Night Market",
              desc: "Enjoy another evening of shopping and street food, if you still have energy.",
              substops: []
            },
            {
              id: "r8-sleep",
              time: "💤 9:00 PM onwards",
              title: "Return to accommodation and rest",
              desc: "",
              substops: []
            }
          ]
        },
        {
          dayNumber: 3,
          date: "December 23, 2026",
          subtitle: "Igorot Stone Kingdom • Pasalubong • Travel home",
          stickerSrc: "assets/nailong-celebrate.jpg",
          stickerAlt: "Nailong cheering happily while hugging a cute pink and lavender star plushie",
          items: [
            {
              id: "h1-stone-kingdom",
              time: "🏰 8:00–10:00 AM",
              title: "Igorot Stone Kingdom",
              desc: "Explore the stone structures, cultural displays, and photo spots.",
              substops: []
            },
            {
              id: "h2-pasalubong",
              time: "🍓 10:00–11:00 AM",
              title: "Buy pasalubong",
              desc: "Purchase souvenirs, local snacks, and other gifts.",
              substops: []
            },
            {
              id: "h3-bus-terminal",
              time: "🚌 11:00 AM onwards",
              title: "Proceed to the bus terminal",
              desc: "Prepare for departure and travel back to your hometown.",
              substops: []
            }
          ]
        }
      ],
      packingItems: [
        { id: "pack-jacket", title: "Cozy Jacket / Hoodie" },
        { id: "pack-cash", title: "Small Bills for Ukay" },
        { id: "pack-powerbank", title: "Powerbank & Cord" },
        { id: "pack-umbrella", title: "Compact Umbrella" },
        { id: "pack-shoes", title: "Comfy Walking Shoes" },
        { id: "pack-ecobag", title: "Pasalubong Eco-Bag" }
      ]
    };
  }

  let state = createDefaultData();
  let globalEditMode = false;
  let activeItemEditId = null; // Allows quick-editing a single item without turning on full Edit Mode
  let currentFilter = "all";
  let pokeIndex = 0;
  let autoSaveTimer = null;
  let hasPendingSave = false;

  // DOM References
  const daysStack = document.getElementById("days-stack");
  const essentialsList = document.getElementById("essentials-list");
  const addPackForm = document.getElementById("add-pack-form");
  const overallText = document.getElementById("overall-progress-text");
  const overallFill = document.getElementById("overall-progress-fill");
  const overallBar = document.getElementById("overall-progressbar");
  const nailongQuote = document.getElementById("nailong-quote");
  const pokeBtn = document.getElementById("poke-nailong-btn");
  const burstLayer = document.getElementById("burst-layer");
  const autosaveBadge = document.getElementById("autosave-badge");
  const toggleEditBtn = document.getElementById("toggle-edit-btn");
  const swapBtn = document.getElementById("swap-days-btn");
  const expandCollapseBtn = document.getElementById("expand-collapse-btn");
  const resetBtn = document.getElementById("reset-all-btn");
  const restoreDefaultsBtn = document.getElementById("restore-defaults-btn");
  const notesInput = document.getElementById("trip-notes");
  const notesStatus = document.getElementById("notes-status");

  function uid(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  }

  // Load state from v3 localStorage (migrating checkmarks & notes from earlier versions)
  function loadState() {
    try {
      const rawV3 = localStorage.getItem(STORAGE_KEY_V3);
      if (rawV3) {
        const parsed = JSON.parse(rawV3);
        if (parsed && Array.isArray(parsed.days) && parsed.days.length === 3) {
          state = {
            checked: parsed.checked && typeof parsed.checked === "object" ? parsed.checked : {},
            notes: typeof parsed.notes === "string" ? parsed.notes : "",
            days: parsed.days,
            packingItems: Array.isArray(parsed.packingItems)
              ? parsed.packingItems
              : createDefaultData().packingItems
          };
          return;
        }
      }

      // Migrate checkmarks & notes onto the restored original Day 1/2/3 schedule
      const rawPrev = localStorage.getItem(STORAGE_KEY_V2) || localStorage.getItem(STORAGE_KEY_V1);
      if (rawPrev) {
        const prev = JSON.parse(rawPrev);
        const migrated = createDefaultData();
        if (prev && typeof prev === "object") {
          migrated.checked = prev.checked && typeof prev.checked === "object" ? prev.checked : {};
          migrated.notes = typeof prev.notes === "string" ? prev.notes : "";
          if (Array.isArray(prev.packingItems)) {
            migrated.packingItems = prev.packingItems;
          }
        }
        state = migrated;
        persistImmediately();
      }
    } catch {
      // Ignore restricted storage read errors
    }
  }

  function persistImmediately() {
    try {
      localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(state));
      hasPendingSave = false;
    } catch {
      // Ignore quota or restricted storage errors
    }
  }

  // Live Auto-Save with visual status indicator
  function scheduleAutoSave(immediate = false) {
    hasPendingSave = true;
    if (autosaveBadge) {
      autosaveBadge.classList.add("is-saving");
      autosaveBadge.textContent = "🌸 Saving changes...";
    }
    if (notesStatus) {
      notesStatus.textContent = "🌸 Saving to browser...";
    }

    clearTimeout(autoSaveTimer);

    if (immediate) {
      persistImmediately();
      if (autosaveBadge) {
        autosaveBadge.classList.remove("is-saving");
        autosaveBadge.textContent = "💾 Auto-saved in browser";
      }
      if (notesStatus) {
        notesStatus.textContent = "✨ Auto-saved in your browser";
      }
      return;
    }

    autoSaveTimer = setTimeout(() => {
      persistImmediately();
      if (autosaveBadge) {
        autosaveBadge.classList.remove("is-saving");
        autosaveBadge.textContent = "💾 Auto-saved in browser";
      }
      if (notesStatus) {
        notesStatus.textContent = "✨ Auto-saved in your browser";
      }
    }, 200);
  }

  // Flush any pending debounced save if user closes or hides tab
  window.addEventListener("pagehide", () => {
    if (hasPendingSave) persistImmediately();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && hasPendingSave) {
      persistImmediately();
    }
  });

  // IME-safe Enter handler for single-line inline inputs (modern-web-guidance: ime-safe-enter-submit)
  function attachImeSafeEnter(inputEl, callback) {
    inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (event.isComposing || event.keyCode === 229) {
          return;
        }
        callback();
      }
    });
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

  // Swap Day 1 & Day 2 schedules in data object
  function swapDaysInData(targetState) {
    const d1 = targetState.days[0];
    const d2 = targetState.days[1];
    if (!d1 || !d2) return;

    const tmpSubtitle = d1.subtitle;
    const tmpStickerSrc = d1.stickerSrc;
    const tmpStickerAlt = d1.stickerAlt;
    const tmpItems = d1.items;

    d1.subtitle = d2.subtitle;
    d1.stickerSrc = d2.stickerSrc;
    d1.stickerAlt = d2.stickerAlt;
    d1.items = d2.items;

    d2.subtitle = tmpSubtitle;
    d2.stickerSrc = tmpStickerSrc;
    d2.stickerAlt = tmpStickerAlt;
    d2.items = tmpItems;
  }

  // Compute indeterminate & checked status for an item with substops
  function getItemCheckStatus(item) {
    if (!item.substops || item.substops.length === 0) {
      return {
        checked: Boolean(state.checked[item.id]),
        indeterminate: false
      };
    }

    const total = item.substops.length;
    const done = item.substops.filter((s) => Boolean(state.checked[s.id])).length;
    if (done === 0) {
      state.checked[item.id] = false;
      return { checked: false, indeterminate: false };
    }
    if (done === total) {
      state.checked[item.id] = true;
      return { checked: true, indeterminate: false };
    }
    state.checked[item.id] = false;
    return { checked: false, indeterminate: true };
  }

  // Render a single Timeline Item (either View Mode or Inline Edit Mode)
  function createTimelineItemElement(dayObj, item, itemIndex, totalItems) {
    const isEditing = globalEditMode || activeItemEditId === item.id;
    const status = getItemCheckStatus(item);

    const li = document.createElement("li");
    li.className = "timeline-item";
    li.dataset.itemId = item.id;

    if (status.checked) {
      li.classList.add("is-completed");
    }
    if (isEditing) {
      li.classList.add("is-editing");
    }

    if (!isEditing) {
      // ==================== STANDARD INTERACTIVE CHECKLIST VIEW ====================
      const rowShell = document.createElement("div");
      rowShell.className = "item-row-shell";

      const label = document.createElement("label");
      label.className = "check-row";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "checkbox-custom main-check";
      if (item.substops && item.substops.length > 0) {
        checkbox.classList.add("has-substops");
      }
      checkbox.checked = status.checked;
      checkbox.indeterminate = status.indeterminate;

      checkbox.addEventListener("change", () => {
        state.checked[item.id] = checkbox.checked;
        checkbox.indeterminate = false;

        if (item.substops && item.substops.length > 0) {
          item.substops.forEach((sub) => {
            state.checked[sub.id] = checkbox.checked;
          });
        }

        scheduleAutoSave();
        renderAllDays();
        updateAllProgress(checkbox.checked, checkbox);

        if (checkbox.checked) {
          const allDayDone = dayObj.items.every((it) => getItemCheckStatus(it).checked);
          if (allDayDone) {
            spawnBurst(li, 16);
          }
        }
      });

      const content = document.createElement("span");
      content.className = "item-content";

      const top = document.createElement("span");
      top.className = "item-top";

      if (item.time && item.time.trim()) {
        const timeBadge = document.createElement("span");
        timeBadge.className = "time-badge";
        timeBadge.textContent = item.time;
        top.appendChild(timeBadge);
      }

      const titleSpan = document.createElement("span");
      titleSpan.className = "item-title";
      titleSpan.textContent = item.title;
      top.appendChild(titleSpan);
      content.appendChild(top);

      if (item.desc && item.desc.trim()) {
        const descP = document.createElement("p");
        descP.className = "item-desc";
        descP.textContent = item.desc;
        content.appendChild(descP);
      }

      label.appendChild(checkbox);
      label.appendChild(content);

      const quickActions = document.createElement("div");
      quickActions.className = "item-quick-actions";

      const editItemBtn = document.createElement("button");
      editItemBtn.type = "button";
      editItemBtn.className = "icon-mini-btn";
      editItemBtn.title = "Edit this checklist item";
      editItemBtn.setAttribute("aria-label", `Edit ${item.title}`);
      editItemBtn.textContent = "✎";
      editItemBtn.addEventListener("click", () => {
        activeItemEditId = item.id;
        renderAllDays();
      });

      quickActions.appendChild(editItemBtn);
      rowShell.appendChild(label);
      rowShell.appendChild(quickActions);
      li.appendChild(rowShell);

      // Render nested sub-stops if present
      if (item.substops && item.substops.length > 0) {
        const subList = document.createElement("ul");
        subList.className = "substops-list";
        subList.setAttribute("aria-label", `${item.title} stops`);

        item.substops.forEach((sub) => {
          const subLi = document.createElement("li");
          const subLabel = document.createElement("label");
          subLabel.className = "substop-label";
          if (state.checked[sub.id]) {
            subLabel.classList.add("is-sub-checked");
          }

          const subCheck = document.createElement("input");
          subCheck.type = "checkbox";
          subCheck.className = "checkbox-custom sub-check";
          subCheck.checked = Boolean(state.checked[sub.id]);

          subCheck.addEventListener("change", () => {
            state.checked[sub.id] = subCheck.checked;
            getItemCheckStatus(item);
            scheduleAutoSave();
            renderAllDays();
            updateAllProgress(subCheck.checked, subCheck);
          });

          const subSpan = document.createElement("span");
          subSpan.textContent = sub.title;

          subLabel.appendChild(subCheck);
          subLabel.appendChild(subSpan);
          subLi.appendChild(subLabel);
          subList.appendChild(subLi);
        });

        li.appendChild(subList);
      }
    } else {
      // ==================== INLINE AUTO-SAVING EDITOR VIEW ====================
      const editor = document.createElement("div");
      editor.className = "item-editor";

      const topRow = document.createElement("div");
      topRow.className = "item-editor-top";

      const timeId = `edit-time-${item.id}`;
      const timeLabel = document.createElement("label");
      timeLabel.className = "sr-only";
      timeLabel.setAttribute("for", timeId);
      timeLabel.textContent = "Activity time";

      const timeInput = document.createElement("input");
      timeInput.type = "text";
      timeInput.id = timeId;
      timeInput.className = "inline-input inline-input--time";
      timeInput.placeholder = "Time (e.g. 🎡 8:00 AM)";
      timeInput.value = item.time || "";
      timeInput.addEventListener("input", () => {
        item.time = timeInput.value;
        scheduleAutoSave();
      });

      const titleId = `edit-title-${item.id}`;
      const titleLabel = document.createElement("label");
      titleLabel.className = "sr-only";
      titleLabel.setAttribute("for", titleId);
      titleLabel.textContent = "Activity title";

      const titleInput = document.createElement("input");
      titleInput.type = "text";
      titleInput.id = titleId;
      titleInput.className = "inline-input inline-input--title";
      titleInput.placeholder = "Activity title...";
      titleInput.value = item.title || "";
      titleInput.addEventListener("input", () => {
        item.title = titleInput.value;
        scheduleAutoSave();
      });

      if (!globalEditMode) {
        const closeSingleEdit = () => {
          activeItemEditId = null;
          scheduleAutoSave(true);
          renderAllDays();
        };
        attachImeSafeEnter(timeInput, closeSingleEdit);
        attachImeSafeEnter(titleInput, closeSingleEdit);
      }

      topRow.appendChild(timeLabel);
      topRow.appendChild(timeInput);
      topRow.appendChild(titleLabel);
      topRow.appendChild(titleInput);

      const descId = `edit-desc-${item.id}`;
      const descLabel = document.createElement("label");
      descLabel.className = "sr-only";
      descLabel.setAttribute("for", descId);
      descLabel.textContent = "Activity description";

      const descInput = document.createElement("textarea");
      descInput.id = descId;
      descInput.className = "inline-textarea inline-textarea--desc";
      descInput.rows = 1;
      descInput.placeholder = "Optional details or notes for this stop...";
      descInput.value = item.desc || "";
      descInput.addEventListener("input", () => {
        item.desc = descInput.value;
        scheduleAutoSave();
      });

      editor.appendChild(topRow);
      editor.appendChild(descLabel);
      editor.appendChild(descInput);

      // Sub-stops Inline Editor Section
      const subBox = document.createElement("div");
      subBox.className = "substop-editor-box";

      const subHeading = document.createElement("span");
      subHeading.className = "substop-editor-label";
      subHeading.textContent = "Sub-checklist spots (optional)";
      subBox.appendChild(subHeading);

      if (!Array.isArray(item.substops)) {
        item.substops = [];
      }

      item.substops.forEach((sub, subIdx) => {
        const subRow = document.createElement("div");
        subRow.className = "substop-edit-row";

        const subInputId = `edit-sub-${sub.id}`;
        const subLbl = document.createElement("label");
        subLbl.className = "sr-only";
        subLbl.setAttribute("for", subInputId);
        subLbl.textContent = `Sub-stop ${subIdx + 1}`;

        const subInput = document.createElement("input");
        subInput.type = "text";
        subInput.id = subInputId;
        subInput.className = "inline-input inline-input--sub";
        subInput.placeholder = "Sub-stop name...";
        subInput.value = sub.title || "";
        subInput.addEventListener("input", () => {
          sub.title = subInput.value;
          scheduleAutoSave();
        });

        const delSubBtn = document.createElement("button");
        delSubBtn.type = "button";
        delSubBtn.className = "icon-mini-btn icon-mini-btn--danger";
        delSubBtn.title = "Remove sub-stop";
        delSubBtn.setAttribute("aria-label", `Remove ${sub.title || "sub-stop"}`);
        delSubBtn.textContent = "✕";
        delSubBtn.addEventListener("click", () => {
          delete state.checked[sub.id];
          item.substops.splice(subIdx, 1);
          getItemCheckStatus(item);
          scheduleAutoSave();
          renderAllDays();
          updateAllProgress(false);
        });

        subRow.appendChild(subLbl);
        subRow.appendChild(subInput);
        subRow.appendChild(delSubBtn);
        subBox.appendChild(subRow);
      });

      const addSubBtn = document.createElement("button");
      addSubBtn.type = "button";
      addSubBtn.className = "add-substop-btn";
      addSubBtn.textContent = "+ Add sub-stop";
      addSubBtn.addEventListener("click", () => {
        const newSub = { id: uid("sub"), title: "New stop" };
        item.substops.push(newSub);
        getItemCheckStatus(item);
        scheduleAutoSave();
        renderAllDays();
        updateAllProgress(false);
        const focusEl = document.getElementById(`edit-sub-${newSub.id}`);
        if (focusEl) {
          focusEl.focus();
          focusEl.select();
        }
      });

      subBox.appendChild(addSubBtn);
      editor.appendChild(subBox);

      // Reorder, Delete & Done Action Row
      const actionBar = document.createElement("div");
      actionBar.className = "item-editor-actions";

      const leftBtns = document.createElement("div");
      leftBtns.className = "item-editor-left-btns";

      const upBtn = document.createElement("button");
      upBtn.type = "button";
      upBtn.className = "icon-mini-btn";
      upBtn.textContent = "↑ Up";
      upBtn.disabled = itemIndex === 0;
      upBtn.setAttribute("aria-label", `Move ${item.title} up`);
      upBtn.addEventListener("click", () => {
        if (itemIndex === 0) return;
        const swap = dayObj.items[itemIndex - 1];
        dayObj.items[itemIndex - 1] = dayObj.items[itemIndex];
        dayObj.items[itemIndex] = swap;
        scheduleAutoSave();
        renderAllDays();
      });

      const downBtn = document.createElement("button");
      downBtn.type = "button";
      downBtn.className = "icon-mini-btn";
      downBtn.textContent = "↓ Down";
      downBtn.disabled = itemIndex === totalItems - 1;
      downBtn.setAttribute("aria-label", `Move ${item.title} down`);
      downBtn.addEventListener("click", () => {
        if (itemIndex >= totalItems - 1) return;
        const swap = dayObj.items[itemIndex + 1];
        dayObj.items[itemIndex + 1] = dayObj.items[itemIndex];
        dayObj.items[itemIndex] = swap;
        scheduleAutoSave();
        renderAllDays();
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "icon-mini-btn icon-mini-btn--danger";
      deleteBtn.textContent = "🗑 Delete";
      deleteBtn.setAttribute("aria-label", `Delete ${item.title}`);
      deleteBtn.addEventListener("click", () => {
        delete state.checked[item.id];
        if (Array.isArray(item.substops)) {
          item.substops.forEach((s) => delete state.checked[s.id]);
        }
        dayObj.items.splice(itemIndex, 1);
        if (activeItemEditId === item.id) {
          activeItemEditId = null;
        }
        scheduleAutoSave();
        renderAllDays();
        updateAllProgress(false);
      });

      leftBtns.appendChild(upBtn);
      leftBtns.appendChild(downBtn);
      leftBtns.appendChild(deleteBtn);
      actionBar.appendChild(leftBtns);

      const rightBtns = document.createElement("div");
      rightBtns.className = "item-editor-right-btns";

      if (!globalEditMode) {
        const doneBtn = document.createElement("button");
        doneBtn.type = "button";
        doneBtn.className = "icon-mini-btn icon-mini-btn--done";
        doneBtn.textContent = "✓ Done";
        doneBtn.addEventListener("click", () => {
          activeItemEditId = null;
          scheduleAutoSave(true);
          renderAllDays();
        });
        rightBtns.appendChild(doneBtn);
      }

      actionBar.appendChild(rightBtns);
      editor.appendChild(actionBar);
      li.appendChild(editor);
    }

    return li;
  }

  // Render all 3 Day Cards (preserving <details open> state)
  function renderAllDays() {
    state.days.forEach((dayObj, index) => {
      const dayNum = index + 1;
      dayObj.dayNumber = dayNum;

      const card = document.getElementById(`day-card-${dayNum}`);
      if (!card) return;

      // Update Sticker
      const stickerWrap = document.getElementById(`day-${dayNum}-sticker`);
      if (stickerWrap) {
        const img = stickerWrap.querySelector("img");
        if (img) {
          img.src = dayObj.stickerSrc;
          img.alt = dayObj.stickerAlt;
        }
      }

      // Update Day Heading inside <summary> (pure non-interactive text for HTML spec compliance)
      const headingWrap = card.querySelector(".day-heading-wrap");
      let dateSpanRef = null;
      let h2Ref = null;

      if (headingWrap) {
        headingWrap.replaceChildren();

        const eyebrow = document.createElement("div");
        eyebrow.className = "day-eyebrow";

        const chip = document.createElement("span");
        chip.className = "day-chip";
        chip.textContent = `Day ${dayNum}`;

        dateSpanRef = document.createElement("span");
        dateSpanRef.className = "day-date";
        dateSpanRef.textContent = dayObj.date;

        eyebrow.appendChild(chip);
        eyebrow.appendChild(dateSpanRef);

        h2Ref = document.createElement("h2");
        h2Ref.className = "day-title";
        h2Ref.id = `day-${dayNum}-subtitle`;
        h2Ref.textContent = dayObj.subtitle;

        headingWrap.appendChild(eyebrow);
        headingWrap.appendChild(h2Ref);
      }

      if (globalEditMode) {
        const disclosure = card.querySelector(".day-disclosure");
        if (disclosure) disclosure.open = true;
      }

      // Render Day Header Editor (in Global Edit Mode) + Timeline Items List inside .day-body
      const bodyEl = document.getElementById(`day-${dayNum}-body`);
      if (bodyEl) {
        const existingHeaderEdit = bodyEl.querySelector(".day-edit-fields");
        if (existingHeaderEdit) {
          existingHeaderEdit.remove();
        }

        const listEl = bodyEl.querySelector(".timeline-list");

        if (globalEditMode && listEl) {
          const editWrap = document.createElement("div");
          editWrap.className = "day-edit-fields";

          const headerEditTitle = document.createElement("span");
          headerEditTitle.className = "substop-editor-label";
          headerEditTitle.textContent = `Day ${dayNum} Header & Date`;

          const dateId = `edit-day-date-${dayNum}`;
          const dateLbl = document.createElement("label");
          dateLbl.className = "sr-only";
          dateLbl.setAttribute("for", dateId);
          dateLbl.textContent = `Day ${dayNum} date`;

          const dateInput = document.createElement("input");
          dateInput.type = "text";
          dateInput.id = dateId;
          dateInput.className = "inline-input inline-input--date";
          dateInput.value = dayObj.date;
          dateInput.placeholder = "Date (e.g. December 21, 2026)...";
          dateInput.addEventListener("input", () => {
            dayObj.date = dateInput.value;
            if (dateSpanRef) dateSpanRef.textContent = dayObj.date;
            scheduleAutoSave();
          });

          const subId = `edit-day-sub-${dayNum}`;
          const subLbl = document.createElement("label");
          subLbl.className = "sr-only";
          subLbl.setAttribute("for", subId);
          subLbl.textContent = `Day ${dayNum} highlights`;

          const subInput = document.createElement("input");
          subInput.type = "text";
          subInput.id = subId;
          subInput.className = "inline-input inline-input--day-title";
          subInput.value = dayObj.subtitle;
          subInput.placeholder = "Day highlights subtitle...";
          subInput.addEventListener("input", () => {
            dayObj.subtitle = subInput.value;
            if (h2Ref) h2Ref.textContent = dayObj.subtitle;
            scheduleAutoSave();
          });

          editWrap.appendChild(headerEditTitle);
          editWrap.appendChild(dateLbl);
          editWrap.appendChild(dateInput);
          editWrap.appendChild(subLbl);
          editWrap.appendChild(subInput);
          bodyEl.insertBefore(editWrap, listEl);
        }

        if (listEl) {
          listEl.replaceChildren();
          dayObj.items.forEach((item, idx) => {
            listEl.appendChild(
              createTimelineItemElement(dayObj, item, idx, dayObj.items.length)
            );
          });
        }
      }
    });

    renderPackingItems();
    applyFilterVisibility();
  }

  // Render Baguio Bag Check Essentials (View Mode + Inline Edit Mode)
  function renderPackingItems() {
    if (!essentialsList) return;
    essentialsList.replaceChildren();

    state.packingItems.forEach((pack, idx) => {
      const li = document.createElement("li");
      li.className = "pack-item-row";

      if (!globalEditMode) {
        const label = document.createElement("label");
        label.className = "substop-label";
        if (state.checked[pack.id]) {
          label.classList.add("is-sub-checked");
        }

        const check = document.createElement("input");
        check.type = "checkbox";
        check.className = "checkbox-custom pack-check";
        check.checked = Boolean(state.checked[pack.id]);
        check.addEventListener("change", () => {
          state.checked[pack.id] = check.checked;
          label.classList.toggle("is-sub-checked", check.checked);
          scheduleAutoSave();
        });

        const span = document.createElement("span");
        span.textContent = pack.title;

        label.appendChild(check);
        label.appendChild(span);
        li.appendChild(label);
      } else {
        const inputId = `edit-pack-${pack.id}`;
        const lbl = document.createElement("label");
        lbl.className = "sr-only";
        lbl.setAttribute("for", inputId);
        lbl.textContent = `Bag item ${idx + 1}`;

        const input = document.createElement("input");
        input.type = "text";
        input.id = inputId;
        input.className = "inline-input inline-input--pack";
        input.value = pack.title;
        input.addEventListener("input", () => {
          pack.title = input.value;
          scheduleAutoSave();
        });

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "icon-mini-btn icon-mini-btn--danger";
        delBtn.setAttribute("aria-label", `Delete ${pack.title}`);
        delBtn.textContent = "✕";
        delBtn.addEventListener("click", () => {
          delete state.checked[pack.id];
          state.packingItems.splice(idx, 1);
          scheduleAutoSave();
          renderPackingItems();
        });

        li.appendChild(lbl);
        li.appendChild(input);
        li.appendChild(delBtn);
      }

      essentialsList.appendChild(li);
    });
  }

  // Update overall & per-day progress indicators
  function updateAllProgress(allowCelebrate, triggerEl) {
    let totalMain = 0;
    let totalDone = 0;

    state.days.forEach((dayObj, index) => {
      const dayNum = index + 1;
      const count = dayObj.items.length;
      const done = dayObj.items.filter((item) => getItemCheckStatus(item).checked).length;

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

    if (nailongQuote) {
      if (pct === 0) {
        nailongQuote.textContent =
          "Rawr~! Ready for chilly Baguio vibes & strawberry taho? Tap checkboxes or ✏️ Edit anytime! 🍓💜";
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

    if (allowCelebrate && pct === 100 && totalMain > 0) {
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
        const isEditingItem = item.classList.contains("is-editing");
        item.classList.toggle(
          "is-hidden-remaining",
          currentFilter === "remaining" && isDone && !isEditingItem
        );
      });

      if (currentFilter === "all") {
        card.classList.remove("is-hidden-by-filter");
      } else if (currentFilter === "remaining") {
        const hasVisible = items.some((it) => !it.classList.contains("is-hidden-remaining"));
        card.classList.toggle("is-hidden-by-filter", !hasVisible && !globalEditMode);
      } else {
        card.classList.toggle("is-hidden-by-filter", day !== currentFilter);
      }
    });
  }

  // Add Stop Forms (Per Day)
  document.querySelectorAll(".add-stop-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const dayIndex = Number(form.dataset.dayForm) - 1;
      const dayObj = state.days[dayIndex];
      if (!dayObj) return;

      const timeInput = form.elements.namedItem("time");
      const titleInput = form.elements.namedItem("title");
      const title = titleInput ? titleInput.value.trim() : "";
      const time = timeInput ? timeInput.value.trim() : "";

      if (!title) return;

      const newItem = {
        id: uid("stop"),
        time: time ? `✨ ${time}` : "✨ Anytime",
        title,
        desc: "",
        substops: []
      };

      dayObj.items.push(newItem);
      form.reset();
      scheduleAutoSave();
      renderAllDays();
      updateAllProgress(false);
      spawnBurst(form, 8);
    });
  });

  // Add Packing Bag Item Form
  if (addPackForm) {
    addPackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const packInput = addPackForm.elements.namedItem("packTitle");
      const title = packInput ? packInput.value.trim() : "";
      if (!title) return;

      state.packingItems.push({
        id: uid("pack"),
        title
      });

      addPackForm.reset();
      scheduleAutoSave();
      renderPackingItems();
      spawnBurst(addPackForm, 6);
    });
  }

  // Toggle Global Edit Mode Button
  if (toggleEditBtn) {
    toggleEditBtn.addEventListener("click", () => {
      runWithTransition(() => {
        globalEditMode = !globalEditMode;
        if (!globalEditMode) {
          activeItemEditId = null;
          scheduleAutoSave(true);
        }
        toggleEditBtn.setAttribute("aria-pressed", String(globalEditMode));
        toggleEditBtn.textContent = globalEditMode ? "✓ Done Editing" : "✏️ Edit Checklist";
        renderAllDays();
        updateAllProgress(false);
      }, daysStack);
    });
  }

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
        swapDaysInData(state);
        scheduleAutoSave();
        renderAllDays();
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

  // Uncheck All Checkboxes (preserves custom edits & notes)
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const confirmed = window.confirm(
        "Uncheck all activities and bag items? (All your edited checklist text, custom stops, and notes will stay saved!)"
      );
      if (!confirmed) return;

      state.checked = {};
      scheduleAutoSave(true);
      renderAllDays();
      updateAllProgress(false);
    });
  }

  // Restore Original Default Itinerary
  if (restoreDefaultsBtn) {
    restoreDefaultsBtn.addEventListener("click", () => {
      const confirmed = window.confirm(
        "Restore the original default Baguio checklist items and titles? This will reset custom text edits (your Trip Notes will stay safe)."
      );
      if (!confirmed) return;

      const savedNotes = state.notes;
      state = createDefaultData();
      state.notes = savedNotes;
      globalEditMode = false;
      activeItemEditId = null;

      if (toggleEditBtn) {
        toggleEditBtn.setAttribute("aria-pressed", "false");
        toggleEditBtn.textContent = "✏️ Edit Checklist";
      }

      scheduleAutoSave(true);
      renderAllDays();
      updateAllProgress(false);
    });
  }

  // Interactive Poke Nailong Mascot
  if (pokeBtn) {
    pokeBtn.addEventListener("click", () => {
      pokeBtn.classList.remove("is-jiggling");
      void pokeBtn.offsetWidth;
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
    notesInput.addEventListener("input", () => {
      state.notes = notesInput.value;
      scheduleAutoSave();
    });
  }

  // Initialize on Page Load
  loadState();
  if (notesInput) {
    notesInput.value = state.notes;
  }
  renderAllDays();
  updateAllProgress(false);
})();
