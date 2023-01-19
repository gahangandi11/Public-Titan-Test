export interface SupportFormDTO {
    uid: string,
    organization: string,
    type: string,
    requesterName: string,
    requesterEmail: string,
    requestedDate: string,
    description: string,
    attachmentFileName: string,
    attachmentUrl: string,
    isEmailSent:boolean
}