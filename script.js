let profiles = JSON.parse(localStorage.getItem("profiles")) || [];
let chatPartner = null;

// Save profile
document.getElementById("profile-form").addEventListener("submit", function (e) {
    e.preventDefault();

    let profile = {
        name: document.getElementById("name").value.trim(),
        subjects: document.getElementById("subjects").value.toLowerCase().trim(),
        studyHours: document.getElementById("study-hours").value.toLowerCase().trim()
    };

    // Update or add profile
    profiles = profiles.filter(p => p.name !== profile.name);
    profiles.push(profile);
    localStorage.setItem("profiles", JSON.stringify(profiles));

    alert("Profile saved!");
    displayMatches();
});

// Match by subject + time
function displayMatches() {
    let myProfile = profiles[profiles.length - 1];
    if (!myProfile) return;

    let matched = profiles.filter(p =>
        p.name !== myProfile.name &&
        p.subjects === myProfile.subjects &&
        p.studyHours === myProfile.studyHours
    );

    let matchList = document.getElementById("match-list");
    matchList.innerHTML = "";

    matched.forEach(p => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${p.name} - ${p.subjects} (${p.studyHours})
            <button onclick="startChat('${p.name}')">Chat</button>
        `;
        matchList.appendChild(li);
    });
}

// Chat box functions
function startChat(name) {
    chatPartner = name;
    document.getElementById("chatWith").innerText = `Chat with ${name}`;
    document.getElementById("chatContainer").classList.remove("chat-hidden");
    loadMessages();
}

document.getElementById("closeChat").addEventListener("click", function () {
    document.getElementById("chatContainer").classList.add("chat-hidden");
    chatPartner = null;
});

document.getElementById("sendMessage").addEventListener("click", function () {
    sendMessage();
});

document.getElementById("chatMessage").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    let msg = document.getElementById("chatMessage").value.trim();
    if (!msg || !chatPartner) return;

    let messages = JSON.parse(localStorage.getItem("messages")) || {};
    if (!messages[chatPartner]) messages[chatPartner] = [];
    messages[chatPartner].push({ text: msg, sender: "me", time: new Date().toLocaleTimeString() });
    localStorage.setItem("messages", JSON.stringify(messages));

    document.getElementById("chatMessage").value = "";
    loadMessages();
}

function loadMessages() {
    let chatBox = document.getElementById("chatMessages");
    chatBox.innerHTML = "";

    let messages = JSON.parse(localStorage.getItem("messages")) || {};
    let chatHistory = messages[chatPartner] || [];

    chatHistory.forEach(m => {
        let div = document.createElement("div");
        div.className = m.sender === "me" ? "my-message" : "their-message";
        div.textContent = `${m.text} (${m.time})`;
        chatBox.appendChild(div);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Initial display
displayMatches();
