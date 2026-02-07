from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

from data.student import students, SKILL_VOCAB

class CompanyInput(BaseModel):
    role : str
    req_skills : List[str]
    pref_skills : List[str]
    min_cgpa : float
    count : int


def vectorize(skills, vocab):
    return [1 if skill in skills else 0 for skill in vocab]

def calc_skill(req, pref, student_skills):
    req = len(set(req) & set(student_skills)) / len(req)
    pref = len(set(pref) & set(student_skills)) / len(pref) if pref else 0
    return (0.8 * req) + (0.2 * pref)

def calc_score(student, company):
    if not company.req_skills:
        return 0.0

    s_vec = np.array(vectorize(student['skills'], SKILL_VOCAB))
    c_vec = np.array(vectorize(company.req_skills, SKILL_VOCAB))

    cosine_score = cosine_similarity(c_vec.reshape(1, -1), s_vec.reshape(1, -1))[0][0]

    logic_score = calc_skill(
        company.req_skills,
        company.pref_skills,
        student['skills']
    )

    skill_score = 0.7 * cosine_score + 0.3 * logic_score
    cgpa_score = student['cgpa'] / 10

    ROLE_BASED_WEIGHT = {
        "backend": (0.8, 0.2),
        "frontend": (0.7, 0.3),
        "fullstack": (0.9, 0.1),
        "data_science": (0.6, 0.4),
        "devops": (0.5, 0.5)
    }

    role = company.role.lower()
    w_skill, w_cgpa = ROLE_BASED_WEIGHT.get(role, (0.5, 0.5))

    return round((w_skill * skill_score) + (w_cgpa * cgpa_score), 4)


app = FastAPI(title = "Placement Recommendation System API")

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status" : "online"}


@app.post("/recommend")
def recommend_placements(company: CompanyInput):
    if not company.req_skills:
        return 0

    results = []

    for student in students:
        if student['cgpa'] < company.min_cgpa:
            continue

        score = calc_score(student, company)
        results.append({
            "id": student['id'],
            "name": student['name'],
            "cgpa": student['cgpa'],
            "skills": student['skills'],
            "score": score
        })

    results.sort(key=lambda x: x['score'], reverse=True)

    return results[:company.count]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
