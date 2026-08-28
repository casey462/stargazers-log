const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");
const status = document.querySelector("#status");

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium"
  }).format(new Date(`${dateString}T00:00:00`));
}

function renderRepositories(repositories) {
  repositoryList.innerHTML = repositories.map((repository) => `
    <li class="repository">
      <div>
        <h3><a href="${repository.url}" target="_blank" rel="noreferrer">${repository.owner}/${repository.name}</a></h3>
        <p class="repository-description">${repository.description}</p>
      </div>
      <div class="repository-meta">
        <span>${repository.language}</span>
        <span>Starred ${formatDate(repository.starred_at)}</span>
      </div>
    </li>
  `).join("");
  repositoryCount.textContent = `${repositories.length} repositories`;
  status.remove();
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Could not load repositories: ${response.status}`);
    }

    renderRepositories(await response.json());
  } catch (error) {
    status.textContent = "The repository list could not be loaded.";
    status.classList.add("error");
    console.error(error);
  }
}

loadRepositories();