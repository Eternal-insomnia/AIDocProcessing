import { Bar, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer, BarChart } from 'recharts';
import cl from './Histogram.module.css';
import translationsStore from '../../../../store/translationsStore';

// Интерфейс, определяющий структуру одного значения графика
interface GraphValue {
    period: string; // Период (например, дата, время) в виде строки
    [key: string]: number | string; // Дополнительные ключи могут быть числами или строками
}

// Интерфейс, определяющий структуру данных графика
interface Graph {
    name: string; // Название графика
    type: string; // Тип графика
    values: GraphValue[]; // Массив значений графика
}

// Пропсы, ожидаемые компонентом Histogram
interface HistogramProps {
    graph: Graph; // Данные графика для отображения
    totalGraphs: number; // Общее количество графиков для условного стиля
}

// Предопределенная палитра цветов для столбцов графика
const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];

const Histogram: React.FC<HistogramProps> = ({ graph, totalGraphs }) => {
    return (
        <div className={`${cl.container} ${totalGraphs === 1 ? cl.fullWidth : ''}`}> {/* Условный класс для полного ширины, если только один график */}
            <div className={cl.title}>
                {graph.name}
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={graph.values} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}> {/* Компонент BarChart с настройками отступов */}
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeWidth={2} /> {/* Сеточные линии для лучшей читаемости */}
                    <XAxis
                        dataKey="period"
                        stroke="#fff"
                        tick={{ fontSize: 20, fill: '#fff' }}
                        strokeWidth={2}
                    />
                    <YAxis
                        stroke="#fff"
                        tick={{ fontSize: 20, fill: '#fff' }}
                        strokeWidth={2}
                    />
                    <Tooltip /> {/* Всплывающее окно для отображения данных при наведении */}
                    <Legend wrapperStyle={{ fontSize: '24px', color: '#fff' }} /> {/* Легенда для графика */}
                    {Object.keys(graph.values[0]).map((key, index) => {  // Перебор ключей первого значения для создания столбцов
                        if (key === 'period') return null;  // Пропускаем ключ 'period', так как это не ряд данных
                        return (
                            <Bar
                                key={key} // Уникальный ключ для каждого компонента Bar
                                dataKey={key} // Ключ данных для столбца
                                fill={colors[index % colors.length]} // Присвоение цвета из палитры
                                name={translationsStore.translations[key] || key} // Название из переводов или запасной вариант — ключ
                            />
                        );
                    })}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Histogram;
