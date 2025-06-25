import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Urban Balcony Gardening Workshop',
    date: '2024-07-15',
    time: '5:00 PM',
    location: 'Online (Zoom)',
    description: 'Learn how to create a lush balcony garden in small spaces. Includes Q&A with experts.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop',
    link: '#'
  },
  {
    id: 2,
    title: 'Monsoon Plant Care Webinar',
    date: '2024-07-22',
    time: '7:00 PM',
    location: 'Online (Google Meet)',
    description: 'Tips for keeping your plants healthy and pest-free during the rainy season.',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop',
    link: '#'
  },
  {
    id: 3,
    title: 'Kids Gardening Day',
    date: '2024-08-05',
    time: '10:00 AM',
    location: 'City Park, Main Lawn',
    description: 'Fun, hands-on gardening activities for children. Free plant for every participant!',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=300&fit=crop',
    link: '#'
  }
];

function GardeningEvents() {
  return (
    <section className="py-8 bg-white" id="gardening-events">
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Gardening Events & Workshops
          </h2>
          <a href="#" className="text-green-600 text-sm font-medium hover:underline">View All Events</a>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="min-w-[280px] max-w-[320px] bg-green-50 rounded-2xl shadow-md flex-shrink-0 flex flex-col"
            >
              <img src={event.image} alt={event.title} className="w-full h-36 object-cover rounded-t-2xl" />
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">{event.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <p className="text-xs text-gray-700 mb-3 line-clamp-3">{event.description}</p>
                <a href={event.link} className="mt-auto inline-block bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors text-center">Join / RSVP</a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GardeningEvents; 