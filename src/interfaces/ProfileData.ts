export interface ProfileActionsProps
{
    onActionTapped:(actionType:ProfileActionType)=>void,

}

export enum ProfileActionType{
        CHANGE_EMAIL,CHANGE_PASSWORD,PROFILE_DETAIL
}

