from pymilvus import MilvusClient
import requests

class MilvusService():

    def __init__(self, db_path: str, collection_name: str, dimension: int = 1024):
        self.client = MilvusClient(db_path)
        self.collection_name = collection_name
        self.dimension = dimension


    def insert_data(self, vectors: list[list[float]], texts: list[str]):
        has_collection = self.client.has_collection(self.collection_name)
        if has_collection:
            self.client.drop_collection(self.collection_name)

        # Create collection
        self.client.create_collection(
            collection_name=self.collection_name,
            dimension=self.dimension
        )
        """Вставка данных в коллекцию"""
        data = [{"id": i, "vector": vectors[i], "text": texts[i]}
                for i in range(len(vectors))]

        return self.client.insert(
            collection_name=self.collection_name,
            data=data
        )

    def search(self, query_vector: list[list[float]], limit: int = 10) -> list[list[dict]]:
        """Поиск похожих документов"""
        return self.client.search(
            collection_name=self.collection_name,
            data=query_vector,
            limit=limit,
            output_fields=["text"]
        )

    def drop(self):
        """Удаление всей коллекции"""
        return self.client.drop_collection(self.collection_name)