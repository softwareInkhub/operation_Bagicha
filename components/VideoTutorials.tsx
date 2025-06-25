import { motion } from 'framer-motion';
import { Play, Clock, Eye } from 'lucide-react';

const videos = [
  {
    id: 1,
    title: 'How to Repot Your Plants Like a Pro',
    duration: '8:32',
    views: '12.5K',
    thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
    videoId: 'dQw4w9WgXcQ',
    description: 'Learn the proper technique for repotting your plants without damaging their roots.'
  },
  {
    id: 2,
    title: '5 Easy Plants for Beginners',
    duration: '12:15',
    views: '8.9K',
    thumbnail: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=250&fit=crop',
    videoId: 'dQw4w9WgXcQ',
    description: 'Perfect starter plants that are hard to kill and great for new gardeners.'
  },
  {
    id: 3,
    title: 'DIY Organic Fertilizer at Home',
    duration: '15:42',
    views: '6.2K',
    thumbnail: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=250&fit=crop',
    videoId: 'dQw4w9WgXcQ',
    description: 'Make your own natural fertilizer using kitchen waste and common household items.'
  },
  {
    id: 4,
    title: 'Watering Tips for Different Plants',
    duration: '10:18',
    views: '9.7K',
    thumbnail: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400&h=250&fit=crop',
    videoId: 'dQw4w9WgXcQ',
    description: 'Master the art of watering - when, how much, and how often for various plant types.'
  }
];

export default function VideoTutorials() {
  return (
    <section className="py-8 bg-gray-50" id="video-tutorials">
      <div className="px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Play className="w-5 h-5 text-green-500" />
            Watch & Learn
          </h2>
          <a href="#" className="text-green-600 text-sm font-medium hover:underline">View All Videos</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {videos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                    <Play className="w-6 h-6 text-green-600 fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{video.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{video.duration}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 