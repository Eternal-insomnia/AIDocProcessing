import { observer } from 'mobx-react-lite';
import cl from './Messages.module.css';
import chatStore from '../../../../store/chatStore';
import MessageItem from './messageItem/MessageItem';

const Messages: React.FC = observer(() => {
    
    return (
        <>
            {chatStore.messages.length === 0 ? ( // Проверка, есть ли сообщения в хранилище
                <div className={cl.emptyMessageContainer}> {/* Контейнер для пустого сообщения */}
                    <div className={cl.emptyMessage}> {/* Сообщение, если нет сообщений */}
                        Задайте свой вопрос
                    </div>
                </div>
            ) : (
                <div className={cl.messagesContainer}> {/* Контейнер для списка сообщений */}
                    {chatStore.messages.slice().reverse().map((message, index) => ( // Перебор сообщений с реверсированием для отображения последнего сообщения сверху
                        <div
                            key={index} // Уникальный ключ для каждого сообщения                            
                        >                            
                            <MessageItem text={message.text} isUser={message.isUser}/> {/* Компонент для отображения отдельного сообщения */}
                        </div>
                    ))}                    
                </div>
            )}
        </>
    );
});

export default Messages;
