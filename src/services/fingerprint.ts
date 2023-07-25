import fpPromise from "@fingerprintjs/fingerprintjs";

export async function getFingerprint() {
    const agent = await fpPromise.load();
    return await agent.get();
}