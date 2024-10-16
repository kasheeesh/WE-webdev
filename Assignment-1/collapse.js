function collapse() {
    let collapsible = document.getElementsByClassName("collapsible");
    for (let i = 0; i < collapsible.length; i++) {
        collapsible[i].addEventListener("click", function () {
            let divcontent = this.nextElementSibling;
            (divcontent.style.display === "block") ? divcontent.style.display = "none" : divcontent.style.display = "block";
        });
    }
    tableOfContent();
}

function tableOfContent() {
    const toc = document.getElementById('toc-list');
    const headings = document.querySelectorAll('.collapsible');
    const nestedToc = [];

    headings.forEach(function (heading) {
        let sectionId = heading.parentElement.id;
        let listItem = document.createElement('li');
        let link = document.createElement('a');
        link.href = '#' + sectionId;
        link.textContent = heading.textContent;

        listItem.appendChild(link);
        
        const level = parseInt(heading.tagName.charAt(1));
        
        if (level === 2) { 
            nestedToc.push({ item: listItem, children: [] });
        } else if (level === 3) {
            if (nestedToc.length > 0) {
                nestedToc[nestedToc.length - 1].children.push(listItem);
            }
        }
    });

    nestedToc.forEach(function (item) {
        toc.appendChild(item.item);
        if (item.children.length > 0) {
            let sublist = document.createElement('ol');
            item.children.forEach(child => sublist.appendChild(child));
            item.item.appendChild(sublist);
        }
    });
}

collapse();

