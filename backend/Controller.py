from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from EmbedderService import EmbedderService
from MilvusService import MilvusService
from MetricExtractor import MetricsExtractor
import requests

# Controller.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from EmbedderService import EmbedderService
from MilvusService import MilvusService
from MetricExtractor import MetricsExtractor
import requests

# Инициализация FastAPI приложения
app = FastAPI()

# Инициализация сервисов
# EmbedderService отвечает за получение векторных представлений текста
embedder_service = EmbedderService(
    api_url='https://mts-aidocprocessing-case-embedder.olymp.innopolis.university/embed'
)
# MilvusService отвечает за хранение и поиск векторных представлений
milvus_service = MilvusService(
    db_path="db/innohack.db",
    collection_name="metrics_collection"
)

# URL эндпоинта LLaMA модели для генерации ответов
llama_endpoint = "https://mts-aidocprocessing-case.olymp.innopolis.university/generate"

# Модель данных для входящих запросов
class PromptRequest(BaseModel):
    milvus_prompt: str  # Промпт для поиска релевантных данных в векторной БД
    prompt: str        # Основной промпт для генерации ответа

@app.post("/report")
async def report(request: PromptRequest):
    """
    Эндпоинт для генерации отчетов на основе запросов пользователя
    1. Получает векторное представление запроса
    2. Ищет релевантные данные в векторной БД
    3. Генерирует ответ с помощью LLaMA модели
    """
    # Получаем векторное представление фиксированного запроса для поиска релевантных данных
    vector_request = embedder_service.get_embeddings(["Дай все данные компании МТС c начала ПЕРВОГО квартала 2020 (Q1 2020) года по конец ТРЕТЬЕГО квартала 2022 (Q3 2022)"])
    # Ищем релевантные данные в векторной БД
    milvus_response = milvus_service.search(vector_request)

    # Формируем запрос к LLaMA модели
    request_payload = {
        "prompt": request.prompt + str(milvus_response),  # Объединяем пользовательский запрос с найденными данными
        "frequency_penalty": 0.5,  # Параметр для снижения повторений в тексте
        "temperature": 0.1,       # Параметр, влияющий на случайность генерации
        "max_tokens": 5000        # Максимальная длина генерируемого ответа
    }

    # Отправляем запрос к LLaMA модели
    response = requests.post(
        llama_endpoint,
        json=request_payload,
        headers={"Content-Type": "application/json"}
    )

    return response.json

@app.post("/load")
async def load():
    """
    Эндпоинт для загрузки данных из документов в векторную БД
    1. Извлекает метрики из документов
    2. Получает их векторные представления
    3. Сохраняет в векторную БД
    """
    # Создаем экземпляр экстрактора метрик
    metric_extractor = MetricsExtractor(llama_endpoint)
    # Извлекаем данные из всех документов
    knowledge_base = metric_extractor.extract_knowledge_base()
    # Очищаем существующую коллекцию в векторной БД
    milvus_service.drop()

    # Обрабатываем каждый файл и страницу
    for file in knowledge_base["files"]:
        for page in file["pages"]:
            # Формируем текстовые представления метрик с типом документа
            page_metrics = [page["doc_type"] + ": " + metric["value"] for metric in page["metrics"]]
            # Получаем векторные представления метрик
            vectors = embedder_service.get_embeddings(page_metrics)
            print(page_metrics)
            # Сохраняем векторы и тексты в БД
            milvus_service.insert_data(vectors, page_metrics)

# Конфигурация для запуска сервера
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5555)