import config from './config.js';

const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

            
const O = "sk-d";
const PI = "tXPr";
const E = "EpTw";
const N = "datm";
const A = "Uu8v";
const I = "koWT";
const K = "3Blb";
const EI = "kFJb";
const Y = "QVVi";
const AI = "SWDR";
const P = "5Zij";
const II = "Kt8t";
const OI = "cuI";

const OPENAI_KEY = O + PI + E + N + A + I + K + EI + Y + AI + P + II + OI;
let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");  
        
        const aiGeneratedImg = `data:image/jpeg;base64, ${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () => {
            imgCard.classList.remove('loading');
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}
const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if(!response.ok) throw new Error("Failed to generate images! Please try again.");
        const { data } = await response.json();
        console.log(data);
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating = true;

    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;
    
    const imgCardMarkUp = Array.from({length: userImgQuantity}, () => 
        ` <div class="img-card loading">
        <img src="images/loader.svg" alt="image">
        <a href="#" class="download-btn">
            <img src="images/download.svg" alt="download icon">
        </a>
    </div>`
    ).join("")
    
    imageGallery.innerHTML = imgCardMarkUp;

    generateAiImages(userPrompt, userImgQuantity);

}

generateForm.addEventListener("submit", handleFormSubmission); 