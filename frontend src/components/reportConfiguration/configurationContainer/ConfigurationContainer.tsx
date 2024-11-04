import cl from './ConfigurationContainer.module.css'
import SelectionOfReportingPeriod from './selectionOfReportingPeriod/SelectionOfReportingPeriod'
import configurationStore from '../../../store/configurationStore'
import { observer } from 'mobx-react-lite';
import Metrics from './metrics/Metrics';

const ConfigurationContainer: React.FC = observer(() => {


    return (
        <div className={cl.container}> {/* Основной контейнер для конфигурации */}
            <div className={cl.forBorderContainer}> {/* Контейнер с рамкой для выбора периодов */}
                <div className={cl.selectionOfReportingPeriodsContainer}> {/* Контейнер для выбора периодов отчетности */}
                    <div className={`${cl.selectionOfStartReportingPeriod} ${cl.itemSelectionOfReportingPeriod}`}> {/* Контейнер для выбора начала отчетного периода */}
                        <SelectionOfReportingPeriod
                            title={'Начало периода отчетности'} // Заголовок выбора
                            quarter={configurationStore.startOfReportingQuarter} // Текущий выбранный квартал для начала
                            year={configurationStore.startOfReportingYear} // Текущий выбранный год для начала
                            setQuarter={(value) => configurationStore.setStartOfReportingQuarter(value)} // Функция для обновления квартала начала
                            setYear={(value) => configurationStore.setStartOfReportingYear(value)} // Функция для обновления года начала
                        />
                    </div>

                    <div className={`${cl.selectionOfEndReportingPeriod} ${cl.itemSelectionOfReportingPeriod}`}> {/* Контейнер для выбора конца отчетного периода */}
                        <SelectionOfReportingPeriod
                            title={'Конец периода отчетности'} // Заголовок выбора
                            quarter={configurationStore.endOfReportingQuarter} // Текущий выбранный квартал для конца
                            year={configurationStore.endOfReportingYear} // Текущий выбранный год для конца
                            setQuarter={(value) => configurationStore.setEndOfReportingQuarter(value)} // Функция для обновления квартала конца
                            setYear={(value) => configurationStore.setEndOfReportingYear(value)} // Функция для обновления года конца
                        />
                    </div>
                </div>
            </div>

            <div className={cl.metricsContainer}> {/* Контейнер для отображения метрик */}
                <Metrics /> {/* Включение компонента Metrics */}
            </div>
        </div>
    )
})

export default ConfigurationContainer