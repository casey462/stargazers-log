const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");
const status = document.querySelector("#status");

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid starred date: ${dateString}`);
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium"
  }).format(date);
}

function validateRepositories(repositories) {
  if (!Array.isArray(repositories)) {
    throw new Error("Repository data must be an array");
  }

  return repositories.map((repository) => {
    const fields = ["name", "owner", "description", "language", "starred_at", "url"];

    if (!repository || fields.some((field) => typeof repository[field] !== "string" || !repository[field].trim())) {
      throw new Error("Repository data is missing a required field");
    }

    const url = new URL(repository.url);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Repository URL must use HTTP or HTTPS");
    }

    return repository;
  });
}

function renderRepositories(repositories) {
  repositoryList.replaceChildren(...repositories.map((repository) => {
    const item = document.createElement("li");
    item.className = "repository";

    const details = document.createElement("div");
    const heading = document.createElement("h3");
    const link = document.createElement("a");
    link.href = repository.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = `${repository.owner}/${repository.name}`;
    heading.append(link);

    const description = document.createElement("p");
    description.className = "repository-description";
    description.textContent = repository.description;
    details.append(heading, description);

    const metadata = document.createElement("div");
    metadata.className = "repository-meta";
    const language = document.createElement("span");
    language.textContent = repository.language;
    const starredDate = document.createElement("span");
    starredDate.textContent = `Starred ${formatDate(repository.starred_at)}`;
    metadata.append(language, starredDate);

    item.append(details, metadata);
    return item;
  }));
  repositoryCount.textContent = `${repositories.length} repositories`;
  status.textContent = `${repositories.length} repositories loaded.`;
}

async function loadRepositories() {
  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Could not load repositories: ${response.status}`);
    }

    renderRepositories(validateRepositories(await response.json()));
  } catch (error) {
    status.textContent = "The repository list could not be loaded.";
    status.classList.add("error");
    console.error(error);
  }
}

loadRepositories();