import csv
import json

dimension_dict = {
    "Project Details": 1,
    "Organization Maturity": 2,
    "Accountability": 3,
    "Data": 4,
    "Fairness": 5,
    "interpretability": 6,
}

subdimension_dict = {
    "Strategy (AI/Technology Experience)": 1,
    "Governance": 2,
    "People & Training": 3,
    "human-in-the-loop/Agency/Autonomy": 4,
    "Disclosure of Automation": 5,
    "Dynamic nature of data (& data drift)": 6,
    "Redress (all mitigation)": 7,
    "Internal logs for ethical decisions": 8,
    "Sensitive Data": 9,
    "Data Type (bias part 2)": 10,
    "Structure of data": 11,
    "Data Providence": 12,
    "Representativeness": 13,
    "Data Qualification": 14,
    "Breadth of deployment": 15,
    "Domain (bias part 1)": 16,
    "System Task": 17,
    "Manipulation": 18,
    "Human Rights & Accessibility Scenario Planning": 19,
    "Representation": 21,
    "Labor Displacement": 22,
    "Model Details": 23,
    "Risks of Gaming/ Explainable to whom": 24,
    "Communication to Users when the user is not the client": 25,
    "Communication to the User when the user is the client": 26,
    "Additional Systems Reporting": 27,
    "Adversarial Attack Considerations": 28,
    "Quality of Service Indicators": 29,
    "Edge case testing": 30,
    "Component Interaction": 31,
    "Scope of your AI System": 32,
}
import pdb

def get_response_weights_for_question(rows):
    responses = []
    i = 0
    for r in rows:
        resp = {}
        resp["responseNumber"] = i
        resp["indicator"] = r[9]
        resp["score"] = float(10)
        responses.append(resp)
        i +=1 
    return responses

def create_question(rows):
    # pdb.set_trace()
    question_row = rows[0]
    num = int(question_row[0])
    qs = question_row[1]
    dimension_index = int(dimension_dict.get(question_row[2]))
    question_type = question_row[4]
    points = 1#question_row[5]
    response_type = question_row[8]
    weighting = 1 #question_row[11]
    reference = question_row[12]
    alt_text = question_row[13]
    rec_links = [ r[-1] for r in rows if r[-1] != ""]
    child = False #for now; TODO in future
    if response_type in ["dropdown", "radiogroup", "checkbox"]:
        responses_list = get_response_weights_for_question(rows)
    else:
        responses_list = []

    if (
        question_type != "mitigation"
        and question_type != "risk"
        and question_type != "organization"
        and question_type != "tombstone"
    ):
        exit("invalid question type")
    if dimension_index == -1:
        exit("Invalid dimension")
    if response_type not in ["text", "comment", "dropdown", "radiogroup", "checkbox", "slider"]:
        exit("Invalid response type")
    question = {
        "trigger": {"responses": []},
        "domainApplicability": [],
        "regionalApplicability": [],
        "roles": [],
        "lifecycle": [],
        "rec_links": rec_links,
        "questionNumber": num,
        "__v": 0,
        "alt_text": alt_text,
        "mandatory": True,
        "pointsAvailable": 1,
        "prompt": "",
        "question": qs,
        "questionType": question_type,
        "reference": reference,
        "responseType": response_type,
        "responses": responses_list,
        "trustIndexDimension": dimension_index,
        "weighting": 1,
        "child": child,
    }
    if question_row[3] !="":
        subd_index = int(subdimension_dict.get(question_row[3]))
        question["subdimension"] = subd_index
    return question
    """
    Trigger
        parent - ID of Parent
        parentQuestion- string
        responses
            list of id of response for that parent # QUESTION:
"""


def parse_file():
    filename = "question4.csv"
    questions = []
    with open(filename, "r") as csvfile:
        csv_data = list(csv.reader(csvfile))
        # extracting field names through first row
        fields = csv_data[0]
        # print(fields)
        # pdb.set_trace()
        index = 1
        while index < len(csv_data):
            row = csv_data[index]
            if row[0] != "": #new question
                rows_for_question = [row]
                local_index = index +1 
                while local_index < len(csv_data) and csv_data[local_index][0] == "": 
                    rows_for_question.append(csv_data[local_index])
                    local_index +=1
                #rows for questions gets all the rows needed to build one question
                print(rows_for_question)
                q = create_question(rows_for_question)
                questions.append(q)
                index = local_index
        
    f = open("questions-formatted.json", "w")
    json.dump(questions, f)


if __name__ == "__main__":
    parse_file()
