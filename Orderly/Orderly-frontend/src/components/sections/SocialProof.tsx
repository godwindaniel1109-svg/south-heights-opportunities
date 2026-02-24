export default function SocialProof() {
  return (
    <section className="py-8 bg-white border-y border-gray-100">
      <div className="container">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            {/* Avatar images - overlapping */}
            <div className="flex -space-x-2">
              <img
                src="/images/user1.jpg"
                alt="Customer 1"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="/images/user2.jpg"
                alt="Customer 2"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="/images/user3.jpg"
                alt="Customer 3"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">
                +50
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-center max-w-2xl">
            Small businesses already rely on Orderly to manage daily sales, customer lists, and order records — from fashion vendors to food sellers and gadget dealers.
          </p>
        </div>
      </div>
    </section>
  );
}
