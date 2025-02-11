import Head from 'next/head';
import Link from 'next/link';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head children={<>
        <title>Mentions Légales - GRIM</title>
      </>} />

      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-purple-500 hover:text-purple-400 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Mentions Légales
          </h1>

          <div className="space-y-8">
            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Éditeur du site</h2>
              <p className="text-gray-300 mb-4">
                GRIM SAS<br />
                Capital social : 10 000€<br />
                RCS Paris B 123 456 789<br />
                Siège social : 123 Avenue des Jeux, 75001 Paris<br />
                Email : contact@grim.com
              </p>
              <p className="text-gray-300">
                Directeur de la publication : Jean Dupont<br />
                Responsable de la rédaction : Marie Martin
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Hébergement</h2>
              <p className="text-gray-300">
                Le site grim est hébergé par :<br />
                Amazon Web Services (AWS)<br />
                38 Avenue John F. Kennedy<br />
                L-1855 Luxembourg
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Propriété intellectuelle</h2>
              <p className="text-gray-300 mb-4">
                L'ensemble du contenu du site Grim (logo, textes, graphismes, images, vidéos, etc.) est protégé par le droit d'auteur. Toute reproduction ou représentation, totale ou partielle, du site ou de l'un des éléments qui le composent, sans l'autorisation expresse de Jokerou, est interdite et constituerait une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
              </p>
              <p className="text-gray-300">
                Les marques et logos figurant sur le site sont des marques déposées par Grim ou ses partenaires. Toute reproduction ou utilisation de ces marques sans autorisation expresse est interdite.
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Données personnelles</h2>
              <p className="text-gray-300">
                Les informations concernant la collecte et le traitement des données personnelles sont détaillées dans notre Politique de Confidentialité, accessible depuis le pied de page du site.
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Cookies</h2>
              <p className="text-gray-300">
                Le site Jokerou utilise des cookies pour améliorer l'expérience utilisateur. Pour en savoir plus sur l'utilisation des cookies, consultez notre Politique de Cookies, accessible depuis le pied de page du site.
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Limitation de responsabilité</h2>
              <p className="text-gray-300">
                Grim s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur son site. Toutefois, Jokerou ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur le site. En conséquence, Jokerou décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site.
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Contact</h2>
              <p className="text-gray-300">
                Pour toute question concernant les présentes mentions légales, vous pouvez nous contacter à l'adresse suivante :<br />
                Email : legal@jokerou.com<br />
                Adresse : 123 Avenue des Jeux, 75001 Paris
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 