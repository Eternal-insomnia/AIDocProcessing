import cl from './MetricCheckox.module.css'
import { ReactComponent as EmptyCheckbox } from '../../../../../icons/emptyCheckbox.svg';
import { ReactComponent as ChoosenCheckbox } from '../../../../../icons/choosenCheckbox.svg';
import { observer } from 'mobx-react-lite';

// Интерфейс, определяющий пропсы для компонента MetricCheckox
interface MetricCheckoxProps {
    label: string; // Подпись чекбокса
    value: boolean; // Значение чекбокса (выбран или нет)
    toggleValue: () => void; // Функция для переключения значения чекбокса
}

const MetricCheckox: React.FC<MetricCheckoxProps> = ({ value, toggleValue, label }) => {

    return (
        <div className={cl.container} onClick={() => toggleValue()}> {/* Контейнер для всего элемента, при клике происходит переключение значения */}
            <div className={cl.checkboxContainer}> {/* Контейнер для чекбокса */}
                {value // Условная отрисовка чекбокса в зависимости от значения
                    ? <ChoosenCheckbox /> // Отображение иконки выбранного чекбокса
                    : <EmptyCheckbox /> // Отображение иконки пустого чекбокса
                }
            </div>
            <div className={cl.text}> {/* Контейнер для текста подписи чекбокса */}
                {label} {/* Отображение подписи чекбокса */}
            </div>
        </div>
    )
}

export default MetricCheckox