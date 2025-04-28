const cardProjects = document.querySelector(".projects ul");
const cardAbout = document.querySelector(".contact");
const cardBlog = document.querySelector(".bloglist");
const discordCopy = document.querySelector("#discordCopy");
const definer1 = document.querySelector("#definer1");
const definer2 = document.querySelector("#definer2");
const definer3 = document.querySelector("#definer3");
let projects = [];

function rollRandomFacts(){
    const definer1_facts = ["Programmer, most of the time."]
    const definer2_facts = ["Source Engine Fan"];
    const definer3_facts = ["Furry"];

    definer1.innerText = definer1_facts[Math.floor(Math.random() * definer1_facts.length)];
    definer2.innerText = definer2_facts[Math.floor(Math.random() * definer2_facts.length)];
    definer3.innerText = definer3_facts[Math.floor(Math.random() * definer3_facts.length)];
}

async function getProjects(){
    try {
        let result = await fetch("./files/projects.json");
        if (!result.ok) {
            console.error("Failed to fetch projects.json:", result.status, result.statusText);
            return;
        }
        let json = await result.json();
        console.log("Full JSON response:", json);
        let data = json.projects;
        if (!data) {
            console.error("No 'projects' property found in JSON");
            return;
        }
        cardProjects.innerHTML = "";
        data.forEach(project => {
            const projectEntry = document.createElement("li");
            const projectEntryTitle = document.createElement("h3");
            const projectEntryDescription = document.createElement("p");
            const projectEntryLink = document.createElement("a");
            projectEntry.appendChild(projectEntryTitle);
            projectEntry.appendChild(projectEntryDescription);
            projectEntry.appendChild(projectEntryLink);
    
            projectEntryTitle.innerText = project.name;
            projectEntryDescription.innerText = project.description;
            projectEntryLink.href = project.link;
            projectEntryLink.target = "_blank";
            projectEntryLink.innerText = "Go to the project";
    
            cardProjects.appendChild(projectEntry);
        });
    } catch (error) {
        console.error("Error fetching or parsing projects.json:", error);
    }
}

getProjects();
loadBlogEntries(cardBlog);
rollRandomFacts();

discordCopy.addEventListener("click", (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(discordCopy.getAttribute("data-copy"));
    alert("Copied!");
});
