import cl from './MessageItem.module.css';

// Интерфейс, определяющий пропсы для компонента MessageItem
interface MessageItemProps {
    text: string; // Текст сообщения
    isUser: boolean; // Флаг, указывающий, принадлежит ли сообщение пользователю
}

const MessageItem: React.FC<MessageItemProps> = ({ text, isUser }) => {
    return (
        <div className={cl.container}> {/* Контейнер для всего элемента сообщения */}
            <div className={`${cl.textContainer} ${isUser ? cl.userTextContainer : cl.neuroTextContainer}`}> {/* Контейнер для текста, с условным классом */}
                {text.split('\n').map((line, index) => ( // Разделение текста на строки по символу новой строки
                    <span key={index}> {/* Уникальный ключ для каждой строки */}
                        {line} {/* Текст строки */}
                        <br /> {/* Перенос строки */}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default MessageItem;
