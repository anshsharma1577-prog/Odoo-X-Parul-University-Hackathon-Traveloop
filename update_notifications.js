const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'login.html');

const oldBlock = `<button class="icon-btn notification">
                        <i class="fa-regular fa-bell"></i>
                        <span class="badge"></span>
                    </button>`;

const newBlock = `<div class="notification-container" style="position: relative;">
                        <button class="icon-btn notification" onclick="toggleNotifications(event)">
                            <i class="fa-regular fa-bell"></i>
                            <span class="badge" style="display:flex; justify-content:center; align-items:center; font-size:10px;">2</span>
                        </button>
                        <div class="profile-dropdown-menu" id="notificationDropdown" style="width: 320px; right: -10px; left: auto; padding: 0;">
                            <div style="padding: 16px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                                <h4 style="margin: 0; color: var(--text-dark);">Notifications</h4>
                                <span style="font-size: 0.8rem; color: var(--primary-color); cursor: pointer;" onclick="document.getElementById('notificationDropdown').classList.remove('show')">Mark all read</span>
                            </div>
                            <div style="max-height: 300px; overflow-y: auto;">
                                <a href="#" style="display: flex; gap: 12px; padding: 16px; border-bottom: 1px solid var(--border-color); white-space: normal; text-decoration: none;">
                                    <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(56, 189, 248, 0.1); display: flex; align-items: center; justify-content: center; color: var(--primary-color); flex-shrink: 0;">
                                        <i class="fa-solid fa-plane"></i>
                                    </div>
                                    <div>
                                        <p style="margin: 0; font-size: 0.9rem; color: var(--text-dark);">Your trip to <strong>Paris</strong> starts in 3 days!</p>
                                        <span style="font-size: 0.75rem; color: var(--text-muted);">2 hours ago</span>
                                    </div>
                                </a>
                                <a href="#" style="display: flex; gap: 12px; padding: 16px; border-bottom: 1px solid var(--border-color); white-space: normal; text-decoration: none;">
                                    <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(34, 197, 94, 0.1); display: flex; align-items: center; justify-content: center; color: #22c55e; flex-shrink: 0;">
                                        <i class="fa-solid fa-wallet"></i>
                                    </div>
                                    <div>
                                        <p style="margin: 0; font-size: 0.9rem; color: var(--text-dark);">You stayed under budget for your Tokyo trip.</p>
                                        <span style="font-size: 0.75rem; color: var(--text-muted);">Yesterday</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>`;

files.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    if (c.includes(oldBlock)) {
        fs.writeFileSync(f, c.replace(oldBlock, newBlock));
        console.log('Updated ' + f);
    }
});
