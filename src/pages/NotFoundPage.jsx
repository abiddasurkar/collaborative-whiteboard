import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, SearchX, Sparkles, Navigation, Ghost } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl top-20 left-10 animate-float-slow" />
                <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl bottom-20 right-10 animate-float-slower" />
                <div className="absolute w-64 h-64 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl top-1/2 left-1/3 animate-pulse-slow" />
                <div className="absolute inset-0 bg-grid-pattern bg-grid-size opacity-10 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

                {/* Floating Particles */}
                <div className="absolute inset-0">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float-random"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 20}s`,
                                animationDuration: `${15 + Math.random() * 20}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="text-center relative z-10 max-w-2xl mx-auto">
                {/* Animated 404 Icon */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse" />
                    <div className="relative bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <Ghost className="w-16 h-16 text-cyan-400 animate-bounce" />
                            <SearchX className="w-16 h-16 text-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>

                        <h1 className="text-7xl sm:text-9xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                            404
                        </h1>

                        <h2 className="text-2xl sm:text-3xl font-semibold text-cyan-100 mb-4 flex items-center justify-center gap-3">
                            <Navigation className="w-6 h-6 text-cyan-400" />
                            Page Not Found
                            <Sparkles className="w-6 h-6 text-purple-400" />
                        </h2>

                        <p className="text-gray-300 mb-8 text-lg max-w-md mx-auto leading-relaxed">
                            Oops! The page you're looking for seems to have vanished into the digital void.
                            It might have been moved, deleted, or never existed in the first place.
                        </p>

                        {/* Enhanced Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="px-8 py-4 bg-gray-800/80 backdrop-blur-sm border border-white/20 text-gray-300 rounded-xl font-semibold hover:bg-gray-700/80 hover:text-white hover:border-cyan-400/30 transition-all duration-300 flex items-center justify-center gap-3 group hover:transform hover:-translate-y-1"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                                <span>Go Back</span>
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
                            >
                                <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                <span>Go Home</span>
                            </button>
                        </div>

                        {/* Quick Navigation Tips */}
                        <div className="mt-8 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10">
                            <p className="text-sm text-gray-400 mb-2">Quick tips:</p>
                            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                                <span>• Check the URL for typos</span>
                                <span>• Use the navigation menu</span>
                                <span>• Visit the homepage</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="flex justify-center gap-2 mt-8">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.3}s` }}
                        />
                    ))}
                </div>
            </div>

            {/* Add custom animation for floating particles */}
            <style jsx>{`
        @keyframes float-random {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-40px) translateX(10px);
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-80px) translateX(-5px);
            opacity: 0.8;
          }
          75% { 
            transform: translateY(-40px) translateX(-10px);
            opacity: 0.6;
          }
        }
        .animate-float-random {
          animation: float-random linear infinite;
        }
      `}</style>
        </div>
    );
};

export default NotFoundPage;