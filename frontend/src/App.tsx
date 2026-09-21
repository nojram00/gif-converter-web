import { useEffect, useState, type ChangeEvent } from 'react';
import useGifApi from './hooks/useGifApi'

function App() {
  const { byte, send, error } = useGifApi();
  const [data, setData] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)

  useEffect(() => {
    if (error) {
      alert(error)
    }
  }, [error])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setData(file)
    }
  }

  const handleSend = async () => {
    if (data) {
      setIsConverting(true)
      try {
        await send(data)
      } finally {
        setIsConverting(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-gray-800">Video to GIF Converter</h1>
          <p className="text-gray-600">Upload a video file to convert it to an animated GIF</p>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <label className="block">
            <span className="sr-only">Choose video file</span>
            <div className="flex items-center justify-center w-full">
              <div className="w-full">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept="video/*"
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          {data ? data.name : 'Click to select video'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {data ? `${(data.size / (1024 * 1024)).toFixed(2)} MB` : 'MP4, AVI, MOV, or other video formats'}
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </label>
        </div>

        {/* Convert Button */}
        <button 
          onClick={handleSend}
          disabled={!data || isConverting}
          className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
            !data || isConverting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isConverting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Converting...</span>
            </div>
          ) : (
            'Convert to GIF'
          )}
        </button>

        {/* Result Display */}
        {byte != null && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Your GIF</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Ready!
              </span>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <img 
                src={URL.createObjectURL(byte)} 
                alt="Converted GIF"
                className="w-full h-auto"
              />
            </div>
            <div className="flex justify-center">
              <a 
                href={URL.createObjectURL(byte)}
                download="converted.gif"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>Download GIF</span>
              </a>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
          <p>Conversion may take a few moments depending on video size</p>
        </div>
      </div>
    </div>
  )
}

export default App
