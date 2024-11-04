import { makeObservable, observable, action } from 'mobx';
// Класс для управления конфигурацией отчетности
class ConfigurationStore {
    startOfReportingQuarter: string; // Начало квартала отчетности
    endOfReportingQuarter: string; // Конец квартала отчетности
    startOfReportingYear: string; // Начало года отчетности
    endOfReportingYear: string; // Конец года отчетности

    constructor() {
        const currentYear = new Date().getFullYear(); // Получение текущего года
        // Установка начальных значений
        this.startOfReportingQuarter = 'I квартал';
        this.endOfReportingQuarter = 'I квартал';
        this.startOfReportingYear = String(currentYear);
        this.endOfReportingYear = String(currentYear);
        
        makeObservable(this, {
            startOfReportingQuarter: observable,
            endOfReportingQuarter: observable,
            startOfReportingYear: observable,
            endOfReportingYear: observable,
            setStartOfReportingQuarter: action,
            setEndOfReportingQuarter: action,
            setStartOfReportingYear: action,
            setEndOfReportingYear: action,
        });
    }

    // Метод для установки начала квартала отчетности
    setStartOfReportingQuarter(quarter: string) {
        this.startOfReportingQuarter = quarter; // Установка значения
    }

    // Метод для установки конца квартала отчетности
    setEndOfReportingQuarter(quarter: string) {
        this.endOfReportingQuarter = quarter; // Установка значения
    }

    // Метод для установки начала года отчетности
    setStartOfReportingYear(year: string) {
        this.startOfReportingYear = year; // Установка значения
    }

    // Метод для установки конца года отчетности
    setEndOfReportingYear(year: string) {
        this.endOfReportingYear = year; // Установка значения
    }
}

const configurationStore = new ConfigurationStore();
export default configurationStore;
