const showBtn = document.querySelector(".btn");
const sendChatBtn=document.querySelector(".chat-input span");
const chatInput= document.querySelector(".chat-input textarea");
const chatbox=document.querySelector(".chatbox");
const mobileCloseBtn=document.querySelector(".close-btn");
const signUp=document.querySelector(".sign-up");
const inputField=document.querySelector(".email input");

let show=true;
let userMessage;
const API_KEY="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";
const inputInitHeight=chatInput.scrollHeight;
var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

signUp.addEventListener("click", ()=>{
    if(inputField.value!=="" && inputField.value.match(mailformat)){
        alert("Your E-Mail has been stored and You are Ready to use Chatbot!");
        inputField.value="";
    }
    else{
        alert("Enter a valid E-Mail address.");
        inputField.value="";
    }
})



function generateResponse(incomingChatLi){
    const API_URL="https://api.openai.com/v1/chat/completions";
    const messagePass = incomingChatLi.querySelector("p");
    
    const requestOptions={
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}],
        })

    }

    fetch(API_URL, requestOptions).then(res => res.json()).then(data=>{
        messagePass.innerHTML=data.choices[0].message.content;
    }).catch(()=>{
        messagePass.classList.add("error");
        messagePass.innerHTML="Oops! Something went wrong. Please Try Again.";
    }).finally(()=> chatbox.scrollTo(0, chatbox.scrollHeight));


}

function createChatLi(message, className){
    const chatLi=document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent=className==="outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span> <p></p>`;
    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent=message;
    return chatLi;
}

function handleChat(){
    userMessage=chatInput.value.trim();
    if(!userMessage) return;
    chatInput.style.height=`${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatInput.value="";
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(()=>{
        const incomingChatLi=createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);
}

sendChatBtn.addEventListener("click", handleChat);

function checkButton(){
    if(show===false){
        document.body.classList.add("show");
        show=true;
    }
    else{
        document.body.classList.remove("show");
        show=false;
    }
}

chatInput.addEventListener("input",()=>{
    chatInput.style.height=`${inputInitHeight}px`;
    chatInput.style.height=`${chatInput.scrollHeight}px`;

})

chatInput.addEventListener("keydown", function(e){
    if(e.key==="Enter" && !e.shiftKey){
        if(chatInput.value!==""){
            
            handleChat();
        }
    }

}
)

showBtn.addEventListener("click", checkButton);
mobileCloseBtn.addEventListener("click", ()=>{
    document.body.classList.remove("show");
    show=false;
})


