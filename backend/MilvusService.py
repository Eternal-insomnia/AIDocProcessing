from pymilvus import MilvusClient
import requests


class MilvusService():
    """
    Сервис для работы с векторной базой данных Milvus
    """
    def __init__(self, db_path: str, collection_name: str, dimension: int = 1024):
        """
        Инициализация сервиса
        :param db_path: Путь к БД
        :param collection_name: Имя коллекции
        :param dimension: Размерность векторов
        """
        self.client = MilvusClient(db_path)
        self.collection_name = collection_name
        self.dimension = dimension

    def insert_data(self, vectors: list[list[float]], texts: list[str]):
        """
        Вставка данных в коллекцию
        :param vectors: Список векторов
        :param texts: Список соответствующих текстов
        """
        # Проверяем существование коллекции и удаляем её при необходимости
        has_collection = self.client.has_collection(self.collection_name)
        if has_collection:
            self.client.drop_collection(self.collection_name)

        # Создаем новую коллекцию
        self.client.create_collection(
            collection_name=self.collection_name,
            dimension=self.dimension
        )

        # Формируем данные для вставки
        data = [{"id": i, "vector": vectors[i], "text": texts[i]}
                for i in range(len(vectors))]

        return self.client.insert(
            collection_name=self.collection_name,
            data=data
        )

    def search(self, query_vector: list[list[float]], limit: int = 10) -> list[list[dict]]:
        """
        Поиск похожих документов
        :param query_vector: Векторное представление запроса
        :param limit: Максимальное количество результатов
        :return: Список найденных документов
        """
        return self.client.search(
            collection_name=self.collection_name,
            data=query_vector,
            limit=limit,
            output_fields=["text"]
        )

    def drop(self):
        """Удаление коллекции"""
        return self.client.drop_collection(self.collection_name)
