import React, { useContext, useEffect, useRef, useState } from 'react'

import "./TestSection.scss";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Modal, TextField } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css';

import purify from "dompurify";

import { Form, Formik } from 'formik';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import { getQuestion, saveAnswer } from '../../../services/AssessmentService';
import { IGetQuestionRes } from '../../../types/assessment-interface';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { getDataFromLocalStorage, setDataOnLocalStorage } from '../../../utils/globalUtilities';
import { getSurveyDetails, getSurveyQuestions } from '../../../services/SurveryList';
import { LOCAL_STORAGE_DATA_KEYS } from '../../../localstorageDataModel';
import { UserContext } from '../../../App';

const imageBaseUrl = process.env.REACT_APP_MINDLER_PRODUCT_IMAGES_URL;

interface IProps {
    onFinishHandler: () => void;
    setModalVisibility: (x: boolean) => void;
}
/*
    Component which fetches Test Question, Options and shows them
*/
const TestSection = (props: IProps) => {

    const initialFormValue = {
        option_id: 0
    }


    const [selectedOption, setSelectedOption] = useState<{ option_id: number | null }>(initialFormValue);

    // const [disableSubmit, setDisableSubmit] = useState(false);
    const disableSelection = useRef(false);

    const [isPrevQuestion, setIsPrevQuestion] = useState(false);

    const [showAlertOnLastSubmit, setShowAlertOnLastSubmit] = useState(false);

    const [isLastQuestion, setIsLastQuestion] = useState(false);

    const navigate = useNavigate()

    const [questionIdx, setQuestionIdx] = useState<number>(-1);

    const [inputtext, setInputtext] = useState<string>("");

    const [userInput, setUserInput] = useState<any[]>([]);

    let { surveyId } = useParams();

    const [surveyDetails, setSurveyDetails] = useState<any>();

    const [questions, setQuestions] = useState<({
        id: number;
        question: string;
        type: string;
        options?: {
            option_id: number;
            value: string;
            name: string;
        }[];
        script: string;
    })[]>([]);


    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#fff',
        boxShadow: 24,
        p: 4,
    };

    const userDetails = useContext(UserContext);


    useEffect(() => {
        setSurveyDetails(getSurveyDetails(surveyId));
        resumeSurvey();
    }, [])

    /*
        Fetch Next Question from API 
    */
    const fetchNextQuestion = async (isAlreadyset: boolean = false) => {
        setInputtext("");
        if (!questions?.length) {
            let questionResponse = getSurveyQuestions(surveyId);
            setQuestions(questionResponse);
            if (!isAlreadyset) {
                setQuestionIdx(0);
            }
        } else {

            if (isLastQuestion) {
                if (!isAlreadyset) {

                    setQuestionIdx(0);
                }
            }
            if (!isAlreadyset) {

                setQuestionIdx((p) => p + 1);
            }
        }
        disableSelection.current = false; //allow user to select any option
        if (questionIdx != -1 && questions?.length == questionIdx + 1) {
            setIsLastQuestion(true);
            props.onFinishHandler();
            let cs: any[] = JSON.parse(getDataFromLocalStorage('comp') || "[]");
            cs.push(surveyId)
            setDataOnLocalStorage('comp', JSON.stringify(cs));
            return;
        } else {
            setIsLastQuestion(false);
        }

    }

    const handleOptionSelect = (event: React.SyntheticEvent, option_id: number | null, type: string) => {
        if (disableSelection.current) { return }
        disableSelection.current = true; //prevent user to select other option while submitting
        setSelectedOption({ option_id });
        let answer: any = option_id;
        if (type == 'text' || type == 'textarea') {
            answer = inputtext;
        } else if (type == 'checkbox') {
            answer = JSON.stringify(userInput);
        }
        if (!isLastQuestion) {
            submitAnswer(answer, questions[questionIdx].id);
        }
        // else {
        //     setShowAlertOnLastSubmit(true);
        // }
    }

    const submitAnswer = async (option_id: any, question_id: number) => {
        if (!await validateResponse(option_id)) {
            setDataOnLocalStorage(`nrd_${surveyId}`, '1');
        }
        let list: any[] = JSON.parse(getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.CSR + `_${surveyId}`) || "[]") || [];
        list.push({
            option_id,
            question_id
        })
        setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.CSR + `_${surveyId}`, JSON.stringify(list));

        if (!isLastQuestion) {
            fetchNextQuestion();
        }
    }

    const getQuestionNumber = () => {
        return questionIdx + 1;
    }

    const validateResponse = async (answer: any) => {
        try {
            let isValid = await axios.post<{ data: boolean }>(`https://surveyx-api.onrender.com/validate_question`, {
                "setId": +surveyId!,
                "questionId": questions && questions[questionIdx].id,
                "answer": answer
            })
            return isValid.data.data;
        } catch (err) {
            console.log(err);
            return 0;
        }

    }

    const onCbSelect = (event: any, id: number, data: any) => {
        if (event.target.checked) {
            setUserInput((cb) => {
                let new_cb = [...cb];
                new_cb.push(data);
                return new_cb;
            })
        } else {
            setUserInput((cb) => {
                let idx = cb.findIndex((selected) => selected.id == id)
                let new_cb = [...cb];
                new_cb.splice(idx, 1);
                return new_cb;
            })
        }
    }

    const resumeSurvey = async () => {
        if (surveyId && !isNaN(+surveyId) && +surveyId == 1) {
            await axios.post('https://surveyx-api.onrender.com/recentTransactions', {
                "account_id": userDetails?.userDetails?.address
            })
            .catch((err)=>{
                
            })
        }
        let list: any[] = JSON.parse(getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.CSR + `_${surveyId}`) || "[]") || [];
        setQuestionIdx(list?.length || 0);
        fetchNextQuestion(!!list?.length);
    }


    return (
        <section className='test-section tw-bg-[#1E1E1E] tw-rounded-[24px] tw-p-2 md:tw-px-16 md:tw-pb-16 md:pt-6'>
            <p className='section-heading'>Survey - {surveyDetails?.title}</p>
            <div className='question tw-flex tw-items-center tw-gap-4 fs14 tw-font-semibold'>Question {getQuestionNumber()}/{questions?.length || 0}
            </div>
            <div className='tw-flex tw-items-center tw-justify-between '>
                <div className='text tw-font-bold'>
                    {questions && questions[questionIdx]?.question}
                </div>
            </div>


            <div className='tw-my-4'>
                {
                    questions && questions[questionIdx]?.type == 'checkbox' &&
                    <>
                        {
                            questions[questionIdx]?.options?.map((option, index) => (
                                <div key={index} className='tw-flex tw-items-center tw'>
                                    <label htmlFor={`option-${option.option_id}`} className='option tw-font-medium'>
                                        <input type="checkbox" className='tw-mr-4' id={`option-${option.option_id}`} name={option.value} onChange={(e) => { onCbSelect(e, option.option_id, { ...option }) }} />
                                        <span>{option.value} - {option.name}</span>
                                    </label>
                                </div>
                            ))
                        }
                        <button type='button' onClick={(e) => { handleOptionSelect(e, null, questions[questionIdx]?.type); }} className='btn btn--blue tw-w-max'>Submit</button>
                    </>
                }


                {
                    questions && (questions[questionIdx]?.type == 'radio' || questions[questionIdx]?.type == 'dropdown') &&
                    <div>
                        {
                            questions[questionIdx]?.options?.map((op) => (
                                <div key={op.option_id} className='tw-block tw-my-4'>
                                    <input id={`option-${op.option_id}`} disabled={disableSelection.current} className='option-radio' name='option_id' onClick={(e) => { handleOptionSelect(e, op.option_id, questions[questionIdx]?.type); }} checked={op.option_id === selectedOption.option_id} value={op.option_id} type="radio" />
                                    <label htmlFor={`option-${op.option_id}`} className='option  tw-font-medium'>
                                        <span>{op.value} - {op.name}</span>
                                        <div className='tick'>
                                            <img src={`${imageBaseUrl}/assessment/tick.svg`} alt="" />
                                        </div>
                                    </label>
                                </div>
                            ))
                        }
                    </div>
                }


                {
                    questions && (questions[questionIdx]?.type == 'textarea' || questions[questionIdx]?.type == 'text') &&
                    <>
                        <div className='tw-flex tw-flex-col tw-gap-2'>
                            <TextField
                                className='tw-bg-white tw-w-1/2'
                                placeholder='Enter your response'
                                margin="normal"
                                variant="outlined"
                                value={inputtext}
                                onChange={(event) => setInputtext(event.target.value)}
                                multiline
                                rows={2}
                            />
                            <button type='button' onClick={(e) => { handleOptionSelect(e, null, questions[questionIdx]?.type); }} className='btn btn--blue tw-w-max'>Submit</button>

                        </div>
                    </>
                }

            </div>

            {/* {
                questionDetails?.answeredQuestion != 0 && !isPrevQuestion ?
                    <div className='tw-flex tw-justify-center tw-mt-20'>
                        <button onClick={goToLastQuestion} className='btn btn--sky'><ArrowBackIcon fontSize='small' /> Back</button>
                    </div>
                    : null
            } */}

            {/* popup*/}
            <Modal
                open={showAlertOnLastSubmit}
                onClose={() => { }}
                aria-labelledby="Submit sub-test Confirmation"
                aria-describedby="Submit sub-test Confirmation"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}
            >
                {/* <Box sx={modalStyle}> */}
                <div className='pause-exit-popup tw-flex tw-flex-col tw-p-2'>
                    <div className='section-heading tw-text-center'>You have successfully completed this assessment.</div>
                    <div className='desc tw-font-medium  tw-mb-6 tw-text-center'>
                        If you wish to change your last answer, please go back, else submit.
                    </div>
                    <div className="tw-flex tw-justify-center tw-gap-2">
                        <button onClick={() => { disableSelection.current = false; setIsPrevQuestion(true); setShowAlertOnLastSubmit(false) }} className='button1 tw-flex tw-justify-center tw-items-center tw-cursor-pointer'>
                            <div className='button-pe tw-font-medium'>Go Back</div>
                        </button>
                        <button onClick={() => { navigate('/thankyou') }} className='button2 tw-flex tw-justify-center tw-items-center tw-cursor-pointer'>
                            <div className='res tw-font-bold'>Submit</div>
                        </button>
                    </div>

                </div>
                {/* </Box> */}
            </Modal>
        </section >


    )
}

export default TestSection