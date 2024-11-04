import cl from './DataItem.module.css'
import Histogram from './histogram/Histogram';
import Linear from './linear/Linear';

// Интерфейс, определяющий структуру метрики
interface Metric {
    name: string; // Название метрики
    value: number; // Значение метрики
}

// Интерфейс, определяющий структуру одного значения графика
interface GraphValue {
    period: string; // Период (например, дата, время) в виде строки
    [key: string]: number | string; // Дополнительные ключи могут быть числами или строками
}

// Интерфейс, определяющий структуру данных графика
interface Graph {
    name: string; // Название графика
    type: string; // Тип графика (например, 'linear' или 'histogram')
    values: GraphValue[]; // Массив значений графика
}

// Интерфейс, определяющий структуру данных о ликвидности
interface LiquidityData {
    title: string; // Заголовок данных о ликвидности
    metrics: Metric[]; // Массив метрик
    graphs: Graph[]; // Массив графиков
    conclusion: string; // Вывод по метрикам
}

// Пропсы, ожидаемые компонентом DataItem
interface DataItemProps {
    data: LiquidityData[]; // Массив данных о ликвидности
}

const DataItem: React.FC<DataItemProps> = ({ data }) => {


    return (
        <div className={cl.container}> {/* Контейнер для всего компонента */}
            {data.map((item, index) => ( // Перебор данных о ликвидности
                <div key={index}> {/* Уникальный ключ для каждого элемента данных */}
                    <div className={cl.title}> {/* Заголовок для блока данных */}
                        {item.title}
                    </div>

                    <div className={cl.metricsContainer}> {/* Контейнер для метрик */}
                        {item.metrics.map((metric, metricIndex) => ( // Перебор метрик
                            <div key={metricIndex} className={cl.metricItem}> {/* Уникальный ключ для каждой метрики */}
                                {`${metric.name} = ${metric.value}`} {/* Отображение метрики */}
                            </div>
                        ))}
                    </div>

                    <div className={cl.graphContainer}> {/* Контейнер для графиков */}
                        {item.graphs.map((graph, graphIndex) => { // Перебор графиков
                            if (graph.type === 'linear') { // Если тип графика линейный
                                return <Linear key={graphIndex} graph={graph} totalGraphs={item.graphs.length} />;
                            } else if (graph.type === 'histogram') { // Если тип графика гистограмма
                                return <Histogram key={graphIndex} graph={graph} totalGraphs={item.graphs.length} />;
                            }
                            // else if (graph.type === 'circle') { // Закомментированный код для круговой диаграммы
                            //     return <CustomPieChart key={graphIndex} graph={graph} totalGraphs={item.graphs.length} />;
                            // }
                            return null; // Возврат null, если тип графика неизвестен
                        })}
                    </div>

                    <div className={cl.conclusion}> {/* Блок для вывода по метрикам */}
                        <span className={cl.spanConclusion}>{'Вывод по метрике: '}</span>{item.conclusion} {/* Вывод текста и заключение */}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default DataItem