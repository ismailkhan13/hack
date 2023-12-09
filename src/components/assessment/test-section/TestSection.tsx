import React, { useEffect, useRef, useState } from 'react'

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
import { useNavigate } from 'react-router-dom';

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

    const [questionDetails, setQuestionDetails] = useState<IGetQuestionRes>()

    const [selectedOption, setSelectedOption] = useState<{ option_id: number }>(initialFormValue);

    // const [disableSubmit, setDisableSubmit] = useState(false);
    const disableSelection = useRef(false);

    const [isPrevQuestion, setIsPrevQuestion] = useState(false);

    const [showAlertOnLastSubmit, setShowAlertOnLastSubmit] = useState(false);

    const [isLastQuestion, setIsLastQuestion] = useState(false);

    const [testimonialText, setTestimonialText] = useState('')

    const navigate=useNavigate()



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

    useEffect(() => {
        fetchNextQuestion();
    }, [])

    /*
        Fetch Next Question from API 
    */
    const fetchNextQuestion = async (lastQuestion = false) => {
        let questionResponse: IGetQuestionRes = await getQuestion(lastQuestion)
            .catch((err) => {
                toast.error('Error Fetching Question, Please Try Later');
            })
        disableSelection.current = false; //allow user to select any option
        if (questionResponse?.button_name === "SUBMIT") {
            setIsLastQuestion(true);
        } else {
            setIsLastQuestion(false);
        }
        setQuestionDetails(questionResponse);
        if (lastQuestion) {
            patchSelectedOption(questionResponse);
            setIsPrevQuestion(true);
        } else {
            setIsPrevQuestion(false) //To reset previous question flag if not a last question
        }
    }

    const handleOptionSelect = (event: React.SyntheticEvent, option_id: number) => {
        if (disableSelection.current) { return }
        disableSelection.current = true; //prevent user to select other option while submitting
        setSelectedOption({ option_id });
        if (!isLastQuestion) {
            submitAnswer(option_id);
        } else {
            setShowAlertOnLastSubmit(true);
        }
    }

    

    const submitAnswer = async (option_id: number) => {
        await saveAnswer({ questionId: questionDetails?.question.id || 0, optionId: option_id })
            .catch((err) => {
                if (err.response.data?.errors && err?.response.data?.errors[0]?.message)
                    toast.error(err?.response.data?.errors[0]?.message);
                props.onFinishHandler();
            })
        if (!isLastQuestion) {
            fetchNextQuestion();
        } else {
            props.onFinishHandler();
        }
    }

    const goToLastQuestion = () => {
        fetchNextQuestion(true);
    }

    const getQuestionNumber = () => {
        return (isPrevQuestion && !isLastQuestion) ? (questionDetails?.answeredQuestion! || 0) : (questionDetails?.answeredQuestion! + 1 || 0)
    }

    const patchSelectedOption = (questionResponse: IGetQuestionRes) => {
        setSelectedOption({ option_id: questionResponse.selectedOption || 0 });
    }

    return (
        <section className='test-section tw-bg-[#1E1E1E] tw-rounded-[24px] tw-p-2 md:tw-px-16 md:tw-pb-16 md:pt-6'>
            <p className='section-heading'>Assessment</p>
            <div className='question tw-flex tw-items-center tw-gap-4 fs14 tw-font-semibold'>Question {getQuestionNumber()}/{questionDetails?.totalQuestion || 0}
                {
                    questionDetails?.question?.additional_info ? (
                        <span className='tw-ml-2'>
                            <button data-tooltip-id="add-info">
                                <InfoIcon />
                            </button>
                            <Tooltip positionStrategy='fixed' className='tw-max-w-xs tw-text-center' html={questionDetails?.question?.additional_info || ""} id="add-info" place="top" >
                                {/* <div className='tw-text-white tw-font-medium fs14' dangerouslySetInnerHTML={{ __html: questionDetails?.question?.additional_info || "" }}></div> */}
                            </Tooltip>

                        </span>
                    ) : ''
                }
            </div>
            <div className='tw-flex tw-items-center tw-justify-between '>
                <div className='text tw-font-bold' dangerouslySetInnerHTML={{ __html: purify.sanitize(questionDetails?.question?.question || "") }}></div>
            </div>
            {questionDetails?.question?.question_image &&
                <img
                    className={`question-image${(questionDetails.question.id === 266 || questionDetails.question.id === 267) ? '--big' : ''}`} //hardcoding for some question images which need big size
                    src={`${imageBaseUrl}/assessment/question_images/${questionDetails?.question?.question_image}`} alt=""
                />}

            <Formik initialValues={selectedOption} onSubmit={(values) => { console.log(values); }}>
                {
                    ({ values, handleChange, setFieldValue }) => {
                        return (
                            <Form>
                                {questionDetails?.option ? questionDetails?.option?.map((option, idx) => (
                                    <div key={option.id} className='tw-my-4'>
                                        {option.option_image ?
                                            <div className='tw-flex'>
                                                <input className='big-radio tw-mr-2' id={`option-${idx}`} disabled={disableSelection.current} name='option_id' onClick={(e) => { handleOptionSelect(e, option.id); setFieldValue("option_id", option.id) }} checked={option.id === selectedOption.option_id} value={option.id} type="radio" />
                                                <label htmlFor={`option-${idx}`} className='option option__img'>
                                                    <img className='tw-w-full' src={`${imageBaseUrl}/assessment/option_images/${option.option_image}`} alt={`option-img-${idx}`} />
                                                </label>
                                            </div>
                                            :
                                            <div className=''>
                                                <input id={`option-${idx}`} disabled={disableSelection.current} className='option-radio' name='option_id' onClick={(e) => { handleOptionSelect(e, option.id); setFieldValue("option_id", option.id) }} checked={option.id === selectedOption.option_id} value={option.id} type="radio" />
                                                <label htmlFor={`option-${idx}`} className='option  tw-font-medium'>
                                                    <span dangerouslySetInnerHTML={{ __html: purify.sanitize(option.option || "") }}></span>
                                                    <div className='tick'>
                                                        <img src={`${imageBaseUrl}/assessment/tick.svg`} alt="" />
                                                    </div>
                                                </label>
                                            </div>
                                        }

                                    </div>
                                )) :
                                    <div className='tw-flex tw-flex-col tw-gap-2'>
                                        <TextField
                                            className='tw-bg-white tw-w-1/2'
                                            placeholder='Enter your text message'
                                            margin="normal"
                                            variant="outlined"
                                            value={testimonialText}
                                            onChange={(event) => setTestimonialText(event.target.value)}
                                            multiline
                                            rows={2}
                                        />
                                        <button className='btn btn--blue tw-w-max'>Submit</button>

                                    </div>
                                }
                            </Form>
                        )
                    }
                }
            </Formik>

            {
                questionDetails?.answeredQuestion != 0 && !isPrevQuestion ?
                    <div className='tw-flex tw-justify-center tw-mt-20'>
                        <button onClick={goToLastQuestion} className='btn btn--sky'><ArrowBackIcon fontSize='small' /> Back</button>
                    </div>
                    : null
            }

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
                        <button onClick={() => { navigate('/thankyou')}} className='button2 tw-flex tw-justify-center tw-items-center tw-cursor-pointer'>
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