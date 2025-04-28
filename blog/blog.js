async function fetchBlogEntryFromQuery() {
    const container = document.getElementById('blog-entries-container');
    const navbar = document.getElementById('nav');
    container.innerHTML = '';

    // Get the 'entry' query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const entryName = urlParams.get('entry');

    if (!entryName) {
        document.title = "Error :(";
        //Hack...
        container.innerHTML = '<p>No blog entry specified in the URL...<p><br><a href="/blog">Try selecting an entry!</a>';
        document.body.style.height = "80vh"; //WTF?
        return;
    }

    const entryPath = `entries/${entryName}.json`;

    try {
        const response = await fetch(entryPath);
        if (!response.ok) {
            document.title = "Error :(";
            container.textContent = 'Blog entry not found.';
            console.error('Failed to fetch blog entry:', entryPath);
            return;
        }
        const blogEntry = await response.json();

        // Set document title if documentTitle is present
        if (blogEntry.documentTitle) {
            document.title = blogEntry.documentTitle;
        }

        renderBlogEntry(container, blogEntry, navbar);
    } catch (error) {
        document.title = "Error :(";
        container.textContent = 'Error loading blog entry.';
        console.error('Error fetching blog entry:', entryPath, error);
    }
}

function renderBlogEntry(container, blogEntry, navbar) {
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('blog-entry');

    imageDialog = document.createElement('dialog');
    imageDialog.id = 'image-popup-dialog';
    imageDialog.style.padding = '0';
    imageDialog.style.border = 'none';
    imageDialog.style.background = 'transparent';

    imageDialog.addEventListener('click', () => {
        imageDialog.close();
    });

    document.body.appendChild(imageDialog);

    const nextBlog = document.createElement("a");
    const prevBlog = document.createElement("a");

    nextBlog.innerText = "Next Entry";
    nextBlog.id = "navnext";
    prevBlog.innerText = "Previous Entry";
    prevBlog.id = "navback";

    nextBlog.href = `entry.html?entry=${blogEntry.next}`;
    
    if (blogEntry.prev != null)
        prevBlog.href = `entry.html?entry=${blogEntry.prev}`;

    const title = document.createElement('h2');
    title.textContent = blogEntry.title;
    entryDiv.appendChild(title);

    blogEntry.content.forEach(section => {
        let sectionElement;
        switch (section.type) {
            case 'bigText':
                sectionElement = document.createElement('div');
                const sectionTitle = document.createElement('h3');
                sectionTitle.textContent = section.title;
                const sectionContent = document.createElement('p');
                sectionContent.textContent = section.content;
                sectionElement.appendChild(sectionTitle);
                sectionElement.appendChild(sectionContent);
                break;
            case 'image':
                sectionElement = document.createElement('div');
                const imgTitle = document.createElement('h3');
                imgTitle.textContent = section.title;
                const imgCaption = document.createElement('p');
                imgCaption.textContent = section.content + " (click to expand)"; 
                const img = document.createElement('img');
                img.src = section.path;
                img.alt = section.alt ? section.alt : section.title;

                img.style.cursor = 'pointer';
                img.addEventListener('click', () => {
                    imageDialog.innerHTML = '';
                    const dialogImage = document.createElement('img');
                    dialogImage.src = img.src;
                    dialogImage.alt = img.alt;
                    dialogImage.style.maxWidth = '90vw';
                    dialogImage.style.maxHeight = '90vh';
                    dialogImage.style.display = 'block';
                    dialogImage.style.margin = 'auto';

                    imageDialog.appendChild(dialogImage);
                    imageDialog.showModal();
                });

                sectionElement.appendChild(imgTitle);
                sectionElement.appendChild(img);
                sectionElement.appendChild(imgCaption);
                break;
            case 'code':
                sectionElement = document.createElement('div');
                const codeTitle = document.createElement('h3');
                codeTitle.textContent = section.title;
                const codeBlock = document.createElement('pre');
                const codeContent = document.createElement('code');
                codeContent.textContent = section.content.join('\n');
                codeBlock.appendChild(codeContent);
                sectionElement.appendChild(codeTitle);
                sectionElement.appendChild(codeBlock);
                break;
            default:
                console.warn('Unknown blog content type:', section.type);
                break;
        }
        if (sectionElement) {
            entryDiv.appendChild(sectionElement);
        }
    });

    if (blogEntry.prev == null){ 
        prevBlog.style.position = "relative";
        prevBlog.style.top = "-100vh";
    }
    navbar.appendChild(prevBlog);
    navbar.appendChild(nextBlog);
    container.appendChild(entryDiv);
}

document.addEventListener('DOMContentLoaded', fetchBlogEntryFromQuery);
