//Displaying all the displays in the localStorage on the shortenLinkDisplay
const shortenLinkDisplay = document.querySelector(".shorten-link-display");

let keys = Object.keys(localStorage);
for (i = 0; i < keys.length; i += 2) {

    let shortLink = localStorage.getItem(i);
    let longLink = localStorage.getItem(i + 1);
    addDisplay(shortLink, longLink);
}

//hiding promoImg and displaying navBar when the user clicks the menuIcon
//and hiding navBar and displaying promoImg when the user clicks the menuIcon again
const menuIcon = document.querySelector(".menu-icon");
const navBox = document.querySelector(".nav-box");
const promoImg = document.querySelector(".promo-img");

menuIcon.addEventListener('click', changeNavDisplay);
function changeNavDisplay() {
    if (navBox.classList.contains("hidden-display")) {
        navBox.classList.add("block-display");
        navBox.classList.remove("hidden-display");
        promoImg.classList.remove("block-display");
        promoImg.classList.add("hidden-display");
    } else {
        navBox.classList.remove("block-display");
        navBox.classList.add("hidden-display");
        promoImg.classList.remove("hidden-display");
        promoImg.classList.add("block-display");
    }
}

//check if the URL input is empty when the shorten button is clicked, if so add empty-input class
//if not remove empty-input class

const shortenBtn = document.querySelector(".shorten-box button");
const UrlInput = document.querySelector(".shorten-box input[type='text']");
const errorMessage = document.querySelector(".shorten-box .error-message");


//validate URl and display error message if not
function isUrlValid() {
    var res = UrlInput.value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null) {
        UrlInput.classList.add("empty-input");
        errorMessage.textContent = "Please add a link";
        return false;
    }

    else {
        UrlInput.classList.remove("empty-input");
        errorMessage.textContent = "";
        return true;
    }
}

//fetch shorten link from https://rel.ink/  

async function bringShortenUrl() {
    let requestBodyData = {
        "url": UrlInput.value
    }
    let fetchData = {
        method: 'POST',
        body: JSON.stringify(requestBodyData),
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors"
    }

    let shortLink = await fetch("https://rel.ink/api/links/", fetchData)
        .then(function (response) {
            return response.json();
        })
        .then(respData => {

            let hashId = respData.hashid;
            let shortUrl = `https://rel.ink/${hashId}`;
            return shortUrl;
        })
        .catch(function (response) {
            console.log(response.status)
        });

    return shortLink;
}

//Add short link display
function addDisplay(shortLink, longLink) {
    let newLi = document.createElement('li');
    let newH1 = document.createElement('h1');
    let newDiv = document.createElement('div');
    let newH2 = document.createElement('h2');
    let newBtn = document.createElement('Button');

    newH1.textContent = longLink;
    newH2.textContent = shortLink;
    newBtn.textContent = "copy";
    newBtn.classList.add("not-copied");
    newBtn.addEventListener("click", copyLink);
    newDiv.appendChild(newH2);
    newDiv.appendChild(newBtn);
    newLi.appendChild(newH1);
    newLi.appendChild(newDiv);
    shortenLinkDisplay.appendChild(newLi);
}

//store links in the local storage
function storeDisplay(shortLink, longLink) {
    let keys = Object.keys(localStorage);
    let localStorageLength = keys.length;
    localStorage.setItem(localStorageLength, shortLink);
    localStorage.setItem(localStorageLength + 1, longLink);
}

shortenBtn.addEventListener('click', handelShortenRequest);
async function handelShortenRequest() {
    if (!isUrlValid()) {
        return
    }

    let shortLink = await bringShortenUrl();
    addDisplay(shortLink, UrlInput.value);
    storeDisplay(shortLink, UrlInput.value);
    UrlInput.value = "";
}

//copy shortLink

let copyBtnList = document.querySelectorAll(".shorten-link-display button");
copyBtnList.forEach(btn => {
    btn.addEventListener("click", copyLink);
})

function copyLink(e) {
    let btn = e.target;
    let shortLink = btn.previousElementSibling.textContent;
    let ta = document.createElement("textarea");
    document.body.appendChild(ta)
    ta.value = shortLink;
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);

    editCopyBtn(btn);
}

function editCopyBtn(targetBtn) {
    copyBtnList = document.querySelectorAll(".shorten-link-display button");
    copyBtnList.forEach(btn => {
        btn.classList.add('not-copied');
        btn.classList.remove('copied')
        btn.textContent = 'copy'
    });
    targetBtn.classList.add('copied');
    targetBtn.classList.remove('not-copied')
    targetBtn.textContent = 'copied!'
}

