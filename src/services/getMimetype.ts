
export async function getMimetype(uri: string) : Promise<string | null> {
    try {
        const response = await fetch(uri, { method: 'HEAD' });
        if (response.ok) {
            const contentType = response.headers.get('Content-Type') || '';
            return contentType;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}