import cl from './Select.module.css'
import { ReactComponent as Icon } from '../../../../../icons/select.svg';
import { useState, useEffect, useRef } from 'react';

// Интерфейс, определяющий пропсы для компонента Select
interface SelectProps {
    value: string; // Текущая выбранная опция
    options: string[]; // Доступные опции для выбора
    setValue: (value: string) => void; // Функция для обновления выбранного значения
    isYear: boolean; // Флаг, указывающий, является ли селект для выбора года
}

const Select: React.FC<SelectProps> = ({ value, options, setValue, isYear }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false); // Состояние для управления видимостью списка опций
    const selectRef = useRef<HTMLDivElement>(null); // Реф для контейнера селекта

    const handleToggle = () => setIsOpen(!isOpen); // Функция для переключения состояния открытости селекта

    const handleSelect = (option: string) => { // Функция для обработки выбора опции
        setValue(option); // Установка выбранного значения
        setIsOpen(false); // Закрытие списка опций
    };

    const handleClickOutside = (event: MouseEvent) => { // Функция для закрытия селекта при клике вне его
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsOpen(false); // Закрытие списка опций
        }
    };

    useEffect(() => { // Эффект для добавления обработчика события клика вне селекта
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); // Удаление обработчика при размонтировании
        };
    }, []);

    return (
        <div ref={selectRef} className={`${cl.container} ${isYear ? cl.yearContainer : cl.quarterContainer}`} onClick={handleToggle}>
            <Icon className={cl.icon}/> {/* Отображение иконки селекта */}
            
            <div className={cl.value}> {/* Отображение текущего значения */}
                {value}
            </div>

            {isOpen && ( // Условное отображение списка опций, если селект открыт
                <div className={cl.options}>
                    {options.map((option, index) => ( // Отображение каждой опции
                        <div
                            key={option} // Уникальный ключ для каждой опции
                            className={`${cl.option} ${option === value ? cl.selected : ''} ${index === options.length - 1 ? cl.lastOption : ''}`}
                            onClick={() => handleSelect(option)} // Обработка выбора опции
                        >
                            {option} {/* Отображение текста опции */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Select