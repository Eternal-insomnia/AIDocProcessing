import { makeAutoObservable } from 'mobx';

// Определение интерфейсов для структурирования данных
interface Metric {
    name: string; // Название метрики
    value: number; // Значение метрики
}

interface GraphValue {
    period: string; // Период времени
    [key: string]: number | string; // Дополнительные значения по ключам
}

interface Graph {
    name: string; // Название графика
    type: string; // Тип графика (например, линейный, столбчатый)
    values: GraphValue[]; // Массив значений для графика
}

interface EconomicData {
    title: string; // Заголовок экономических данных
    metrics: Metric[]; // Массив метрик
    graphs: Graph[]; // Массив графиков
    conclusion: string; // Заключение по экономическим данным
}

// Определение класса хранилища для управления экономическими данными
class EconomicStore {
    economicData: EconomicData[] = []; // Изначально пустой массив экономических данных

    constructor() {
        makeAutoObservable(this); // Делает свойства наблюдаемыми и методы действиями
    }

    // Метод для добавления нового объекта экономических данных в массив
    addLiquidityData(newData: EconomicData) {
        this.economicData.push(newData); // Добавление новых данных в массив
    }
}

// Экспорт экземпляра хранилища
const economicStore = new EconomicStore();
export default economicStore;
