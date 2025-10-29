import xgboost as xgb
from sklearn.metrics import accuracy_score
import pandas as pd

# Load training data
train_data = pd.read_csv('modified_data_train.csv')  # Training dataset
X_train = train_data.drop(columns=['GeneXpert'])     # Features (all columns except the target column 'GeneXpert')
y_train = train_data['GeneXpert']                  # Flu Prediction (target variable)

# Load test data
test_data = pd.read_csv('modified_data_test.csv')  # Testing dataset
X_test = test_data.drop(columns=['GeneXpert'])     # Features (all columns except the target column 'GeneXpert')
y_test = test_data['GeneXpert']                  # Flu Prediction (true labels)

# XGBoost model
model = xgb.XGBClassifier()

# Train the model on the training data
model.fit(X_train, y_train)

# Predict on the test set
y_pred = model.predict(X_test)

# Evaluate the accuracy
accuracy = accuracy_score(y_test, y_pred)       # Calculate accuracy by comparing predicted and true labels
print(f"Accuracy on test set: {accuracy:.2f}")

# Save the trained model
model.save_model("xgboost_flu_model.json")