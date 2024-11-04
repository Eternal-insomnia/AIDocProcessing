import { makeObservable, observable, action } from "mobx"; // Импорт функций MobX для создания наблюдаемых объектов и действий

// Класс для управления состоянием чекбоксов
class CheckboxStore {
    incomeExpenses: boolean; // Чекбокс для доходов и расходов
    liquidity: boolean; // Чекбокс для ликвидности
    profitability: boolean; // Чекбокс для рентабельности
    financialStability: boolean; // Чекбокс для финансовой устойчивости
    businessLoad: boolean; // Чекбокс для деловой активности
    balanceSheet: boolean; // Чекбокс для бухгалтерского баланса
    financialResultsReport: boolean; // Чекбокс для отчета о финансовых результатах
    statementOfChangesInEquity: boolean; // Чекбокс для отчета об изменениях капитала

    keyMetrics: boolean; // Чекбокс для ключевых метрик

    constructor() {
        // Изначальные значения всех чекбоксов
        this.incomeExpenses = false;
        this.liquidity = false;
        this.profitability = false;
        this.financialStability = false;
        this.businessLoad = false;
        this.balanceSheet = false;
        this.financialResultsReport = false;
        this.statementOfChangesInEquity = false;

        this.keyMetrics = false; // Изначальное значение для ключевых метрик

        // Делает свойства наблюдаемыми и действия доступными для MobX
        makeObservable(this, {
            incomeExpenses: observable,
            liquidity: observable,
            profitability: observable,
            financialStability: observable,
            businessLoad: observable,
            balanceSheet: observable,
            financialResultsReport: observable,
            statementOfChangesInEquity: observable,

            keyMetrics: observable, 
            toggleKeyMetrics: action,
            updateKeyMetrics: action,

            toggleIncomeExpenses: action,
            toggleLiquidity: action, 
            toggleProfitability: action,
            toggleFinancialStability: action,
            toggleBusinessLoad: action, 
            toggleBalanceSheet: action, 
            toggleFinancialResultsReport: action,
            toggleStatementOfChangesInEquity: action,
        });
    }

    // Метод для переключения состояния ключевых метрик
    toggleKeyMetrics() {
        this.keyMetrics = !this.keyMetrics; // Переключение состояния ключевых метрик
        // Установка всех метрик в состояние, равное состоянию ключевых метрик
        this.incomeExpenses = this.keyMetrics;
        this.liquidity = this.keyMetrics;
        this.profitability = this.keyMetrics;
        this.financialStability = this.keyMetrics;
        this.businessLoad = this.keyMetrics;
    }

    // Метод для обновления состояния ключевых метрик на основе других метрик
    updateKeyMetrics() {
        this.keyMetrics =
            this.incomeExpenses &&
            this.liquidity &&
            this.profitability &&
            this.financialStability &&
            this.businessLoad;
    }

    toggleIncomeExpenses() {
        this.incomeExpenses = !this.incomeExpenses;
        this.updateKeyMetrics();
    }

    toggleLiquidity() {
        this.liquidity = !this.liquidity;
        this.updateKeyMetrics();
    }

    toggleProfitability() {
        this.profitability = !this.profitability;
        this.updateKeyMetrics();
    }

    toggleFinancialStability() {
        this.financialStability = !this.financialStability;
        this.updateKeyMetrics();
    }

    toggleBusinessLoad() {
        this.businessLoad = !this.businessLoad;
        this.updateKeyMetrics();
    }

    toggleBalanceSheet() {
        this.balanceSheet = !this.balanceSheet;
    }

    toggleFinancialResultsReport() {
        this.financialResultsReport = !this.financialResultsReport;
    }

    toggleStatementOfChangesInEquity() {
        this.statementOfChangesInEquity = !this.statementOfChangesInEquity;
    }
}


const checkboxStore = new CheckboxStore();
export default checkboxStore; 
