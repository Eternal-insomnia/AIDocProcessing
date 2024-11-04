import Select from './select/Select';
import cl from './SelectionOfReportingPeriod.module.css'

// Интерфейс, определяющий пропсы для компонента SelectionOfReportingPeriod
interface SelectionOfReportingPeriodProps {
    title: string; // Заголовок для выбора периода отчетности
    quarter: string; // Текущий выбранный квартал
    year: string; // Текущий выбранный год
    setQuarter: (quarter: string) => void; // Функция для обновления выбранного квартала
    setYear: (year: string) => void; // Функция для обновления выбранного года
}

const SelectionOfReportingPeriod: React.FC<SelectionOfReportingPeriodProps> = ({title, quarter, year, setQuarter, setYear}) => {
    const currentYear = new Date().getFullYear(); // Получение текущего года
    const quarters = ['I квартал', 'II квартал', 'III квартал', 'IV квартал']; // Массив доступных кварталов
    const years = Array.from({ length: 25 }, (_, i) => (currentYear - i).toString()); // Массив последних 25 лет

    return (
        <div className={cl.container}> {/* Основной контейнер для выбора периода отчетности */}
            <div className={cl.title}> {/* Заголовок выбора */}
                {title}
            </div>
            
            {/* Компоненты Select для выбора квартала и года */}
            <Select value={quarter} options={quarters} setValue={setQuarter} isYear={false}/> 
            <Select value={year} options={years} setValue={setYear} isYear={true}/>
        </div>
    )
}

export default SelectionOfReportingPeriod