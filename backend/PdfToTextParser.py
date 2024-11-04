import pytesseract
from pdf2image import convert_from_path
import re
from datetime import datetime
import os


class PdfToTextParser:

    def parse_pdf_to_text(self, file_path: str) -> list[str]:
        result_text = ""
        pages_text = []
        # Преобразуем PDF в изображения (по одной на страницу)
        pages = convert_from_path(file_path, dpi=300)

        for page_num, page_image in enumerate(pages):
            # Извлекаем данные с координатами
            data = pytesseract.image_to_data(page_image, lang='rus+eng', output_type=pytesseract.Output.DICT)

            # Структура для хранения строк
            lines = {}

            # Собираем слова и их координаты
            for i in range(len(data['text'])):
                word = data['text'][i]
                if word.strip():  # Пропускаем пустые слова
                    x, y, width, height = data['left'][i], data['top'][i], data['width'][i], data['height'][i]
                    line_y = round(y / 10) * 10  # Округляем координату y для группировки по строкам

                    if line_y not in lines:
                        lines[line_y] = []
                    lines[line_y].append((x, word))

            # Обрабатываем строки и создаем структуру таблицы
            extracted_text = ""
            for y, words in sorted(lines.items()):
                line_text = ""
                words = sorted(words, key=lambda w: w[0])  # Сортируем слова по x-координате
                prev_x = None

                for x, word in words:
                    # Если большой промежуток, добавляем табуляцию
                    if prev_x is not None and x - prev_x > 50:  # Настройте это значение для ваших данных
                        line_text += "\t"
                    line_text += word + " "
                    prev_x = x + len(word) * 5  # Обновляем координату конца слова, с учетом его длины

                extracted_text += line_text.strip() + "\n"

            result_text += f"\n--- Page {page_num + 1} ---\n" + extracted_text
            pages_text.append(extracted_text)
        return pages_text


    # def print_to_file(self):
    #     filepath = "samples/Бухгалтерская+отчетность+ПАО+«МТС»+по+состоянию+на+30.06.2023+г.++++.pdf"
    #     result = self.parse_pdf_to_text(filepath)
    #     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    #     filename = "out_" + timestamp + ".txt"
    #     with open(os.path.join("outputs/txt", filename), 'w', encoding='utf-8') as f:
    #         f.write(result)