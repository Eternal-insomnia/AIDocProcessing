import cl from './MetricsCheckboxGroup.module.css'
import { useState } from 'react';
import { ReactComponent as EmptyCheckbox } from '../../../../../icons/emptyCheckbox.svg';
import { ReactComponent as ChoosenCheckbox } from '../../../../../icons/choosenCheckbox.svg';
import checkboxStore from '../../../../../store/checkboxStore';
import { observer } from 'mobx-react-lite';
import MetricCheckox from '../metricCheckox/MetricCheckox';


const MetricsCheckboxGroup: React.FC = observer(() => {
    const [isVisible, setIsVisible] = useState<boolean>(false); // Состояние для управления видимостью чекбоксов

    return (
        <div className={cl.container}> {/* Основной контейнер для группы чекбоксов */}
            <div className={cl.arrowCheckboxContainer}> {/* Контейнер для стрелки и основного чекбокса */}
                <div className={`${cl.arrow} ${cl.text}`} onClick={() => { setIsVisible(!isVisible) }}> {/* Стрелка для сворачивания/разворачивания списка */}
                    {isVisible ? "↑" : "↓"} {/* Отображение стрелки вверх или вниз в зависимости от состояния видимости */}
                </div>

                <div className={cl.checkbox} onClick={() => checkboxStore.toggleKeyMetrics()}> {/* Основной чекбокс для финансовых метрик */}
                    <div className={cl.checkboxContainer}>
                        {checkboxStore.keyMetrics // Условная отрисовка чекбокса в зависимости от состояния
                            ? <ChoosenCheckbox /> // Отображение иконки выбранного чекбокса
                            : <EmptyCheckbox /> // Отображение иконки пустого чекбокса
                        }
                    </div>

                    <div className={cl.text}> {/* Текст для основного чекбокса */}
                        Финансовые метрики
                    </div>
                </div>
            </div>

            {isVisible && // Условное отображение группы чекбоксов, если isVisible истинно
                <div className={cl.itemCheckboxContainer}>                
                    {/* Отображение каждого чекбокса метрики с передачей значения и функции для переключения */}
                    <MetricCheckox value={checkboxStore.incomeExpenses} toggleValue={() => checkboxStore.toggleIncomeExpenses()} label={"Доходы-Расходы"}/>
                    <MetricCheckox value={checkboxStore.liquidity} toggleValue={() => checkboxStore.toggleLiquidity()} label={"Ликвидность"}/>
                    <MetricCheckox value={checkboxStore.profitability} toggleValue={() => checkboxStore.toggleProfitability()} label={"Рентабельность"}/>
                    <MetricCheckox value={checkboxStore.financialStability} toggleValue={() => checkboxStore.toggleFinancialStability()} label={"Фин. устойчивость"}/>
                    <MetricCheckox value={checkboxStore.businessLoad} toggleValue={() => checkboxStore.toggleBusinessLoad()} label={"Деловая активность"}/>
                </div>
            }
        </div>
    )
})

export default MetricsCheckboxGroup