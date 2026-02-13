```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import re

import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Configure Gemini
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-pro')

# --- KNOWLEDGE BASE ---
KNOWLEDGE = {
    "exams": {
        "jee": "JEE (Joint Entrance Exam) is for Engineering. Mains for NITs/IIITs, Advanced for IITs. High competition! Aim for >97 percentile for top NITs.",
        "neet": "NEET is for Medicine (MBBS/BDS). Govt colleges require 600+ marks (Out of 720). Private colleges are expensive.",
        "cat": "CAT is for MBA in IIMs and top B-Schools. >99 percentile gets you IIM A/B/C. >95 for New IIMs/FMS.",
        "gate": "GATE is for M.Tech/PSU jobs. Top IITs require rank < 500 for CSE. Good score: 700+.",
        "bitsat": "BITSAT admission is score-based. BITS Pilani CSE cutoff is usually ~320/390.",
        "clat": "CLAT is for Law (NLUs). Top 5 NLUs require rank < 400.",
        "cet": "MHT-CET is for Maharashtra colleges (VJTI, COEP, SPIT). >99 percentile needed for CSE in VJTI/COEP.",
        "gre": "GRE is for MS abroad (USA/Europe). 320+ is a safe score for Top 50 universities."
    },
    "branches": {
        "cse": "Computer Science: Highest cutoff. Focus: Coding, AI, Systems. Avg Salary: ₹10-20 LPA+.",
        "ece": "Electronics (ECE): Good mix of hardware/software. VLSI jobs pay very well. Avg Salary: ₹8-15 LPA.",
        "mech": "Mechanical: Evergreen branch. Robotics & Auto jobs. Avg Salary: ₹6-10 LPA.",
        "civil": "Civil: Govt jobs (IES/PWD). Real estate sector. Avg Salary: ₹5-8 LPA.",
        "mbbs": "MBBS: 5.5 years. PG (MD/MS) is essential for high career growth.",
        "law": "Law: Corporate Law pays highest. Litigation takes time to build."
    },
    "locations": {
        "mumbai": "Top Mumbai Colleges:\nEngineering: IITB, VJTI, SPIT, DJ Sanghvi.\nManagement: JBIMS, SP Jain.\nArts: St Xaviers.",
        "pune": "Top Pune Colleges:\nEngineering: COEP, PICT, VIT, MIT.\nManagement: SIBM, PUMBA.",
        "delhi": "Top Delhi Colleges:\nEngineering: IITD, DTU, NSUT, IIIT-D.\nMedical: AIIMS, MAMC.\nCommerce: SRCC, LSR.",
        "bangalore": "Top Bangalore Colleges:\nEngineering: IISc, IIIT-B, RVCE, BMS, MSRIT.\nMgmt: IIM-B.",
        "chennai": "Top Chennai Colleges:\nEngineering: IITM, Anna University (CEG/MIT), SSN."
    },
    "colleges": {
        "iit bombay": "IIT Bombay (Mumbai): Top Engineering Institute. Cutoff: JEE Adv Rank < 60 (CSE). Fees: ~₹10L total. Avg Pkg: ₹30 LPA+.",
        "iit delhi": "IIT Delhi: Located in Hauz Khas. Strong Alumni network. Cutoff: Rank < 100 (CSE). Startups culture is huge.",
        "bits pilani": "BITS Pilani: Top Private Institute. No Reservation. Admission: BITSAT score > 320 for CSE. Fees: ~₹25L total (High but worth it).",
        "vit": "VIT Vellore: Known for large campus & placements. Exam: VITEEE. Rank < 5000 for CSE Cat-1. Fees varies by Category (₹2L - ₹5L/yr).",
        "vjti": "VJTI Mumbai: Top Govt College in MH. MHT-CET Cutoff: 99.7+ percentile for CSE/IT. Very low fees (~₹85k/yr) & great ROI.",
        "coep": "COEP Pune: Heritage Institute. MHT-CET Cutoff: 99.8+ percentile. Known for Clubs, Robocon, and Core Placements."
    }
}

def analyze_percentile(p):
    if p >= 99:
        return f"📊 {p}% Analysis: Excellent! Top NITs (Trichy, Warangal, Surathkal) CSE/ECE confirmed. Eligible for IIIT-Hyderabad (via JEE Main)."
    elif p >= 97:
        return f"📊 {p}% Analysis: Very Good! Top NIT Core branches or Mid NIT CSE. DTU/NSUT (Outside Delhi) possible for ECE/EE."
    elif p >= 95:
        return f"📊 {p}% Analysis: Good Score. New IIITs CSE possible. Top State Colleges (VJTI, RVCE) likely via All India Quota."
    elif p >= 90:
        return f"📊 {p}% Analysis: Decent. Focus on Home State Quota for NITs. Consider Thapar, Manipal, JIIT Noida."
    elif p >= 80:
        return f"📊 {p}% Analysis: Challenge. Gen Category NIT seats difficult. Try State Counseling (MHT-CET, COMEDK) or private universities (VIT, SRM, Amity)."
    else:
        return f"📊 {p}% Analysis: Explore Alternatives. Private colleges or Drop year. Check for specialized private exams (MET, SRMJEEE)."

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message', '').lower()
    
    # SYSTEM PROMPT for Gemini
    system_prompt = """
    You are EduBot, the AI Mentor for EduNavigator. 
    Your goal is to guide students (mostly Indian) about Careers, Colleges (IITs, NITs, Private), Exams (JEE, NEET, CAT), and Admissions.
    - Be helpful, encouraging, and concise.
    - Use emojis.
    - If asked about fees/cutoffs, give realistic estimates in INR.
    - If user asks for specific college data not in your training, give general advice.
    """

    # 1. Try Gemini First (if Key exists)
    if GOOGLE_API_KEY:
        try:
            full_prompt = f"{system_prompt}\nUser: {user_input}\nEduBot:"
            response = model.generate_content(full_prompt)
            return jsonify({"reply": response.text})
        except Exception as e:
            print(f"Gemini Error: {e}")
            # Fallthrouguh to local logic

    # --- LOCAL FALLBACK LOGIC ---
    response = "I can help with cutoffs and college predictions. Try saying: 'I got 92 percentile' or 'Best colleges for CSE'."

    # 1. Direct Knowledge Lookup
    for key, val in KNOWLEDGE["exams"].items():
        if key in user_input:
            return jsonify({"reply": f"ℹ️ {key.upper()} Info: {val}"})
            
    for key, val in KNOWLEDGE["colleges"].items():
        if key in user_input:
            return jsonify({"reply": f"🏛️ College Info: {val}"})
            
    for key, val in KNOWLEDGE["locations"].items():
        if key in user_input:
            return jsonify({"reply": val})

    # Branch matching helper
    branches = {
        "cse": ["cse", "computer science", "it", "code", "software", "ai", "data science"],
        "ece": ["ece", "electronics", "communication", "vlsi"],
        "mbbs": ["mbbs", "doctor", "medicine"]
    }
    
    for branch, keywords in branches.items():
        if any(k in user_input for k in keywords):
             return jsonify({"reply": KNOWLEDGE["branches"][branch]})

    # 2. Percentile Parsing
    percentile_match = re.search(r'(\d+(\.\d+)?)(\s*%|\s*percentile)', user_input)
    if percentile_match:
        p = float(percentile_match.group(1))
        return jsonify({"reply": analyze_percentile(p)})

    # 3. Rank Parsing
    rank_match = re.search(r'rank\s*(\d+)', user_input)
    if rank_match:
        r = int(rank_match.group(1))
        if r < 5000:
            return jsonify({"reply": f"🏅 Rank {r}: Top Tier! Old IITs (if Adv) or Top NIT CSE (if Mains). All doors open."})
        elif r < 20000:
            return jsonify({"reply": f"🎖️ Rank {r}: Good Rank. Top NIT Core branches or New IITs. Good IIITs are safe."})
        else:
            return jsonify({"reply": f"📍 Rank {r}: Check previous year cutoffs for state colleges and private universities."})

    # 4. Intent & Conversational
    intents = [
        {"keys": ['hi', 'hello', 'hey'], "resp": ["Hello! 👋 Ready to plan your future?", "Hi! Ask me anything about Indian colleges."]},
        {"keys": ['fee', 'cost', 'money'], "resp": ["IITs ~10L, NITs ~6L, Pvt ~20L+. Scholarships available.", "Private colleges are costly (~20L). Govt colleges offer great ROI."]},
        {"keys": ['scholarship', 'financial'], "resp": ["Check NSP and MahaDBT.", "Many colleges give 100% waiver for Top 100 ranks."]},
        {"keys": ['placement', 'salary'], "resp": ["Avg Packages: IIT (~25LPA), NIT (~15LPA), Pvt (~6LPA).", "Product companies pay the most!"]},
        {"keys": ['best college'], "resp": ["'Best' depends on YOU. For tech? IITB. For research? IISc.", "IIT Madras is #1 in NIRF."]}
    ]
    
    import random
    for intent in intents:
        if any(k in user_input for k in intent['keys']):
            return jsonify({"reply": random.choice(intent['resp'])})

    # 5. Fallback
    fallbacks = [
        "I'm listening! Tell me more about your interests.",
        "Could you specify your exam (JEE/NEET) or percentile?",
        "I can help with Colleges, Exams, or Career advice. Just ask!"
    ]
    response = random.choice(fallbacks)

    return jsonify({"reply": response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
