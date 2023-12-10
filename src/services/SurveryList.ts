import { LOCAL_STORAGE_DATA_KEYS } from "../localstorageDataModel";
import { getDataFromLocalStorage } from "../utils/globalUtilities";

export const SURVEY_LIST = [
    {
        "set": 1,
        "title": "Survey 1",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse euismod, justo et eleifend congue, purus lectus congue massa, sit amet vestibulum risus augue a orci.",
        "questions": [
            {
                "id": 1,
                "question": "Age Group",
                "type": "radio",
                "options": [
                    {
                        "option_id": 1,
                        "value": "a",
                        "name": "Under 18"
                    },
                    {
                        "option_id": 2,
                        "value": "b",
                        "name": "18-24"
                    },
                    {
                        "option_id": 3,
                        "value": "c",
                        "name": "25-34"
                    },
                    {
                        "option_id": 4,
                        "value": "d",
                        "name": "35-44"
                    },
                    {
                        "option_id": 5,
                        "value": "e",
                        "name": "45-54"
                    },
                    {
                        "option_id": 6,
                        "value": "f",
                        "name": "55 or above"
                    }
                ],
                "script": "if (!['a', 'b', 'c', 'd', 'e', 'f'].includes(ageGroup)) {console.log('Please select a valid option (a, b, c, d, e, or f).');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 2,
                "question": "Trading Experience Level",
                "type": "radio",
                "options": [
                    {
                        "option_id": 1,
                        "value": "a",
                        "name": "Beginner"
                    },
                    {
                        "option_id": 2,
                        "value": "b",
                        "name": "Intermediate"
                    },
                    {
                        "option_id": 3,
                        "value": "c",
                        "name": "Advanced"
                    },
                    {
                        "option_id": 4,
                        "value": "d",
                        "name": "Professional"
                    }
                ],
                "script": "if (!['a', 'b', 'c', 'd'].includes(tradingExperienceLevel)) {console.log('Please select a valid option (a, b, c, or d).');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 3,
                "question": "Which blockchain platforms have you used for cross-chain transactions? (Select all that apply)",
                "type": "checkbox",
                "options": [
                    {
                        "option_id": 1,
                        "value": "a",
                        "name": "Ethereum"
                    },
                    {
                        "option_id": 2,
                        "value": "b",
                        "name": "Binance Smart Chain"
                    },
                    {
                        "option_id": 3,
                        "value": "c",
                        "name": "Polkadot"
                    },
                    {
                        "option_id": 4,
                        "value": "d",
                        "name": "Solana"
                    },
                    {
                        "option_id": 5,
                        "value": "e",
                        "name": "Bitcoin"
                    },
                    {
                        "option_id": 6,
                        "value": "f",
                        "name": "XDC Network"
                    },
                    {
                        "option_id": 7,
                        "value": "g",
                        "name": "Others"
                    }
                ],
                "script": "const validPlatforms = ['a', 'b', 'c', 'd', 'e', 'f', 'g']; if (!selectedPlatforms.every(platform => validPlatforms.includes(platform))) {console.log('Please select valid blockchain platforms.');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 4,
                "question": "How often do you engage in cross-chain transactions?",
                "type": "radio",
                "options": [
                    {
                        "option_id": 1,
                        "value": "a",
                        "name": "Daily"
                    },
                    {
                        "option_id": 2,
                        "value": "b",
                        "name": "Weekly"
                    },
                    {
                        "option_id": 3,
                        "value": "c",
                        "name": "Monthly"
                    },
                    {
                        "option_id": 4,
                        "value": "d",
                        "name": "Rarely"
                    },
                    {
                        "option_id": 5,
                        "value": "e",
                        "name": "Never"
                    }
                ],
                "script": "if (!['a', 'b', 'c', 'd', 'e'].includes(transactionFrequency)) {console.log('Please select a valid option (a, b, c, d, or e).');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 5,
                "question": "On average, how long do your cross-chain transactions take to complete?",
                "type": "radio",
                "options": [
                    {
                        "option_id": 1,
                        "value": "a",
                        "name": "Less than 10 minutes"
                    },
                    {
                        "option_id": 2,
                        "value": "b",
                        "name": "10-30 minutes"
                    },
                    {
                        "option_id": 3,
                        "value": "c",
                        "name": "30-90 minutes"
                    },
                    {
                        "option_id": 4,
                        "value": "d",
                        "name": "More than 90 minutes"
                    }
                ],
                "script": "if (!['a', 'b', 'c', 'd'].includes(transactionDuration)) {console.log('Please select a valid option (a, b, c, or d).');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 6,
                "question": "Have you experienced any challenges with current bridging mechanisms? (Select all that apply)",
                "type": "checkbox",
                "options": [
                    {
                        "option_id": 1,
                        "value": "a",
                        "name": "High transaction fees"
                    },
                    {
                        "option_id": 2,
                        "value": "b",
                        "name": "Long transaction times"
                    },
                    {
                        "option_id": 3,
                        "value": "c",
                        "name": "Complexity of the process"
                    },
                    {
                        "option_id": 4,
                        "value": "d",
                        "name": "Security concerns"
                    },
                    {
                        "option_id": 5,
                        "value": "e",
                        "name": "Lack of support for certain tokens or chains"
                    },
                    {
                        "option_id": 6,
                        "value": "f",
                        "name": "Others (Please specify)"
                    }
                ],
                "script": "const validChallenges = ['a', 'b', 'c', 'd', 'e', 'f']; if (!selectedChallenges.every(challenge => validChallenges.includes(challenge))) {console.log('Please select valid challenges.');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 7,
                "question": "What factors are most important to you when choosing a platform for cross-chain transactions? (Top 2 in order of importance)",
                "type": "checkbox",
                "options": [
                    {
                        "option_id": 1,
                        "value": "a",
                        "name": "Transaction speed"
                    },
                    {
                        "option_id": 2,
                        "value": "b",
                        "name": "Security"
                    },
                    {
                        "option_id": 3,
                        "value": "c",
                        "name": "User interface"
                    },
                    {
                        "option_id": 4,
                        "value": "d",
                        "name": "Supported chains and tokens"
                    },
                    {
                        "option_id": 5,
                        "value": "e",
                        "name": "Transaction fees"
                    },
                    {
                        "option_id": 6,
                        "value": "f",
                        "name": "Community and support"
                    }
                ],
                "script": "const validRanking = ['1', '2', '3', '4', '5', '6']; if (!selectedFactors.every(rank => validRanking.includes(rank))) {console.log('Please provide a valid ranking for each factor.');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 8,
                "question": "How likely are you to try a new decentralized exchange that offers faster and more efficient cross-chain transactions without traditional bridging mechanisms?",
                "type": "radio",
                "options": [
                    {
                        "option_id": 1,
                        "value": "a",
                        "name": "Very likely"
                    },
                    {
                        "option_id": 2,
                        "value": "b",
                        "name": "Somewhat likely"
                    },
                    {
                        "option_id": 3,
                        "value": "c",
                        "name": "Neutral"
                    },
                    {
                        "option_id": 4,
                        "value": "d",
                        "name": "Somewhat unlikely"
                    },
                    {
                        "option_id": 5,
                        "value": "e",
                        "name": "Very unlikely"
                    }
                ],
                "script": "if (!['a', 'b', 'c', 'd', 'e'].includes(decentralizedExchangeLikelihood)) {console.log('Please select a valid option (a, b, c, d, or e).');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 9,
                "question": "Any additional comments or suggestions regarding your experience with cross-chain transactions and decentralized exchanges?",
                "type": "textarea",
                "script": "if (additionalComments.trim() === '') {console.log('Please provide additional comments or suggestions.');} else {console.log('Thank you for your response.');}"
            }
        ]
    },
    {
        "set": 2,
        "title": "Survey 2",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse euismod, justo et eleifend congue, purus lectus congue massa, sit amet vestibulum risus augue a orci.",
        "questions": [
            {
                "id": 10,
                "question": "Which cryptocurrencies do you currently hold in your portfolio? (Select all that apply)",
                "type": "checkbox",
                "options": [
                    {
                        "option_id": 1,
                        "value": "a",
                        "name": "Bitcoin (BTC)"
                    },
                    {
                        "option_id": 2,
                        "value": "b",
                        "name": "Ethereum (ETH)"
                    },
                    {
                        "option_id": 3,
                        "value": "c",
                        "name": "Binance Coin (BNB)"
                    },
                    {
                        "option_id": 4,
                        "value": "d",
                        "name": "Cardano (ADA)"
                    },
                    {
                        "option_id": 5,
                        "value": "e",
                        "name": "Solana (SOL)"
                    },
                    {
                        "option_id": 6,
                        "value": "f",
                        "name": "Ripple (XRP)"
                    },
                    {
                        "option_id": 7,
                        "value": "g",
                        "name": "Polkadot (DOT)"
                    },
                    {
                        "option_id": 8,
                        "value": "h",
                        "name": "Litecoin (LTC)"
                    }
                ],
                "script": "const validCryptos = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; if (!selectedCryptos.every(crypto => validCryptos.includes(crypto))) {console.log('Please select valid cryptocurrencies.');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 11,
                "question": "How did you learn about cryptocurrency investments?",
                "type": "text",
                "script": "if (learningSource.trim() === '') {console.log('Please provide details on how you learned about cryptocurrency investments.');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 12,
                "question": "What percentage of your overall investment portfolio is allocated to cryptocurrencies?",
                "type": "text",
                "script": "if (isNaN(cryptoAllocation) || cryptoAllocation < 0 || cryptoAllocation > 100) {console.log('Please enter a valid percentage between 0 and 100.');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 13,
                "question": "Which investment strategy best describes your approach to cryptocurrencies?",
                "type": "radio",
                "options": [
                    {
                        "option_id": 1,
                        "value": "a",
                        "name": "Hodl (Long-term holding)"
                    },
                    {
                        "option_id": 2,
                        "value": "b",
                        "name": "Day trading"
                    },
                    {
                        "option_id": 3,
                        "value": "c",
                        "name": "Swing trading"
                    },
                    {
                        "option_id": 4,
                        "value": "d",
                        "name": "Automated trading bots"
                    }
                ],
                "script": "if (!['a', 'b', 'c', 'd'].includes(investmentStrategy)) {console.log('Please select a valid option (a, b, c, or d).');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 14,
                "question": "What challenges have you encountered in managing your cryptocurrency portfolio? (Select all that apply)",
                "type": "checkbox",
                "options": [
                    {
                        "option_id": 1,
                        "value": "a",
                        "name": "Volatility"
                    },
                    {
                        "option_id": 2,
                        "value": "b",
                        "name": "Security concerns"
                    },
                    {
                        "option_id": 3,
                        "value": "c",
                        "name": "Regulatory uncertainty"
                    },
                    {
                        "option_id": 4,
                        "value": "d",
                        "name": "Lack of liquidity"
                    },
                    {
                        "option_id": 5,
                        "value": "e",
                        "name": "Tax implications"
                    }
                ],
                "script": "const validChallenges = ['a', 'b', 'c', 'd', 'e']; if (!selectedChallenges.every(challenge => validChallenges.includes(challenge))) {console.log('Please select valid challenges.');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 15,
                "question": "What features do you consider essential in a cryptocurrency portfolio management tool?",
                "type": "text",
                "script": "if (portfolioFeatures.trim() === '') {console.log('Please provide details on essential features in a cryptocurrency portfolio management tool.');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 16,
                "question": "How satisfied are you with the current state of cryptocurrency regulations in your country?",
                "type": "radio",
                "options": [
                    {
                        "option_id": 1,
                        "value": "a",
                        "name": "Very satisfied"
                    },
                    {
                        "option_id": 2,
                        "value": "b",
                        "name": "Satisfied"
                    },
                    {
                        "option_id": 3,
                        "value": "c",
                        "name": "Neutral"
                    },
                    {
                        "option_id": 4,
                        "value": "d",
                        "name": "Dissatisfied"
                    },
                    {
                        "option_id": 5,
                        "value": "e",
                        "name": "Very dissatisfied"
                    }
                ],
                "script": "if (!['a', 'b', 'c', 'd', 'e'].includes(regulationSatisfaction)) {console.log('Please select a valid option (a, b, c, d, or e).');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 17,
                "question": "Do you actively participate in any cryptocurrency communities or forums?",
                "type": "radio",
                "options": [
                    {
                        "option_id": 1,
                        "value": "a",
                        "name": "Yes"
                    },
                    {
                        "option_id": 2,
                        "value": "b",
                        "name": "No"
                    }
                ],
                "script": "if (!['a', 'b'].includes(cryptoCommunityParticipation)) {console.log('Please select a valid option (a or b).');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 18,
                "question": "What topics or information would you like to see more coverage on in the cryptocurrency space?",
                "type": "text",
                "script": "if (coveragePreferences.trim() === '') {console.log('Please provide topics or information you would like to see more coverage on in the cryptocurrency space.');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 19,
                "question": "How likely are you to recommend a cryptocurrency investment platform to a friend or colleague?",
                "type": "radio",
                "options": [
                    {
                        "option_id": 1,
                        "value": "a",
                        "name": "Very likely"
                    },
                    {
                        "option_id": 2,
                        "value": "b",
                        "name": "Somewhat likely"
                    },
                    {
                        "option_id": 3,
                        "value": "c",
                        "name": "Neutral"
                    },
                    {
                        "option_id": 4,
                        "value": "d",
                        "name": "Somewhat unlikely"
                    },
                    {
                        "option_id": 5,
                        "value": "e",
                        "name": "Very unlikely"
                    }
                ],
                "script": "if (!['a', 'b', 'c', 'd', 'e'].includes(recommendationLikelihood)) {console.log('Please select a valid option (a, b, c, d, or e).');} else {console.log('Thank you for your response.');}"
            },
            {
                "id": 20,
                "question": "Any additional comments or suggestions regarding your experience with cryptocurrency investments?",
                "type": "textarea",
                "script": "if (additionalComments.trim() === '') {console.log('Please provide additional comments or suggestions.');} else {console.log('Thank you for your response.');}"
            }
        ]
    }


]




export const getSurveyDetails = (sid: number | string | undefined) => {
    let survey = sid && SURVEY_LIST.find((s) => s.set === +sid);
    if (survey) {
        return survey;
    }
    return [];
}

export const getSurveyQuestions = (sid: number | string | undefined) => {
    let questions = sid && SURVEY_LIST.find((s) => s.set === +sid)?.questions;
    if (questions) {
        return questions;
    }
    return [];
}

export const getCompletedSurveys = (): number[] => {
    try {
        let list: number[] = JSON.parse(getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.CSR))
        return list;
    }
    catch (err) {
        return [];
    }
}

export const getIncompleteSurveys = (): number[] => {
    try {
        let list: number[] = JSON.parse(getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.ISR))
        return list;
    }
    catch (err) {
        return [];
    }
}

