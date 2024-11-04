import pytesseract
from pdf2image import convert_from_path
import re
from datetime import datetime
import os


class PdfToTextParser:
    """
    Класс для преобразования PDF документов в текст с использованием OCR (Optical Character Recognition).
    Использует библиотеки pdf2image для конвертации PDF в изображения и pytesseract для OCR.
    """
    def parse_pdf_to_text(self, file_path: str) -> list[str]:
        """
        Преобразование PDF документа в текст с сохранением структуры
        :param file_path: Путь к PDF файлу
        :return: Список текстов страниц с сохранением форматирования
        """
        result_text = ""
        pages_text = []
        
        # Конвертируем PDF в изображения с высоким разрешением для лучшего распознавания
        pages = convert_from_path(file_path, dpi=300)

        # Обрабатываем каждую страницу
        for page_num, page_image in enumerate(pages):
            # Получаем данные OCR с координатами для каждого слова
            data = pytesseract.image_to_data(page_image, lang='rus+eng', output_type=pytesseract.Output.DICT)

            # Словарь для хранения строк с учетом их расположения
            lines = {}

            # Группируем слова по строкам на основе их Y-координат
            for i in range(len(data['text'])):
                word = data['text'][i]
                if word.strip():  # Пропускаем пустые слова
                    x, y = data['left'][i], data['top'][i]
                    width, height = data['width'][i], data['height'][i]
                    
                    # Округляем Y-координату для группировки слов в строки
                    line_y = round(y / 10) * 10
                    
                    if line_y not in lines:
                        lines[line_y] = []
                    lines[line_y].append((x, word))

            # Формируем текст с сохранением структуры таблиц
            extracted_text = ""
            for y, words in sorted(lines.items()):
                line_text = ""
                # Сортируем слова по X-координате для правильного порядка в строке
                words = sorted(words, key=lambda w: w[0])
                prev_x = None

                for x, word in words:
                    # Добавляем табуляцию при большом промежутке между словами
                    if prev_x is not None and x - prev_x > 50:
                        line_text += "\t"
                    line_text += word + " "
                    # Обновляем позицию конца предыдущего слова
                    prev_x = x + len(word) * 5

                extracted_text += line_text.strip() + "\n"

            # Добавляем разметку страницы в общий текст
            result_text += f"\n--- Page {page_num + 1} ---\n" + extracted_text
            # Сохраняем текст страницы отдельно
            pages_text.append(extracted_text)

        return pages_text