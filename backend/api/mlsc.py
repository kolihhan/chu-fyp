import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import OneHotEncoder
import requests
baseUrl = 'http://220.141.71.110:8000/api/'
feedbackReviewUrl = 'companyEmployeeFeedBackReview/get/all'

feedbackReviewFullUrl = baseUrl + feedbackReviewUrl
scoreUrl = baseUrl + 'getCompanyEmployeeEvaluateAll'
employeeFeedbackUrl = baseUrl + 'companyEmployeeFeedBackReview/get/'

def login():
  body = {
    "email": "chia1@gmail.com",
    "password": "chiachia"
  }
  try:
    response = requests.post(baseUrl+'login', json=body)
    response.raise_for_status()
    data = response.json()
    return data['access']
  except Exception as e:
    return e

def getDataFromUrl(url):
  try:
    headers = {
        "Content-Type": "application/json",
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    data = response.json()
    return data
  except Exception as ex:
    return ex

data_ori = getDataFromUrl(feedbackReviewFullUrl)
data_ori = data_ori['data']

for item in data_ori:
  item['companyEmployee_id'] = item['companyEmployee_id']['id']
  item['feedback_to'] = item['feedback_to']['id']

data = pd.DataFrame(data_ori)
pd.set_option('display.max_columns', None)
pd.set_option('display.expand_frame_repr', False)

oneHotEncoder = OneHotEncoder()
oneHotEncoder.fit(data[['remarks']])
remarks_encoder = oneHotEncoder.transform(data[['remarks']]).toarray()
remark_list = data['remarks']
remark_list = remark_list.unique()
remark_list.sort()
data[remark_list] = remarks_encoder

final_data = data.groupby('feedback_to')[remark_list].sum()

score_ori = getDataFromUrl(scoreUrl)['data']
score_ori = pd.DataFrame(score_ori)
final_score = score_ori[['companyEmployee_id', 'score']]

data_final = final_data.merge(final_score, left_on='feedback_to', right_on='companyEmployee_id', how='inner')

y=data_final['score']
x=data_final[remark_list]

from sklearn.model_selection import train_test_split

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=87)

x_train = x_train.to_numpy()
x_test = x_test.to_numpy()

w = np.array([1]*len(remark_list))
b = 0
y_pred = (x_train * w).sum(axis=1)

((y_train - y_pred) ** 2).mean()

def compute_cost(x, y, w, b):
  y_pred = (x * w).sum(axis=1) + b
  cost = ((y - y_pred)**2).mean()
  return cost

def compute_gradient(x, y, w, b):
  y_pred = (x*w).sum(axis=1) + b
  b_gradient = (y_pred - y).mean()
  w_gradient = np.zeros(x.shape[1])
  for i in  range(x.shape[1]):
    w_gradient[i] = (x[:, i] * (y_pred-y)).mean()
  return w_gradient, b_gradient

def gradient_descent(x, y, w_init, b_init, learning_rate, cost_function, gradient_function, run_iter, p_iter=1000):

  c_hist = []
  w_hist = []
  b_hist = []

  w = w_init
  b = b_init
  for i in range(run_iter+1):
    w_gradient, b_gradient = gradient_function(x, y, w, b)

    w = w - w_gradient * learning_rate
    b = b - b_gradient * learning_rate
    cost = cost_function(x, y, w, b)

    w_hist.append(w)
    b_hist.append(b)
    c_hist.append(cost)

    if i%p_iter == 0:
      # print(f"{i:4}")
      # print(f"{i:4}: Cost : {cost: .2f}, w: {w}, b: {b:.2f}, w_gradient: {w_gradient}, b_gradient: {b_gradient: 2.3f}")
      print(f"{i:4}: Cost : {cost: .2f}, b: {b:.2f}, b_gradient: {b_gradient: 2.3f}")
  return w, b, w_hist, b_hist, c_hist

w = np.array([1]*len(remark_list))
b=0
learning_rate = 0.001

compute_cost(x_train, y_train, w, b)

y_pred = (x_train*w).sum(axis=1) + b
b_gradient = (y_pred - y_train).mean()
b_gradient
w_gradient = np.zeros(x_train.shape[1])

for i in range(x_train.shape[1]):
  w_gradient[i] = (x_train[:, i]* (y_pred-y_train)).mean()

w_gradient, b_gradient

w_init=np.array([0]*len(remark_list))
b_init=0
learning_rate = 0.01
run_iter = 200
w_final, b_final, w_hist, b_hist, c_hist = gradient_descent(x_train, y_train, w_init, b_init, learning_rate, compute_cost, compute_gradient, run_iter, p_iter=1000)

y_pred = (w_final * x_test).sum(axis=1) + b_final
testing = pd.DataFrame({
    "y_pred": y_pred,
    "y_test": y_test
})

data_real = getDataFromUrl(employeeFeedbackUrl+'88')['data']

data_real = pd.DataFrame(data_real)

oneHotEncoder = OneHotEncoder()
oneHotEncoder.fit(data_real[['remarks']])
remarks_encoder = oneHotEncoder.transform(data_real[['remarks']]).toarray()

remark_list = data_real['remarks']

remark_list = remark_list.unique()
remark_list.sort()

data_real[remark_list] = remarks_encoder

data_real.drop('companyEmployee_id', axis=1)

feedback_value_list = ['不尊重多樣性和缺乏包容性', '不積極尋求改進和創新', '不遵守公司政策和程序', '主動學習和成長', '充分滿足客戶需求',
       '創新和提出改進建議', '創造公司利潤', '勤奮工作', '善於溝通和協作', '尊重公司機密和保密政策',
       '尊重多樣性和包容性', '導致公司損失', '工作效率不足', '忽略客戶需求和反饋', '忽略專業發展和學習',
       '承擔錯誤和負責任', '拖延或敷衍工作', '提前完成工作任務', '提升業績', '損害公司財產', '未能按時完成工作任務',
       '未達工作目標', '消極態度', '準時達成工作目標', '無私地捐獻資源給公司', '積極態度', '積極解決問題',
       '細心處理工作', '經常出現錯誤或粗心大意', '經常與同事發生衝突或矛盾', '缺乏團隊合作精神', '缺乏有效溝通和團隊協作',
       '良好的團隊合作精神', '負責任處理工作', '辱罵同事', '逃避責任或找借口', '違反公司的機密和保密政策', '關心同事',
       '頻繁發生問題', '高效率完成工作']

data_real = getDataFromUrl(employeeFeedbackUrl+'200')['data']
for item in data_real:
  item['companyEmployee_id'] = item['companyEmployee_id']['id']
  item['feedback_to'] = item['feedback_to']['id']

for fv in feedback_value_list:
  row = {'id': 1245, 'companyEmployee_id': data_real[0]['companyEmployee_id'], 'feedback_to': data_real[0]['feedback_to'], 'remarks': data_real[0]['remarks'], 'create_at': data_real[0]['create_at'], 'company_id': data_real[0]['company_id']}
  row['remarks'] = fv
  data_real.append(row)

data_real = pd.DataFrame(data_real)

oneHotEncoder = OneHotEncoder()
oneHotEncoder.fit(data_real[['remarks']])
remarks_encoder = oneHotEncoder.transform(data_real[['remarks']]).toarray()
remark_list = data_real['remarks']

remark_list = remark_list.unique()
remark_list.sort()
remark_list

data_real[remark_list] = remarks_encoder

data_real = data_real.groupby('feedback_to')[remark_list].sum()
data_real[remark_list] = data_real[remark_list]-1

x=data_real[remark_list]
x = x.to_numpy()

score = (w_final * x).sum(axis=1) + b_final
score[0]