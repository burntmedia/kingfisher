const churchSuiteData = window.kingfisherChurchSuite || { events: [], groups: [] };

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function eventDateParts(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return {
    day: new Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat("en-GB", { month: "short" }).format(date),
    long: new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date),
  };
}

function eventCard(event) {
  const date = eventDateParts(event.date);
  const actionLabel = event.booking ? "View & book" : "View details";

  return `
    <article class="event-card" data-event-category="${escapeHtml(event.category)}">
      <div class="event-card-image">
        <img src="${escapeHtml(event.image)}" alt="" />
        <time datetime="${escapeHtml(event.date)}" class="event-date-tile">
          <span>${date.day}</span>
          <strong>${date.month}</strong>
        </time>
      </div>
      <div class="event-card-copy">
        <p class="tag">${escapeHtml(event.category)}</p>
        <h3>${escapeHtml(event.title)}</h3>
        <p class="event-meta">${escapeHtml(date.long)} · ${escapeHtml(event.time)}–${escapeHtml(event.endTime)}</p>
        <p class="event-location">${escapeHtml(event.location)}</p>
        <p>${escapeHtml(event.summary)}</p>
        <button class="arrow-button" type="button" data-event-open="${escapeHtml(event.id)}">${actionLabel}</button>
      </div>
    </article>
  `;
}

function groupCard(group) {
  return `
    <article class="group-card">
      <div class="group-card-topline">
        <span>${escapeHtml(group.day)}</span>
        <span>${escapeHtml(group.format)}</span>
      </div>
      <h2>${escapeHtml(group.name)}</h2>
      <p class="group-schedule">${escapeHtml(group.day)}s at ${escapeHtml(group.time)}</p>
      <p class="group-location">${escapeHtml(group.area)} · ${escapeHtml(group.audience)}</p>
      <p>${escapeHtml(group.summary)}</p>
      <div class="group-card-footer">
        <span class="availability"><i aria-hidden="true"></i>${escapeHtml(group.availability)}</span>
        <button class="arrow-button" type="button" data-group-open="${escapeHtml(group.id)}">Ask to join</button>
      </div>
    </article>
  `;
}

document.querySelectorAll("[data-event-preview]").forEach((container) => {
  container.innerHTML = churchSuiteData.events.slice(0, 3).map(eventCard).join("");
});

const eventList = document.querySelector("[data-event-list]");
const eventFilters = Array.from(document.querySelectorAll("[data-event-filter]"));

function renderEvents(category = "All") {
  if (!eventList) return;
  const events = category === "All"
    ? churchSuiteData.events
    : churchSuiteData.events.filter((event) => event.category === category);
  eventList.innerHTML = events.map(eventCard).join("");
}

eventFilters.forEach((button) => {
  button.addEventListener("click", () => {
    eventFilters.forEach((filter) => {
      const isActive = filter === button;
      filter.classList.toggle("is-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });
    renderEvents(button.dataset.eventFilter);
  });
});

renderEvents();

const groupList = document.querySelector("[data-group-list]");
const groupSearch = document.querySelector("[data-group-search]");
const groupDay = document.querySelector("[data-group-day]");
const groupAudience = document.querySelector("[data-group-audience]");
const groupResultCount = document.querySelector("[data-group-result-count]");

function renderGroups() {
  if (!groupList) return;
  const query = groupSearch?.value.trim().toLowerCase() || "";
  const day = groupDay?.value || "All";
  const audience = groupAudience?.value || "All";
  const groups = churchSuiteData.groups.filter((group) => {
    const searchable = `${group.name} ${group.area} ${group.audience} ${group.summary}`.toLowerCase();
    return (!query || searchable.includes(query))
      && (day === "All" || group.day === day)
      && (audience === "All" || group.audience === audience);
  });

  groupList.innerHTML = groups.length
    ? groups.map(groupCard).join("")
    : '<div class="empty-state"><h2>No exact matches</h2><p>Try another day or clear one of the filters.</p></div>';

  if (groupResultCount) {
    groupResultCount.textContent = `${groups.length} ${groups.length === 1 ? "group" : "groups"}`;
  }
}

[groupSearch, groupDay, groupAudience].forEach((control) => {
  control?.addEventListener(control === groupSearch ? "input" : "change", renderGroups);
});

renderGroups();

const detailsDialog = document.querySelector("[data-details-dialog]");
const dialogEyebrow = detailsDialog?.querySelector("[data-dialog-eyebrow]");
const dialogTitle = detailsDialog?.querySelector("[data-dialog-title]");
const dialogSummary = detailsDialog?.querySelector("[data-dialog-summary]");
const dialogForm = detailsDialog?.querySelector("[data-dialog-form]");
const dialogConfirmation = detailsDialog?.querySelector("[data-dialog-confirmation]");
const dialogSubmit = detailsDialog?.querySelector("[data-dialog-submit]");

function openDetailsDialog(type, id) {
  if (!detailsDialog) return;
  const item = type === "event"
    ? churchSuiteData.events.find((event) => event.id === id)
    : churchSuiteData.groups.find((group) => group.id === id);
  if (!item) return;

  const isEvent = type === "event";
  dialogEyebrow.textContent = isEvent ? "Event sign-up" : "Connect Group enquiry";
  dialogTitle.textContent = isEvent ? item.title : `Interested in ${item.name}?`;
  dialogSummary.textContent = isEvent
    ? `${eventDateParts(item.date).long} at ${item.time}, ${item.location}`
    : `${item.day}s at ${item.time}, ${item.area}`;
  dialogSubmit.textContent = isEvent && item.booking ? "Request a place" : "Send my enquiry";
  dialogForm.hidden = false;
  dialogConfirmation.hidden = true;
  dialogForm.reset();
  detailsDialog.showModal();
}

document.addEventListener("click", (event) => {
  const eventButton = event.target.closest("[data-event-open]");
  const groupButton = event.target.closest("[data-group-open]");
  if (eventButton) openDetailsDialog("event", eventButton.dataset.eventOpen);
  if (groupButton) openDetailsDialog("group", groupButton.dataset.groupOpen);
});

detailsDialog?.querySelector("[data-dialog-close]")?.addEventListener("click", () => detailsDialog.close());

detailsDialog?.addEventListener("click", (event) => {
  if (event.target === detailsDialog) detailsDialog.close();
});

dialogForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  dialogForm.hidden = true;
  dialogConfirmation.hidden = false;
});

document.querySelectorAll("[data-demo-form]").forEach((form) => {
  const confirmation = form.parentElement.querySelector("[data-form-confirmation]");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.hidden = true;
    confirmation.hidden = false;
  });
});
