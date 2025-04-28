async function loadBlogEntries(blog) {
    const listContainer = blog == null ? document.getElementById('blog-entries-list') : blog;
    listContainer.innerHTML = '';

    const entries = [
        { filename: '01_First', title: 'First Blog Post!' },
        { filename: 'MythosBotCreation', title: 'Two things I liked to make in MythosBot' }
    ];

    entries.forEach(entry => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `/blog/entry.html?entry=${entry.filename}`;
        link.textContent = entry.title;
        listItem.appendChild(link);
        listContainer.appendChild(listItem);
    });
}
