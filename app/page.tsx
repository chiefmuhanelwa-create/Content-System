import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-2xl">
        <h1 className="text-6xl font-bold mb-4">NOCHILL</h1>
        <h2 className="text-3xl font-semibold mb-2">Content Governance System</h2>
        <p className="text-xl text-gray-300 mb-8 italic">For children's children</p>

        <p className="text-lg text-gray-200 mb-8 leading-relaxed">
          Leading African creators out of digital slavery into the promised land of
          ownership, wealth, and legacy. Building Africa's Largest School of Influence
          through contentpreneurship.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">4E</div>
            <div>Content Balance</div>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">PAIDS</div>
            <div>Revenue Streams</div>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">SEEDS</div>
            <div>Sales Funnel</div>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">10 Laws</div>
            <div>Constitutional</div>
          </div>
        </div>
      </div>
    </div>
  );
}
