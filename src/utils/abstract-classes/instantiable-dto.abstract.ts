/* eslint-disable */
export abstract class InstantiableDto {
    public static async create(...args: any[]): Promise<any> {
        throw new Error('Method not implemented! Use derived class');
    }
}

/* eslint-enable */
