from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse
from ffmpeg_python_helper import FFMPEG

router = APIRouter()

@router.post('/gif')
async def gif(request : Request):
    header  = request.headers
    data : bytes = await request.body()

    print(type(data).__name__)

    if header.get('Content-Type') != 'video/mp4':
        return JSONResponse(
            content={
                "message": "Content-Type must be video/mp4."
            },
            status_code=401
        )

    if type(data).__name__ == 'bytes':
        output = FFMPEG.api().gifs(data)

        return Response(
            content=output,
            media_type="image/gif"
        )

    return JSONResponse(
        content={
            "message": "Invalid or Corrupted File. Please generate a valid file"
        },
        status_code=401
    )