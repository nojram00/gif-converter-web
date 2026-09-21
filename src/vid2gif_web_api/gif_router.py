from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse
from ffmpeg_python_helper import AsyncFFMPEG, FFMPEG
from fastapi.concurrency import run_in_threadpool

from vid2gif_web_api.helpers.byte_helper import ByteSizeHelper

router = APIRouter()

@router.post('/gif')
async def gif(request : Request):
    import platform
    header  = request.headers
    data : bytes = await request.body()

    content_type = header.get("Content-Type", "").split(";")[0].strip().lower()

    try:
        if content_type != 'video/mp4':
            return JSONResponse(
                content={
                    "message": "Content-Type must be video/mp4."
                },
                status_code=401
            )
        if isinstance(data, bytes):

            size_helper = ByteSizeHelper(data)

            if size_helper.mb >=5:
                return JSONResponse(
                    content={
                        "message": "File Size Must below 5 mb."
                    },
                    status_code=400
                )

            if platform.system().lower() == 'windows' :
                output = await run_in_threadpool(
                    FFMPEG.api().gifs,
                    data
                )
            else:
                output = await AsyncFFMPEG.api().gifs(data)

            return Response(
                content=output,
                media_type="image/gif"
            )
    except RuntimeError as e:
        print(f"Error: {e}")
        return JSONResponse(
            content={
                "message": "Invalid or Corrupted File. Please generate a valid file"
            },
            status_code=400
        )