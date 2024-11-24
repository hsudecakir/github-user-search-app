function init(){
  const lightModeBtn = document.querySelector('.light-mode-btn');
  const darkModeBtn = document.querySelector('.dark-mode-btn');

  lightModeBtn.addEventListener('click', changeTheme);
  darkModeBtn.addEventListener('click', changeTheme);
  searchInputForm.addEventListener('submit', findUser);

  loadLocalStorage();
}

function saveLocalStorage(){
  if(document.body.classList.contains('dark-mode')){
    localStorage.setItem('mode', 'darkMode');
  } else{
    localStorage.setItem('mode', 'lightMode');
  }
}

function loadLocalStorage(){
  const mode = localStorage.getItem('mode');
  if(mode){
    if(mode == 'darkMode'){
      document.body.classList.add('dark-mode');
    }
  } else{
    if(window.matchMedia(('(prefers-color-scheme : dark)')).matches){
      document.body.classList.add('dark-mode');
    }
  }
}

function changeTheme(){
  document.body.classList.toggle('dark-mode');
  saveLocalStorage();
}

async function fetchUserInfo() {
  const inputValue = searchInput.value.trim().toLowerCase();
  const response = await fetch(`https://api.github.com/users/${inputValue}`);
  const data = await response.json();
  return data;
}

async function findUser(e) {
  e.preventDefault();
  const inputValue = searchInput.value.trim().toLowerCase();
  try{
  const data = await fetchUserInfo();
  const date = data.created_at.split('-').reverse();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if(inputValue == data.login.toLowerCase()){
    avatar.innerHTML = `<img class="user-img" src="${data.avatar_url}">`;
    userInfoContainer.innerHTML = `
      <div class="user-info-container__wrapper--left">
        <p class="user-name">${data.name}</p>
        <a href="${data.html_url}" class="username" target="_blank">@${data.login}</a>
      </div>
      <p class="join-date">Joined ${date[0].slice(0, 2)} ${months[Number(date[1]) - 1]} ${date[2]}</p>
    `
    if(data.bio == null || data.bio == ''){
      userBio.innerHTML = `<p>This profile has no bio</p>`;
      userBio.classList.add('no-bio');
    } else{
      userBio.innerHTML = `<p>${data.bio}</p>`;
      userBio.classList.remove('no-bio');
    }
    followersInfoContainer.innerHTML = `
      <div class="user-followers-info-grid-item">
        <p>Repos</p>
        <p id="reposNumber">${data.public_repos}</p>
      </div>
      <div class="user-followers-info-grid-item">
        <p>Followers</p>
        <p id="followersNumber">${data.followers}</p>
      </div>
      <div class="user-followers-info-grid-item">
        <p>Following</p>
        <p id="followingNumber">${data.following}</p>
      </div>
    `
    userContactContainer.innerHTML = `
      <div class="user-contact-grid-item ${data.location == null || data.location == '' ? 'not-available' : ''} no-link">
        <i class="fa-solid fa-location-dot"></i>
        <a href="#" id="location">${data.location == null ? 'Not Available' : data.location}</a>
      </div>
      <div class="user-contact-grid-item ${data.blog == null || data.blog == '' ? 'not-available no-link' : ''}">
        <i class="fa-solid fa-link"></i>
        <a href="${data.blog == null || data.blog == '' ? '#' : data.blog}" id="githubLink" target="_blank">${data.blog == null || data.blog == '' ? 'Not Available' : data.blog}</a>
      </div>
      <div class="user-contact-grid-item not-available ${data.twitter_username == null || data.twitter_username == '' ? 'not-available no-link' : ''}">
        <i class="fa-brands fa-twitter"></i>
        <a href="${data.twitter_username == null || data.twitter_username == '' ? '#' : data.twitter_username}" id="twitterLink" target="_blank">${data.twitter_username == null || data.twitter_username == '' ? 'Not Available' : data.twitter_username}</a>
      </div>
      <div class="user-contact-grid-item ${data.company == null || data.company == '' ? 'not-available' : ''} no-link">
        <i class="fa-solid fa-building"></i>
        <a href="#" id="company">${data.company == null || data.company == '' ? 'Not Available' : data.company}</a>
      </div>
    `
    errorText.style.display = 'none';
    document.body.classList.remove('no-content');
  }
  } catch{
    if(inputValue == ''){
      errorText.style.display = 'inline-block';
      errorText.innerText = "Can't be blank";
    } else{
      errorText.style.display = 'inline-block';
      errorText.innerText = 'No Results';
    }
  }
  bindNoLinks();
}

function bindNoLinks(){
  const noLinks = document.querySelectorAll('.no-link');
  for (const noLink of noLinks) {
    noLink.addEventListener('click', preventLinkClick);
  }
}

function preventLinkClick(e){
  e.preventDefault();
}

init();



