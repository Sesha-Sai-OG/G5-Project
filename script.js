let profiles = JSON.parse(localStorage.getItem("profiles")) || [];

document.getElementById("profile-form").addEventListener("submit", function(e) {
    e.preventDefault();
    
    let profile = {
        name: document.getElementById("name").value,
        subjects: document.getElementById("subjects").value.toLowerCase(),
        studyHours: document.getElementById("study-hours").value.toLowerCase(),
        branch: document.getElementById("branch").value.toLowerCase(),
        year: document.getElementById("year").value.toLowerCase(),
        hostel: document.getElementById("hostel").value.toLowerCase()
    };

    // Save profile (update if exists)
    profiles = profiles.filter(p => p.name !== profile.name);
    profiles.push(profile);
    localStorage.setItem("profiles", JSON.stringify(profiles));

    alert("Profile saved!");
    displayMatches(profiles);
});

document.getElementById("apply-filters").addEventListener("click", function() {
    let subjectFilter = document.getElementById("filter-subject").value.toLowerCase();
    let branchFilter = document.getElementById("filter-branch").value.toLowerCase();
    let yearFilter = document.getElementById("filter-year").value.toLowerCase();

    let filtered = profiles.filter(p => {
        return (!subjectFilter || p.subjects.includes(subjectFilter)) &&
               (!branchFilter || p.branch.includes(branchFilter)) &&
               (!yearFilter || p.year.includes(yearFilter));
    });

    displayMatches(filtered);
});

function displayMatches(list) {
    let matchList = document.getElementById("match-list");
    matchList.innerHTML = "";
    list.forEach(p => {
        let li = document.createElement("li");
        li.textContent = `${p.name} - Subjects: ${p.subjects} | Hours: ${p.studyHours}`;
        matchList.appendChild(li);
    });
}

// Initial load
displayMatches(profiles);
function startChat(name) {
    chatPartner = name;
    document.getElementById("chatWith").innerText = `Chat with ${name}`;
    document.getElementById("chatContainer").classList.remove("chat-hidden");
    loadMessages();
}

document.getElementById("closeChat").addEventListener("click", function () {
    document.getElementById("chatContainer").classList.add("chat-hidden");
});

document.getElementById("sendMessage").addEventListener("click", function () {
    sendMessage();
});

document.getElementById("chatMessage").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const msg = document.getElementById("chatMessage").value.trim();
    if (!msg) return;

    let messages = JSON.parse(localStorage.getItem(`chat_${currentUser}_${chatPartner}`)) || [];
    messages.push({ sender: currentUser, text: msg, time: new Date().toLocaleTimeString() });
    localStorage.setItem(`chat_${currentUser}_${chatPartner}`, JSON.stringify(messages));

    document.getElementById("chatMessage").value = "";
    loadMessages();
}

function loadMessages() {
    const messagesBox = document.getElementById("chatMessages");
    messagesBox.innerHTML = "";

    let messages = JSON.parse(localStorage.getItem(`chat_${currentUser}_${chatPartner}`)) || [];
    messages.forEach(m => {
        const msgDiv = document.createElement("div");
        msgDiv.innerHTML = `<b>${m.sender}:</b> ${m.text} <small>${m.time}</small>`;
        messagesBox.appendChild(msgDiv);
    });

    messagesBox.scrollTop = messagesBox.scrollHeight;
}
