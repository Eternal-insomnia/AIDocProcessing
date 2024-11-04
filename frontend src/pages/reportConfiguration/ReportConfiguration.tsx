import cl from "./ReportConfiguration.module.css"
import ConfigurationContainer from '../../components/reportConfiguration/configurationContainer/ConfigurationContainer';
import chatStore from "../../store/chatStore";
import axios from 'axios';
import { useState } from "react";
import configurationStore from "../../store/configurationStore";
import checkboxStore from "../../store/checkboxStore";
import loadingGif from '../../gifs/loading.gif'
import { useNavigate } from "react-router-dom";
import dataWithTemplateOfPrompts from '../../data.json'
import { processFinancialReports } from "../../generationPromts";
import testData from '../../testPromtToTestApi.json'
import economicStore from '../../store/economicStore';

interface ReportData {
    startQuarterStr: string;
    endQuarterStr: string;
    startOfReportingYear: string;
    endOfReportingYear: string;
    incomeExpenses: boolean;
    liquidity: boolean;
    profitability: boolean;
    financialStability: boolean;
    businessLoad: boolean;
    balanceSheet: boolean;
    financialResultsReport: boolean;
    statementOfChangesInEquity: boolean;
}

const ReportConfiguration: React.FC = () => {
    const [loading, setLoading] = useState(false); // Состояние загрузки

    const navigate = useNavigate(); // Инициализация навигации

    // Обработчик клика для отправки запроса
    const handleSendRequestClick = async () => {
        const wasChatOpen = chatStore.isOpen; // Проверка состояния чата

        if (wasChatOpen) {
            chatStore.handleCloseChat(); // Закрытие чата, если он открыт
        }

        // Подготовка данных для отчета
        const variables: ReportData = {
            startQuarterStr: configurationStore.startOfReportingQuarter,
            endQuarterStr: configurationStore.endOfReportingQuarter,
            startOfReportingYear: configurationStore.startOfReportingYear,
            endOfReportingYear: configurationStore.endOfReportingYear,
            incomeExpenses: checkboxStore.incomeExpenses,
            liquidity: checkboxStore.liquidity,
            profitability: checkboxStore.profitability,
            financialStability: checkboxStore.financialStability,
            businessLoad: checkboxStore.businessLoad,
            balanceSheet: checkboxStore.balanceSheet,
            financialResultsReport: checkboxStore.financialResultsReport,
            statementOfChangesInEquity: checkboxStore.statementOfChangesInEquity
        };

        try {
            // Обработка финансовых отчетов
            const results = await processFinancialReports(variables, dataWithTemplateOfPrompts);
            console.log(results);
            const finalMilvus = results.finalMilvus; // Получение финальных данных
            delete results.finalMilvus; // Удаление финальных данных из результатов

            let isFirstIteration = true; // Флаг для отслеживания первой итерации
            for (const [key, value] of Object.entries(results)) {
                const wasChatOpen = chatStore.isOpen; // Проверка состояния чата

                try {
                    const payload = {
                        prompt: value, // Данные для запроса
                        milvus_prompt: finalMilvus, // Дополнительные данные для запроса
                    };

                    // Отправка запроса на сервер
                    const response = await axios.post('http://192.168.88.223/report', payload);
                    console.log(`Response for ${key}:`, response.data);
                    economicStore.addLiquidityData(response.data); // Добавление данных в хранилище
                    if (isFirstIteration) {
                        navigate('/economicData'); // Переход на страницу экономических данных
                        isFirstIteration = false; // Обновление флага
                    }
                } catch (error) {
                    console.error(`Error sending request for ${key}:`, error); // Обработка ошибок
                } finally {
                    if (wasChatOpen) {
                        chatStore.handleOpenChat(); // Открытие чата, если он был открыт
                    }
                }
            }
            setLoading(false); // Сброс состояния загрузки
        } catch (error) {
            console.error('Error processing financial reports:', error); // Обработка ошибок
        }
    }

    return (
        <div className={cl.container}> {/* Основной контейнер для конфигурации отчета */}
            {loading ? ( // Условный рендеринг загрузки
                <div className={cl.loadingOverlay}>
                    <img src={loadingGif} alt="Loading..." className={cl.loadingGif} /> {/* Индикатор загрузки */}
                </div>
            ) : (
                <>
                    <ConfigurationContainer /> {/* Включение контейнера конфигурации */}

                    <div className={cl.sendRequestButton} onClick={handleSendRequestClick}> {/* Кнопка для отправки запроса */}
                        Получить отчетность
                    </div>
                </>
            )}
        </div>
    )
}

export default ReportConfiguration