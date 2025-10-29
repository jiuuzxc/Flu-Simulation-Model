from flask import Flask, request, jsonify
from flask_cors import CORS
import xgboost as xgb
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

# Load the saved XGBoost model
model = xgb.XGBClassifier()
model.load_model("xgboost_flu_model.json")

@app.route('/predict', methods=['POST'])
def predict():
    # Receive data from the HTML form as JSON
    data = request.json
    
    # Parse data and convert it to the format the model expects
    input_data = np.array([[ 
        data['temperature'], 
        data['height'], 
        data['weight'], 
        data['illness_days'],
        data['week'],
        data['season'],
        int(data['fluvaccine']),
        int(data['increased_cough']),
        int(data['sputum_cough']),
        int(data['increased_sorethroat']),
        int(data['nasal_congestion']),
        int(data['sinus_pain']),
        int(data['exposure_to_influenza']),
        int(data['travel']),
        int(data['antivirals']),
        int(data['chronic_lung_disease'])
    ]])

    # Check if the input data has the right shape
    print("Input data shape:", input_data.shape)

    # Predict using the model directly with the NumPy array
    probability = model.predict_proba(input_data)

    # Ensure that the output is not empty and is the correct shape
    if probability.size == 0:
        return jsonify({'flu_probability': 0.0})

    # Get the probability for the positive class (1)
    flu_probability = probability[0][1] * 100  # Probability of flu

    return jsonify({'flu_probability': flu_probability})

if __name__ == '__main__':
    app.run(debug=True)