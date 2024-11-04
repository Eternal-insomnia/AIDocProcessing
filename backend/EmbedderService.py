import requests

# EmbedderService.py
class EmbedderService:
    """
    Сервис для получения векторных представлений текста через API
    """
    def __init__(self, api_url: str):
        """
        Инициализация сервиса
        :param api_url: URL API для получения эмбеддингов
        """
        self.api_url = api_url

    def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        """
        Получение эмбеддингов для списка текстов
        :param texts: Список текстов для преобразования
        :return: Список векторных представлений
        """
        data = {"inputs": texts}
        response = requests.post(self.api_url, json=data)

        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Ошибка API: {response.status_code} - {response.text}")
