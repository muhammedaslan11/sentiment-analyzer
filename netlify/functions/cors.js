// netlify/functions/cors.js

exports.handler = async (event, context) => {
    const headers = {
      "Access-Control-Allow-Origin": "*", // Bu, tüm kaynaklardan gelen isteklere izin verir
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS", // İzin verilen HTTP metodları
    };
  
    if (event.httpMethod === "OPTIONS") {
      // OPTIONS istekleri için hızlı yanıt
      return {
        statusCode: 204, // No Content
        headers,
        body: "",
      };
    }
  
    // Gerçek işlem burada yapılır, örnek olarak:
    const apiUrl = 'http://localhost:8000/api' + event.path;
    const response = await fetch(apiUrl);
    const data = await response.json();
  
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  };
  