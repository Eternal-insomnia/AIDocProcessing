import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import cl from './Linear.module.css';
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

// Пропсы, ожидаемые компонентом Linear
interface LinearProps {
    graph: Graph; // Данные графика для отображения
    totalGraphs: number; // Общее количество графиков для условного стиля
}

// Предопределенная палитра цветов для линий в графике
const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];

const Linear: React.FC<LinearProps> = ({ graph, totalGraphs }) => {
    return (
        <div className={`${cl.container} ${totalGraphs === 1 ? cl.fullWidth : ''}`}>
            <div className={cl.title}>
                {graph.name}
            </div>
            <ResponsiveContainer width="100%" height={400} >
            <LineChart data={graph.values} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}> {/* Компонент LineChart с настройками отступов */}
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeWidth={2} /> {/* Сеточные линии для лучшей читаемости */}
                    <XAxis
                        dataKey="period" // Ключ для данных по оси X
                        stroke="#fff" // Цвет линии оси
                        tick={{ fontSize: 20, fill: '#fff' }} // Стилизация меток на оси X
                        strokeWidth={2} // Ширина линии оси
                    />
                    <YAxis
                        stroke="#fff" // Цвет линии оси
                        tick={{ fontSize: 20, fill: '#fff' }} // Стилизация меток на оси Y
                        strokeWidth={2} // Ширина линии оси
                    />
                    <Tooltip /> {/* Всплывающее окно для отображения данных при наведении */}
                    <Legend
                        wrapperStyle={{ fontSize: '24px', color: '#fff' }} // Стилизация легенды
                    />
                    {Object.keys(graph.values[0]).map((key, index) => { // Перебор ключей первого значения для создания линий
                        if (key === 'period') return null; // Пропускаем ключ 'period', так как это не ряд данных
                        return (
                            <Line
                                key={key} // Уникальный ключ для каждой линии
                                type="monotone" // Тип линии
                                dataKey={key} // Ключ данных для линии
                                stroke={colors[index % colors.length]} // Присвоение цвета из палитры
                                strokeWidth={2.5} // Ширина линии
                                name={translationsStore.translations[key] || key} // Название из переводов или запасной вариант — ключ
                            />
                        );
                    })}
                </LineChart>
            </ResponsiveContainer>
            
        </div>
    );
};

export default Linear;
