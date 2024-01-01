import joblib
import pandas as pd
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.http import JsonResponse


# Load the trained model
model = joblib.load(f'/app/backend/api/chatbot/random_forest_grid21.sav')
model2 = joblib.load(f'/app/backend/api/chatbot/test.sav')

# Load the necessary encoders
mlb_interest = joblib.load(f'/app/backend/api/chatbot/mlb_interest.pkl')
mlb_skills = joblib.load(f'/app/backend/api/chatbot/mlb_skills.pkl')
le = joblib.load(f'/app/backend/api/chatbot/le.pkl')

# Load the Standard Scaler
scaler = joblib.load(f'/app/backend/api/chatbot/sc.sav')

@api_view(['POST'])
@permission_classes([AllowAny])
def predict_job_title(request):


    interests = request.data[0]
    skills = request.data[1]


    user_data = pd.DataFrame(columns=['interest', 'skills'])
    user_data.loc[0] = [interests, skills]
    user_data['interest'] = user_data['interest'].apply(lambda x: [interest.lower().strip() for interest in x.replace(';', ',').split(',')])
    user_data['skills'] = user_data['skills'].apply(lambda x: [skill.lower().strip() for skill in x.replace(';', ',').split(',')])


    encoded_interest = mlb_interest.transform(user_data['interest'])
    encoded_skills = mlb_skills.transform(user_data['skills'])

    user_data.drop(['interest', 'skills'], axis=1, inplace=True)
    user_data = pd.concat([pd.DataFrame(encoded_interest, columns=mlb_interest.classes_), pd.DataFrame(encoded_skills, columns=mlb_skills.classes_)], axis=1)
    user_data_std = scaler.transform(user_data)
    
    # Predict the job title
    predicted_job_code = model.predict(user_data_std)
    predicted_job_code2 = model2.predict(user_data_std)

    predicted_job_code_rounded = int(predicted_job_code)
    predicted_job_code_rounded2 = int(predicted_job_code2)

    predicted_job_title = le.inverse_transform([predicted_job_code_rounded,predicted_job_code_rounded2])

    answer = '推薦職位：' + predicted_job_title
    return JsonResponse({'predicted_job_title': answer})


# interests_input = "entrepreneurship, Interest2, Interest3"  # Replace with user input
# skills_input = "Python, C++, good communication skill"  # Replace with user input
# interests_input2 = "HAPPY;HAPPY,LHAPPY!"
# predicted_job = predict_job_title( interests_input, skills_input)
# print(f"The predicted job title based on your inputs is: {predicted_job}")

# predicted_job = predict_job_title(interests_input2, skills_input)
# print(f"The predicted job title based on your inputs is: {predicted_job}")

