import os
import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from .sentiment_model import predict_sentiment, load_vectorizer, save_sentiment_to_database, get_sentiment_data

app = FastAPI()
handler = Mangum(app)

# CORS ayarlarını genişletin
origins = [
    "http://localhost:3000",  # Bu URL'i frontend'inizle değiştirin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Tüm HTTP metodlarını ekledik
    allow_headers=["*"],  # Tüm başlıklara izin veriyoruz, daha güvenli bir ayar yapabilirsiniz
)

vectorizer = load_vectorizer()

class SentimentInput:
    def __init__(self, text):
        self.text = text

class SentimentOutput:
    def __init__(self, prediction, lr_model_proba):
        self.prediction = prediction
        self.lr_model_proba = lr_model_proba

@app.post("/predict_sentiment")
def predict_sentiment_endpoint(input_data: SentimentInput):
    text = input_data.text
    prediction, lr_model_proba = predict_sentiment(text)
    return SentimentOutput(prediction=prediction, lr_model_proba=lr_model_proba)

@app.get("/get_sentiment_data")
def get_sentiment_data_endpoint():
    data = get_sentiment_data()
    return data

@app.post("/save_sentiment")
def save_sentiment_endpoint(input_data: SentimentInput):
    new_text_vector = vectorizer.transform([input_data.text])
    sentiment_prediction, _ = predict_sentiment(input_data.text, new_text_vector)
    label = sentiment_prediction.split()[0]
    save_sentiment_to_database(input_data.text, label, sentiment_prediction)
    return {"mesaj": "Veriler başarıyla veritabanına kaydedildi."}

# AWS Lambda uyumlu handler fonksiyonu
def lambda_handler(event, context):
    return handler(event, context)
