export interface DisplayAmount {
    whole: number;
    fractional: number;
    currency: string;
}

export const getDisplayAmount = function (num: number, currency: string = "$"): DisplayAmount {
    return {
        whole: Math.floor(num / 100),
        fractional: (num % 100),
        currency: currency,
    };
}