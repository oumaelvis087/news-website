const API_KEY = "YOUR API KEY";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => {
    fetchNews("Kenya");
    curSelectedNav = document.getElementById("kenya");
    curSelectedNav.classList.add("active");
});

async function fetchNews(query) {
    try {
        // Show loading state
        document.getElementById("cardscontainer").innerHTML = '<div class="loading">Loading news...</div>';
        
        const res = await fetch(`${url}${encodeURIComponent(query)}&apiKey=${API_KEY}`);
        if (!res.ok) throw new Error('Failed to fetch news');
        
        const data = await res.json();
        if (data.articles.length === 0) {
            document.getElementById("cardscontainer").innerHTML = '<div class="no-results">No articles found</div>';
            return;
        }
        bindData(data.articles);
    } catch (error) {
        console.error(error);
        document.getElementById("cardscontainer").innerHTML = '<div class="error">Failed to load news</div>';
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cardscontainer");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    })
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsImg.onerror = () => newsImg.src = 'placeholder-image.jpg'; // Add a placeholder image

    newsTitle.innerHTML = article.title ? `${article.title.slice(0, 60)}...` : 'No title available';
    newsDesc.innerHTML = article.description 
        ? `${article.description.slice(0, 150)}...` 
        : 'No description available';

    const date = new Date(article.publishedAt).toLocaleString("en-US", { 
        timeZone: "Africa/Nairobi",
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    newsSource.innerHTML = `${article.source.name || 'Unknown Source'} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    })
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");
const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    performSearch();
});

function performSearch() {
    const query = searchText.value.trim();
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
}
