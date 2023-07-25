export function charToHue(char: any, saturation : number = 70, lightness : number = 85) {
    const asciiVals = [
        ...Array(10).keys(), // digits
        ...Array.from({ length: 26 }, (_, i) => i + 10), // uppercase letters
    ];
    const asciiChar = [
        ...Array.from({ length: 10 }, (_, i) => i.toString()),
        ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65)),
    ];
    const asciiMap = new Map(asciiChar.map((c, i) => [c, asciiVals[i]]));
    const value = asciiMap.get(char);
    const hue = (value / 36) * 360; // normalize to 0-360
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`; // return HSL value with fixed saturation and lightness
}


// Interleave digits and uppercase letters in ASCII values.
export function charToHueInterleaved(char: any) {
    const asciiVals = [
        ...Array.from({ length: 10 }, (_, i) => i * 2),
        ...Array.from({ length: 26 }, (_, i) => i * 2 + 1),
    ];

    const asciiChar = [
        ...Array.from({ length: 10 }, (_, i) => i.toString()),
        ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65)),
    ];

    const asciiMap = new Map(asciiChar.map((c, i) => [c, asciiVals[i]]));
    const value = asciiMap.get(char);
    const hue = (value / 72) * 360; // normalize to 0-360
    return `hsl(${hue}, 70%, 85%)`; // return HSL value with fixed saturation and lightness
}
