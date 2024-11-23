'use client'

import { useState } from "react";

export default function PredictionForm() {
    const [formData, setFormData] = useState({
        age: "",
        sex: "",
        cp: "",
        trestbps: "",
        chol: "",
        fbs: "",
        restecg: "",
        thalach: "",
        exang: "",
        oldpeak: "",
        slope: "",
        ca: "",
        thal: "",
    });

    const [results, setResults] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        setResults(data);
    };

    return (
        <div className="mt-10 w-[20rem] md:w-[30rem]">
            <form className="border border-gray-700 p-2 flex flex-col md:items-center bg-gray-800 backdrop-blur-md shadow-2xl bg-opacity-20 rounded-lg" onSubmit={handleSubmit}>
                <h1 className="text-center font-semibold text-lg mt-3">Enter Your Details</h1>
                {Object.keys(formData).map((key) => (
                    <div className="flex gap-10 justify-between mt-3" key={key}>
                        <label className="text-end text-l w-full md:w-40 md:text-2xl font-bold">{key} :</label>
                        <input className=" bg-transparent border-b focus:outline-none text-center md:w-56"
                            type="text"
                            name={key}
                            value={formData[key]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <button className="md:w-4/5  rounded-md mb-10 bg-gray-600 backdrop-blur-md bg-opacity-20 shadow-xl border border-gray-500 p-2 mt-10 w-60 self-center" type="submit">Predict</button>
            </form>
            {results && (
                <div className="mt-10 mb-10 border border-gray-700 p-2 flex flex-col items-center bg-gray-800 backdrop-blur-md shadow-2xl bg-opacity-20 rounded-lg">
                    <h1 className="text-2xl p-5">Prediction Results:</h1>
                    
                    
                    {/* Calculate Overall Probability */}
                    {(() => {
                    const probabilities = [
                        results.rf_classifier[0][1], // Random Forest
                        results.knn_classifier[0][1], // KNN
                        results.logistic_model[0][1], // Logistic Regression
                        results.svc_classifier[0][1], // SVM
                    ];
                    // Average probabilities
                    const overallProbability = (
                        probabilities.reduce((sum, prob) => sum + prob, 0) / probabilities.length
                    ).toFixed(3);

                    return (
                        <div className="w-[90%] flex flex-col items-center mb-10 border border-gray-500 rounded-lg p-5 backdrop-blur-md bg-gray-400 bg-opacity-10">
                          <h1 className="text-xl mb-2">Overall Probability:</h1>
                          <div className="w-full relative mt-2 h-6 bg-gray-600 rounded-full overflow-hidden">
                            {/* Progress Bar */}
                            <div
                              className="h-full bg-green-500 transition-all duration-500"
                              style={{ width: `${(overallProbability * 100).toFixed(1)}%` }}
                            />
                            {/* Probability Text */}
                            <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
                              {(overallProbability * 100).toFixed(1)}%
                            </span>
                          </div>
                      
                          {/* Comment Section */}
                          <div className="mt-4 text-center text-lg font-medium">
                            {overallProbability > 0.75 && (
                              <p className="text-red-500">
                                Your heart disease probability is high ({(overallProbability * 100).toFixed(1)}%). Please consult a doctor for further evaluation.
                              </p>
                            )}
                            {overallProbability > 0.5 && overallProbability <= 0.75 && (
                              <p className="text-yellow-500">
                                Your heart disease probability is moderate ({(overallProbability * 100).toFixed(1)}%). Consider making lifestyle changes and consulting a healthcare professional.
                              </p>
                            )}
                            {overallProbability <= 0.5 && (
                              <p className="text-green-500">
                                Your heart disease probability is low ({(overallProbability * 100).toFixed(1)}%). Maintain a healthy lifestyle to keep it that way.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                      
                    })()}
                    
                    
                    <div className="flex justify-between w-[80%]">
                        <h1>Decision Tree Classifier:</h1>
                        <h1>{results.dt_classifier}</h1>
                    </div>
                    <div className="flex justify-between w-[80%]">
                        <h1>Random Forrest Classifier:</h1>
                        <h1>{results.rf_classifier[0][1]}</h1>
                    </div>
                    <div className="flex justify-between w-[80%]">
                        <h1>KNN Classifier:</h1>
                        <h1>{results.knn_classifier[0][1].toFixed(3)}</h1>
                    </div>
                    <div className="flex justify-between w-[80%]">
                        <h1>Logistic Model:</h1>
                        <h1>{results.logistic_model[0][1]}</h1>
                    </div>
                    <div className="flex justify-between w-[80%]">
                        <h1>Support Vector Machine:</h1>
                        <h1>{results.svc_classifier[0][1]}</h1>
                    </div>
                    {/* <pre>{JSON.stringify(results, null, 2)}</pre> */}

                    
                </div>
            )}
        </div>
    );
}
