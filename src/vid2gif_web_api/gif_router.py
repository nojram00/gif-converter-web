from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse
from ffmpeg_python_helper import FFMPEG, FFProbe

from vid2gif_web_api.helpers.byte_helper import ByteSizeHelper

router = APIRouter()

@router.post('/gif')
async def gif(request : Request):
    header  = request.headers
    data : bytes = await request.body()

    print(type(data).__name__)

    try:
        if header.get('Content-Type') != 'video/mp4':
            return JSONResponse(
                content={
                    "message": "Content-Type must be video/mp4."
                },
                status_code=401
            )

        if type(data).__name__ == 'bytes':

            size_helper = ByteSizeHelper(data)

            if size_helper.mb >=5:
                return JSONResponse(
                    content={
                        "message": "File Size Must below 5 mb."
                    },
                    status_code=400
                )

            output = FFMPEG.api().gifs(data)

            return Response(
                content=output,
                media_type="image/gif"
            )
    except RuntimeError:
        return JSONResponse(
            content={
                "message": "Invalid or Corrupted File. Please generate a valid file"
            },
            status_code=400
        )