import { useState } from "react";

export default function useGifApi() {
    const [byte, setByte] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    const send = async (video_byte : Blob) => {
        try {
            setError(null);
            const response = await fetch("/gif", {
                method: 'POST',
                body: video_byte,
                headers: {
                    "Content-Type" : "video/mp4"
                }
            })

            if (response.status !== 200) {
                const json_data = await response.json();
                setError(json_data?.message ?? "Something Went Wrong.");
                setByte(null);
                return;
            }

            const data = await response.blob(); 
            if (data) {
                setByte(data);
            }
        } catch (error : any) {
            setError(error?.message);
            setByte(null);
        }
    }

    return {
        byte,
        error,
        send
    }
}