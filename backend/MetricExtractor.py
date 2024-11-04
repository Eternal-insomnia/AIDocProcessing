import requests
import logging
import json
from typing import Dict, Any
from concurrent.futures import ThreadPoolExecutor
from PdfToTextParser import PdfToTextParser
from pathlib import Path



class MetricsExtractor:
    """
    Класс для извлечения финансовых метрик из документов с использованием LLaMA модели.
    Обрабатывает PDF документы, извлекает из них метрики и структурирует данные.
    """
    def __init__(self, endpoint):
        """
        Инициализация экстрактора метрик
        :param endpoint: URL эндпоинта LLaMA модели для обработки текста
        """
        self.endpoint = endpoint
        self.logger = self._setup_logger()
        self.samples_path = "samples"  # Путь к директории с PDF файлами

    def _setup_logger(self):
        """
        Настройка логгера для отслеживания процесса обработки документов
        :return: Настроенный объект logger
        """
        logger = logging.getLogger('DocumentProcessor')
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    def _extract_financial_data(self, response_text: str) -> Dict[str, Any] | None:
        """
        Преобразование ответа модели в структурированные данные
        :param response_text: JSON строка с ответом модели
        :return: Словарь с извлеченными метриками или None в случае ошибки
        """
        try:
            # Парсим JSON ответ (двойной parse из-за особенностей формата ответа)
            data = json.loads(json.loads(response_text))
            return data
        except Exception as e:
            self.logger.error(f"Ошибка парсинга метрик: {str(e)}")
            return {"metrics": []}

    def extract_metrics_from_page(self, page_text: str) -> Dict[str, Any] | None:
        """
        Извлечение метрик из текста одной страницы
        :param page_text: Текст страницы для анализа
        :return: Словарь с извлеченными метриками или None в случае ошибки
        """
        # Базовый промпт с инструкциями для модели
        base_prompt = """
        Извлеките все важные данные:
        - финансовые показатели
        - аналитика
        - деятельность компании
        - решения руководства
        - политика компании
        - приобретения
        - движение денежных средств
        - инвестиции.
            
        СТРОГО верните данные в формате JSON:
        {
            "metrics": [
                {"value": "данные"}
            ]
        }
            
        Правила:
        1. НИКАКИХ дополнительных текстов
        2. Если это финансовая метрика, то оставлять ТОЧНОЕ название метрики и ее значение
        3. ТОЛЬКО реальные числа из документа
        4. ТОЧНЫЕ названия как в документе
        5. Сохранять единицы измерения (тыс. руб., млн руб., тыс. дол.)
        6. ТОЛЬКО важные аналитические данные
        """

        # Системный промпт, определяющий роль модели
        system_prompt = """
        Вы — эксперт по финансовой отчетности. Вы разговариваете на русском языке.
        """

        # Формируем параметры запроса к модели
        request_payload = {
            "prompt": base_prompt + page_text,
            "system_prompt": system_prompt,
            "frequency_penalty": 1,  # Снижаем вероятность повторений
            "temperature": 0.2,      # Делаем генерацию более детерминированной
            "max_tokens": 10000,     # Максимальная длина ответа
            "schema": {              # Схема для структурирования ответа
                "title": "Generated schema for Root",
                "type": "object",
                "properties": {
                    "metrics": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "value": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "value"
                            ]
                        }
                    }
                },
                "required": [
                    "metrics"
                ]
            }
        }

        try:
            # Отправляем запрос к LLaMA модели
            response = requests.post(
                self.endpoint,
                json=request_payload,
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                # Успешный ответ - извлекаем метрики
                extracted_data = self._extract_financial_data(response.text)
                return extracted_data
            elif response.status_code == 503:
                # Сервис временно недоступен - пробуем получить метаданные
                return self.extract_metadata(page_text)
            else:
                self.logger.error(f"Ошибка API при обработке страницы, код {response.status_code}")
                return None

        except Exception as e:
            self.logger.error(f"Ошибка обработки страницы: {str(e)}")
            return None

    def extract_metadata(self, first_page: str) -> Dict[str, str]:
        """
        Извлечение метаданных (тип отчета и дата) из первой страницы
        :param first_page: Текст первой страницы документа
        :return: Словарь с метаданными
        """
        # Системный промпт для определения типа отчета
        system_prompt = """
        Вы — эксперт по анализу финансовой отчетности. Определите тип отчета из первой страницы документа.
        
        СТРОГО верните данные в формате JSON:
        {
            "report_type": "тип_отчета"
        }
        
        Примеры вывода:
        1. {"report_type": "Аудиторское заключение о бухгалтерской отчетности за 2010 год"}
        2. {"report_type": "бухгалтерский баланс НА 30 июня 2023 года"}
        3. {"report_type": "ОТЧЕТ О ФИНАНСОВЫХ РЕЗУЛЬТАТАХ за 1-е полугодие 2021 года"}
        4. {"report_type": "Консолидированная финансовая отчетность по состоянию на 31 декабря 2013 и 2012 годов"}
        """

        # Формируем параметры запроса
        request_payload = {
            "prompt": first_page,
            "system_prompt": system_prompt,
            "frequency_penalty": 0.5,
            "temperature": 0.1,
            "max_tokens": 5000,
            "schema": {
                "type": "object",
                "properties": {
                    "report_type": {
                        "type": "string"
                    }
                },
                "required": [
                    "report_type"
                ]
            }
        }

        try:
            # Отправляем запрос к модели
            response = requests.post(
                self.endpoint,
                json=request_payload,
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                metadata = json.loads(json.loads(response.text))
                return metadata
            elif response.status_code == 503:
                # При недоступности сервиса пробуем повторить запрос
                return self.extract_metadata(first_page)
            else:
                self.logger.error(f"Ошибка API при извлечении метаданных, код {response.status_code}")
                return {"report_type": ""}

        except Exception as e:
            self.logger.error(f"Ошибка извлечения метаданных: {str(e)}")
            return {"report_type": ""}

    def extract_metrics_from_all_pages(self, pages_text):
        """
        Извлечение метрик из всех страниц документа
        :param pages_text: Список текстов страниц
        :return: Словарь с метриками по всем страницам
        """
        all_metrics = {
            "pages": []
        }

        # Извлекаем метаданные только из первой страницы
        metadata = self.extract_metadata(pages_text[0])

        def process_page(page_num, page_text):
            """
            Обработка одной страницы документа
            :param page_num: Номер страницы
            :param page_text: Текст страницы
            :return: Словарь с метриками страницы или None
            """
            print(f"Обработка страницы {page_num + 1} из {len(pages_text)}...")
            page_metrics = self.extract_metrics_from_page(page_text)

            if page_metrics and page_metrics.get("metrics", []):
                return {
                    "doc_type": metadata.get("report_type", ""),
                    "page": page_num + 1,
                    "metrics": page_metrics.get("metrics", [])
                }
            return None

        if metadata.get("report_type", ""):
            # Параллельная обработка страниц через ThreadPoolExecutor
            with ThreadPoolExecutor() as executor:
                results = list(executor.map(lambda args: process_page(*args), enumerate(pages_text)))

            # Фильтруем None результаты и добавляем успешные в общий список
            all_metrics["pages"] = [result for result in results if result is not None]

        return all_metrics

    def extract_knowledge_base(self):
        """
        Извлечение базы знаний из всех PDF файлов в указанной директории
        :return: Структурированная база знаний со всеми извлеченными метриками
        """
        parser = PdfToTextParser()
        directory = Path(self.samples_path)
        pdf_files = list(directory.glob("*.pdf"))

        knowledge_base = {
            "files": []
        }

        # Обрабатываем каждый PDF файл
        for file in pdf_files:
            pages_text = parser.parse_pdf_to_text(f"{self.samples_path}/{file.name}")
            results = self.extract_metrics_from_all_pages(pages_text)
            knowledge_base["files"].append(results)

        return knowledge_base