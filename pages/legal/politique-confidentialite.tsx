import Head from 'next/head';
import Link from 'next/link';

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Politique de Confidentialité - Jokerou</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-purple-500 hover:text-purple-400 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Politique de Confidentialité
          </h1>

          <div className="space-y-8">
            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Données collectées</h2>
              <p className="text-gray-300 mb-4">
                Nous collectons les données suivantes :<br />
                - Informations de profil (nom, prénom, email)<br />
                - Données de géolocalisation pendant les parties<br />
                - Statistiques de jeu<br />
                - Informations de connexion<br />
                - Communications avec le support
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Utilisation des données</h2>
              <p className="text-gray-300 mb-4">
                Vos données sont utilisées pour :<br />
                - Permettre le fonctionnement du jeu<br />
                - Améliorer l'expérience utilisateur<br />
                - Assurer la sécurité des joueurs<br />
                - Communiquer des informations importantes<br />
                - Analyser les performances du service
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Protection des données</h2>
              <p className="text-gray-300 mb-4">
                Nous mettons en place :<br />
                - Le chiffrement des données sensibles<br />
                - Des protocoles de sécurité avancés<br />
                - Des sauvegardes régulières<br />
                - Des audits de sécurité<br />
                - Une limitation d'accès aux données
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Partage des données</h2>
              <p className="text-gray-300 mb-4">
                Vos données peuvent être partagées avec :<br />
                - Les autres joueurs (uniquement les informations publiques)<br />
                - Nos prestataires de service (hébergement, analyse)<br />
                - Les autorités compétentes si requis par la loi
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Vos droits</h2>
              <p className="text-gray-300 mb-4">
                Vous disposez des droits suivants :<br />
                - Accès à vos données personnelles<br />
                - Rectification des données inexactes<br />
                - Suppression de vos données<br />
                - Opposition au traitement<br />
                - Portabilité des données
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Conservation des données</h2>
              <p className="text-gray-300">
                Nous conservons vos données :<br />
                - Pendant la durée de votre inscription<br />
                - 3 mois après la suppression du compte<br />
                - Plus longtemps si requis par la loi
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Contact DPO</h2>
              <p className="text-gray-300">
                Pour exercer vos droits ou poser des questions :<br />
                Email : dpo@jokerou.com<br />
                Adresse : DPO Jokerou, 123 Avenue des Jeux, 75001 Paris
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 