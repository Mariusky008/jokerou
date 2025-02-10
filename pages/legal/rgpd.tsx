import Head from 'next/head';
import Link from 'next/link';

export default function RGPD() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>RGPD - Jokerou</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-purple-500 hover:text-purple-400 mb-8 inline-block">
          ← Retour à l'accueil
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Règlement Général sur la Protection des Données (RGPD)
          </h1>

          <div className="space-y-8">
            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Base légale du traitement</h2>
              <p className="text-gray-300 mb-4">
                Nous traitons vos données sur les bases légales suivantes :<br />
                - Votre consentement explicite<br />
                - L'exécution du contrat de service Jokerou<br />
                - Nos obligations légales<br />
                - Notre intérêt légitime à améliorer le service
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Droits des utilisateurs</h2>
              <p className="text-gray-300 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :<br />
                - Droit d'accès (Article 15)<br />
                - Droit de rectification (Article 16)<br />
                - Droit à l'effacement (Article 17)<br />
                - Droit à la limitation du traitement (Article 18)<br />
                - Droit à la portabilité (Article 20)<br />
                - Droit d'opposition (Article 21)
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Exercice de vos droits</h2>
              <p className="text-gray-300 mb-4">
                Pour exercer vos droits :<br />
                1. Contactez notre DPO par email<br />
                2. Fournissez une preuve d'identité<br />
                3. Précisez votre demande<br />
                4. Recevez notre réponse sous 30 jours
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Mesures de sécurité</h2>
              <p className="text-gray-300 mb-4">
                Nous protégeons vos données par :<br />
                - Le chiffrement des données<br />
                - L'authentification forte<br />
                - Des audits réguliers<br />
                - La formation de notre personnel<br />
                - Des procédures de sécurité strictes
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Transferts de données</h2>
              <p className="text-gray-300 mb-4">
                Vos données sont hébergées dans l'UE.<br />
                Tout transfert hors UE est encadré par :<br />
                - Des clauses contractuelles types<br />
                - Des garanties appropriées<br />
                - Votre consentement explicite
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Violation de données</h2>
              <p className="text-gray-300">
                En cas de violation de données :<br />
                - Notification à la CNIL sous 72h<br />
                - Information des personnes concernées<br />
                - Mise en place de mesures correctives
              </p>
            </section>

            <section className="bg-gray-900 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Contact</h2>
              <p className="text-gray-300">
                Pour toute question relative au RGPD :<br />
                DPO : Marie Dupont<br />
                Email : dpo@jokerou.com<br />
                Tél : +33 1 23 45 67 89
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 