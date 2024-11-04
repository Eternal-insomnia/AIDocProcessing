import requests
import logging
import json
from typing import Dict, Any
from concurrent.futures import ThreadPoolExecutor
from PdfToTextParser import PdfToTextParser
from pathlib import Path




class MetricsExtractor:
    def __init__(self, endpoint):
        self.endpoint = endpoint
        self.logger = self._setup_logger()
        self.samples_path = "samples"

    def _setup_logger(self):
        logger = logging.getLogger('DocumentProcessor')
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        return logger

    def _extract_financial_data(self, response_text: str) -> Dict[str, Any] | None:
        """Convert the model's response into structured data."""
        try:
            # Attempt to parse if response is in JSON format
            data = json.loads(json.loads(response_text))
            return data
        except Exception as e:
            self.logger.error(f"Error parsing metrics with regex: {str(e)}")
            return {"metrics": []}

    def extract_metrics_from_page(self, page_text: str) -> Dict[str, Any] | None:
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
            2. Если это финансовая метрика, то осталвять ТОЧНОЕ название метрики и ее значение
            3. ТОЛЬКО реальные числа из документа
            4. ТОЧНЫЕ названия как в документе
            5. Сохранять единицы измерения (тыс. руб., млн руб., тыс. дол.)
            6. ТОЛЬКО важные аналитические данные
            
            Что НЕ включать:
            - Абстрактные определения без отчетных данных
            - Пустые значения
            - Значения не имеющие смысла
            - Заголовки разделов без значений
            - Метрики без числовых значений
            - Промежуточные итоги разделов
            - Пояснительные комментарии
            
            Пример ответа:
            {
                "metrics": [
                    {"value": "Выручка: 180245623 тыс. руб."},
                    {"value": "Прибыль: 33381467 тыс. руб."}
                    {"value": "Приобритение «Дагтелекома» в январе 2009 года за 51 млн долл. США"}
                ]
            }
            Вот текст:
        """
        system_prompt = """
        Вы — эксперт по финансовой отчетности. Вы разговариваете на русском языке.
        """

        # Шаблон для запроса
        request_payload = {
            "prompt": base_prompt + page_text,
            "system_prompt": system_prompt,
            "frequency_penalty": 1,
            "temperature": 0.2,
            "max_tokens": 10000,
            "schema": {
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

        # Отправка запроса к эндпоинту LLaMA
        try:

            response = requests.post(
                self.endpoint,
                json=request_payload,
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                extracted_data = self._extract_financial_data(response.text)
                return extracted_data
            elif response.status_code == 503:
                return self.extract_metadata(page_text)
            else:
                self.logger.error(f"API call failed for page with status code {response.status_code}")
                return None

        except Exception as e:
            self.logger.error(f"Error processing page: {str(e)}")
            return None

    def extract_metadata(self, first_page: str) -> Dict[str, str]:
        """Extract report date and type from the first page."""
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
            response = requests.post(
                self.endpoint,
                json=request_payload,
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                metadata = json.loads(json.loads(response.text))
                return metadata
            elif response.status_code == 503:
                return self.extract_metadata(first_page)
            else:
                self.logger.error(f"API call failed for metadata extraction with status code {response.status_code}")
                return {"report_type": ""}

        except Exception as e:
            self.logger.error(f"Error extracting metadata: {str(e)}")
            return {"report_type": ""}

    def extract_metrics_from_all_pages(self, pages_text):
        all_metrics = {
            "pages": []
        }

        # Извлекаем метаданные только из первой страницы
        metadata = self.extract_metadata(pages_text[0])

        def process_page(page_num, page_text):

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
            # Параллельная обработка страниц
            with ThreadPoolExecutor() as executor:
                results = list(executor.map(lambda args: process_page(*args), enumerate(pages_text)))

            # Добавляем результаты в all_metrics
            all_metrics["pages"] = [result for result in results if result is not None]

        return all_metrics

    def extract_knowledge_base(self):
        parser = PdfToTextParser()
        directory = Path(self.samples_path)
        pdf_files = list(directory.glob("*.pdf"))

        knowledge_base = {
            "files": []
        }

        for file in pdf_files:
            pages_text = parser.parse_pdf_to_text(f"{self.samples_path}/{file.name}")
            results = self.extract_metrics_from_all_pages(pages_text)
            knowledge_base["files"].append(results)

        return knowledge_base
