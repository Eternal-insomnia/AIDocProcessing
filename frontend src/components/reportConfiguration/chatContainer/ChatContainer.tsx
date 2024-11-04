import { observer } from 'mobx-react-lite';
import cl from './ChatContainer.module.css'
import { useState, useRef } from 'react';
import chatStore from '../../../store/chatStore';
import Messages from './messages/Messages';
import axios from 'axios';

// Компонент ChatContainer, обернутый в observer для реактивного обновления
const ChatContainer: React.FC = observer(() => {
    const [value, setValue] = useState<string>(''); // Состояние для текста сообщения
    const textAreaRef = useRef<HTMLTextAreaElement>(null); // Ссылка на элемент textarea

    // Обработчик изменения текста в textarea
    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value); // Обновление состояния текста

        // Закомментированный код для автоматической настройки высоты textarea
        // if (textAreaRef.current) {
        //     textAreaRef.current.style.height = 'auto';
        //     textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 200)}px`;
        // }
    };

    // Обработчик отправки сообщения
    const handleSendMessage = async () => {
        if (value.trim()) { // Проверка на наличие текста
            // Добавление сообщения пользователя в хранилище чата
            chatStore.addMessage(value);

            setValue(''); // Очистка поля ввода
            if (textAreaRef.current) {
                textAreaRef.current.style.height = 'auto'; // Сброс высоты textarea
            }

            try {
                const payload = {
                    prompt: `Найди все данные, которые отвечают на этот вопрос: ${value}`, // Формирование полезной нагрузки для запроса
                    milvus_prompt: `Ответь на данный вопрос - ${value}, используя следующие данные`
                };                
                const response = await axios.post('http://192.168.88.223:5555/report', payload); // Отправка POST-запроса
                
                // Обработка ответа от сервера
                if (response.data && response.data.reply) {
                    chatStore.addResponse(response.data.reply); // Добавление ответа в хранилище чата
                }
            } catch (error) {
                console.error("Error sending message:", error); // Обработка ошибок
            }
        }
    };

    // Обработчик нажатия клавиш в textarea
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') { // Если нажата клавиша Enter
            if (event.ctrlKey) { // Если зажат Ctrl, не отправлять сообщение
                return;
            } else {
                event.preventDefault(); // Предотвращение стандартного поведения Enter
                handleSendMessage(); // Отправка сообщения
            }
        }
    };

    return (
        <>
            <div className={`${cl.chatContainer} ${chatStore.isOpen ? '' : cl.chatContainerClosed}`} >
                <div className={cl.tittleContainer}> {/* Контейнер для заголовка чата */}
                    <button className={cl.closeChat} onClick={() => { chatStore.handleCloseChat() }}> {/* Кнопка закрытия чата */}
                        →
                    </button>
                    <div className={cl.tittle}> {/* Заголовок чата */}
                        AI-Ассистент
                    </div>
                </div>

                <div className={cl.textChatContainer}> {/* Контейнер для текстового чата */}
                    <Messages /> {/* Компонент для отображения сообщений */}
                </div>

                <div className={cl.inputContainer}> {/* Контейнер для ввода сообщения */}
                    <div className={cl.inputButtonContainer}> {/* Контейнер для textarea и кнопки */}
                        <textarea
                            ref={textAreaRef} // Ссылка на textarea
                            placeholder={'Введите сообщение'} // Плейсхолдер
                            className={cl.input} // CSS-класс для textarea
                            value={value} // Значение textarea
                            onKeyDown={handleKeyDown} // Обработчик нажатия клавиш
                            onChange={handleInputChange} // Обработчик изменения текста
                            rows={1} // Начальное количество строк
                        />
                        <button className={cl.buttonForInput} onClick={handleSendMessage}> {/* Кнопка отправки сообщения */}
                            ↑
                        </button>
                    </div>
                </div>
            </div>

            <button
                className={`${cl.openChat} ${chatStore.isHideCloseChatButton ? cl.openChatIsOpen : ''}`} // Кнопка для открытия чата
                onClick={() => chatStore.handleOpenChat()}
            >
                AI-Ассистент
            </button>
        </>
    )
})

export default ChatContainer