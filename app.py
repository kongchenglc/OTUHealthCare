from fastapi import FastAPI, Request
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# load Hugging Face model
generator = pipeline('text-generation', model='meta-llama/Llama-3.2-1B-Instruct')

@app.post("/chat/")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get('message') 
    
    # call Hugging Face model to generate
    response = generator(user_message)[0]['generated_text']
    return {"response": response}

@app.get("/chat/")
async def chat(message: str):
    try:
        response = generator(message, max_new_tokens=256)[0]['generated_text']
        return {"response": response}
    
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)