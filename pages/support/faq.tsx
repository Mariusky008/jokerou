import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

const faqs = [
  {
    category: "Général",
    questions: [
      {
        q: "Qu'est-ce que Grim ?",
        a: "Grim est un jeu de cache-cache urbain en temps réel qui se joue via votre smartphone. Les joueurs sont divisés en deux équipes : les Chasseurs et le Grim, et doivent utiliser stratégie et agilité pour gagner."
      },
      {
        q: "Comment commencer à jouer ?",
        a: "Pour commencer, créez un compte sur l'application, validez votre email, et rejoignez une partie à 18h. Vous serez automatiquement assigné à un rôle (Chasseur ou Grim) au début de la partie."
      },
      {
        q: "Le jeu est-il gratuit ?",
        a: "Le jeu propose une version gratuite avec des fonctionnalités de base et une version premium avec des fonctionnalités avancées comme des pouvoirs spéciaux et des statistiques détaillées."
      }
    ]
  },
  {
    category: "Gameplay",
    questions: [
      {
        q: "Quelle est la durée d'une partie ?",
        a: "Une partie standard dure 1 heure. Elle commence à 18h précises et se termine soit quand le Grim est capturé, soit à la fin du temps imparti s'il n'a pas été attrapé."
      },
      {
        q: "Comment localiser les autres joueurs ?",
        a: "Les chasseurs peuvent voir la dernière position connue du Grim, mise à jour toutes les 30 secondes."
      },
      {
        q: "Quels sont les différents pouvoirs ?",
        a: "Les pouvoirs varient selon votre rôle. Le Grim peut devenir invisible temporairement, tandis que les Chasseurs ont accès à des outils de pistage avancés. De nouveaux pouvoirs sont débloqués en progressant."
      }
    ]
  },
  {
    category: "Technique",
    questions: [
      {
        q: "Quels sont les prérequis techniques ?",
        a: "Vous avez besoin d'un smartphone avec GPS, une connexion internet stable, et iOS 12+ ou Android 8+. L'application utilise environ 50MB d'espace de stockage."
      },
      {
        q: "Comment économiser la batterie ?",
        a: "Activez le mode économie d'énergie dans l'app, réduisez la luminosité de l'écran, et emportez une batterie externe pour les longues sessions de jeu."
      },
      {
        q: "Le jeu fonctionne-t-il hors ligne ?",
        a: "Non, une connexion internet est requise pour jouer car le jeu fonctionne en temps réel et nécessite un échange constant de données entre les joueurs."
      }
    ]
  },
  {
    category: "Sécurité",
    questions: [
      {
        q: "Comment est assurée ma sécurité ?",
        a: "Les zones de jeu sont soigneusement sélectionnées, évitant les zones dangereuses. Un bouton SOS est disponible en cas d'urgence, et notre équipe de modération surveille les parties 24/7."
      },
      {
        q: "Mes données sont-elles protégées ?",
        a: "Oui, toutes les données sont chiffrées et stockées de manière sécurisée conformément au RGPD. Nous ne partageons jamais vos informations personnelles avec des tiers."
      },
      {
        q: "Comment signaler un joueur ?",
        a: "Utilisez la fonction 'Signaler' dans l'app, accessible depuis le profil du joueur ou pendant une partie. Notre équipe de modération traitera votre signalement sous 24h."
      }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("Général");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = searchTerm
    ? faqs.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqs;

  return (
    <div className="min-h-screen bg-black text-white">
      <Head children={<>
        <title>FAQ - GRIM</title>
      </>} />

      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-purple-500 hover:text-purple-400 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Foire Aux Questions
          </h1>

          {/* Barre de recherche */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-purple-500/20 rounded-lg p-4 text-gray-300 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Navigation des catégories */}
          {!searchTerm && (
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
              {faqs.map((category) => (
                <button
                  key={category.category}
                  onClick={() => setActiveCategory(category.category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                    activeCategory === category.category
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {category.category}
                </button>
              ))}
            </div>
          )}

          {/* Questions et réponses */}
          <div className="space-y-8">
            {filteredFaqs.map((category) => (
              (!searchTerm && category.category !== activeCategory) ? null : (
                <div key={category.category}>
                  <h2 className="text-2xl font-bold mb-4 text-purple-400">{category.category}</h2>
                  <div className="space-y-4">
                    {category.questions.map((qa, index) => (
                      <div key={index} className="bg-gray-900 rounded-2xl p-6 border border-purple-500/20">
                        <h3 className="text-lg font-bold mb-3 text-gray-200">{qa.q}</h3>
                        <p className="text-gray-400">{qa.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Contact support */}
          <div className="mt-12 bg-gray-900 rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Besoin d'aide supplémentaire ?</h2>
            <p className="text-gray-300 mb-4">
              Notre équipe de support est disponible 24/7 pour répondre à vos questions.
            </p>
            <div className="flex gap-4">
              <a
                href="mailto:support@grim.com"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-lg text-center transition-all duration-300"
              >
                Contacter le support
              </a>
              <Link
                href="/support"
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-all duration-300"
              >
                Centre d'aide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 