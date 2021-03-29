const topStory = document.querySelector("#top");
const newStory = document.querySelector("#new");
const bestStory = document.querySelector("#best");
const dispNews = document.querySelector("#dispNews");

const showMoreLabel = document.querySelector("#showMoreLabel");
const showMoreBody = document.querySelector("#showMoreBody");

let news = [];
let type = null;

// set story categeory tab selected -> active
const setTabSelected = (which) => {
  if (topStory.hasAttribute("aria-current")) {
    topStory.removeAttribute("aria-current");
  } else if (newStory.hasAttribute("aria-current")) {
    newStory.removeAttribute("aria-current");
  } else if (bestStory.hasAttribute("aria-current")) {
    bestStory.removeAttribute("aria-current");
  }

  if (topStory.classList.contains("active")) {
    topStory.classList.remove("active");
  } else if (newStory.classList.contains("active")) {
    newStory.classList.remove("active");
  } else if (bestStory.classList.contains("active")) {
    bestStory.classList.remove("active");
  }

  if (which == "top") {
    topStory.setAttribute("aria-current", "page");
    topStory.classList.add("active");
  } else if (which == "new") {
    newStory.setAttribute("aria-current", "page");
    newStory.classList.add("active");
  } else if (which == "best") {
    bestStory.setAttribute("aria-current", "page");
    bestStory.classList.add("active");
  }
};

// Show loading component
const loading = (status) => {
  dispNews.innerHTML = "";
  if (status == true) {
    dispNews.innerHTML = `<div class="col-12 text-center pt-5 mt-5">
    <div class="spinner-border text-warning" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>`;
  }
};

// Show full text of a story in a modal
const showMore = (id) => {
  var modal = new bootstrap.Modal(document.getElementById("showMore"));
  let toModalShow = news.filter((n) => n.id == id);
  showMoreLabel.innerHTML = toModalShow[0]["title"];
  showMoreBody.innerHTML = toModalShow[0]["text"];
  showMoreBody.innerHTML += `<div class="w-100 text-center"><a class="btn btn-primary" href="${toModalShow[0].url}">Read More</a></div>`;
  modal.show();
};

// Display all the news according to the page no selected in pagination component
const displayNews = (pno) => {
  // calculate news starting and ending index according to the page no
  const start = 40 * (pno - 1);
  const end = 40 * pno - 1 > news.length - 1 ? news.length : 40 * pno;
  const showNews = news.slice(start, end);
  dispNews.innerHTML = "";
  showNews.map((sn) => {
    // Convert second into date

    const milliseconds = sn.time * 1000; // 1575909015000
    const d = new Date(milliseconds);
    const date = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();

    dispNews.innerHTML += `<div class="col-auto col-md-3 mb-2">
            <div class="card h-100 border border-3">
                <img src="https://previews.123rf.com/images/maurus/maurus1909/maurus190900112/130691214-graphic-card-part-of-red-graphic-card-as-background-technology-and-electronics-industry-macro-.jpg" class="card-img-top" alt="...">
                <div class="card-body card-body-color">
                    <h5 class="card-title"><a class="card-link" href="${
                      sn.url
                    }">${sn.title}</a></h5>
                    <h6 class="card-title text-center">
                    <span><i class="fas fa-calendar-alt"></i> ${date}</span></h6>
                    <h6><span><i class="fas fa-user-alt"></i> ${sn.by}</span>
                    <span style="float:right"><i class="fas fa-folder-open"></i> ${
                      sn.type
                    }</span></h6>
                    <p class="card-text">${
                      sn.text === undefined
                        ? ""
                        : sn.text.split("<p>")[0] +
                          "<p class='h6 show-btn text-primary' onclick='showMore(" +
                          sn.id +
                          ")'>Read More ></p>"
                    }</p>
                </div>
            </div>
        </div>`;
  });

  // Set pagination component
  let html = `<div class="col-12"><nav class="w-100" aria-label="page navigation">
  <ul class="pagination justify-content-center overflow-auto">
    <li class="page-item disabled">
      <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
    </li>`;
  for (let j = 0; j < Math.ceil(news.length / 40); j++) {
    html += `<li class="page-item ${
      pno - 1 == j ? "active" : ""
    }" onclick='displayNews(${j + 1})'><a class="page-link" href="#">${
      j + 1
    }</a></li>`;
  }
  html += `<li class="page-item">
      <a class="page-link" href="#">Next</a>
    </li>
  </ul>
</nav></div>`;

  dispNews.innerHTML += html;
};

// Fetch all news from express app according to the category
const getAllNews = async (url) => {
  const response = await fetch(url);

  if (response.status !== 200) {
    throw new Error("Can not fetch data!!");
  }

  const data = await response.json();
  return data;
};

// Event handler when top story tab is clicked
topStory.addEventListener("click", (e) => {
  setTabSelected("top");
  if (type != "top") {
    type = "top";
    loading(true);
    getAllNews("http://localhost:3000/api/topstories")
      .then((data) => {
        news = data;
        displayNews(1);
      })
      .catch((err) => console.log("Error: ", err.message));
  } else {
    displayNews(1);
  }
});

// Event handler when new story tab is clicked
newStory.addEventListener("click", (e) => {
  setTabSelected("new");
  if (type != "new") {
    type = "new";
    loading(true);
    getAllNews("http://localhost:3000/api/newstories")
      .then((data) => {
        news = data;
        displayNews(1);
      })
      .catch((err) => console.log("Error: ", err.message));
  } else {
    displayNews(1);
  }
});

// Event handler when best story tab is clicked
bestStory.addEventListener("click", (e) => {
  setTabSelected("best");
  if (type != "best") {
    type = "best";
    loading(true);
    getAllNews("http://localhost:3000/api/beststories")
      .then((data) => {
        news = data;
        displayNews(1);
      })
      .catch((err) => console.log("Error: ", err.message));
  } else {
    displayNews(1);
  }
});


// For displaying firt time

loading(true);
setTabSelected("top");
getAllNews("http://localhost:3000/api/topstories")
  .then((data) => {
    news = data;
    type="top";
    displayNews(1);
  })
  .catch((err) => console.log("Error: ", err.message));
