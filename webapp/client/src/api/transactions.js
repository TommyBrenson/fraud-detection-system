
const BASE_URL = import.meta.env.VITE_API_URL;

export const validateTransaction = async (transaction) => {
    const response = await fetch(`${BASE_URL}transactions/validate`,
        {
            method: 'POST',
            body: JSON.stringify(transaction),
            headers: {
                'Accept': 'application/json;charset=UTF-8',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }
    );
    const result = await response.json();
    return result;
}