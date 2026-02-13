console.log("EduNavigator Client Initialized");

// Interactvity for Buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.96)';
    });
    button.addEventListener('mouseup', () => {
        button.style.transform = '';
    });
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
});

// Career Quiz Logic
const quizForm = document.getElementById('career-quiz-form');
if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const resultsContainer = document.getElementById('results-container');
        const recommendations = document.getElementById('recommendations');
        const loader = resultsContainer.querySelector('.loader-container');
        const formData = new FormData(quizForm);

        // Hide form, show loader
        quizForm.classList.add('hidden');
        resultsContainer.classList.remove('hidden');

        // Mock API Latency
        setTimeout(() => {
            loader.classList.add('hidden');

            // Simple mock logic
            const interest = formData.get('q1');
            let career = "Undecided";
            let details = "Explore more options.";

            if (interest === 'tech') {
                career = "Software Engineer / AI Architect";
                details = "High demand in 2025. Your logic skills fit perfectly here. Expected growth: +22%.";
            } else if (interest === 'art') {
                career = "UX/UI Designer / Digital Artist";
                details = "Your creativity combined with modern tools will shape the visual web.";
            } else if (interest === 'science') {
                career = "Biotech Researcher / Data Scientist";
                details = "Solving complex problems using data and science.";
            } else {
                career = "Business Strategist / Entrepreneur";
                details = "Leading teams and building value in the marketplace.";
            }

            recommendations.innerHTML = `
                <div class="recommendation-card" style="animation: fadeIn 0.5s ease;">
                    <h3>🎯 Top Match: ${career}</h3>
                    <p>${details}</p>
                    <p><strong>Avg Entry Salary:</strong> ₹6 LPA - ₹18 LPA</p>
                    <button class="primary-btn" style="margin-top:1rem; font-size:0.9rem; padding: 0.6rem 1.2rem;" onclick="window.location.href='college-matcher.html?career=${encodeURIComponent(career)}'">Find Matching Colleges</button>
                </div>
            `;
        }, 1500);
    });
}

// College Matcher Logic
const collegeGrid = document.getElementById('college-results');
if (collegeGrid) {
    const colleges = [
        // West
        { name: "IIT Bombay", location: "Mumbai, MH", type: "tech", cost: 250000, acceptance: "1%", region: "west", tags: ["#JEE", "#CSE"] },
        { name: "VJTI Mumbai", location: "Mumbai, MH", type: "tech", cost: 85000, acceptance: "2%", region: "west", tags: ["#MHT-CET", "#Govt"] },
        { name: "COEP Pune", location: "Pune, MH", type: "tech", cost: 90000, acceptance: "1.5%", region: "west", tags: ["#Legacy", "#Robotics"] },
        { name: "SPIT Mumbai", location: "Mumbai, MH", type: "tech", cost: 170000, acceptance: "3%", region: "west", tags: ["#Modern", "#Coding"] },
        { name: "BITS Pilani (Goa)", location: "Goa", type: "tech", cost: 550000, acceptance: "5%", region: "west", tags: ["#CampusLife", "#BITS"] },
        { name: "IIM Ahmedabad", location: "Ahmedabad, GJ", type: "business", cost: 2400000, acceptance: "0.2%", region: "west", tags: ["#CAT", "#MBA"] },
        { name: "NID Ahmedabad", location: "Ahmedabad, GJ", type: "art", cost: 300000, acceptance: "3%", region: "west", tags: ["#Design", "#Creative"] },
        { name: "NMIMS Mumbai", location: "Mumbai, MH", type: "business", cost: 400000, acceptance: "15%", region: "west", tags: ["#NMAT", "#Metro"] },

        // North
        { name: "IIT Delhi", location: "New Delhi, DL", type: "tech", cost: 220000, acceptance: "1%", region: "north", tags: ["#Startup", "#Capital"] },
        { name: "DTU (Delhi Tech)", location: "New Delhi, DL", type: "tech", cost: 190000, acceptance: "4%", region: "north", tags: ["#Placements", "#Legacy"] },
        { name: "BITS Pilani", location: "Pilani, RJ", type: "tech", cost: 550000, acceptance: "2%", region: "north", tags: ["#NoAttendance", "#Freedom"] },
        { name: "IIM Lucknow", location: "Lucknow, UP", type: "business", cost: 2000000, acceptance: "1%", region: "north", tags: ["#Finance", "#Marketing"] },
        { name: "NIFT Delhi", location: "New Delhi, DL", type: "art", cost: 280000, acceptance: "8%", region: "north", tags: ["#Fashion", "#Trends"] },
        { name: "Ashoka Univ", location: "Sonipat, HR", type: "art", cost: 900000, acceptance: "12%", region: "north", tags: ["#LiberalArts", "#Global"] },
        { name: "Thapar Univ", location: "Patiala, PB", type: "tech", cost: 450000, acceptance: "20%", region: "north", tags: ["#Infra", "#Research"] },
        { name: "Amity Noida", location: "Noida, UP", type: "business", cost: 350000, acceptance: "60%", region: "north", tags: ["#Global", "#Management"] },

        // South
        { name: "IIT Madras", location: "Chennai, TN", type: "tech", cost: 210000, acceptance: "0.8%", region: "south", tags: ["#NIRF_Rank1", "#Research"] },
        { name: "IISc Bangalore", location: "Bangalore, KA", type: "science", cost: 40000, acceptance: "0.1%", region: "south", tags: ["#PureScience", "#Elite"] },
        { name: "VIT Vellore", location: "Vellore, TN", type: "tech", cost: 198000, acceptance: "15%", region: "south", tags: ["#VITEEE", "#MassReco"] },
        { name: "Manipal (MIT)", location: "Manipal, KA", type: "tech", cost: 450000, acceptance: "18%", region: "south", tags: ["#StudentLife", "#Private"] },
        { name: "IIM Bangalore", location: "Bangalore, KA", type: "business", cost: 2450000, acceptance: "0.5%", region: "south", tags: ["#Consulting", "#Strategy"] },
        { name: "NIFT Bengaluru", location: "Bangalore, KA", type: "art", cost: 270000, acceptance: "9%", region: "south", tags: ["#TechFashion", "#Textile"] },
        { name: "IIIT Hyderabad", location: "Hyderabad, TS", type: "tech", cost: 350000, acceptance: "1%", region: "south", tags: ["#CodingCulture", "#HighPkg"] },
        { name: "SRM University", location: "Chennai, TN", type: "tech", cost: 350000, acceptance: "40%", region: "south", tags: ["#Engineering", "#Campus"] }
    ];

    function renderColleges(filterType = 'all', filterLoc = 'all', maxCost = 2500000) {
        collegeGrid.innerHTML = '';
        const filtered = colleges.filter(c =>
            (filterType === 'all' || c.type === filterType) &&
            (filterLoc === 'all' || c.region === filterLoc) &&
            c.cost <= maxCost
        );

        if (filtered.length === 0) {
            collegeGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #a0a0a0;">No colleges found within this fee range.</p>';
            return;
        }

        filtered.forEach(college => {
            const card = document.createElement('div');
            card.className = 'college-card fade-in';
            // Format currency in Indian Lakhs style if needed, or just locale string
            const costStr = college.cost >= 100000 ? `₹${(college.cost / 100000).toFixed(1)}L` : `₹${(college.cost / 1000).toFixed(0)}k`;

            card.innerHTML = `
                <div class="card-image">${getIcon(college.type)}</div>
                <div class="card-content">
                    <div class="college-name">${college.name}</div>
                    <div class="college-location">📍 ${college.location}</div>
                    <div style="font-size: 0.9rem; margin-bottom: 0.5rem;">
                        <span style="color: #4ade80;">${costStr}/yr</span> • 
                        <span style="color: #60a5fa;">${college.acceptance} Acc.</span>
                    </div>
                    <div class="tags">
                        ${college.tags.map(t => `<span class="badge">${t}</span>`).join('')}
                    </div>
                    <button class="secondary-btn view-details-btn" style="width:100%; margin-top: 1rem; padding: 0.6rem;">View Details</button>
                </div>
            `;

            // Attach Click Event
            card.querySelector('.view-details-btn').addEventListener('click', () => openModal(college));

            collegeGrid.appendChild(card);
        });
    }

    function openModal(college) {
        const modal = document.getElementById('college-modal');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');
        const costStr = college.cost >= 100000 ? `₹${(college.cost / 100000).toFixed(1)} Lakhs` : `₹${(college.cost / 1000).toFixed(0)}k`;

        title.textContent = college.name;
        body.innerHTML = `
            <div class="modal-info-row">
                <span class="modal-info-label">Location</span>
                <span class="modal-info-val">${college.location}</span>
            </div>
            <div class="modal-info-row">
                <span class="modal-info-label">Region</span>
                <span class="modal-info-val" style="text-transform: capitalize;">${college.region} India</span>
            </div>
            <div class="modal-info-row">
                <span class="modal-info-label">Tuition Fee</span>
                <span class="modal-info-val">${costStr} / Year</span>
            </div>
            <div class="modal-info-row">
                <span class="modal-info-label">Acceptance Rate</span>
                <span class="modal-info-val">${college.acceptance}</span>
            </div>
            <div class="modal-info-row">
                <span class="modal-info-label">Type</span>
                <span class="modal-info-val" style="text-transform: capitalize;">${college.type} Focus</span>
            </div>
            <p style="margin-top: 1rem; color: #ddd; line-height: 1.6;">
                <strong>${college.name}</strong> is a premier institution known for its excellence. 
                Focus area: <span style="color: var(--neon-cyan);">${college.tags[0].replace('#', '')}</span>. 
                It offers state-of-the-art facilities and a vibrant campus life.
            </p>
        `;

        modal.classList.remove('hidden');

        // Close logic
        document.querySelector('.close-modal').onclick = () => {
            modal.classList.add('hidden');
        };
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.classList.add('hidden');
            }
        };
    }

    function getIcon(type) {
        if (type === 'tech') return '💻';
        if (type === 'art') return '🎨';
        if (type === 'science') return '🧬';
        if (type === 'business') return '📈';
        return '🎓';
    }

    // Initialize with params
    const urlParams = new URLSearchParams(window.location.search);
    const careerParam = urlParams.get('career');
    let initialFilter = 'all';

    // Auto-select filter based on career quiz result
    if (careerParam) {
        if (careerParam.includes('Software') || careerParam.includes('AI')) initialFilter = 'tech';
        else if (careerParam.includes('Designer') || careerParam.includes('Artist')) initialFilter = 'art';
        else if (careerParam.includes('Biotech') || careerParam.includes('Scientist')) initialFilter = 'science';
        else if (careerParam.includes('Business')) initialFilter = 'business';

        document.getElementById('program-filter').value = initialFilter;
    }

    // Event Listeners
    const progFilter = document.getElementById('program-filter');
    const tuitionFilter = document.getElementById('tuition-filter');
    const locFilter = document.getElementById('location-filter');
    const tuitionVal = document.getElementById('tuition-val');

    const updateColleges = () => {
        const cost = parseInt(tuitionFilter.value);
        tuitionVal.textContent = cost >= 100000 ? `₹${(cost / 100000).toFixed(1)}L` : `₹${(cost / 1000).toFixed(0)}k`;
        renderColleges(progFilter.value, locFilter.value, cost);
    };

    progFilter.addEventListener('change', updateColleges);
    locFilter.addEventListener('change', updateColleges);
    tuitionFilter.addEventListener('input', updateColleges);

    // Initial Render
    setTimeout(() => renderColleges(initialFilter), 500); // Small delay for effect
}

// Mentor Chatbot Logic
const chatForm = document.getElementById('chat-form');
if (chatForm) {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = userInput.value.trim();
        if (!text) return;

        // Add User Message
        addMessage(text, 'user');
        userInput.value = '';

        // Mock AI Response (with Fallback)
        addMessageWithLoading(text);
    });

    async function addMessageWithLoading(userText) {
        // Show Loading Bubble
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai loading';
        loadingDiv.innerHTML = '<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
        chatWindow.appendChild(loadingDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        let aiReply = "";

        // 1. Try Fetching from Backend (Python/Gemini)
        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText })
            });

            if (!response.ok) throw new Error("Backend Offline");

            const data = await response.json();
            aiReply = data.reply;
        } catch (err) {
            // 2. Fallback to Local Logic (Mock AI)
            console.warn("Backend unavailable, using local logic:", err);
            await new Promise(r => setTimeout(r, 1000)); // Simulate delay
            aiReply = getAIResponseLocal(userText); // Renamed function
        }

        // Remove Loader & Add Message
        chatWindow.removeChild(loadingDiv);
        addMessage(aiReply, 'ai');
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.innerHTML = text;
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function getAIResponseLocal(input) {
        const lower = input.toLowerCase();

        // --- 1. KNOWLEDGE BASE (Exact & Keyword Match) ---
        const knowledge = {
            exams: {
                jee: ["JEE (Joint Entrance Exam) is the gateway to IITs/NITs.", "For IITs, you need to clear JEE Advanced. For NITs, JEE Mains.", "JEE is one of the toughest exams globally."],
                neet: ["NEET is the sole entrance for MBBS/BDS in India.", "Target 600+ score for Govt Medical Colleges.", "Biology NCERT is your bible for NEET."],
                cat: ["CAT is for IIMs. It tests Aptitude, Logic, and English.", "Top IIMs look for >99 percentile but profile matters too."],
                gate: ["GATE opens doors to PSUs and M.Tech in IITs.", "A high GATE score can get you into ONGC, NTPC, or Research."],
                bitsat: ["BITSAT is all about speed and accuracy.", "BITS Pilani has no reservation policy.", "Score >300 is safe for top branches."],
                clat: ["CLAT is for National Law Universities (NLUs).", "Focus on Current Affairs and Legal Aptitude."],
                cet: ["MHT-CET is key for VJTI, COEP, and SPIT.", "It's easier than JEE but requires high speed."],
                gre: ["GRE is mainly for US/Europe MS programs.", "320+ is a good score for top tier universities."]
            },
            branches: {
                cse: ["Computer Science is the most popular. Focus on DSA and Dev.", "High paying jobs in Google, Microsoft, Amazon.", "Cutoffs are usually very high."],
                ece: ["ECE is evergreen. You can go into Software or Core VLSI.", "Chip design (VLSI) is booming in India right now."],
                mech: ["Mechanical is versatile. Robotics & Mechatronics are future fields.", "Good scope in Germany and Auto companies."],
                civil: ["Civil Engineers build the world. Govt jobs (IES) are a big attraction."],
                mbbs: ["Medicine is noble but a long journey (5.5 yrs + PG).", "Stability is high, but entry is hard."],
                law: ["Corporate Law in top firms pays as much as Engineering.", "Litigation requires patience but has power."]
            },
            locations: {
                mumbai: "Mumbai has IIT Bombay, VJTI, and SPIT. Great industrial exposure.",
                pune: "Pune is the 'Oxford of the East'. COEP & Ferguson are legendary.",
                delhi: "Delhi is an education hub. IIT Delhi, DTU, AIIMS, JNU are world class.",
                bangalore: "Bangalore is the Tech Hub. IISc and IIIT-B are right next to big tech HQs.",
                chennai: "Chennai has IIT Madras and Anna University. Very strong academic culture."
            },
            colleges: {
                "iit bombay": "IIT Bombay: The dream college. Powai campus is beautiful. Top placements.",
                "iit delhi": "IIT Delhi: Located in the capital. massive startup ecosystem.",
                "iit madras": "IIT Madras: Consistently Rank 1 in NIRF. Best campus life.",
                "bits pilani": "BITS Pilani: 'Magic' happens here. Zero attendance policy & student freedom.",
                "vit": "VIT Vellore: A city in itself. Huge opportunities if you stand out.",
                "vjti": "VJTI Mumbai: Best ROI. Low fees, high packages, central Mumbai location.",
                "coep": "COEP Pune: One of the oldest colleges in Asia. Great robotics club."
            }
        };

        // Helper for random response
        const pick = (arr) => Array.isArray(arr) ? arr[Math.floor(Math.random() * arr.length)] : arr;

        // Check Knowledge Base Loops
        for (const [key, val] of Object.entries(knowledge.exams)) if (lower.includes(key)) return `ℹ️ **${key.toUpperCase()}**: ${pick(val)}`;
        for (const [key, val] of Object.entries(knowledge.colleges)) if (lower.includes(key)) return `🏛️ **College**: ${pick(val)}`;
        for (const [key, val] of Object.entries(knowledge.locations)) if (lower.includes(key)) return `📍 ${pick(val)}`;

        // Branch smart match
        const branchMap = {
            cse: ["cse", "computer", "software", "ai", "data", "coding"],
            ece: ["ece", "electronics", "communication", "vlsi"],
            mech: ["mech", "robotics", "auto"],
            civil: ["civil", "construct"],
            mbbs: ["mbbs", "medic", "doctor"],
            law: ["law", "legal"]
        };
        for (const [b, kws] of Object.entries(branchMap)) {
            if (kws.some(k => lower.includes(k))) return `🎓 **${b.toUpperCase()}**: ${pick(knowledge.branches[b])}`;
        }

        // --- 2. PERCENTILE / RANK LOGIC ---
        const numMatch = lower.match(/(\d+(\.\d+)?)/);
        if (numMatch && (lower.includes('percent') || lower.includes('rank') || lower.includes('%'))) {
            const num = parseFloat(numMatch[1]);
            const isRank = lower.includes('rank');

            if (!isRank) { // Percentile
                if (num > 100) return "Percentile can't be > 100! Did you mean marks?";
                if (num >= 99) return "🏆 Top Tier: You're in the top 1%! NIT Trichy, Warangal, Surathkal CSE is very likely.";
                if (num >= 97) return "🌟 Excellent: Top NIT Core branches or IIITs are within reach.";
                if (num >= 94) return "✨ Good: Focus on LNMIIT, Thapar, or new IIITs. Spot rounds available.";
                if (num >= 90) return "👍 Decent: Try Home State NITs or top private colleges like VIT/Manipal.";
                return "💡 Advice: Explore strong private colleges (SRM, KIIT) or state govt colleges. Don't lose hope!";
            } else { // Rank
                if (num < 1000) return "🏅 Under 1000: You are a topper! Old IITs CSE/ECE is yours.";
                if (num < 10000) return "🎖️ Top 10k: Great rank. Almost all NITs and New IITs are open.";
                return "📍 Rank " + num + ": Use the College Matcher to filter specifically for this rank.";
            }
        }

        // --- 3. INTENT & CONVERSATIONAL (Fuzzy Matches) ---
        const intents = [
            { keys: ['hi', 'hello', 'hey', 'greetings'], resp: ["Hello! 👋 Ready to plan your future?", "Hi there! What's on your mind?", "Namaste! 🙏 Ask me anything."] },
            { keys: ['fee', 'cost', 'money', 'expensive'], resp: ["IITs ~10L, NITs ~6L, Pvt ~20L+. Scholarships cover up to 100%.", "Education is an investment! But yes, Pvt colleges are costly (~20L)."] },
            { keys: ['scholarship', 'financial', 'aid'], resp: ["Check NSP, MahaDBT, and college-specific merit waivers.", "Many colleges give 100% waiver for Top 100 ranks."] },
            { keys: ['placement', 'salary', 'package', 'job'], resp: ["Avg Packages: IIT (~25LPA), NIT (~15LPA), Pvt (~6LPA).", "Product companies pay the most. Service based pay ~4-6LPA."] },
            { keys: ['best college', 'top college'], resp: ["'Best' depends on YOU. For tech? IITB. For research? IISc. for MBA? IIM-A.", "IIT Madras is ranked #1. IIT Bombay is preferred by toppers."] },
            { keys: ['exam', 'test'], resp: ["Major exams: JEE (Engg), NEET (Med), CAT (MBA), CLAT (Law). Which one are you targeting?"] },
            { keys: ['how are you'], resp: ["I'm just code, but I'm feeling helpful! 🤖", "Operating at 100% efficiency!"] },
            { keys: ['thank', 'good', 'nice'], resp: ["You're welcome! 🌟", "Happy to help!", "All the best for your prep!"] }
        ];

        for (const intent of intents) {
            if (intent.keys.some(k => lower.includes(k))) return pick(intent.resp);
        }

        // --- 4. FALLBACK (Varied) ---
        const fallbacks = [
            "I'm listening! Tell me more about your interests.",
            "Could you specify your exam (JEE/NEET) or percentile?",
            "I can help with Colleges, Exams, or Career advice. Just ask!",
            "Not sure I got that. Try asking 'Best colleges for Rank 5000' or similar."
        ];
        return pick(fallbacks);
    }
}
