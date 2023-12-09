export interface IAssessmentStatus {
    assessments: ITestInfo[],
    progress: number,
    nextTest: string,
    is_free_user: boolean
}

export interface ITestInfo {
    id: number,
    name: string,
    url_parameter: string,
    recommended_time: number,
    icon: string,
    icon_desktop: string,
    status: number,
    isCompleted: boolean,
    isLocked: boolean,
    subTest: ISubTestInfo[],
    test_sno: number,
}

export interface ISubTestInfo {
    id: number,
    test_main_id: number,
    name: string,
    number_of_questions: number,
    question_per_page: number,
    status: number,
    display_status: number,
    pg: number,
    recommended_time: number,
    timer: number,
    heading: string,
    instructions: string,
    check_id: number,
    font: string,
    created_on: number,
    updated_on: number,
    isCompleted: boolean,
    progress: number,
}


export interface IGetQuestionRes {
    question: IQuestionDetails,
    option: IOptionDetails[],
    test_id: number,
    subTestName: string,
    button_name: string,
    subTest_id: number,
    progress: number,
    totalQuestion: number,
    answeredQuestion: number,
    selectedOption: number,
}

export interface IQuestionDetails {
    id: number,
    subtest_id: number,
    question: string,
    question_image: string,
    additional_info: string,
    question_id: number,
    dimesion_id: number,
    sub_dimension_id: number,
    status: number,
}

export interface IOptionDetails {
    id: number,
    subtest_id: number,
    question_id: number,
    option: string,
    option_image: string,
    option_id: number,
    value: string,
}

export interface ITestResultResponse {
    result: ITestResultScores[],
    next_test_name: string,
    text: string,
    test_name: string,
    osDef: any,
    icon: string,
    progress: number,
    partialMatches: IPartialMatches[]

}

export interface IPartialMatches {
    id: number
    title: string
    name: string
    description: string
    tagline: string
    icon: string
    image: string
}

export interface ITestResultScores {
    param_score: number,
    stanine: number,
    yanivas: number,
    os_parameters: string,
    param: string,
    value: string,
}

export interface ICareerMatch {
    name: string,
    description: string,
    tagline: string | null,
    icon: string | null,
    image: string,
    title: string,
    id: number,
    test_name?: string,
    match?: string
    test_id: number;
}