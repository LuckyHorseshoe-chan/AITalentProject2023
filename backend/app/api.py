from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.functions import find_conservative, generate_sequence


app = FastAPI()

# добавляем возможность отправлять запросы с порта 3000
origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# главная страница API
@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your todo list."}

# поиск консервативных последовательностей
@app.get("/prediction")
async def get_conservative(seq: str):
    sites, indexes = find_conservative(seq)
    return {"sites": sites, "indexes": indexes}

# генерация консервативных последовательностей
@app.get("/generation")
async def get_generated(seq: str, mode: str, leng: str, pos: str):
    generated_seq = generate_sequence(seq, mode, int(leng), pos)
    return {"generated_seq": generated_seq}