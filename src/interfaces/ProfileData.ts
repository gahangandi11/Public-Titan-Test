export interface ProfileQuickActionsProps
{
    onActionTapped:(actionType:ProfileQuickActionType)=>void,

}

//Since profile component is disintegrated into sub component, this interface is used to communicate between 
//different siblings of same profile container.
export interface ProfileUpdateAction
{
    onProfileSegmentUpdated:()=>void
    actionType:ProfileQuickActionType
}

export enum ProfileQuickActionType{
        CHANGE_EMAIL,CHANGE_PASSWORD,PROFILE_DETAIL
}

