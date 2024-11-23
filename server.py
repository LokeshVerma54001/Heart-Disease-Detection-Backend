from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle

app = Flask(__name__)
CORS(app)

# Load the models (assuming they are stored as a list)
with open('models.pkl', 'rb') as f:
    models = pickle.load(f)

# Access models by index
logistic_model = models[0]
knn_classifier = models[1]
rf_classifier = models[2]
dt_classifier = models[3]
svc_classifier = models[4]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse the JSON request
        data = request.get_json()

        # Convert all input fields to numeric values
        features = np.array([[ 
            float(data['age']),
            float(data['sex']),
            float(data['cp']),
            float(data['trestbps']),
            float(data['chol']),
            float(data['fbs']),
            float(data['restecg']),
            float(data['thalach']),
            float(data['exang']),
            float(data['oldpeak']),
            float(data['slope']),
            float(data['ca']),
            float(data['thal'])
        ]])

        response = {}

        # Predict using Logistic Regression
        if logistic_model:
            if hasattr(logistic_model, "predict_proba"):
                response["logistic_model"] = logistic_model.predict_proba(features).tolist()
            else:
                response["logistic_model"] = logistic_model.predict(features).tolist()

        # Predict using K-Nearest Neighbors
        if knn_classifier:
            if hasattr(knn_classifier, "predict_proba"):
                response["knn_classifier"] = knn_classifier.predict_proba(features).tolist()
            else:
                response["knn_classifier"] = knn_classifier.predict(features).tolist()

        # Predict using Random Forest Classifier
        if rf_classifier:
            response["rf_classifier"] = rf_classifier.predict_proba(features).tolist()

        # Predict using Decision Tree Classifier
        if dt_classifier:
            if hasattr(dt_classifier, "predict_proba"):
                response["dt_classifier"] = dt_classifier.predict_proba(features).tolist()
            else:
                response["dt_classifier"] = dt_classifier.predict(features).tolist()
        
        if svc_classifier:
            if hasattr(svc_classifier, "predict_proba"):
                # Use predict_proba if available
                response["svc_classifier"] = svc_classifier.predict_proba(features).tolist()
            elif hasattr(svc_classifier, "decision_function"):
                # Use decision_function as an alternative to predict_proba
                decision_scores = svc_classifier.decision_function(features)
                response["svc_classifier"] = decision_scores.tolist()
            else:
                response["svc_classifier"] = svc_classifier.predict(features).tolist()

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
