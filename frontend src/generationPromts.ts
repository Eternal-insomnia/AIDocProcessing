// Types
interface Variables {
    incomeExpenses: boolean;
    liquidity: boolean;
    profitability: boolean;
    financialStability: boolean;
    businessLoad: boolean;
    balanceSheet: boolean;
    financialResultsReport: boolean;
    statementOfChangesInEquity: boolean;
    startQuarterStr: string;
    endQuarterStr: string;
    startOfReportingYear: string;
    endOfReportingYear: string;
}

interface Data {
    incomeExpenses: string;
    incomeExpenses_Q: string;
    liquidity: string;
    liquidity_Q: string;
    profitability: string;
    profitability_Q: string;
    financialStability: string;
    financialStability_Q: string;
    businessLoad: string;
    businessLoad_Q: string;
    balanceSheet: string;
    balanceSheet_Q: string;
    financialResultsReport: string;
    financialResultsReport_Q: string;
    statementOfChangesInEquity: string;
    statementOfChangesInEquity_Q: string;
    milvus: string;
    milvus_Q: string;
}

// Functions
function romanToRussianQuarterGenitive(romanQuarter: string): string {
    const quarters: { [key: string]: string } = {
        'I квартал': 'ПЕРВОГО квартала',
        'II квартал': 'ВТОРОГО квартала',
        'III квартал': 'ТРЕТЬЕГО квартала',
        'IV квартал': 'ЧЕТВЕРТОГО квартала'
    };
    return quarters[romanQuarter] || romanQuarter;
}

function romanToQ(romanQuarter: string): string {
    const quarters: { [key: string]: string } = {
        'I квартал': 'Q1',
        'II квартал': 'Q2',
        'III квартал': 'Q3',
        'IV квартал': 'Q4'
    };
    return quarters[romanQuarter] || romanQuarter;
}

function replaceStrings(
    startQuarterStr: string,
    endQuarterStr: string,
    startYear: string,
    endYear: string,
    QStartConst: string,
    QEndConst: string,
    string: string,
    string_Q: string
): string {
    let result: string;
    
    if (startQuarterStr === endQuarterStr) {
        result = string_Q
            .replace("&&&&ПЕРВОГО квартала&&&&", startQuarterStr)
            .replace("&&&&ТРЕТЬЕГО квартала&&&&", endQuarterStr)
            .replace("&&&&2020&&&&", startYear)
            .replace("&&&&2022&&&&", endYear)
            .replace("&&&&Q1&&&&", QStartConst)
            .replace("&&&&Q3&&&&", QEndConst);
    } else {
        result = string
            .replace("&&&&ПЕРВОГО квартала&&&&", startQuarterStr)
            .replace("&&&&ТРЕТЬЕГО квартала&&&&", endQuarterStr)
            .replace("&&&&2020&&&&", startYear)
            .replace("&&&&2022&&&&", endYear)
            .replace("&&&&Q1&&&&", QStartConst)
            .replace("&&&&Q3&&&&", QEndConst);
    }
    
    return result;
}

// Main processing function
export async function processFinancialReports(variables: Variables, data: Data): Promise<{[key: string]: string}> {
    const startYear = variables.startOfReportingYear;
    const endYear = variables.endOfReportingYear;
    
    const startQuarterStr = romanToRussianQuarterGenitive(variables.startQuarterStr);
    const endQuarterStr = romanToRussianQuarterGenitive(variables.endQuarterStr);
    
    const QStartConst = romanToQ(variables.startQuarterStr);
    const QEndConst = romanToQ(variables.endQuarterStr);
    
    const results: {[key: string]: string} = {};

    results.finalMilvus = replaceStrings(
        startQuarterStr,
        endQuarterStr,
        startYear,
        endYear,
        QStartConst,
        QEndConst,
        data.milvus,
        data.milvus_Q
    );
    
    // Process each report type if enabled
    if (variables.incomeExpenses) {
        results.incomeExpenses = replaceStrings(
            startQuarterStr,
            endQuarterStr,
            startYear,
            endYear,
            QStartConst,
            QEndConst,
            data.incomeExpenses,
            data.incomeExpenses_Q
        );


    }
    
    if (variables.liquidity) {
        results.liquidity = replaceStrings(
            startQuarterStr,
            endQuarterStr,
            startYear,
            endYear,
            QStartConst,
            QEndConst,
            data.liquidity,
            data.liquidity_Q
        );
    }
    
    if (variables.profitability) {
        results.profitability = replaceStrings(
            startQuarterStr,
            endQuarterStr,
            startYear,
            endYear,
            QStartConst,
            QEndConst,
            data.profitability,
            data.profitability_Q
        );
    }
    
    if (variables.financialStability) {
        results.financialStability = replaceStrings(
            startQuarterStr,
            endQuarterStr,
            startYear,
            endYear,
            QStartConst,
            QEndConst,
            data.financialStability,
            data.financialStability_Q
        );
    }
    
    if (variables.businessLoad) {
        results.businessLoad = replaceStrings(
            startQuarterStr,
            endQuarterStr,
            startYear,
            endYear,
            QStartConst,
            QEndConst,
            data.businessLoad,
            data.businessLoad_Q
        );
    }
    
    if (variables.balanceSheet) {
        results.balanceSheet = replaceStrings(
            startQuarterStr,
            endQuarterStr,
            startYear,
            endYear,
            QStartConst,
            QEndConst,
            data.balanceSheet,
            data.balanceSheet_Q
        );
    }
    
    if (variables.financialResultsReport) {
        results.financialResultsReport = replaceStrings(
            startQuarterStr,
            endQuarterStr,
            startYear,
            endYear,
            QStartConst,
            QEndConst,
            data.financialResultsReport,
            data.financialResultsReport_Q
        );
    }
    
    if (variables.statementOfChangesInEquity) {
        results.statementOfChangesInEquity = replaceStrings(
            startQuarterStr,
            endQuarterStr,
            startYear,
            endYear,
            QStartConst,
            QEndConst,
            data.statementOfChangesInEquity,
            data.statementOfChangesInEquity_Q
        );
    }
    
    return results;
}

