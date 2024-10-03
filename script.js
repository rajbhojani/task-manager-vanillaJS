document.getElementById("addTask").addEventListener("click", function () {
  const taskInput = document.getElementById("taskInput");
  const taskName = taskInput.value;
  if (taskName) {
    fetch("index.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=add&name=${encodeURIComponent(taskName)}`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {

          const newTask = document.createElement("div");
          newTask.className = "tasklistbox";
          newTask.setAttribute("data-id", data.id);
          newTask.innerHTML = `
          <div class="view-form">
            <span class="task-name">${taskName}</span>
            <div class="actions">
              <button class="editButton"></button>
              <button class="deleteTask"></button>
              <button class="more"></button>
              <div class="dropdown-content hidden">
                <ul class="task-status-list">
                  <li class="task-status-item selected" data-status="Pending">
                    <span class="status-text Pending">Pending</span>
                  </li>
                  <li class="task-status-item" data-status="In-Progress">
                    <span class="status-text Progress">In Progress</span>
                  </li>
                  <li class="task-status-item" data-status="Completed">
                    <span class="status-text Completed">Completed</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="statuspill Pending"><span class="status-text">Pending</span></div>
          </div>
          <div class="edit-form hidden">
            <input class="task-name-input" type="text" value="${taskName}" />
            <div class="actions">
              <button class="confirmEdit"></button>
              <button class="cancelEdit"></button>
            </div>
          </div>
        `;

          document.querySelector(".taskList").appendChild(newTask);
          taskInput.value = "";
          initializeEventListeners();
          const mainContainer = document.querySelector(".main-container");
          mainContainer.querySelector(".addTask").classList.add("hidden");
          mainContainer.querySelector(".taskList").classList.remove("hidden");
        }
      });
  }
});
initializeEventListeners();
function initializeEventListeners() {

  document.querySelectorAll(".editButton").forEach((button) => {
    button.addEventListener("click", function () {
      const box = this.closest(".tasklistbox");
      box.querySelector(".view-form").classList.add("hidden");
      box.querySelector(".edit-form").classList.remove("hidden");
    });
  });


  document.querySelectorAll(".confirmEdit").forEach((button) => {
    button.addEventListener("click", function () {
      const box = this.closest(".tasklistbox");
      const id = box.getAttribute("data-id");
      const newName = box.querySelector(".edit-form input").value;

      fetch("index.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=edit&id=${id}&name=${encodeURIComponent(newName)}`,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            box.querySelector(".task-name").textContent = newName;
            box.querySelector(".edit-form").classList.add("hidden");
            box.querySelector(".view-form").classList.remove("hidden");
          }
        });
    });
  });


  document.querySelectorAll(".cancelEdit").forEach((button) => {
    button.addEventListener("click", function () {
      const box = this.closest(".tasklistbox");
      box.querySelector(".edit-form").classList.add("hidden");
      box.querySelector(".view-form").classList.remove("hidden");
    });
  });


  document.querySelectorAll(".deleteTask").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.closest(".tasklistbox").getAttribute("data-id");
      const taskElement = this.closest(".tasklistbox");

      fetch("index.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=delete&id=${id}`,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            taskElement.remove();
            updateInProgressCount();
          }
        });
    });
  });


  document.querySelectorAll(".more").forEach((button) => {
    button.addEventListener("click", function () {
      const dropdown = this.nextElementSibling;
      dropdown.classList.toggle("hidden");
    });
  });
  document.addEventListener("click", function (event) {
    const dropdowns = document.querySelectorAll(".dropdown-content");
    dropdowns.forEach((dropdown) => {
      if (
        !dropdown.previousElementSibling.contains(event.target) &&
        !dropdown.contains(event.target)
      ) {
        dropdown.classList.add("hidden");
      }
    });
  });
  document.querySelectorAll(".task-status-item").forEach((item) => {
    item.addEventListener("click", function () {
      const status = this.getAttribute("data-status");
      const id = item.closest(".tasklistbox").getAttribute("data-id");

      fetch("index.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `action=update_status&id=${id}&status=${encodeURIComponent(
          status
        )}`,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            const box = item.closest(".tasklistbox");

            
            const statusPill = box.querySelector(".statuspill");
            statusPill.className = `statuspill ${status}`;
            statusPill.querySelector(".status-text").textContent = status;

            
            const allStatusItems = box.querySelectorAll(".task-status-item");
            allStatusItems.forEach((statusItem) => {
              statusItem.classList.remove("selected");
            });
            this.classList.add("selected");

            
            updateInProgressCount();
          }
        });
    });
  });
}

document.querySelectorAll(".add-new-task").forEach((button) => {
  button.addEventListener("click", function () {
    const mainContainer = document.querySelector(".main-container");
    mainContainer.querySelector(".taskList").classList.add("hidden");
    mainContainer.querySelector(".addTask").classList.remove("hidden");
  });
});

document.querySelectorAll(".backButton").forEach((button) => {
  button.addEventListener("click", function () {
    const mainContainer = document.querySelector(".main-container");
    mainContainer.querySelector(".addTask").classList.add("hidden");
    mainContainer.querySelector(".taskList").classList.remove("hidden");
  });
});

function updateInProgressCount() {
  const tasks = document.querySelectorAll(".tasklistbox");
  let inProgressCount = 0;

  tasks.forEach((task) => {
    if (task.querySelector(".statuspill").classList.contains("In-Progress")) {
      inProgressCount++;
    }
  });

  document.querySelector(
    ".in-progress"
  ).textContent = `In progress (${inProgressCount})`;
}
