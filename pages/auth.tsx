import { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    city: '',
    birthYear: ''
  });
  const [formErrors, setFormErrors] = useState({
    birthYear: '',
    terms: '',
    password: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();
  const { returnUrl } = router.query;

  const validateAge = (year: string): boolean => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(year);
    return age >= 13;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin) {
      // Validation de l'âge pour l'inscription
      if (!validateAge(formData.birthYear)) {
        setFormErrors(prev => ({
          ...prev,
          birthYear: "Vous devez avoir au moins 13 ans pour vous inscrire (conformité RGPD)."
        }));
        return;
      }

      // Validation du mot de passe
      if (formData.password !== formData.confirmPassword) {
        setFormErrors(prev => ({
          ...prev,
          password: "Les mots de passe ne correspondent pas."
        }));
        return;
      }

      // Validation des CGU et RGPD
      if (!acceptedTerms) {
        setFormErrors(prev => ({
          ...prev,
          terms: "Vous devez accepter les conditions d'utilisation et la politique de confidentialité pour continuer."
        }));
        return;
      }
    }

    // TODO: Implémenter la logique d'authentification
    console.log('Form submitted:', formData);
    
    // Redirection vers la page précédente ou la page des chasses
    if (typeof returnUrl === 'string' && returnUrl.startsWith('/')) {
      router.push(returnUrl);
    } else {
      router.push('/hunts');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validation spécifique pour l'année de naissance
    if (name === 'birthYear') {
      const year = parseInt(value);
      const currentYear = new Date().getFullYear();
      
      if (year < 1900) {
        setFormErrors(prev => ({
          ...prev,
          birthYear: "L'année doit être supérieure à 1900"
        }));
      } else if (year > currentYear) {
        setFormErrors(prev => ({
          ...prev,
          birthYear: "L'année ne peut pas être dans le futur"
        }));
      } else if (!validateAge(value)) {
        setFormErrors(prev => ({
          ...prev,
          birthYear: "Vous devez avoir au moins 13 ans pour vous inscrire"
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          birthYear: ""
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <Head children={<>
        <title>{isLogin ? 'Connexion' : 'Inscription'} - GRIM</title>
      </>} />

      <Link href="/" className="mb-8 text-purple-500 hover:text-purple-400">
        ← Retour à l'accueil
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-neon"
      >
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          {isLogin ? 'Connexion' : 'Inscription'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="username">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2" htmlFor="birthYear">
                  Année de naissance
                </label>
                <input
                  type="number"
                  id="birthYear"
                  name="birthYear"
                  value={formData.birthYear}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className={`w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 ${
                    formErrors.birthYear ? 'focus:ring-red-500 border-red-500' : 'focus:ring-purple-500'
                  }`}
                  required
                />
                {formErrors.birthYear && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2"
                  >
                    {formErrors.birthYear}
                  </motion.p>
                )}
                <p className="text-gray-400 text-xs mt-1">
                  Vous devez avoir au moins 13 ans pour vous inscrire
                </p>
              </div>
            </>
          )}

          {!isLogin && (
            <>
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="password">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2" htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 ${
                    formErrors.password ? 'focus:ring-red-500 border-red-500' : 'focus:ring-purple-500'
                  }`}
                  required
                />
                {formErrors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2"
                  >
                    {formErrors.password}
                  </motion.p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-gray-300 mb-2" htmlFor="city">
                Ville
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          )}

          {!isLogin && (
            <div className="space-y-4">
              <div className="bg-gray-800/80 p-6 rounded-xl border-2 border-purple-500/30">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked);
                      if (e.target.checked) {
                        setFormErrors(prev => ({ ...prev, terms: '' }));
                      }
                    }}
                    className="mt-1.5 w-5 h-5 rounded border-2 border-purple-500 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="terms" className="text-lg text-gray-300">
                    <span className="font-semibold">J'accepte :</span>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">•</span>
                        <Link href="/legal/conditions-utilisation" className="text-purple-400 hover:text-purple-300 underline">
                          Les conditions générales d'utilisation
                        </Link>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-purple-400">•</span>
                        <Link href="/legal/politique-confidentialite" className="text-purple-400 hover:text-purple-300 underline">
                          La politique de confidentialité
                        </Link>
                      </li>
                    </ul>
                  </label>
                </div>
                {formErrors.terms && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-base mt-4 bg-red-500/10 p-3 rounded-lg"
                  >
                    {formErrors.terms}
                  </motion.p>
                )}
              </div>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-base text-gray-300">
                  En vous inscrivant, vous acceptez que vos données personnelles soient traitées conformément à notre politique de confidentialité, dans le respect du RGPD.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 ${
              !isLogin && !acceptedTerms ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!isLogin && !acceptedTerms}
          >
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-400 hover:text-purple-300"
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </motion.div>

      <style jsx global>{`
        .shadow-neon {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }
      `}</style>
    </div>
  );
} 