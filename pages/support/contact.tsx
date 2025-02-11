import Head from 'next/head';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
  <title>Contact - GRIM</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Contact</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Nous contacter</h2>
              <p className="text-gray-300 space-y-2">
                <span className="block">
                  <strong>Email :</strong> support@grim.com
                </span>
                <span className="block">
                  <strong>Téléphone :</strong> +33 1 23 45 67 89
                </span>
                <span className="block">
                  <strong>Chat :</strong> Disponible en direct via l'application
                </span>
              </p>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Formulaire de contact</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-700 bg-gray-700 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 