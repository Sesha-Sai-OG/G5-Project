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
