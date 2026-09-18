from fastapi import FastAPI
from vid2gif_web_api import gif_router

app = FastAPI()
app.include_router(gif_router)

app.frontend(directory="dist", path="/")

@app.get('/test')
def index():
    return "Hello World!"