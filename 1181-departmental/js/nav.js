(function () {
  const NAV = [
    {
      group: "Overview",
      items: [
        { href: "index.html", label: "Home / Proposal" },
        { href: "skeleton.html", label: "Skeleton Draft" },
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
  ];

  function currentPage() {
    const path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  function renderSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;
    const here = currentPage();

    const title = document.createElement("h2");
    title.textContent = "ENGL 1181 — Track A Skeleton";
    sidebar.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.className = "sidebar-subtitle";
    subtitle.textContent = "FYW Proposal Draft";
    sidebar.appendChild(subtitle);

    NAV.forEach((section) => {
      const groupTitle = document.createElement("h3");
      groupTitle.className = "sidebar-group-title";
      groupTitle.textContent = section.group;
      sidebar.appendChild(groupTitle);

      const ul = document.createElement("ul");
      section.items.forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;
        if (item.href === here) a.setAttribute("aria-current", "page");
        li.appendChild(a);
        ul.appendChild(li);
      });
      sidebar.appendChild(ul);
    });
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
