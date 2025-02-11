import Head from 'next/head';
import Link from 'next/link';

const supportCategories = [
  {
    title: "Aide au jeu",
    icon: "🎮",
    items: [
      { text: "Guide du débutant", link: "/support/guide" },
      { text: "Tutoriels vidéo", link: "/support/tutoriels" },
      { text: "Astuces et stratégies", link: "/support/astuces" },
      { text: "Questions fréquentes", link: "/support/faq" }
    ]
  },
  {
    title: "Support technique",
    icon: "🔧",
    items: [
      { text: "Problèmes de connexion", link: "/support/connexion" },
      { text: "Bugs connus", link: "/support/bugs" },
      { text: "Mise à jour de l'app", link: "/support/updates" },
      { text: "Optimisation", link: "/support/optimisation" }
    ]
  },
  {
    title: "Sécurité",
    icon: "🛡️",
    items: [
      { text: "Règles de sécurité", link: "/security/regles-securite" },
      { text: "Signaler un problème", link: "/security/signaler-probleme" },
      { text: "Charte du joueur", link: "/security/charte-joueur" },
      { text: "Protection des données", link: "/legal/politique-confidentialite" }
    ]
  }
];

export default function Support() {
  return (
    <div className="min-h-screen bg-black text-white">
      <title>
        <title>Support - GRIM</title>
      </title>

      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-purple-500 hover:text-purple-400 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Centre d'aide
          </h1>

          {/* Contact rapide */}
          <section className="bg-gray-900 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Contact rapide</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="text-2xl mb-3">📧</div>
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-gray-400 text-sm mb-3">Réponse sous 24h</p>
                <a href="mailto:support@grim.com" className="text-purple-400 hover:text-purple-300">
                  support@grim.com
                </a>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="text-2xl mb-3">📱</div>
                <h3 className="font-bold mb-2">Téléphone</h3>
                <p className="text-gray-400 text-sm mb-3">Support 24/7</p>
                <a href="tel:+33123456789" className="text-purple-400 hover:text-purple-300">
                  +33 1 23 45 67 89
                </a>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="text-2xl mb-3">💬</div>
                <h3 className="font-bold mb-2">Chat en direct</h3>
                <p className="text-gray-400 text-sm mb-3">Disponible dans l'app</p>
                <button className="text-purple-400 hover:text-purple-300">
                  Ouvrir le chat
                </button>
              </div>
            </div>
          </section>

          {/* Catégories de support */}
          <div className="grid md:grid-cols-3 gap-8">
            {supportCategories.map((category, index) => (
              <div key={index} className="bg-gray-900 rounded-2xl p-8">
                <div className="text-3xl mb-4">{category.icon}</div>
                <h2 className="text-xl font-bold mb-6 text-purple-400">{category.title}</h2>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        href={item.link}
                        className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2"
                      >
                        <span className="text-purple-400">•</span>
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Ressources supplémentaires */}
          <section className="mt-12 bg-gray-900 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Ressources supplémentaires</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="font-bold mb-3">Base de connaissances</h3>
                <p className="text-gray-400 mb-4">
                  Explorez notre documentation détaillée pour trouver des réponses à vos questions.
                </p>
                <Link
                  href="/support/documentation"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Consulter la documentation →
                </Link>
              </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="font-bold mb-3">Communauté</h3>
                <p className="text-gray-400 mb-4">
                  Rejoignez notre communauté de joueurs pour partager vos expériences et obtenir de l'aide.
                </p>
                <Link
                  href="/communaute"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Rejoindre la communauté →
                </Link>
              </div>
            </div>
          </section>

          {/* Engagement de support */}
          <section className="mt-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Notre engagement</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Notre équipe de support s'engage à vous fournir une assistance rapide et efficace 24h/24 et 7j/7. 
              Votre satisfaction et votre sécurité sont nos priorités absolues.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 