
export const parseCareerData = (careerText) => {
    try {
        // Extract only JSON content
        const jsonMatch = careerText.match(/{[\s\S]*}/);
        if (!jsonMatch) throw new Error("No JSON found in response");

        // Parse the extracted JSON
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Error parsing career data:", error);
        return null;
    }
};