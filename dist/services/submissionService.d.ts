import type { FormData, SubmissionRecord } from "../types";
declare class SubmissionStorage {
    private submissions;
    create(formData: FormData): Promise<SubmissionRecord>;
    findById(id: string): Promise<SubmissionRecord | null>;
    findByRegistrationNumber(regNumber: string): Promise<SubmissionRecord | null>;
    getAll(): Promise<SubmissionRecord[]>;
    getStats(): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    }>;
}
export declare const submissionStorage: SubmissionStorage;
export declare class SubmissionService {
    static processSubmission(formData: FormData): Promise<SubmissionRecord>;
    static getSubmissionStats(): Promise<{
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    }>;
    static getAllSubmissions(): Promise<SubmissionRecord[]>;
    static getSubmissionById(id: string): Promise<SubmissionRecord | null>;
}
export {};
//# sourceMappingURL=submissionService.d.ts.map