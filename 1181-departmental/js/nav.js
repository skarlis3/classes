(function () {
  const HOME = { href: "index.html", label: "Home / Proposal" };

  const TRACK_A = {
    title: "Track A",
    subtitle: "Genres in Your Field",
    groups: [
      {
        group: "Overview",
        items: [
          { href: "skeleton.html", label: "Skeleton Draft" },
          { href: "units.html", label: "Units" },
          { href: "in-class-topics.html", label: "In-class / Lecture Topics" },
        ],
      },
      {
        group: "Assignments",
        items: [
          { href: "project-1.html", label: "Project 1: Genre Analysis" },
          { href: "project-2.html", label: "Project 2: Multimodal" },
          { href: "writing-activities.html", label: "Writing Activities" },
          { href: "final-reflection.html", label: "Final Reflection" },
        ],
      },
      {
        group: "Schedules",
        items: [
          { href: "schedule-portfolio.html", label: "16-Week — Portfolio" },
          { href: "schedule-no-portfolio.html", label: "16-Week — No Portfolio" },
        ],
      },
      {
        group: "Grading & Outcomes",
        items: [
          { href: "grading.html", label: "Grading" },
          { href: "objectives-map.html", label: "Objectives Map" },
        ],
      },
    ],
  };

  const TRACK_B = {
    title: "Track B",
    subtitle: "Digital Lives",
    groups: [
      {
        group: "Overview",
        items: [
          { href: "trackb-skeleton.html", label: "Skeleton Draft" },
          { href: "trackb-units.html", label: "Units" },
        ],
      },
      {
        group: "Assignments",
        items: [
          { href: "trackb-project-1.html", label: "Project 1: Conversation Essay" },
          { href: "trackb-project-2.html", label: "Project 2: Digital Rhetoric" },
          { href: "trackb-project-3.html", label: "Project 3: Argument Essay" },
          { href: "trackb-writing-activities.html", label: "Writing Activities" },
          { href: "trackb-final-reflection.html", label: "Final Reflection" },
        ],
      },
      {
        group: "Readings & Schedule",
        items: [
          { href: "trackb-readings.html", label: "Readings" },
          { href: "trackb-schedule.html", label: "16-Week Schedule" },
        ],
      },
    ],
  };

  const TRACK_C = {
    title: "Track C",
    subtitle: "Rhetoric & AI Ethics",
    groups: [
      {
        group: "Overview",
        items: [
          { href: "trackc-skeleton.html", label: "Skeleton Draft" },
          { href: "trackc-units.html", label: "Units" },
        ],
      },
      {
        group: "Assignments",
        items: [
          { href: "trackc-project-1.html", label: "Project 1: Group Presentation" },
          { href: "trackc-project-2.html", label: "Project 2: Rhetorical Analysis" },
          { href: "trackc-project-3.html", label: "Project 3: PSA Poster" },
          { href: "trackc-writing-activities.html", label: "Writing Activities" },
        ],
      },
      {
        group: "Readings & Schedule",
        items: [
          { href: "trackc-readings.html", label: "Readings" },
          { href: "trackc-schedule.html", label: "16-Week Schedule" },
        ],
      },
    ],
  };

  // Track A owns the unprefixed filenames, so it stays the fallback. Every track
  // added after it needs a prefix here.
  const TRACKS = [TRACK_A, TRACK_B, TRACK_C];
  const PREFIXES = [
    { prefix: "trackb-", track: TRACK_B },
    { prefix: "trackc-", track: TRACK_C },
  ];

  function currentPage() {
    const path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  function activeTrack(page) {
    for (let i = 0; i < PREFIXES.length; i++) {
      if (page.indexOf(PREFIXES[i].prefix) === 0) return PREFIXES[i].track;
    }
    if (page === "index.html") return null;
    return TRACK_A;
  }

  function trackLink(track) {
    return {
      href: track.groups[0].items[0].href,
      label: track.title + " — " + track.subtitle,
    };
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function linkList(items, here) {
    const ul = document.createElement("ul");
    items.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.label;
      if (here && item.href === here) a.setAttribute("aria-current", "page");
      li.appendChild(a);
      ul.appendChild(li);
    });
    return ul;
  }

  function renderSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;
    const here = currentPage();
    const track = activeTrack(here);

    sidebar.appendChild(el("h2", null, "ENGL 1181 Skeleton"));
    sidebar.appendChild(
      el(
        "p",
        "sidebar-subtitle",
        track ? track.title + " — " + track.subtitle : "FYW Proposal Draft"
      )
    );

    sidebar.appendChild(linkList([HOME], here));

    const rule = document.createElement("hr");
    rule.className = "sidebar-rule";
    sidebar.appendChild(rule);

    if (track) {
      track.groups.forEach((section) => {
        sidebar.appendChild(el("h3", "sidebar-group-title", section.group));
        sidebar.appendChild(linkList(section.items, here));
      });

      const others = TRACKS.filter((t) => t !== track);
      sidebar.appendChild(
        el("h3", "sidebar-group-title other-track-title", "Switch Tracks")
      );
      const otherList = linkList(others.map(trackLink), here);
      otherList.className = "other-track";
      sidebar.appendChild(otherList);
    } else {
      sidebar.appendChild(el("h3", "sidebar-group-title", "Tracks"));
      sidebar.appendChild(linkList(TRACKS.map(trackLink), here));
    }
  }

  function setupMobileToggle() {
    const toggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (!toggle || !sidebar) return;

    function open() {
      sidebar.classList.add("open");
      if (overlay) overlay.classList.add("visible");
      toggle.setAttribute("aria-expanded", "true");
    }
    function close() {
      sidebar.classList.remove("open");
      if (overlay) overlay.classList.remove("visible");
      toggle.setAttribute("aria-expanded", "false");
    }
    function togglePanel() {
      sidebar.classList.contains("open") ? close() : open();
    }

    toggle.addEventListener("click", togglePanel);
    if (overlay) overlay.addEventListener("click", close);

    sidebar.addEventListener("click", (e) => {
      if (e.target.tagName === "A" && window.innerWidth <= 900) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebar.classList.contains("open")) close();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderSidebar();
    setupMobileToggle();
  });
})();
