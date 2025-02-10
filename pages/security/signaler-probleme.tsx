import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function SignalerProbleme() {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    urgence: 'normal',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi du signalement
    console.log('Signalement envoyé:', formData);
    // Reset du formulaire
    setFormData({
      type: '',
      description: '',
      urgence: 'normal',
      email: '',
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Signaler un Problème - Jokerou</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-purple-500 hover:text-purple-400 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Signaler un Problème
          </h1>

          <div className="space-y-8">
            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Procédure de signalement</h2>
              <p className="text-gray-300 mb-4">
                Pour un traitement efficace de votre signalement :<br />
                1. Choisissez le type de problème<br />
                2. Décrivez la situation en détail<br />
                3. Indiquez le niveau d'urgence<br />
                4. Fournissez vos coordonnées<br />
                5. Envoyez le signalement
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-purple-400">Formulaire de signalement</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-purple-400 mb-2">Type de problème</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-gray-800 border border-purple-500/20 rounded-lg p-3 text-gray-300 focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="technique">Problème technique</option>
                    <option value="comportement">Comportement inapproprié</option>
                    <option value="securite">Problème de sécurité</option>
                    <option value="bug">Bug dans le jeu</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-purple-400 mb-2">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-gray-800 border border-purple-500/20 rounded-lg p-3 text-gray-300 focus:outline-none focus:border-purple-500 min-h-[150px]"
                    placeholder="Décrivez le problème en détail..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-purple-400 mb-2">Niveau d'urgence</label>
                  <div className="flex gap-4">
                    {['faible', 'normal', 'urgent'].map((niveau) => (
                      <label key={niveau} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="urgence"
                          value={niveau}
                          checked={formData.urgence === niveau}
                          onChange={(e) => setFormData({...formData, urgence: e.target.value})}
                          className="text-purple-500 focus:ring-purple-500"
                        />
                        <span className="text-gray-300 capitalize">{niveau}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-purple-400 mb-2">Email de contact</label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-800 border border-purple-500/20 rounded-lg p-3 text-gray-300 focus:outline-none focus:border-purple-500"
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                >
                  Envoyer le signalement
                </button>
              </form>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Contact direct</h2>
              <p className="text-gray-300">
                Pour une urgence immédiate :<br />
                Support 24/7 : +33 1 23 45 67 89<br />
                Email : support@jokerou.com<br />
                Chat en direct via l'application
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 