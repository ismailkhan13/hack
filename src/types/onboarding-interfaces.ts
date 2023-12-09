export interface ICountry {
    id: number,
    country_code: string,
    name: string,
    phone_code: string,
    timezone: string,
}

export interface IState {
    country_id: number,
    id: number | string,
    name: string
}
export interface ICity {
    state_id: number,
    id: number,
    name: string
}
export interface ICitys {
    country_code: string,
    city_name: string,
    state_name: string,
    country_name: string,
    state_id: number,
    country_id: number,
    city_id: number
}

export interface IOnboardingOptionsRes {
    identities: IOnboardingIdentity[],
    levels: IOnboardingLevel[],
    grades: IOnboardingGrade[]
}

export interface IOnboardingIdentity {
    id: number,
    name: string,
}

export interface IOnboardingLevel {
    id: number,
    name: string,

}
export interface IOnboardingGrade {
    id: number,
    name: string,
    level_id: number
}

export interface IOnboardingUserDetails {
    name?: string, //from frontend store
    first_name: string,
    last_name: string,
    phone_no: string,
    phone_country_code: string,
    city_id: number,
    state_id: number,
    country_id: number,
    gender_id: number,
    student_level_id: number,
    student_identity_id: number,
    grade_id: number,
    student_type_id: number,
    email?: string,
    otp?: string,
    is_phone_verified?: number | null,
    city_name?: string,
    old_uid: number | null,
    school_branch_id?: number | null
}

export interface IOnboardingStep1Details {
    name: string,
    city_id: number | null,
    state_id: number | null,
    country_id: number | null,
    phone_no: string,
    phone_country_code: string,
    password: string,
    otp: string,
    step?: number | undefined,
    city_name?: string
}

export interface IOnboardingStep2Details {
    student_identity_id: number | null,
    student_level_id: number | null,
    grade_id: number | null,
}


export interface ILoginRes {
    email: string,
    main_user_id: number,
    session: string,
    tempSessionDetails: any,
    isCompleted: number,
    step: number,
    is_phone_verified?: number | null;
    userData: ILoginUserData
}

export interface ILoginUserData {
    first_name: string,
    last_name: string,
    phone_no: string,
    phone_country_code: string,
    city_id: number,
    state_id: number,
    country_id: number,
    gender_id: number,
    student_level_id: number,
    student_identity_id: number,
    grade_id: number,
    student_type_id: number,
    email?: string,
    is_phone_verified?: number | null;
    old_uid: number | null
}