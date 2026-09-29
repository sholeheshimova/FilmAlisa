// const baseUrl = "https://api.sarkhanrahimli.dev/api/filmalisa";

// export async function submitContact(payload) {
//     const response = await fetch(`${baseUrl}/contactus`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//     });

//     const result = await response.json().catch(() => null);
//     if (!response.ok || result?.result === false) {
//         throw new Error(result?.message || `Could not send message (${response.status})`);
//     }

//     return result?.data ?? result;
// }
