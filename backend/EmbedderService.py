import requests

class EmbedderService:
    def __init__(self, api_url: str):
        self.api_url = api_url

    def get_embeddings(self, texts: list[str]) -> list[list[float]]:
        """Получение эмбеддингов для списка текстов"""
        data = {"inputs": texts}
        response = requests.post(self.api_url, json=data)

        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Ошибка API: {response.status_code} - {response.text}")

