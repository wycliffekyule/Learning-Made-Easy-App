import React, { useState } from 'react';
import { Play, X, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoVideoProps {
  className?: string;
}

const DemoVideo: React.FC<DemoVideoProps> = ({ className = '' }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useState(true);

  // Using a sample educational video from Pexels
  const videoUrl = "https://player.vimeo.com/video/395212534?autoplay=1&muted=1";
  const thumbnailUrl = "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800";

  return (
    <>
      <div className={`relative ${className}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative cursor-pointer group"
          onClick={() => setShowVideo(true)}
        >
          <img
            src={thumbnailUrl}
            alt="Learning Made Easy Demo"
            className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl flex items-center justify-center group-hover:bg-opacity-40 transition-all">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg"
            >
              <Play className="w-8 h-8 text-blue-600 ml-1" />
            </motion.div>
          </div>
          
          {/* Video Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white bg-opacity-90 rounded-lg p-3">
              <h3 className="font-semibold text-gray-900 text-sm">See Learning Made Easy in Action</h3>
              <p className="text-xs text-gray-600 mt-1">Watch how our AI tutors help students succeed</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Controls */}
              <div className="absolute top-4 right-4 z-10 flex space-x-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                >
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setShowVideo(false)}
                  className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Iframe */}
              <iframe
                src={`${videoUrl}&muted=${muted ? 1 : 0}`}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Learning Made Easy Demo Video"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DemoVideo;