import { useState } from "react";

export default function useGifApi() {
    const [byte, setByte] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const send = async (video_byte : Blob) => {
        try {
            const response = await fetch("/gif", {
                method: 'POST',
                body: video_byte,
                headers: {
                    "Content-Type" : "video/mp4"
                }
            })

            const data = await response.blob();
            if (data) {
                setByte(data);
            }
        } catch (error : any) {
            setError(error?.message);
        }
    }

    return {
        byte,
        error,
        send
    }
}