import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GameRules from '../components/GameRules';

export default function Home() {
  const [nextGameTime, setNextGameTime] = useState<string>('');
  const [isHovering, setIsHovering] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showRules, setShowRules] = useState(false);

  const features = [
    {
      icon: "🎭",
      title: "Mode Fantôme",
      description: "Devenez invisible pendant 30 secondes pour semer vos poursuivants"
    },
    {
      icon: "🎯",
      title: "Radar de Traque",
      description: "Utilisez des outils de pistage avancés pour localiser votre cible"
    },
    {
      icon: "🌍",
      title: "Zone de Jeu",
      description: "Un périmètre défini et sécurisé pour une expérience de jeu équitable"
    },
    {
      icon: "⚡",
      title: "Pouvoirs Spéciaux",
      description: "Débloquez des capacités uniques en progressant"
    }
  ];

  const testimonials = [
    {
      name: "Thomas L.",
      role: "Joker Légendaire",
      quote: "La meilleure expérience de jeu urbain ! L'adrénaline est au maximum quand on est poursuivi.",
      avatar: "👤",
      rating: 5
    },
    {
      name: "Sarah M.",
      role: "Chasseuse Élite",
      quote: "La coordination entre chasseurs est incroyable. Chaque partie est unique et intense !",
      avatar: "👤",
      rating: 5
    },
    {
      name: "Lucas R.",
      role: "Stratège Urbain",
      quote: "Les pouvoirs spéciaux ajoutent une dimension stratégique passionnante au jeu.",
      avatar: "👤",
      rating: 5
    }
  ];

  useEffect(() => {
    const calculateNextGameTime = () => {
      const now = new Date();
      const next = new Date();
      next.setHours(18, 0, 0, 0);
      
      if (now.getHours() >= 18) {
        next.setDate(next.getDate() + 1);
      }
      
      const diff = next.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    };

    const timer = setInterval(() => {
      setNextGameTime(calculateNextGameTime());
    }, 60000);

    setNextGameTime(calculateNextGameTime());

    // Rotation automatique des fonctionnalités
    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(featureInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Head>
        <title key="title">Jokerou - Le jeu de cache-cache urbain révolutionnaire</title>
        <meta key="description" name="description" content="Découvrez Jokerou, le jeu qui transforme votre ville en terrain de jeu. Cache-cache en temps réel, pouvoirs spéciaux et expérience unique garantie !" />
        <link key="favicon" rel="icon" href="/favicon.ico" />
      </Head>

      {/* Modal des règles */}
      <GameRules isOpen={showRules} onClose={() => setShowRules(false)} />

      {/* Hero Section avec Vidéo Background */}
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-black/50 to-pink-900/90">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        </div>

        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-8xl font-black mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Le Grim
              </span>
            </h1>
            <p className="text-3xl font-light text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              Le premier jeu de cache-cache urbain 
              <span className="block mt-2 text-xl text-purple-400">Une expérience unique chaque soir à 18h dans votre ville.</span>
            </p>

            <div className="flex flex-col gap-6 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link href="/auth" 
                  className="w-full inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 text-center"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  Inscription à la prochaine chasse
                  <motion.span
                    animate={isHovering ? { x: 5 } : { x: 0 }}
                    className="inline-block ml-2"
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
              
              <div className="text-2xl font-bold text-purple-400 mt-4">
                Prochain jeu dans {nextGameTime}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex gap-4 items-center text-gray-400">
              <div className="text-purple-400 font-bold">1000+</div> Joueurs actifs
              <span className="mx-2">•</span>
              <div className="text-purple-400 font-bold">15</div> Villes
              <span className="mx-2">•</span>
              <div className="text-purple-400 font-bold">4.9★</div> Note moyenne
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section Fonctionnalités */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Une expérience de jeu révolutionnaire
              </span>
            </h2>
            <p className="text-xl text-gray-400">Découvrez des fonctionnalités uniques qui redéfinissent le cache-cache</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className={`bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 ${index === activeFeature ? 'ring-2 ring-purple-500' : ''}`}
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="py-20 bg-gradient-to-b from-purple-900/20 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Comment ça marche ?
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">1</div>
                <h3 className="text-xl font-bold mb-4 mt-4">Inscrivez-vous</h3>
                <p className="text-gray-400">Créez votre compte et rejoignez la communauté des joueurs dans votre ville</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">2</div>
                <h3 className="text-xl font-bold mb-4 mt-4">Attendez 18h</h3>
                <p className="text-gray-400">Chaque soir, une nouvelle partie commence. Découvrez votre rôle : Joker ou Chasseur</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">3</div>
                <h3 className="text-xl font-bold mb-4 mt-4">Jouez !</h3>
                <p className="text-gray-400">Utilisez vos pouvoirs, coordonnez-vous et vivez une expérience unique</p>
              </div>
            </motion.div>
          </div>

          {/* Nouveau bouton des règles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => setShowRules(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-lg py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center gap-2 mx-auto"
            >
              <span>📜</span>
              Consulter les règles complètes
            </button>
          </motion.div>
        </div>
      </section>

      {/* Nouvelle section : Modes de jeu */}
      <section className="py-20 bg-gradient-to-b from-purple-900/20 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Modes de jeu
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Jouez en solo ou en équipe, choisissez votre style !
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20"
            >
              <div className="text-4xl mb-6">🎮</div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                Mode Solo
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Vivez l'expérience classique : parcourez la ville en solitaire, utilisez vos pouvoirs et votre stratégie pour échapper aux chasseurs ou traquer le Joker.
              </p>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Liberté de mouvement totale
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Prise de décision rapide
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Parfait pour les joueurs expérimentés
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20"
            >
              <div className="text-4xl mb-6">👥</div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                Mode Duo Stratégique
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Faites équipe avec un ami ! L'un sur le terrain, l'autre derrière son écran pour une expérience de jeu unique combinant action et stratégie.
              </p>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Un joueur sur le terrain suit les instructions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Un stratège à distance analyse la carte et coordonne les actions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Communication en temps réel pour une meilleure coordination
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Parfait pour combiner réflexion et action
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-6 rounded-2xl inline-block backdrop-blur-sm border border-purple-500/20">
              <p className="text-gray-300">
                <span className="text-purple-400 font-bold">Conseil : </span>
                Le mode duo est recommandé pour les nouveaux joueurs, permettant une meilleure prise en main du jeu et des stratégies plus élaborées.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nouvelle section : Règles du jeu */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Règles du jeu
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Un jeu d'adresse et de stratégie où chaque seconde compte
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Conditions de victoire */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                  Conditions de Victoire
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <h4 className="font-bold mb-2">Pour les Chasseurs</h4>
                      <p className="text-gray-300">Approchez-vous à moins de 50 mètres du Joker pour remporter la partie instantanément</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">🎭</div>
                    <div>
                      <h4 className="font-bold mb-2">Pour le Joker</h4>
                      <p className="text-gray-300">Survivez pendant 60 minutes en restant à plus de 50 mètres des chasseurs</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Système de récompenses */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                  Récompenses
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <h4 className="font-bold mb-2">Points d'Expérience</h4>
                      <ul className="text-gray-300 space-y-2">
                        <li>• Victoire en tant que Joker : 1000 XP</li>
                        <li>• Victoire en tant que Chasseur : 500 XP</li>
                        <li>• Bonus de temps pour capture rapide : jusqu'à 300 XP</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">🎖️</div>
                    <div>
                      <h4 className="font-bold mb-2">Badges Spéciaux</h4>
                      <ul className="text-gray-300 space-y-2">
                        <li>• "Maître de l'Évasion" - Survivre 60 minutes en tant que Joker</li>
                        <li>• "Chasseur d'Élite" - Capturer le Joker en moins de 15 minutes</li>
                        <li>• "Stratège" - Utiliser tous vos pouvoirs dans une partie</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Note importante */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-6 rounded-2xl inline-block backdrop-blur-sm border border-purple-500/20">
              <p className="text-gray-300">
                <span className="text-purple-400 font-bold">Important : </span>
                Sortir de la zone de jeu délimitée entraîne une élimination immédiate et la perte des points potentiels.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-20 bg-gradient-to-b from-black to-purple-900/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Ce qu'en pensent nos joueurs
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-purple-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
                <div className="text-yellow-400">{'★'.repeat(testimonial.rating)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Zone de jeu sécurisée */}
      <section className="py-20 bg-gradient-to-b from-purple-900/20 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                Zone de jeu sécurisée
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Pour garantir une expérience équitable et sécurisée
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20"
            >
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                Périmètre défini
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Avant chaque partie, une zone de jeu est clairement délimitée sur la carte. Cette zone est soigneusement choisie pour offrir une expérience de jeu optimale et sécurisée.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/20"
            >
              <div className="text-4xl mb-6">⚠️</div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                Règle d'élimination
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Sortir de la zone délimitée entraîne une élimination immédiate. Cette règle s'applique à tous les joueurs, Joker comme Chasseurs, pour maintenir l'équilibre du jeu.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/90 to-purple-900/90 p-6 rounded-2xl inline-block backdrop-blur-sm border border-purple-500/20"
            >
              <p className="text-gray-300">
                <span className="text-purple-400 font-bold">Note importante :</span> La zone de jeu est visible en permanence sur la carte et des alertes vous préviendront si vous vous en approchez trop près.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section CTA finale */}
      <section className="py-20 bg-gradient-to-b from-purple-900/20 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-5xl font-bold mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Prêt à relever le défi ?
              </span>
            </h2>
            <p className="text-2xl text-gray-300 mb-12">
              Rejoignez la communauté Jokerou et vivez une expérience de jeu unique
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link href="/auth" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-2xl py-6 px-16 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                Créer un compte gratuitement
              </Link>
            </motion.div>
            <p className="mt-6 text-gray-400">
              Déjà plus de 1000 joueurs nous font confiance
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-purple-900/20">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Jokerou. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
} 