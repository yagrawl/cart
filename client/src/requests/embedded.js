const BOLT_URL = "https://api-sandbox.bolt.com";

export const checkAccount = async (email) => {
    console.log(email);
    const response = await fetch(`${BOLT_URL}/v1/account/exists?email=${encodeURIComponent(email)}`);
    const responseAsJson = await response.json();

    return responseAsJson.has_bolt_account;
}
