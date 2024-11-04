import { observer } from 'mobx-react-lite';
import DataItem from '../../components/economicDataPage/dataItem/DataItem';
import economicStore from '../../store/economicStore';
import cl from './EconomicDataPage.module.css'
import { useNavigate } from 'react-router-dom';
// import testData from '../../testData.json'

const EconomicDataPage: React.FC = observer(() => {
    const navigate = useNavigate(); // Инициализация навигации

    return (
        <div className={cl.container}> {/* Основной контейнер для страницы экономических данных */}
            <div className={cl.startAgainButton} onClick={() => { navigate('*')}}> {/* Кнопка для перезапуска, переходит на главный маршрут */}
                Начать заново
            </div>
            <div className={cl.dataContainer}> {/* Контейнер для отображения экономических данных */}
                <DataItem data={economicStore.economicData}/> {/* Включение компонента DataItem с данными из хранилища */}
                {/* <DataItem data={testData}/> */} {/* Закомментированное использование тестовых данных */}
            </div>
        </div>
    )
})

export default EconomicDataPage