import React, { useEffect, useState } from "react";
import { ClimbingBoxLoader } from "react-spinners";
import { FaArrowLeft, FaDatabase, FaQuestion, FaWhmcs } from "react-icons/fa";
import ReactTyped from "react-typed";
import axios from 'axios';




function App() {
  const [loading, setLoading] = useState(false);
  const [positive, setPositive] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [negative, setNegative] = useState(0);
  const [prediction, setPrediction] = useState('');
  const [lrModelProba, setLrModelProba] = useState([]);
  const [startAnalys, setStartAnalys] = useState(true);
  const [showLastResults, setShowLastResults] = useState(false);
  const [onHover, setonHover] = useState(false);
  const [animateDisplay, setAnimateDisplay] = useState("0.7");
  const [onClick, setOnClick] = useState(false);
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState([]);
  

const [predictionResults, setPredictionResults] = useState([]);

const handleSubmit = () => {
  axios.post('https://sentimentanalysisglx.click:8000/predict_sentiment', { text: inputText })
    .then((response) => {
      const { prediction, lr_model_proba } = response.data;
      const categorizedResults = categorizeResults(prediction, lr_model_proba);

      // Sonuçları olasılığa göre sırala
      const sortedResults = categorizedResults.slice().sort((a, b) => b.prob - a.prob);

      setPredictionResults(sortedResults);
    })
    .catch((error) => {
      console.error('Error while making the prediction request:', error);
    });
};



const categorizeResults = (prediction, lr_model_proba) => {
  const labelMapping = {
    "positive": "Positive",
    "negative": "Negative",
    "neutral": "Neutral"
  };

  const positiveProb = lr_model_proba[2] * 100;
  const negativeProb = lr_model_proba[0] * 100;
  const neutralProb = lr_model_proba[1] * 100;

  if (prediction === "positive") {
    return [
      { label: "Positive", prob: positiveProb },
      { label: "Negative", prob: negativeProb },
      { label: "Neutral", prob: neutralProb }
    ];
  } else if (prediction === "negative") {
    return [
      { label: "Negative", prob: negativeProb },
      { label: "Positive", prob: positiveProb },
      { label: "Neutral", prob: neutralProb }
    ];
  } else {
    return [
      { label: "Neutral", prob: neutralProb },
      { label: "Positive", prob: positiveProb },
      { label: "Negative", prob: negativeProb }
    ];
  }
};

  const saveToDatabase = (text, prediction) => {
    axios.post('https://sentimentanalysisglx.click:8000/save_sentiment', { text, prediction })
      .then((response) => {
        console.log('Veri başarıyla veritabanına kaydedildi.');
        fetchData();
      })
      .catch((error) => {
        console.error('Veritabanına kaydedilirken hata oluştu:', error);
      });
  };


const fetchData = () => {
  axios.get('https://sentimentanalysisglx.click:8000/get_sentiment_data')
    .then((response) => {
      const allData = response.data;
      const lastFiveData = allData.slice(-5); // Sadece son 5 veriyi al
      setData(lastFiveData);
    })
    .catch((error) => {
      console.error('Verileri alma sırasında hata oluştu:', error);
    });
};

  // useEffect içinde fetchData'yı çağırın...
  useEffect(() => {
  setStartAnalys();
  setLoading(true);
  fetchData();  // fetchData'yı burada çağırın
  setTimeout(() => {
    setLoading(false);
  }, 3000);
}, []);  // Boş bağımlılık dizisi, yalnızca sayfa yüklendiğinde bir kez çalışmasını sağlar

  // Show Last Results butonunu güncelleyin...



  const getEmoji = (deger) => {
    if (deger === "Positive ") {
      return "🙂";
    } else if (deger === "Negative") {
      return "🙁";
    } else {
      return "😶";
    }
  };

  return (
    <body>
      <div className="container">
        {showLastResults ? (
          <div
            style={{
              width: "85%",
              maxHeight: "500px",
              maxWidth: "1500px",
              borderRadius: "10px",
              border: "1px solid #fff",
              backgroundColor: "transparent",
              backdropFilter: "blur(20px)",
              position: "absolute",
              display: "flex",
              gap: "1.2rem",
              flexDirection: "column",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                alignSelf: "center",
              }}
            >
              Last 5 Result
            </h1>
            <div
              className="subtitle"
              style={{
                fontWeight: "bold",
                borderBottom: "3px solid #fff",
              }}
            >
             <h4>TAG</h4>
          <h4>QUERY</h4>
          <h4>CONFIDENCE</h4>
        </div>
        <div className="dataList">
  <ul>
  {data.slice(-5).map((item) => {
    const percentage = item[3].split(" ")[1];
    return (
      <li key={item[0]}>
        <span>
          {item[2] === 'positive' ? '🙂' : item[2] === 'negative' ? '🙁' : '😐'}
        </span>{" "}
        <span>{item[1]}</span>
        <span>{percentage}</span>
      </li>
    );
  })}
</ul>
      </div>
<button
  onClick={() => {
    setShowLastResults(!showLastResults);
    if (!showLastResults) {
      fetchData(); // showLastResults true olduğunda veriyi al
    }
  }}
  className="analysButton"
>
  <FaArrowLeft />
  Go Back
</button>

      </div>
        ) : null}
        <div className="box" style={showLastResults ? { display: "none" } : {}}>
          {loading ? (
            <div
              style={{
                width: "100%",
                height: "500px",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ClimbingBoxLoader
                color={"#fff"}
                loading={loading}
                size={20}
                aria-label="Loading Spinner"
              />
              <ReactTyped
                style={{ fontSize: "3rem" }}
                strings={["Analysing..."]}
                typeSpeed={100}
                backSpeed={50}
                loop
              />
            </div>
          ) : (
            <div
              className="box-in"
              style={showLastResults ? { display: "none" } : {}}
            >
              <h1 className="article">SENTIMENT ANALYZER</h1>
              <div
                className="AnimateBot" style={{opacity: `${animateDisplay}`,}}>
                Hover Here For Help
              </div>
              <div
                onClick={()=>{
                  setOnClick(!onClick);
                  setonHover(!onHover);
                }}
                className="howWork"
                onMouseEnter={() => {
                  setonHover(true);
                  setAnimateDisplay("0");
                }}
                onMouseLeave={() => {
                  setonHover(false);
                  setAnimateDisplay("0.7")
                }}
              >
                <FaQuestion size={"2rem"} />
              </div>
              <div
                onMouseEnter={() => {
                  setonHover(true);
                  setAnimateDisplay("0");
                }}
                onMouseLeave={() => {
                  setonHover(false);
                  setAnimateDisplay("0.7")
                }}
                className={`howWorkContent ${
                  onClick || onHover ? "howWorkContentActive" : null
                }`}
              >
                <div className="content">
                  <p>% Welcome To Our Sentiment Analyzer %</p>
                  <strong style={{ borderBottom: "3px solid #000" }}>
                    How does it work?
                  </strong>
                  <p>
                    -Firstly; Enter Your Query <br />
                    -Secondly; Click On "start Analysis" Button
                    <br />
                    -Thirdly; Wait For Results to Appear!
                    <br />
                    <br />
                    <br />
                    ??? If You Want You Can View Last 5 Result <br /> By Click{" "}
                    <strong style={{textDecoration:'underline'}}>"Last 5 Result"</strong>
                  </p>
                </div>
              </div>
              <div className="leftRight">
                <div className="leftSide">
                  <h1 className="smallArticle">Query</h1>
                  <textarea
                    placeholder="Enter Text"
                    rows={8}
                    cols={10}
                    maxLength={900}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  ></textarea>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "1rem",
                    }}
                  >
                    <button
                      onClick={handleSubmit}
                      className="analysButton"
                    >
                      <FaWhmcs />
                      Start Analysis
                    </button>
                    <button
                      onClick={() => {
                        setShowLastResults(!showLastResults);
                      }}
                      className="analysButton"
                    >
                      <FaDatabase />
                      Last 5 Results
                    </button>
                  </div>
                </div>
                <div className="rightSide">
  <h1 className="smallArticle">Results</h1>

  <div className="resultsHeader">
  <div style={{ fontWeight: "bold" }}>
    <h4>TAG</h4>
    <span>CONFIDENCE</span>
  </div>
  {predictionResults.map(({ label, prob }) => (
    <div key={label}>
      <h4>
        {label === "Positive" ? "🙂 Positive" : label === "Negative" ? "🙁 Negative" : "😶 Neutral"}
      </h4>
      <p>{prob.toFixed(2)}%</p>
    </div>
  ))}
</div>

</div>

              </div>

              <div className="copyright">
                &copy; {new Date().getFullYear()} All right reserved by {"   "}
                <a href="/">
                  <strong> <a href="https://github.com/muhammedaslan11" target="_blank">Muhammed ASLAN</a> &
                  <a href="https://github.com/yagizergil" target="_blank">Yağız ERGİL</a> </strong>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

    </body>
  );
}

export default App;
