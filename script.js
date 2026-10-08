const WP_SITE = "https://animeshsinha889cne.wordpress.com";
const POSTS_API = `${WP_SITE}/wp-json/wp/v2/posts?_embed&per_page=30`;

const writeUrl = `${WP_SITE}/wp-admin/post-new.php`;
document.querySelector("#writeBtn").href = writeUrl;
document.querySelector("#heroWrite").href = writeUrl;

function stripHtml(html){
  const div=document.createElement("div");
  div.innerHTML=html||"";
  return div.textContent.trim();
}

function formatDate(date){
  return new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"long",year:"numeric"}).format(new Date(date));
}

function getImage(post){
  return post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
}

function card(post){
  const title=stripHtml(post.title?.rendered)||"Untitled Chapter";
  const excerpt=stripHtml(post.excerpt?.rendered).slice(0,170);
  const image=getImage(post);
  const media=image
    ? `<img class="story-image" src="${image}" alt="${title.replace(/"/g,"&quot;")}" loading="lazy">`
    : `<div class="story-placeholder">NO IMAGE YET</div>`;
  return `<article class="story-card">
    ${media}
    <div class="story-body">
      <div class="story-date">${formatDate(post.date)}</div>
      <h3 class="story-title">${title}</h3>
      <p class="story-excerpt">${excerpt || "A new quiet chapter from The Quiet Chapters."}</p>
      <a class="read-link" href="${post.link}" target="_blank" rel="noopener">Read chapter →</a>
    </div>
  </article>`;
}

async function loadStories(){
  const status=document.querySelector("#status");
  const grid=document.querySelector("#storiesGrid");
  try{
    const response=await fetch(POSTS_API);
    if(!response.ok) throw new Error("Could not load posts");
    const posts=await response.json();
    status.textContent = posts.length ? `${posts.length} chapter${posts.length===1?"":"s"} published` : "";
    grid.innerHTML = posts.length
      ? posts.map(card).join("")
      : `<div class="empty">Your first chapter will appear here after you publish it on WordPress.</div>`;
  }catch(error){
    status.textContent="";
    grid.innerHTML=`<div class="empty">Stories could not be loaded right now. The website itself is ready; refresh once WordPress is online.</div>`;
  }
}
loadStories();
