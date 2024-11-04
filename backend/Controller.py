from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from EmbedderService import EmbedderService
from MilvusService import MilvusService
from MetricExtractor import MetricsExtractor
import requests

app = FastAPI()

# Инициализация сервисов
embedder_service = EmbedderService(
    api_url='https://mts-aidocprocessing-case-embedder.olymp.innopolis.university/embed'
)
milvus_service = MilvusService(
    db_path="db/innohack.db",
    collection_name="metrics_collection"
)

llama_endpoint = "https://mts-aidocprocessing-case.olymp.innopolis.university/generate"


# Определяем модель данных для запроса
class PromptRequest(BaseModel):
    milvus_prompt: str
    prompt: str


@app.post("/report")
async def report(request: PromptRequest):
    vector_request = embedder_service.get_embeddings(["Дай все данные компании МТС c начала ПЕРВОГО квартала 2020 (Q1 2020) года по конец ТРЕТЬЕГО квартала 2022 (Q3 2022)"])
    milvus_response = milvus_service.search(vector_request)

    request_payload = {
        "prompt": request.prompt + str(milvus_response),
        "frequency_penalty": 0.5,
        "temperature": 0.1,
        "max_tokens": 5000
    }

    response = requests.post(
        llama_endpoint,
        json=request_payload,
        headers={"Content-Type": "application/json"}
    )

    return response.json




@app.post("/load")
async def load():
    metric_extractor = MetricsExtractor(llama_endpoint)
    knowledge_base = metric_extractor.extract_knowledge_base()
    milvus_service.drop()

    for file in knowledge_base["files"]:
        for page in file["pages"]:
            page_metrics = [page["doc_type"] + ": " + metric["value"] for metric in page["metrics"]]
            vectors = embedder_service.get_embeddings(page_metrics)
            print(page_metrics)
            milvus_service.insert_data(vectors, page_metrics)

# Если запускаем файл напрямую
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5555)
