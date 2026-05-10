const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add favicon
    if (!content.includes('<link rel="icon"')) {
        content = content.replace('</head>', '    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>♾️</text></svg>">\n</head>');
    }

    // Add hamburger menu
    if (!content.includes('hamburger-btn')) {
        content = content.replace('<div class="search-bar">', '<button class="hamburger-btn icon-btn" onclick="toggleSidebar()"><i class="fa-solid fa-bars"></i></button>\n                    <div class="search-bar">');
    }

    fs.writeFileSync(file, content);
});
console.log("Updated all HTML files.");
